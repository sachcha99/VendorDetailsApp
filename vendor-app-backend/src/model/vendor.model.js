const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
    vendorId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactNo: { type: String, required: true },
    email: { type: String, required: true },
    registeredDate: { type: String, required: true },
    product: [{
        pid: { type: String, required: true },
        pname: { type: String, required: true },
        pcode: { type: String, required: true },
        type: { type: String, required: true },
    }],
});

const Vendor = mongoose.model('vendor', VendorSchema);
module.exports = Vendor;