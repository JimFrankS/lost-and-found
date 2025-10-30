import mongoose from "mongoose";

export const ALLOWED_CERTIFICATE_TYPES = ["Olevel", "Alevel", "Poly", "University", "Other"];

const scertificateSchema = new mongoose.Schema({
    certificateType: {
        type: String,
        required: true,
        enum: ALLOWED_CERTIFICATE_TYPES,
        default: "Other"
    },
      lastName: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true,
        set: (v) => v && typeof v === 'string' ? v.toLowerCase() : v
    },
    firstName: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true,
        set: (v) => v && typeof v === 'string' ? v.toLowerCase() : v
    },
    docLocation: {
        type: String,
        required: true,
        maxlength: 200,
        trim: true
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

}, {timestamps: true},
);

scertificateSchema.index({ lastName:1, certificateType: 1}); // Create a compound index for efficient lookups
scertificateSchema.index({ claimedAt: 1 }, { expireAfterSeconds: 60 }); // Add TTL index to auto-delete claimed documents after 60 seconds

const Scertificate = mongoose.model("Scertificate", scertificateSchema);

export default Scertificate;
