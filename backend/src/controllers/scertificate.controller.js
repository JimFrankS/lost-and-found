import asyncHandler from "express-async-handler";
import Scertificate from "../models/scertificate.model.js";
import Stats from "../models/stats.model.js";
import { getCanonical } from "../utility/canonical.utility.js";

const ALLOWED_CERTIFICATE_TYPES = ["Olevel", "Alevel", "Poly", "University", "Other"];

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

    const existingCertificate = await Scertificate.findOne({
        certificateType: canonicalType,
        lastName: { $regex: `^${escapeRegex(lastName)}$`, $options: 'i' },
        firstName: { $regex: `^${escapeRegex(firstName)}$`, $options: 'i' }
    });
    if (existingCertificate) {
        return res.status(400).json({ message: "Certificate already exists with this type, last name, and first name." });
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

export const claimScertificate = asyncHandler(async (req, res) => { // Renamed for consistency
    const { lastName, certificateType } = req.query;
    if (!lastName || !certificateType) {
        return res.status(400).json({ message: "Both lastName and certificateType are required" });
    }

    const certTypeResult = getCanonical(certificateType, ALLOWED_CERTIFICATE_TYPES, 'certificateType');
    if (certTypeResult.error) return res.status(400).json({ message: certTypeResult.error });
    const canonicalType = certTypeResult.canonical;

    let certificate = await Scertificate.findOne({
        lastName: { $regex: `^${escapeRegex(lastName)}$`, $options: 'i' },
        certificateType: canonicalType,
        status: { $in: ["lost", "found"] }
    });
    if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
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
        await Scertificate.updateOne({ _id: certificate._id, status: { $ne: 'found' } }, { $set: { status: 'found' } });
        certificate.status = 'found';
    }

    const { lastName: ln, firstName, certificateType: ct, docLocation, finderContact } = certificate;
    const response = {
        lastName: ln,
        firstName,
        certificateType: ct,
        docLocation,
        finderContact
    };
    res.status(200).json(response);
});
