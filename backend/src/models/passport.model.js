import mongoose from "mongoose";

const passportSchema = new mongoose.Schema({
    passportNumber: {
        type: String,
        required: true,
        unique: true,
        maxlength: 8,
        minlength: 8,
        trim: true,
        match: /^[A-Z]{2}\d{6}$/,
        uppercase: true
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
   idNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{2}-\d{6,7}[A-Z]\d{2}$/,
    maxlength: 13, 
    minlength: 12,
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
},  {timestamps: true},
);

const Passport = mongoose.model("Passport", passportSchema);

export default Passport;