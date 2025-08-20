import mongoose from "mongoose";

export const BAGGAGE_TYPES = [
  "purse", "wallet", "handbag", "hustlebag", "laptopbag", "briefcase", "satchel",
  "travelingbag", "changanibag", "monarch", "plasticbag", "tsaga", "box", "other"
];

const baggageSchema = new mongoose.Schema({
  baggageType: {
    type: String,
    required: true,
    enum: {
      values: BAGGAGE_TYPES,
      message: '{VALUE} is not a valid baggage type'
    },
    default: "other",
    set: v => v && typeof v === 'string' ? v.toLowerCase() : v
  },

    transportType: {
        type: String,
        required: true,
        enum: ["bus", "kombi", "mushikashika", "private"],
        default: "private",
        set: v => v && typeof v === 'string' ? v.toLowerCase() : v
    },

    routeType: {
        type: String,
        required: true,
        enum: ["local", "intercity"],
        default: "local",
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

    destination: {
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
baggageSchema.index({
  baggageType: 1,
  transportType: 1,
  routeType: 1,
  destinationProvince: 1,
  destinationDistrict: 1
});

baggageSchema.index({ claimedAt: 1 }, { expireAfterSeconds: 60 });

const Baggage = mongoose.model("Baggage", baggageSchema);

export default Baggage;


