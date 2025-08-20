import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
    totalDocuments: {
        type: Number,
        default: 0 
    },
    claimedDocuments: {
        type: Number,
        default: 0 
    },
});

const Stats = mongoose.model("Stats", statsSchema);

export default Stats;