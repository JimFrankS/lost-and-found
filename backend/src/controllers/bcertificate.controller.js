import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
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

    const query = {
        lastName: { $regex: `^${escapeRegex(lastName)}$`, $options: 'i' },
        firstName: { $regex: `^${escapeRegex(firstName)}$`, $options: 'i' },
        motherLastName: { $regex: `^${escapeRegex(motherLastName)}$`, $options: 'i' }
    };

    const existingCertificate = await Bcertificate.findOne(query);

    if (existingCertificate) {
        if (existingCertificate.finderContact === finderContact) {
            existingCertificate.docLocation = docLocation;
            existingCertificate.secondName = secondName || existingCertificate.secondName;
            await existingCertificate.save();
            return res.status(200).json({ message: "Certificate location updated successfully." });
        } else if (existingCertificate.docLocation.trim().toLowerCase() === docLocation.trim().toLowerCase()) {
            existingCertificate.finderContact = finderContact;
            await existingCertificate.save();
            return res.status(200).json({ message: "Certificate finder contact updated successfully." });
        }
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

export const searchbCertificate = asyncHandler(async (req, res) => {
    const { lastName, motherLastName, firstName } = req.query;
    if (!lastName || !motherLastName || !firstName) {
        return res.status(400).json({ message: "All search fields are required" });
    }

    const query = {
        lastName: { $regex: `^${escapeRegex(lastName)}$`, $options: 'i' },
        firstName: { $regex: `^${escapeRegex(firstName)}$`, $options: 'i' },
        motherLastName: { $regex: `^${escapeRegex(motherLastName)}$`, $options: 'i' },
        status: { $in: ["lost", "found"] }
    };

    const certificateList = await Bcertificate.find(query).select('_id lastName firstName motherLastName secondName');

    res.status(200).json(certificateList);
});

export const claimbCertificate = asyncHandler(async (req, res) => {
    const { lastName, motherLastName, firstName } = req.query;
    if (!lastName || !motherLastName || !firstName) {
        return res.status(400).json({ message: "All search fields are required" });
    }

    const query = {
        lastName: { $regex: `^${escapeRegex(lastName)}$`, $options: 'i' },
        firstName: { $regex: `^${escapeRegex(firstName)}$`, $options: 'i' },
        motherLastName: { $regex: `^${escapeRegex(motherLastName)}$`, $options: 'i' }
    };

    let certificate = await Bcertificate.findOne(query);
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

    const { lastName: ln, firstName: certFirstName, secondName, motherLastName: mln, docLocation, finderContact, claimed } = certificate;

    let response = {
        lastName: ln,
        firstName: certFirstName,
        motherLastName: mln,
        docLocation,
        finderContact,
        claimed
    };
    if (secondName) {
        response.secondName = secondName;
    }
    res.status(200).json(response);
});

export const viewbCertificate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Certificate ID is required" });
    }

    // Find the certificate by ID and update status to 'found' if it's still 'lost'
    const certificate = await Bcertificate.findOneAndUpdate(
        { _id: id, claimed: false },
        { $set: { status: 'found', claimed: true, claimedAt: new Date() } },
        { new: true }
    );

    const findAndReturnCertificate = async (certificateId) => {
        const existingCertificate = await Bcertificate.findById(certificateId);
        if (!existingCertificate) return res.status(404).json({ message: "Certificate not found" });
        // Return the existing certificate (already found or claimed)
        const {
            lastName: ln,
            firstName: certFirstName,
            secondName,
            motherLastName: mln,
            docLocation,
            finderContact,
            claimed
        } = existingCertificate;
        const response = {
            lastName: ln,
            firstName: certFirstName,
            motherLastName: mln,
            docLocation,
            finderContact,
            claimed
        };
        if (secondName) {
            response.secondName = secondName;
        }
        res.status(200).json(response);
    };

    if (certificate) {
        // Successfully updated to found, increment claimed documents stats
        await Stats.findOneAndUpdate({}, { $inc: { claimedDocuments: 1 } }, { upsert: true });
    } else {
        return await findAndReturnCertificate(id);
    }
    const {
        lastName: ln,
        firstName: certFirstName,
        secondName,
        motherLastName: mln,
        docLocation,
        finderContact,
        claimed
    } = certificate;
    const response = {
        lastName: ln,
        firstName: certFirstName,
        motherLastName: mln,
        docLocation,
        finderContact,
        claimed
    };
    if (secondName) {
        response.secondName = secondName;
    }
    res.status(200).json(response);
});
