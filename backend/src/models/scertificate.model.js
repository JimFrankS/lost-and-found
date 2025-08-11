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
        maxlength: 200,
        trim: true
    },
    status: {
        type: String,
        enum: ["lost", "claimed"],
        default: "lost",
        index: true
    },

}, {timestamps: true},
);

const Scertificate = mongoose.model("Scertificate", scertificateSchema);

export default Scertificate;