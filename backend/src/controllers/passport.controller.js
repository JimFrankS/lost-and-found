import asyncHandler from "express-async-handler";
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

    const existingPassport = await Passport.findOne({
        passportNumber: { $regex: `^${escapeRegex(passportNumber)}$`, $options: 'i' }
    });
    if (existingPassport) {
        await Passport.findOneAndUpdate(
            { passportNumber: { $regex: `^${escapeRegex(passportNumber)}$`, $options: 'i' } },
            { docLocation, finderContact },
            { new: true }
        );
        return res.status(200).json({ message: "Passport information updated successfully." });
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
    await Stats.findOneAndUpdate({}, { $inc: { totalDocuments: 1 } }, { upsert: true });

    res.status(201).json({
        message: "Passport created successfully."
    });
});

export const searchPassport = asyncHandler(async (req, res) => {
    const { category, identifier } = req.query;

    if (!category || !identifier) {
        return res.status(400).json({ message: "Category and identifier are required" });
    }

    let query = { status: { $in: ["lost", "found"] } };

    if (category === 'passportNumber') {
        query.passportNumber = { $regex: `^${escapeRegex(identifier)}$`, $options: 'i' };
    } else if (category === 'idNumber') {
        query.idNumber = { $regex: `^${escapeRegex(identifier)}$`, $options: 'i' };
    } else if (category === 'surname') {
        query.lastName = { $regex: `^${escapeRegex(identifier)}$`, $options: 'i' };
    } else {
        return res.status(400).json({ message: "Invalid category" });
    }

    const passports = await Passport.find(query);

    if (passports.length === 0) {
        return res.status(404).json({ message: "No passports found" });
    }

    // If searching by passportNumber or idNumber, return single result or array
    if (category === 'passportNumber' || category === 'idNumber') {
        if (passports.length === 1) {
            const { _id, passportNumber, lastName, firstName, idNumber, docLocation, finderContact } = passports[0];
            return res.status(200).json({
                _id,
                passportNumber,
                lastName,
                firstName,
                idNumber,
                docLocation,
                finderContact
            });
        } else {
            // Should not happen for unique fields, but handle just in case
            return res.status(200).json(passports.map(passport => ({
                _id: passport._id,
                passportNumber: passport.passportNumber,
                lastName: passport.lastName,
                firstName: passport.firstName,
                idNumber: passport.idNumber,
                docLocation: passport.docLocation,
                finderContact: passport.finderContact
            })));
        }
    } else {
        // For surname, return array of results
        return res.status(200).json(passports.map(passport => ({
            _id: passport._id,
            passportNumber: passport.passportNumber,
            lastName: passport.lastName,
            firstName: passport.firstName,
            idNumber: passport.idNumber,
            docLocation: passport.docLocation,
            finderContact: passport.finderContact
        })));
    }
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
            lastName: { $regex: `^${escapeRegex(identifier)}$`, $options: 'i' },
            status: { $in: ["lost", "found"] }
        });
    }

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
