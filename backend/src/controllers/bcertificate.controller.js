import asyncHandler from "express-async-handler";
import Bcertificate from "../models/bcertificate.model.js";
import Stats from "../models/stats.model.js";

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
        lastName: { $regex: `^${lastName}$`, $options: 'i' },
        firstName: { $regex: `^${firstName}$`, $options: 'i' },
        motherLastName: { $regex: `^${motherLastName}$`, $options: 'i' }
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
    await Stats.findOneAndUpdate({}, { $inc: { totalDocuments: 1 } });

    res.status(201).json({
        message: "Certificate added successfully",
    });
});

export const claimbCertificate = asyncHandler(async (req, res) => {
    const { lastName = "", motherLastName = "" } = req.query;

    if (!lastName || !motherLastName) {
        return res.status(400).json({ message: "Both Child's lastName and motherLastName are required" });
    }

    const certificate = await Bcertificate.findOne({
        lastName: { $regex: `^${lastName}$`, $options: 'i' },
        motherLastName: { $regex: `^${motherLastName}$`, $options: 'i' },
        status: { $in: ["lost", "found"] }
    });

    if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
    }

    if (certificate.status !== "found") {
        certificate.status = "found";
    }

    if (!certificate.claimed){
        certificate.claimed = true;
        certificate.claimedAt = new Date();
        await certificate.save();

        await Stats.findOneAndUpdate({}, { $inc: { claimedDocuments: 1 } });
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
