import mongoose from "mongoose";

const bcertificateSchema = new mongoose.Schema({
    certificateNumber: {
        type: String,
        required: true,
        unique: true,
        maxlength: 8
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 100
    },
    firstName: {
        type: String,
        required: true,
        maxlength: 100
    },
    idNumber: {
        type: String,
        required: true,
        unique: true,
        maxlength: 14
    },
    docLocation: {
        type: String,
        required: true,
        maxlength: 200
    },
    finderContact: {
        type: String,
        required: true,
        maxlength: 200
    },
    status: {
        type: String,
        enum: ["lost", "claimed"],
        default: "lost"
    },

}, {timestamps: true}
);

const BCertificate = mongoose.model("BCertificate", bcertificateSchema);

export default BCertificate;