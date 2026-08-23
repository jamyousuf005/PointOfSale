const Account = require('./account.model');
const asyncHandler = require('../../middlewares/asyncHandler');

const addAccount = asyncHandler(async (req, res) => {
    const newAccount = await Account.create(req.body);
    return res.status(201).json({ msg: 'account added', newAccount });
});

const showAllAccounts = asyncHandler(async (req, res) => {
    const allAccounts = await Account.find({});
    return res.json(allAccounts);
});

const deleteOne = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await Account.findByIdAndDelete(id);
    return res.json({ msg: 'deleted' });
});

const showOne = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const showOneAcc = await Account.findById(id);
    if (!showOneAcc) {
        res.status(404);
        throw new Error('Account not found');
    }
    return res.json(showOneAcc);
});

const editAccount = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await Account.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({ msg: "Account updated" });
});

module.exports = {
    addAccount,
    showAllAccounts,
    deleteOne,
    showOne,
    editAccount
};