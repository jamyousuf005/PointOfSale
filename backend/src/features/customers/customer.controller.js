const Customer = require('./customer.model');

const addCustomer = async (req, res) => {
    try {
        const { group, name, company, email, phone, tax, address, balance } = req.body;
        // Organizational Multi-Tenancy
        const tenantId = req.user.tenantId || req.user._id;

        const newCustomer = new Customer({
            userId: tenantId,
            group,
            name,
            company,
            email,
            phone,
            tax,
            address,
            balance
        });

        await newCustomer.save();
        res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
    } catch (error) {
        res.status(500).json({ message: 'Error adding customer', error: error.message });
    }
};

const getCustomers = async (req, res) => {
    try {
        const tenantId = req.user.tenantId || req.user._id;
        const customers = await Customer.find({ userId: tenantId }).sort({ createdAt: -1 });
        
        // Map _id to id for frontend compatibility
        const formattedCustomers = customers.map(c => ({
            id: c._id,
            group: c.group,
            name: c.name,
            company: c.company,
            email: c.email,
            phone: c.phone,
            tax: c.tax,
            address: c.address,
            balance: c.balance
        }));
        
        res.status(200).json(formattedCustomers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const tenantId = req.user.tenantId || req.user._id;
        
        const customer = await Customer.findOneAndDelete({ _id: id, userId: tenantId });
        
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found or access denied' });
        }
        
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }
};

module.exports = {
    addCustomer,
    getCustomers,
    deleteCustomer
};
