import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Passport from "../models/passport.model.js";
import Stats from "../models/stats.model.js";
import isValidZimbabweIdNumber, { idNumberRegex } from "../utility/idValidation.utility.js";
import { escapeRegex } from "../utility/regex.utility.js";

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

    // Attempt atomic update if the passport exists and finderContact matches
    const updatedPassport = await Passport.findOneAndUpdate(
        {
            passportNumber: { $regex: `^${escapeRegex(passportNumber)}$`, $options: 'i' },
            finderContact: finderContact
        },
        { $set: { docLocation: docLocation } },
        { new: true }
    );

    if (updatedPassport) {
        return res.status(200).json({ message: "Passport location updated successfully." });
    }

    // If update failed, check if passport exists with a different finder
    const existingPassport = await Passport.findOne({
        passportNumber: { $regex: `^${escapeRegex(passportNumber)}$`, $options: 'i' }
    });

    if (existingPassport) {
        return res.status(409).json({ message: "This passport has already been reported by someone else." });
    }

    // If not exists, create a new Passport document
    const newPassport = new Passport({
        passportNumber: passportNumber.toUpperCase(),
        lastName,
        firstName,
        idNumber,
        docLocation,
        finderContact
    });

    await newPassport.save();

    // Increment the Stats counter for reported passports
    await Stats.findOneAndUpdate({}, { $inc: { totalDocuments: 1 } }, { upsert: true });

    return res.status(201).json({ message: "Passport reported successfully." });
});

export const searchPassport = asyncHandler(async (req, res) => {
    const { category, identifier = "" } = req.query;
    if (!category || !identifier) {
        return res.status(400).json({ message: "Category and identifier required" });
    }

    let passports = null;

    switch (category) {
        case 'passportNumber':
            // Search by passportNumber - single result, update status to found
            passports = await Passport.findOneAndUpdate(
                {
                    passportNumber: { $regex: `^${escapeRegex(identifier)}$`, $options: 'i' },
                    status: { $in: ["lost", "found"] },
                    claimed: false
                },
                { $set: { status: 'found', claimed: true, claimedAt: new Date() } },
                { new: true }
            ).select('_id passportNumber lastName firstName idNumber docLocation finderContact');
            if (passports) {
                await Stats.findOneAndUpdate({}, { $inc: { claimedDocuments: 1 } }, { upsert: true });
            } else {
                // If not found with claimed: false, try to find already claimed/found
                passports = await Passport.findOne({
                    passportNumber: { $regex: `^${escapeRegex(identifier)}$`, $options: 'i' },
                    status: { $in: ["lost", "found"] }
                }).select('_id passportNumber lastName firstName idNumber docLocation finderContact');
            }
            break;
        case 'idNumber':
            // Search by idNumber - single result, update status to found
            passports = await Passport.findOneAndUpdate(
                {
                    idNumber: { $regex: `^${escapeRegex(identifier)}$`, $options: 'i' },
                    status: { $in: ["lost", "found"] },
                    claimed: false
                },
                { $set: { status: 'found', claimed: true, claimedAt: new Date() } },
                { new: true }
            ).select('_id passportNumber lastName firstName idNumber docLocation finderContact');
            if (passports) {
                await Stats.findOneAndUpdate({}, { $inc: { claimedDocuments: 1 } }, { upsert: true });
            } else {
                // If not found with claimed: false, try to find already claimed/found
                passports = await Passport.findOne({
                    idNumber: { $regex: `^${escapeRegex(identifier)}$`, $options: 'i' },
                    status: { $in: ["lost", "found"] }
                }).select('_id passportNumber lastName firstName idNumber docLocation finderContact');
            }
            break;
        case 'surname':
            // Search by lastName - multiple results, no status update
            passports = await Passport.find({
                lastName: { $regex: `^${escapeRegex(identifier)}$`, $options: 'i' },
                status: { $in: ["lost", "found"] }
            }).select('_id passportNumber lastName firstName idNumber docLocation finderContact').limit(10);
            break;
        default:
            return res.status(400).json({ message: "Invalid category" });
    }

    if (!passports || (Array.isArray(passports) && passports.length === 0)) {
        return res.status(404).json({ message: "Passport not found" });
    }

    res.status(200).json(passports);
});

export const claimPassport = asyncHandler(async (req, res) => {
    const { identifier } = req.params;
    if (!identifier) {
        return res.status(400).json({ message: "Identifier required" });
    }

    if (!mongoose.Types.ObjectId.isValid(identifier)) {
        return res.status(400).json({ message: "Invalid passport ID" });
    }

    let passportDoc = await Passport.findById(identifier);
    if (!passportDoc) {
        return res.status(404).json({ message: "Passport not found" });
    }

    const updated = await Passport.findOneAndUpdate(
        { _id: passportDoc._id, claimed: false },
        { $set: { claimed: true, claimedAt: new Date(), status: 'found' } },
        { new: true }
    );

    if (updated) {
        await Stats.findOneAndUpdate({}, { $inc: { claimedDocuments: 1 } }, { upsert: true });
        passportDoc = updated;
    } else if (passportDoc.status !== 'found') {
        // If already claimed but status hasn't been updated, correct it
        await Passport.updateOne({ _id: passportDoc._id, status: { $ne: 'found' } }, { $set: { status: 'found' } });
        passportDoc.status = 'found';
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
