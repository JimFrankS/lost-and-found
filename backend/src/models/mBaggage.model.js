import mongoose from "mongoose";

export const MBaggageTypes = [
    "clothing", "wallet", "handbag", "documents", "jewelry", "keys", "phone", "tablet", "laptop", "headphones", "charger", "earpods", "earphones", "money", "hustlebag", "monarch", "satchel", "laptopBag", "briefcase", "travelingbag", "changanibag", "box", "other"
];

const mBaggageSchema = new mongoose.Schema({
  baggageType: {
    type: String,
    required: true,
    enum: {
      values: MBaggageTypes,
      message: '{VALUE} is not a valid baggage type'
    },
    default: "other",
    set: v => v && typeof v === 'string' ? v.toLowerCase() : v
  },

    gatheringType: {
        type: String,
        required: true,
        enum: ["entertainment", "church", "school", "other"],
        default: "church",
        set: v => v && typeof v === 'string' ? v.toLowerCase() : v
    },

    destinationProvince: {
        type: String,
        required: true,
        maxlength: 19,
        minlength:6,
        trim: true,
        set: v => v && typeof v === 'string' ? v.toLowerCase() : v
    },

    destinationDistrict: {
        type: String,
        required: true,
        maxlength: 26,
        minlength: 4,
        trim: true,
        set: v => v && typeof v === 'string' ? v.toLowerCase() : v
    },

    gatheringLocation: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true,
        set: v => v && typeof v === 'string' ? v.toLowerCase() : v
    },

    docLocation: {
        type: String,
        required: true,
        maxlength: 200,
        trim: true,
        set: v => v && typeof v === 'string' ? v.toLowerCase() : v
    },
    finderContact: {
        type: String,
        required: true,
        match: /^07(?:8[0-9]{7}|[137][1-9][0-9]{6})$/,
        maxlength: 10,
        trim: true
    },
    status: {
        type: String,
        enum: ["lost", "found"],
        default: "lost",
        index: true 
    },
    claimed: {
        type: Boolean,
        default: false
    },
    claimedAt: {
        type: Date,
        default: null
    }
}, {timestamps: true});

// Create a compound index for efficient lookups
mBaggageSchema.index({
  baggageType: 1,
  gatheringType: 1,
  destinationProvince: 1,
  destinationDistrict: 1
});

mBaggageSchema.index({ claimedAt: 1 }, { expireAfterSeconds: 60 }); // 60 seconds for found items

const MBaggage = mongoose.model("MBaggage", mBaggageSchema);

export default MBaggage;


