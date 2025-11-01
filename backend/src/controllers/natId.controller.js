import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import NatId from "../models/natId.model.js";
import Stats from "../models/stats.model.js";
import isValidZimbabweIdNumber, { idNumberRegex } from "../utility/idValidation.utility.js";
import { escapeRegex } from "../utility/regex.utility.js";

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
        // Validate submitted firstName and lastName against stored values (trimmed, case-insensitive)
        const submittedFirstName = firstName.trim().toLowerCase();
        const submittedLastName = lastName.trim().toLowerCase();
        const storedFirstName = existingNatId.firstName.trim().toLowerCase();
        const storedLastName = existingNatId.lastName.trim().toLowerCase();

        if (submittedFirstName !== storedFirstName || submittedLastName !== storedLastName) {
            // Log the mismatch for audit purposes
            console.log(`Name mismatch for idNumber ${idNumber}: submitted ${submittedFirstName} ${submittedLastName}, stored ${storedFirstName} ${storedLastName}`);
            return res.status(400).json({ message: "Name mismatch: provided names do not match the stored values." });
        }

        // Proceed to update docLocation and finderContact
        const updatedNatId = await NatId.findByIdAndUpdate(existingNatId._id, { docLocation, finderContact }, { new: true });
        return res.status(200).json(updatedNatId);
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

export const searchNatId = asyncHandler(async (req, res) => {
    const { identifier = "" } = req.query;
    if (!identifier) {
        return res.status(400).json({ message: "Identifier required (idNumber or lastName)" });
    }

    let natIds = null;
    let isSingle = false;

    if (idNumberRegex.test(identifier)) {
        // Search by idNumber - single result
        natIds = await NatId.findOne({
            idNumber: { $regex: `^${escapeRegex(identifier)}$`, $options: 'i' },
            status: { $in: ["lost", "found"] }
        }).select('_id lastName firstName idNumber docLocation finderContact');
        isSingle = true;
    } else {
        // Search by lastName - multiple results
        natIds = await NatId.find({
            lastName: { $regex: `^${escapeRegex(identifier)}$`, $options: 'i' },
            status: { $in: ["lost", "found"] }
        }).select('_id lastName firstName idNumber docLocation finderContact').limit(10);
    }

    if (!natIds || (Array.isArray(natIds) && natIds.length === 0)) {
        return res.status(404).json({ message: "National ID not found" });
    }

    res.status(200).json(natIds);
});

export const claimId = asyncHandler(async (req, res) => {
    const { identifier } = req.params;
    if (!identifier) {
        return res.status(400).json({ message: "Identifier required" });
    }

    if (!mongoose.Types.ObjectId.isValid(identifier)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    let idDocument = await NatId.findById(identifier);
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
