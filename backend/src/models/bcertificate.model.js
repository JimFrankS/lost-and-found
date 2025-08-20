import mongoose from "mongoose";

const bcertificateSchema = new mongoose.Schema({
    motherLastName:{
        type: String,
        required: true,
        maxlength: 100,
        trim: true
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
    secondName: {
        type: String,
        maxlength: 100,
        default: "",
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

}, {timestamps: true}
);

bcertificateSchema.index({ lastName: 1, motherLastName: 1 }); // Create a compound index for efficient lookups
// Add TTL index to auto-delete claimed documents after 60 seconds
bcertificateSchema.index({ claimedAt: 1 }, { expireAfterSeconds: 60 });

const BCertificate = mongoose.model("BCertificate", bcertificateSchema);

export default BCertificate;
