import asyncHandler from "express-async-handler";
import Bcertificate from "../models/bcertificate.model.js";
import Stats from "../models/stats.model.js";

// Helper function to escape regex special characters
const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const foundbCertificate = asyncHandler(async (req, res) => {
    const { motherLastName, lastName, firstName, secondName, docLocation, finderContact } = req.body;
    const phoneNumberRegex = /^07(?:8[0-9]{7}|[137][1-9][0-9]{6})$/;

    if (!motherLastName || !lastName || !firstName || !docLocation || !finderContact) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!phoneNumberRegex.test(finderContact)) {
        return res.status(400).json({ message: "Invalid phone number format. Example: 0712345678" });
    }

    const existingCertificate = await Bcertificate.findOne({
        lastName: { $regex: `^${escapeRegex(lastName)}$`, $options: 'i' },
        firstName: { $regex: `^${escapeRegex(firstName)}$`, $options: 'i' },
        motherLastName: { $regex: `^${escapeRegex(motherLastName)}$`, $options: 'i' }
    });

    if (existingCertificate) {
        await Bcertificate.findOneAndUpdate(
            {
                lastName: { $regex: `^${escapeRegex(lastName)}$`, $options: 'i' },
                firstName: { $regex: `^${escapeRegex(firstName)}$`, $options: 'i' },
                motherLastName: { $regex: `^${escapeRegex(motherLastName)}$`, $options: 'i' }
            },
            { motherLastName, lastName, firstName, secondName, docLocation, finderContact }
        );
        return res.status(200).json({ message: "Certificate information updated successfully." });
    }

    const newCertificate = new Bcertificate({
        motherLastName,
        lastName,
        firstName,
        secondName,
        docLocation,
        finderContact
    });

    await newCertificate.save();
    await Stats.findOneAndUpdate({}, { $inc: { totalDocuments: 1 } }, { upsert: true });

    res.status(201).json({
        message: "Certificate added successfully",
    });
});

export const claimbCertificate = asyncHandler(async (req, res) => {
    const { identifier } = req.params;
    if (!identifier) {
        return res.status(400).json({ message: "Identifier required" });
    }

    if (!require('mongoose').Types.ObjectId.isValid(identifier)) {
        return res.status(400).json({ message: "Invalid certificate ID" });
    }

    let certificate = await Bcertificate.findById(identifier);
    if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
    }

    const updated = await Bcertificate.findOneAndUpdate(
        { _id: certificate._id, claimed: false },
        { $set: { claimed: true, claimedAt: new Date(), status: 'found' } },
        { new: true }
    );
    if (updated) {
        await Stats.findOneAndUpdate({}, { $inc: { claimedDocuments: 1 } }, { upsert: true });
        certificate = updated;
    } else if (certificate.status !== 'found') {
        // If already claimed but status hasn't been updated, correct it
        await Bcertificate.updateOne({ _id: certificate._id, status: { $ne: 'found' } }, { $set: { status: 'found' } });
        certificate.status = 'found';
    }

    const { lastName: ln, firstName: certFirstName, secondName, motherLastName: mln, docLocation, finderContact } = certificate;

    let response = {
        lastName: ln,
        firstName: certFirstName,
        motherLastName: mln,
        docLocation,
        finderContact
    };
    if (secondName) {
        response.secondName = secondName;
    }
    res.status(200).json(response);
});
