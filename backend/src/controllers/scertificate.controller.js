import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Scertificate, { ALLOWED_CERTIFICATE_TYPES } from "../models/scertificate.model.js";
import Stats from "../models/stats.model.js";
import { getCanonical } from "../utility/canonical.utility.js";

// Helper function to escape regex special characters
const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const foundScertificate = asyncHandler(async (req, res) => { // Renamed for consistency
    const { certificateType, lastName, firstName, docLocation, finderContact } = req.body;
    const phoneNumberRegex = /^07(?:8[0-9]{7}|[137][1-9][0-9]{6})$/;

    if (!certificateType || !lastName || !firstName || !docLocation || !finderContact) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!phoneNumberRegex.test(finderContact)) {
        return res.status(400).json({ message: "Invalid phone number format. Example: 0712345678" });
    }

    const certTypeResult = getCanonical(certificateType, ALLOWED_CERTIFICATE_TYPES, 'certificateType');
    if (certTypeResult.error) return res.status(400).json({ message: certTypeResult.error });
    const canonicalType = certTypeResult.canonical;

    const query = {
        certificateType: canonicalType,
        lastName: { $regex: `^${escapeRegex(lastName)}$`, $options: 'i' },
        firstName: { $regex: `^${escapeRegex(firstName)}$`, $options: 'i' }
    };
    const existingCertificate = await Scertificate.findOne(query);

    if (existingCertificate) {
        if (existingCertificate.finderContact === finderContact) {
            existingCertificate.docLocation = docLocation;
            await existingCertificate.save();
            return res.status(200).json({ message: "Certificate location updated successfully." });
        } else if (existingCertificate.docLocation.trim().toLowerCase() === docLocation.trim().toLowerCase()) {
            existingCertificate.finderContact = finderContact;
            await existingCertificate.save();
            return res.status(200).json({ message: "Certificate finder contact updated successfully." });
        }
    }
    const newCertificate = new Scertificate({
        certificateType: canonicalType,
        lastName,
        firstName,
        docLocation,
        finderContact
    });
    await newCertificate.save();
    await Stats.findOneAndUpdate({}, { $inc: { totalDocuments: 1 } }, { upsert: true });
    res.status(201).json({
        message: "Certificate added successfully"
    });
});

export const searchScertificate = asyncHandler(async (req, res) => { // Renamed for consistency
    const { certificateType, lastName } = req.query;
    if (!certificateType || !lastName) {
        return res.status(400).json({ message: "Certificate type and last name are required" });
    }

    const certTypeResult = getCanonical(certificateType, ALLOWED_CERTIFICATE_TYPES, 'certificateType');
    if (certTypeResult.error) return res.status(400).json({ message: certTypeResult.error });
    const canonicalType = certTypeResult.canonical;

    if (!lastName || lastName.trim() === '') {
        return res.status(400).json({ message: 'lastName is required' });
    }
    const canonicalLastName = lastName.trim().toLowerCase(); // Keep this to ensure search query is lowercase

    // Find all school certificates that match the certificate type and last name, including claimed ones.

    const certificateList = await Scertificate.find({
        certificateType: canonicalType,
        lastName: canonicalLastName,
        status: { $in: ["lost", "found"] }
    }).select('_id certificateType lastName firstName docLocation finderContact').limit(10);

    res.status(200).json(certificateList);
});

export const viewScertificate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "ID required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid certificate ID" });
    }

    let certificate = await Scertificate.findById(id);
    if (!certificate) {
        return res.status(404).json({ message: "School Certificate not found" });
    }

    const updated = await Scertificate.findOneAndUpdate(
        { _id: certificate._id, claimed: false },
        { $set: { claimed: true, claimedAt: new Date(), status: 'found' } },
        { new: true }
    );

    if (updated) {
        await Stats.findOneAndUpdate({}, { $inc: { claimedDocuments: 1 } }, { upsert: true });
        certificate = updated;
    } else if (certificate.status !== 'found') {
        // If already claimed but status hasn't been updated, correct it
        await Scertificate.updateOne({ _id: certificate._id, status: { $ne: 'found' } }, { $set: { status: 'found' } });
        certificate.status = 'found';
    }

    const {
        certificateType: cType,
        lastName,
        firstName,
        docLocation,
        finderContact,
        claimed
    } = certificate;
    const response = {
        certificateType: cType,
        lastName,
        firstName,
        docLocation,
        finderContact,
        claimed
    };
    return res.status(200).json(response);
});
