import mongoose from "mongoose";

const scertificateSchema = new mongoose.Schema({
    certificateType: {
        type: String,
        required: true,
        enum: ["Olevel", "Alevel", "Poly", "University", "Other"],
        default: "Other"
    },
      lastName: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
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