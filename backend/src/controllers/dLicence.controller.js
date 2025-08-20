import asyncHandler from "express-async-handler";
import DLicence from "../models/dLicence.model.js";
import Stats from "../models/stats.model.js";
import { isValidZimbabweIdNumber, idNumberRegex } from "../utility/idValidation.utility.js";

export const foundLicence = asyncHandler(async (req, res) => {
    const { licenceNumber, lastName, firstName, idNumber, docLocation, finderContact } = req.body;
    const licenceNumberRegex = /^\d{6}[A-Z]{2}$/;
    const phoneNumberRegex = /^07(?:8[0-9]{7}|[137][1-9][0-9]{6})$/;

    if (!licenceNumber || !lastName || !firstName || !idNumber || !docLocation || !finderContact) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!licenceNumberRegex.test(licenceNumber)) {
        return res.status(400).json({ message: "Invalid licence number format. Example: 123456AB" });
    }

    if (!phoneNumberRegex.test(finderContact)) {
        return res.status(400).json({ message: "Invalid phone number format. Example: 0712345678" });
    }

    if (!isValidZimbabweIdNumber(idNumber)) {
        return res.status(400).json({ message: "Invalid Zimbabwean ID number. Example: 12-1234567A12" });
    }

    const existingLicence = await DLicence.findOne({
        licenceNumber: { $regex: `^${licenceNumber}$`, $options: 'i' }
    });
    if (existingLicence) {
        return res.status(400).json({ message: "Licence already exists with this licence number." });
    }

    const newLicence = new DLicence({
        licenceNumber,
        lastName,
        firstName,
        idNumber,
        docLocation,
        finderContact
    });
    await newLicence.save();
    await Stats.findOneAndUpdate({}, { $inc: { totalDocuments: 1 } });

    res.status(201).json({
        message: "Licence added successfully"
    });
});

export const claimLicence = asyncHandler(async (req, res) => {
    const { identifier = "" } = req.params;
    let licence = null;
    if (!identifier) {
        return res.status(400).json({ message: "Identifier required (licenceNumber, idNumber, or lastName)" });
    }
    if (/^\d{6}[A-Z]{2}$/i.test(identifier)) {
        licence = await DLicence.findOne({
            licenceNumber: { $regex: `^${identifier}$`, $options: 'i' },
            status: { $in: ["lost", "found"] }
        });
    } else if (idNumberRegex.test(identifier)) {
        licence = await DLicence.findOne({
            idNumber: { $regex: `^${identifier}$`, $options: 'i' },
            status: { $in: ["lost", "found"] }
        });
    } else {
        licence = await DLicence.findOne({
            lastName: { $regex: `^${identifier}$`, $options: 'i' },
            status: { $in: ["lost", "found"] }
        });
    }

    if (!licence) {
        return res.status(404).json({ message: "Licence not found" });
    }

    if (licence.status !== "found") {
        licence.status = "found";
    }

    if (!licence.claimed){
        licence.claimed = true;
        licence.claimedAt = new Date();
        await licence.save();
        await Stats.findOneAndUpdate({}, { $inc: { claimedDocuments: 1 } });
    }

    const { licenceNumber, lastName, firstName, idNumber, docLocation, finderContact } = licence;
    let response = {
        licenceNumber,
        lastName,
        firstName,
        idNumber,
        docLocation,
        finderContact
    };
    res.status(200).json(response);
});
