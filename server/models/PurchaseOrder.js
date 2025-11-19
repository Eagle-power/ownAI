const mongoose = require('mongoose');

// Sub-schema for Talents
const TalentSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,

    // 1. Contract Duration
    contractDuration: String,

    // 2. Bill Rate & Currency
    billRate: String,
    billRateCurrency: { type: String, default: 'USD' },

    // 3. Standard Time Rate & Currency
    standardTimeBR: String,
    standardTimeBRCurrency: { type: String, default: 'USD' },

    // 4. Over Time Rate & Currency
    overTimeBR: String,
    overTimeBRCurrency: { type: String, default: 'USD' }
});

// Sub-schema for Job Sections
const JobSectionSchema = new mongoose.Schema({
    sectionId: String,
    jobTitle: String,
    jobId: String,
    selectedTalents: [TalentSchema]
});

// Main Schema
const PurchaseOrderSchema = new mongoose.Schema({
    // Header Fields
    clientName: { type: String, required: true },
    poType: { type: String, required: true },
    poNo: { type: String, required: true },
    receivedOn: { type: Date, required: true },
    receivedFromName: { type: String, required: true },
    receivedFromEmail: { type: String, required: true },
    poStartDate: { type: Date, required: true },
    poEndDate: { type: Date, required: true },
    budget: { type: String, required: true },
    currency: { type: String, default: 'USD' }, // Main Budget Currency

    // Nested Data
    talentsDetails: [JobSectionSchema]
}, { timestamps: true });

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);