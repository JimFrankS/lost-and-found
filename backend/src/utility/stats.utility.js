import Stats from '../models/stats.model.js';
import mongoose from "mongoose";
/**
 * Ensure the Stats collection has an initial document and return current counts.
 *
 * If the collection is empty, creates a Stats document with { totalDocuments: 0, claimedDocuments: 0 }.
 * Always returns an object with the shape { totalDocuments: number, claimedDocuments: number } reflecting the stored values (or zeros if none found).
 *
 * @return {{ totalDocuments: number, claimedDocuments: number }} Current stats values.
 */
export async function ensureStatsInitialized() {
    const count = await Stats.countDocuments();
    if (count === 0) {
        await Stats.create({ totalDocuments: 0, claimedDocuments: 0 });
        console.log('Stats collection initialized with totalDocuments=0 and claimedDocuments=0');
    } else {
        console.log('Stats collection already initialized');
    }
    // Always return the current stats (just those two fields)
    const stats = await Stats.findOne({}, { totalDocuments: 1, claimedDocuments: 1, _id: 0 });
    if (stats) {
        return {
            totalDocuments: stats.totalDocuments,
            claimedDocuments: stats.claimedDocuments
        };
    } else {
        return { totalDocuments: 0, claimedDocuments: 0 };
    }
}

