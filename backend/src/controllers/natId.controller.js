import asyncHandler from "express-async-handler";
import NatId from "../models/natId.model.js";
import Stats from "../models/stats.model.js";
import { isValidZimbabweIdNumber, idNumberRegex } from "../utility/idValidation.utility.js";

export const foundId = asyncHandler(async (req, res) => {
    const { lastName, firstName, idNumber, docLocation, finderContact } = req.body;
    const phoneNumberRegex = /^07(?:8[0-9]{7}|[137][1-9][0-9]{6})$/;

    if (!lastName || !firstName || !idNumber || !docLocation || !finderContact) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!phoneNumberRegex.test(finderContact)) {
        return res.status(400).json({ message: "Invalid phone number format. Example: 0712345678" });
    }

    if (!isValidZimbabweIdNumber(idNumber)) {
        return res.status(400).json({ message: "Invalid Zimbabwean ID number. Example: 12-1234567A12" });
    }

    const existingNatId = await NatId.findOne({
        idNumber: { $regex: `^${idNumber}$`, $options: 'i' }
    });

    if (existingNatId) {
        return res.status(400).json({ message: "National ID already exists within the database." });
    }

    const newNatId = new NatId({
        lastName,
        firstName,
        idNumber,
        docLocation,
        finderContact
    });
    await newNatId.save();
    await Stats.findOneAndUpdate({}, { $inc: { totalDocuments: 1 } });

    res.status(201).json({
        message: "National ID added successfully."
    });
});

export const claimId = asyncHandler(async (req, res) => {
    const { identifier } = req.params;
    let isIdNumber = false;
    let idDocument;

    if (idNumberRegex.test(identifier)) {
        isIdNumber = true;
        idDocument = await NatId.findOne({
            idNumber: { $regex: `^${identifier}$`, $options: 'i' },
            status: { $in: ["lost", "found"] }
        });
    }

    if (!isIdNumber) {
        idDocument = await NatId.findOne({
            lastName: { $regex: `^${identifier}$`, $options: 'i' },
            status: { $in: ["lost", "found"] }
        });
    }

    if (!idDocument) {
        return res.status(404).json({ message: "National ID not found" });
    }

    if (idDocument.status !== "found") {
        idDocument.status = "found";
    }

    if (!idDocument.claimed){
         idDocument.claimed = true;
        idDocument.claimedAt = new Date();
        await idDocument.save();
        await Stats.findOneAndUpdate({}, { $inc: { claimedDocuments: 1 } });
    }

    const { lastName: ln, firstName, idNumber, docLocation, finderContact } = idDocument;
    let response = {
        lastName: ln,
        firstName,
        idNumber,
        docLocation,
        finderContact
    };
    res.status(200).json(response);
});
