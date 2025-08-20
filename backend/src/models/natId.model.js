import mongoose from "mongoose";
import { isValidZimbabweIdNumber } from "../utility/idValidation.utility.js";

const natIdSchema = new mongoose.Schema({
    lastName: {
        type: String,
        required: true,
        maxlength: 100,
        index: true, 
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
      trim: true,
      validate: {
          validator: isValidZimbabweIdNumber,
          message: "Invalid Zimbabwean ID number."
      }
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

}, {timestamps: true});

natIdSchema.index({ claimedAt: 1 }, { expireAfterSeconds: 60 }); // Add TTL index to auto-delete claimed documents after 60 seconds

const NatId = mongoose.model("NatId", natIdSchema);

export default NatId;