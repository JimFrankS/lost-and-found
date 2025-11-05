import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { MBaggageTypes } from "../models/mBaggage.model.js";
import MBaggage from "../models/mBaggage.model.js";
import Stats from "../models/stats.model.js";
import { getCanonical } from "../utility/canonical.utility.js";

// Helper function to escape regex special characters
const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const allowedGatheringTypes = ["entertainment", "church", "school", "other"];

export const lostBaggage = expressAsyncHandler(async (req, res) => {
  const {
    baggageType,
    gatheringType,
    destinationProvince,
    destinationDistrict,
    gatheringLocation,
    docLocation,
    finderContact,
  } = req.body;
  const phoneNumberRegex = /^07(?:8[0-9]{7}|[137][1-9][0-9]{6})$/;

  if (
    !baggageType ||
    !gatheringType ||
    !destinationProvince ||
    !destinationDistrict ||
    !gatheringLocation ||
    !docLocation ||
    !finderContact
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!phoneNumberRegex.test(finderContact)) {
    return res
      .status(400)
      .json({ message: "Invalid phone number format. Example: 0712345678" });
  }

  const bagTypeResult = getCanonical(baggageType, MBaggageTypes, "baggageType");
  if (bagTypeResult.error)
    return res.status(400).json({ message: bagTypeResult.error });
  const canonicalBagType = bagTypeResult.canonical;

  const gatheringTypeResult = getCanonical(
    gatheringType,
    allowedGatheringTypes,
    "gatheringType"
  );
  if (gatheringTypeResult.error)
    return res.status(400).json({ message: gatheringTypeResult.error });
  const canonicalGatheringType = gatheringTypeResult.canonical;

  // Check for existing baggage based on core fields
  const query = {
    baggageType: canonicalBagType,
    gatheringType: canonicalGatheringType,
    destinationProvince: String(destinationProvince).toLowerCase(),
    destinationDistrict: String(destinationDistrict).toLowerCase(),
    gatheringLocation: {
      $regex: `^${escapeRegex(gatheringLocation)}$`,
      $options: "i",
    },
  };

  const existingMBaggage = await MBaggage.findOne(query);

  if (existingMBaggage) {
    if (existingMBaggage.finderContact === finderContact) {
      existingMBaggage.docLocation = docLocation;
      await existingMBaggage.save();
      return res
        .status(200)
        .json({ message: "Baggage location updated successfully." });
    } else if (
      existingMBaggage.docLocation.trim().toLowerCase() ===
      docLocation.trim().toLowerCase()
    ) {
      existingMBaggage.finderContact = finderContact;
      await existingMBaggage.save();
      return res
        .status(200)
        .json({ message: "Baggage finder contact updated successfully." });
    }
    // If neither finderContact nor docLocation matches, fall through to create new
  }

  const newMBaggage = new MBaggage({
    baggageType: canonicalBagType,
    gatheringType: canonicalGatheringType,
    destinationProvince: String(destinationProvince).trim().toLowerCase(),
    destinationDistrict: String(destinationDistrict).trim().toLowerCase(),
    gatheringLocation: String(gatheringLocation).trim().toLowerCase(),
    docLocation,
    finderContact,
  });
  await newMBaggage.save();
  await Stats.findOneAndUpdate(
    {},
    { $inc: { totalDocuments: 1 } },
    { upsert: true }
  );
  res.status(201).json({ message: "Lost baggage registered successfully." });
});

export const searchBaggage = expressAsyncHandler(async (req, res) => {
  const {
    baggageType,
    gatheringType,
    destinationProvince,
    destinationDistrict,
  } = req.query;
  if (
    !baggageType ||
    !gatheringType ||
    !destinationProvince ||
    !destinationDistrict
  ) {
    return res.status(400).json({
      message:
        "baggageType, gatheringType, destinationProvince, and destinationDistrict are required",
    });
  }

  const bagTypeResult = getCanonical(baggageType, MBaggageTypes, "baggageType");
  if (bagTypeResult.error)
    return res.status(400).json({ message: bagTypeResult.error });
  const canonicalBagType = bagTypeResult.canonical;

  const gatheringTypeResult = getCanonical(
    gatheringType,
    allowedGatheringTypes,
    "gatheringType"
  );
  if (gatheringTypeResult.error)
    return res.status(400).json({ message: gatheringTypeResult.error });
  const canonicalGatheringType = gatheringTypeResult.canonical;


  // Find all matching baggage, including claimed ones
  const baggageList = await MBaggage.find({
    baggageType: canonicalBagType,
    gatheringType: canonicalGatheringType,
    destinationProvince: String(destinationProvince).trim().toLowerCase(),
    destinationDistrict: String(destinationDistrict).trim().toLowerCase(),
    status: { $in: ["lost", "found"] },
  }).select(
    "_id baggageType gatheringType destinationProvince destinationDistrict gatheringLocation"
  );

  res.status(200).json(baggageList);
});

export const viewBaggage = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Baggage ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid baggage ID" });
  }

  // Find the baggage by ID and update status to 'found' if it's still 'lost'
  const baggage = await MBaggage.findOneAndUpdate(
    { _id: id, claimed: false },
    { $set: { status: "found", claimed: true, claimedAt: new Date() } },
    { new: true }
  );

  const findAndReturnBaggage = async (baggageId) => {
    const existingBaggage = await MBaggage.findById(baggageId);
    if (!existingBaggage)
      return res.status(404).json({ message: "Baggage not found" });
    // Return the existing baggage (already found or claimed)
    const {
      baggageType: bType,
      gatheringType: gType,
      destinationProvince: p,
      destinationDistrict: d,
      gatheringLocation: gLoc,
      docLocation,
      finderContact,
      claimed,
    } = existingBaggage;
    const response = {
      baggageType: bType,
      gatheringType: gType,
      destinationProvince: p,
      destinationDistrict: d,
      gatheringLocation: gLoc,
      docLocation,
      finderContact,
      claimed,
    };
    res.status(200).json(response);
  };

  if (baggage) {
    // Successfully updated to found, increment claimed documents stats
    await Stats.findOneAndUpdate(
      {},
      { $inc: { claimedDocuments: 1 } },
      { upsert: true }
    );
  } else {
    return await findAndReturnBaggage(id);
  }
  const {
    baggageType: bType,
    gatheringType: gType,
    destinationProvince: p,
    destinationDistrict: d,
    gatheringLocation: gLoc,
    docLocation,
    finderContact,
    claimed,
  } = baggage;
  const response = {
    baggageType: bType,
    gatheringType: gType,
    destinationProvince: p,
    destinationDistrict: d,
    gatheringLocation: gLoc,
    docLocation,
    finderContact,
    claimed,
  };
  res.status(200).json(response);
});

export const claimBaggage = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID required" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // Find the baggage by ID
  let baggage = await MBaggage.findById(id);
  if (!baggage) {
    return res.status(404).json({ message: "Baggage not found" });
  }

  const updated = await MBaggage.findOneAndUpdate(
    { _id: baggage._id, claimed: false },
    { $set: { claimed: true, claimedAt: new Date(), status: "found" } },
    { new: true }
  );

  if (updated) {
    await Stats.findOneAndUpdate(
      {},
      { $inc: { claimedDocuments: 1 } },
      { upsert: true }
    );
    baggage = updated;
  } else if (baggage.status !== "found") {
    // If already claimed but status hasn't been updated, correct it
    await MBaggage.updateOne(
      { _id: baggage._id, status: { $ne: "found" } },
      { $set: { status: "found" } }
    );
    baggage.status = "found";
  }

  const {
    baggageType: bType,
    gatheringType: gType,
    destinationProvince: p,
    destinationDistrict: d,
    gatheringLocation: gLoc,
    docLocation,
    finderContact,
  } = baggage;
  const response = {
    baggageType: bType,
    gatheringType: gType,
    destinationProvince: p,
    destinationDistrict: d,
    gatheringLocation: gLoc,
    docLocation,
    finderContact,
    claimed: true,
  };
  res.status(200).json(response);
});
