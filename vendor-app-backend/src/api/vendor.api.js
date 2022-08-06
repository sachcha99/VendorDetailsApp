const express = require('express');
const router = express.Router();
const VendorController = require('../controller/Vendor.controller');

module.exports = function () {
    router.get('/', VendorController.getAllVendors);
    router.get('/:id', VendorController.getVendorById);
    router.post('/create', VendorController.createVendor);
    router.put('/update/:id', VendorController.updateVendor);
    router.delete('/delete/:id', VendorController.deleteVendor);
    router.get('/search/:name', VendorController.searchVendor);
    return router;
}
