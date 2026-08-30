const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    baseUnit: { type: String, default: 'N/A' },
    operator: { type: String, enum: ['*', '/', '+', '-'], default: '*' },
    operationValue: { type: Number, default: 1 },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
}, { timestamps: true });

// Ensure unique code per tenant
unitSchema.index({ code: 1, tenantId: 1 }, { unique: true });

module.exports = mongoose.model('unit', unitSchema);
