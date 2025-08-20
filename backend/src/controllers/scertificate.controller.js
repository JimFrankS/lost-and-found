import asyncHandler from "express-async-handler";
import Scertificate from "../models/scertificate.model.js";
import Stats from "../models/stats.model.js";
import { getCanonical } from "../utility/canonical.utility.js";

const ALLOWED_CERTIFICATE_TYPES = ["Olevel", "Alevel", "Poly", "University", "Other"];

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
        lastName: { $regex: `^${lastName}$`, $options: 'i' }
    });
    if (existingCertificate) {
        return res.status(400).json({ message: "Certificate already exists with this type and last name." });
    }
    const newCertificate = new Scertificate({
        certificateType: canonicalType,
        lastName,
        firstName,
        docLocation,
        finderContact
    });
    await newCertificate.save();
    await Stats.findOneAndUpdate({}, { $inc: { totalDocuments: 1 } });
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

    const certificate = await Scertificate.findOne({
        lastName: { $regex: `^${lastName}$`, $options: 'i' },
        certificateType: canonicalType,
        status: { $in: ["lost", "found"] }
    });
    if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
    }
    if (certificate.status !== "found") {
        certificate.status = "found";
    }

    if (!certificate.claimed) {
        certificate.claimed = true;
        certificate.claimedAt = new Date();
        await certificate.save();
        await Stats.findOneAndUpdate({}, { $inc: { claimedDocuments: 1 } });
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
