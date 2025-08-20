import expressAsyncHandler from "express-async-handler";
import Baggage, { BAGGAGE_TYPES } from "../models/baggage.model.js";
import Stats from "../models/stats.model.js";
import { getCanonical } from "../utility/canonical.utility.js";

// Helper function to escape regex special characters
const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const allowedTransportTypes = ["bus", "kombi", "mushikashika", "private"];
const allowedRouteTypes = ["local", "intercity"];

export const lostBaggage = expressAsyncHandler(async (req, res) => {
    const { baggageType, transportType, routeType, destinationProvince, destinationDistrict, destination, docLocation, finderContact } = req.body;
    const phoneNumberRegex = /^07(?:8[0-9]{7}|[137][1-9][0-9]{6})$/;

    if (!baggageType || !transportType || !routeType || !destinationProvince || !destinationDistrict || !destination || !docLocation || !finderContact) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!phoneNumberRegex.test(finderContact)) {
        return res.status(400).json({ message: "Invalid phone number format. Example: 0712345678" });
    }

    const bagTypeResult = getCanonical(baggageType, BAGGAGE_TYPES, 'baggageType');
    if (bagTypeResult.error) return res.status(400).json({ message: bagTypeResult.error });
    const canonicalBagType = bagTypeResult.canonical;

    const transportTypeResult = getCanonical(transportType, allowedTransportTypes, 'transportType');
    if (transportTypeResult.error) return res.status(400).json({ message: transportTypeResult.error });
    const canonicalTransportType = transportTypeResult.canonical;

    const routeTypeResult = getCanonical(routeType, allowedRouteTypes, 'routeType');
    if (routeTypeResult.error) return res.status(400).json({ message: routeTypeResult.error });
    const canonicalRouteType = routeTypeResult.canonical;

    // Duplicate check considers all keys
    const existingBaggage = await Baggage.findOne({
        baggageType: canonicalBagType,
        transportType: canonicalTransportType,
        routeType: canonicalRouteType,
        destinationProvince: String(destinationProvince).toLowerCase(),
        destinationDistrict: String(destinationDistrict).toLowerCase(),
        destination: { $regex: `^${escapeRegex(destination)}$`, $options: 'i' }
    });
    if (existingBaggage) {
        return res.status(400).json({ message: "Baggage already registered with these details." });
    }

    const newBaggage = new Baggage({
        baggageType: canonicalBagType,
        transportType: canonicalTransportType,
        routeType: canonicalRouteType,
        destinationProvince: String(destinationProvince).trim().toLowerCase(),
        destinationDistrict: String(destinationDistrict).trim().toLowerCase(),
        destination: String(destination).trim().toLowerCase(),
        docLocation,
        finderContact
    });
    await newBaggage.save();
    await Stats.findOneAndUpdate({}, { $inc: { totalDocuments: 1 } }, { upsert: true });
    res.status(201).json({ message: "Lost baggage registered successfully." });
});


export const claimBaggage = expressAsyncHandler(async (req, res) => {
    const { baggageType, transportType, routeType, destinationProvince, destinationDistrict, destination } = req.query;
    if (!baggageType || !transportType || !routeType || !destinationProvince || !destinationDistrict || !destination) {
        return res.status(400).json({ message: "All of baggageType, transportType, routeType, destinationProvince, destinationDistrict, and destination are required" });
    }

    const bagTypeResult = getCanonical(baggageType, BAGGAGE_TYPES, 'baggageType');
    if (bagTypeResult.error) return res.status(400).json({ message: bagTypeResult.error });
    const canonicalBagType = bagTypeResult.canonical;

    const transportTypeResult = getCanonical(transportType, allowedTransportTypes, 'transportType');
    if (transportTypeResult.error) return res.status(400).json({ message: transportTypeResult.error });
    const canonicalTransportType = transportTypeResult.canonical;

    const routeTypeResult = getCanonical(routeType, allowedRouteTypes, 'routeType');
    if (routeTypeResult.error) return res.status(400).json({ message: routeTypeResult.error });
    const canonicalRouteType = routeTypeResult.canonical;

    // Find the baggage by all key fields
    let baggage = await Baggage.findOne({
        baggageType: canonicalBagType,
        transportType: canonicalTransportType,
        routeType: canonicalRouteType,
        destinationProvince: String(destinationProvince).toLowerCase(),
        destinationDistrict: String(destinationDistrict).toLowerCase(),
        destination: { $regex: `^${escapeRegex(destination)}$`, $options: 'i' },
        status: { $in: ["lost", "found"] }
    });
    if (!baggage) {
        return res.status(404).json({ message: "Baggage not found" });
    }
    
    const updated = await Baggage.findOneAndUpdate(
        { _id: baggage._id, claimed: false },
        { $set: { claimed: true, claimedAt: new Date(), status: 'found' } },
        { new: true }
    );

    if (updated) {
        await Stats.findOneAndUpdate({}, { $inc: { claimedDocuments: 1 } }, { upsert: true });
        baggage = updated;
    } else if (baggage.status !== 'found') {
        await Baggage.updateOne({ _id: baggage._id, status: { $ne: 'found' } }, { $set: { status: 'found' } });
        baggage.status = 'found';
    }
   const {
    baggageType: bType,
    transportType: tType,
    routeType: rType,
    destinationProvince: p,
    destinationDistrict: d,
    destination: dest,
    docLocation,
    finderContact
} = baggage;
const response = {
    baggageType: bType,
    transportType: tType,
    routeType: rType,
    destinationProvince: p,
    destinationDistrict: d,
    destination: dest,
    docLocation,
    finderContact
};
    res.status(200).json(response);
});