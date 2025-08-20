import Stats from '../models/stats.model.js';
import logger from './logger.utility.js';

export async function ensureStatsInitialized() {
    // Atomically find and update the stats document.
    // If it doesn't exist, create it with default values.
    const stats = await Stats.findOneAndUpdate(
        {}, // An empty filter object will match the first document found or be used for creation
        { $setOnInsert: { totalDocuments: 0, claimedDocuments: 0 } }, // Only applies on insert
        {
            upsert: true, // Create the document if it doesn't exist
            new: true, // Return the new or updated document
            setDefaultsOnInsert: true, // Apply schema defaults on creation
            projection: { totalDocuments: 1, claimedDocuments: 1, _id: 0 } // Return only these fields
        }
    );

    // The above operation with `upsert: true` and `new: true` will always return a document.
    logger.info('Stats collection checked and initialized.', {
        totalDocuments: stats.totalDocuments,
        claimedDocuments: stats.claimedDocuments
    });

    return stats;
}
