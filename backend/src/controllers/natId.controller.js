import asyncHandler from "express-async-handler";
import NatId from "../models/natId.model.js";
import Stats from "../models/stats.model.js";
import isValidZimbabweIdNumber, { idNumberRegex } from "../utility/idValidation.utility.js";

// Helper function to escape regex special characters
const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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
        idNumber: { $regex: `^${escapeRegex(idNumber)}$`, $options: 'i' }
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
    await Stats.findOneAndUpdate({}, { $inc: { totalDocuments: 1 } }, { upsert: true });

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
            lastName: { $regex: `^${escapeRegex(identifier)}$`, $options: 'i' },
            status: { $in: ["lost", "found"] }
        });
    }

    if (!idDocument) {
        return res.status(404).json({ message: "National ID not found" });
    }

    const updated = await NatId.findOneAndUpdate(
        { _id: idDocument._id, claimed: false },
        { $set: { claimed: true, claimedAt: new Date(), status: 'found' } },
        { new: true }
    );

    if (updated) {
        await Stats.findOneAndUpdate({}, { $inc: { claimedDocuments: 1 } }, { upsert: true });
        idDocument = updated;
    } else if (idDocument.status !== 'found') {
        // If already claimed but status hasn't been updated, correct it
        await NatId.updateOne({ _id: idDocument._id, status: { $ne: 'found' } }, { $set: { status: 'found' } });
        idDocument.status = 'found';
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
