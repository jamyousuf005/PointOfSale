const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, default: null }, // URL or filename
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
}, { timestamps: true });

// Ensure unique brand name per tenant
brandSchema.index({ name: 1, tenantId: 1 }, { unique: true });

module.exports = mongoose.model('brand', brandSchema);
