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
        await Scertificate.findOneAndUpdate(
            {
                certificateType: canonicalType,
                lastName: { $regex: `^${escapeRegex(lastName)}$`, $options: 'i' },
                firstName: { $regex: `^${escapeRegex(firstName)}$`, $options: 'i' }
            },
            { docLocation, finderContact }
        );
        return res.status(200).json({ message: "Certificate information updated successfully." });
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
    }).select('-docLocation -finderContact -claimed -claimedAt -status -createdAt -updatedAt').limit(10);

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

    // Find the certificate by ID and update status to found and claimed, if it is still "lost".
    const certificate = await Scertificate.findOneAndUpdate(
        { _id: id, status: "lost" },
        { $set: { status: "found", claimed: true, claimedAt: new Date() } },
        { new: true }
    );

    if (certificate) {
        // successfully updated to found and claimed — increment found and claimed documents stats
        await Stats.findOneAndUpdate({}, { $inc: { claimedDocuments: 1 } }, { upsert: true });

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
    }

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

});