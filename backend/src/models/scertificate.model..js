import mongoose from "mongoose";

const scertificateSchema = new mongoose.Schema({
    certificateType: {
        type: String,
        required: true,
        enum: ["Olevel", "Alevel", "Poly", "University", "Other"],
        default: "Other",
        required: true
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

}, {timestamps: true},
);

const Scertificate = mongoose.model("Scertificate", scertificateSchema);

export default Scertificate;