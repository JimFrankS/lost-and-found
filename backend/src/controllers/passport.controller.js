import asyncHandler from "express-async-handler";
import Passport from "../models/passport.model.js";
import Stats from "../models/stats.model.js";
import { isValidZimbabweIdNumber, idNumberRegex } from "../utility/idValidation.utility.js";

export const lostPassport = asyncHandler(async (req, res) => {
    const { passportNumber, lastName, firstName, idNumber, docLocation, finderContact } = req.body;
    const passportNumberRegex = /^[A-Z]{2}\d{6}$/;
    const phoneNumberRegex = /^07(?:8[0-9]{7}|[137][1-9][0-9]{6})$/;

    if (!passportNumber || !lastName || !firstName || !idNumber || !docLocation || !finderContact) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!passportNumberRegex.test(passportNumber)) {
        return res.status(400).json({ message: "Invalid passport number format. Example: AB123456" });
    }

    if (!phoneNumberRegex.test(finderContact)) {
        return res.status(400).json({ message: "Invalid phone number format. Example: 0712345678" });
    }

    if (!isValidZimbabweIdNumber(idNumber)) {
            return res.status(400).json({ message: "Invalid Zimbabwean ID number. Example: 12-1234567A12" });
        }

    const existingPassport = await Passport.findOne({
        passportNumber: { $regex: `^${passportNumber}$`, $options: 'i' }
    });
    if (existingPassport) {
        return res.status(400).json({ message: "Passport already exists with this passport number." });
    }

    const newPassport = new Passport({
        passportNumber,
        lastName,
        firstName,
        idNumber,
        docLocation,
        finderContact
    });
    await newPassport.save();
    await Stats.findOneAndUpdate({}, { $inc: { totalDocuments: 1 } });

    res.status(201).json({
        message: "Passport created successfully."
    });
});

export const claimPassport = asyncHandler(async (req, res) => {
    const { identifier } = req.params;
    let isPassportNumber = false;
    let isIdNumber = false;
    let passportDoc;

    if (/^[A-Z]{2}\d{6}$/i.test(identifier)) {
        isPassportNumber = true;
        passportDoc = await Passport.findOne({
            passportNumber: { $regex: `^${identifier}$`, $options: 'i' },
            status: { $in: ["lost", "found"] }
        });
    }

    if (idNumberRegex.test(identifier)) {
        isIdNumber = true;
        passportDoc = await Passport.findOne({
            idNumber: { $regex: `^${identifier}$`, $options: 'i' },
            status: { $in: ["lost", "found"] }
        });
    }

    if (!isPassportNumber && !isIdNumber) {
        passportDoc = await Passport.findOne({
            lastName: { $regex: `^${identifier}$`, $options: 'i' },
            status: { $in: ["lost", "found"] }
        });
    }

    if (!passportDoc) {
        return res.status(404).json({ message: "Passport not found" });
    }

    if (!passportDoc.claimed) {
        passportDoc.status = "found"; // Also mark as found when claimed
        passportDoc.claimed = true;
        passportDoc.claimedAt = new Date();
        await passportDoc.save();
        await Stats.findOneAndUpdate({}, { $inc: { claimedDocuments: 1 } });
    }

    const { passportNumber, lastName, firstName, idNumber, docLocation, finderContact} = passportDoc;
    let response = {
        passportNumber,
        lastName,
        firstName,
        idNumber,
        docLocation,
        finderContact
    };
    res.status(200).json(response);
});
