const mongoose = require('mongoose');

const inventoryMovementSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { 
        type: String, 
        enum: ['PURCHASE', 'SALE', 'SALE_RETURN', 'PURCHASE_RETURN', 'ADJUSTMENT'], 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true 
    }, // Positive for in, Negative for out
    referenceId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true 
    }, // ID of the sale, purchase, or return
    notes: { 
        type: String 
    }
}, { timestamps: true });

const InventoryMovement = mongoose.model('InventoryMovement', inventoryMovementSchema);
module.exports = InventoryMovement;
