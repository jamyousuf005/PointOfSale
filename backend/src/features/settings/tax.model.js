const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rate: { type: Number, required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
}, { timestamps: true });

// Ensure unique tax name per tenant
taxSchema.index({ name: 1, tenantId: 1 }, { unique: true });

module.exports = mongoose.model('tax', taxSchema);
