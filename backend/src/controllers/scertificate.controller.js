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

export const searchScertificate = asyncHandler(async (req, res) => { // Renamed for consistency
    const { lastName, certificateType } = req.query;
    if (!lastName || !certificateType) {
        return res.status(400).json({ message: "Both lastName and certificateType are required" });
    }

    const certTypeResult = getCanonical(certificateType, ALLOWED_CERTIFICATE_TYPES, 'certificateType');
    if (certTypeResult.error) return res.status(400).json({ message: certTypeResult.error });
    const canonicalType = certTypeResult.canonical;

    // Find all school certificates that match the description, including claimed ones.

    const certificateList = await Scertificate.find({
        certificateType: canonicalType,
        lastName: { $regex: `^${escapeRegex(lastName)}$`, $options: 'i' },
        status: { $in: ["lost", "found"] }
    }).select('-docLocation -finderContact -claimed -claimedAt -status -createdAt -updatedAt')

    res.status(200).json(certificateList);
});

export const viewScertificate = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Certificate ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid certificate ID" });
    }

    // Find the certificate by ID and update status to found, if it is still "lost".
    const certificate = await Scertificate.findOneAndUpdate(
        { _id: id, status: "lost" },
        { $set: { status: "found", foundAt: new Date() } },
        { new: true }
    );

    if (certificate) {
        // successfully updated to found — increment found documents stats
        await Stats.findOneAndUpdate({}, { $inc: { foundDocuments: 1 } }, { upsert: true });
    } else {
        //if not found with the status lost, try to find it anyway ( might already be 'found')
        const existingCertificate = await Scertificate.findById(id);
        if (!existingCertificate) {
            return res.status(404).json({ message: "School Certificate not found" });
        }

        // Return existing certificate (one which is already found or claimed)
        const {
            certificateType: cType,
            lastName,
            firstName,
            docLocation,
            finderContact,
            claimed
        } = existingCertificate;
        const response = {
            certificateType: cType,
            lastName,
            firstName,
            docLocation,
            finderContact,
            claimed
        };
        return res.status(200).json(response);
    }
    // return updated certificate
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