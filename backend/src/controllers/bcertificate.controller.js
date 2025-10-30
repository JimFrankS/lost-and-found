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
        return res.status(400).json({ message: "Certificate already exists with this mother's name, child's last name and first name." });
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
    const { lastName = "", motherLastName = "", firstName = "" } = req.query;

    if (!lastName || !motherLastName || !firstName) {
        return res.status(400).json({ message: "Child's lastName, motherLastName, and firstName are required" });
    }

    let certificate = await Bcertificate.findOne({
        lastName: { $regex: `^${escapeRegex(lastName)}$`, $options: 'i' },
        motherLastName: { $regex: `^${escapeRegex(motherLastName)}$`, $options: 'i' },
        firstName: { $regex: `^${escapeRegex(firstName)}$`, $options: 'i' },
        status: { $in: ["lost", "found"] }
    });

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
        await Bcertificate.updateOne({ _id: certificate._id, status: { $ne: 'found' } }, { $set: { status: 'found' } });
        certificate.status = 'found';
    }
    

    const { lastName: ln, firstName, secondName, motherLastName: mln, docLocation, finderContact } = certificate;

    let response = {
        lastName: ln,
        firstName,
        motherLastName: mln,
        docLocation,
        finderContact
    };
    if (secondName) {
        response.secondName = secondName;
    }
    res.status(200).json(response);
});
