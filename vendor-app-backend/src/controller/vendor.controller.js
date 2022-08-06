const Vendor = require("../model/vendor.model");

//Add New Vendor
const createVendor = async (req, res) => {
    if (req.body) {

        const vendor = new Vendor(req.body);

        await vendor.save()
            .then(data => res.status(200).send({ data: data }))
            .catch(err => res.status(500).send(err));

    }
}

//update Vendor Details
const updateVendor = async (req, res) => {
    if (req.body) {
        if (!req.params.id) return res.status(500).send("Id is missing");
        let id = req.params.id;

        updateDetails(id, req, (err, vendor) => {
            if (err) return res.status(500).send(err);
            res.status(200).send(vendor);
        })
    }
}

function updateDetails(id, req, callback) {
    Vendor.findByIdAndUpdate(id, req.body)
        .then((res) => {
            Vendor.findOne({ _id: id }, (err, result) => {
                if (err) {
                    console.log(err);
                    return callback(err);
                } else {
                    var vendor = result;
                    console.log(vendor);
                    return callback(null, vendor);
                }
            });
        })
        .catch(err => {
            console.log(err)
            return callback(err);
        })
}

//get All Vendors
const getAllVendors = async (req, res) => {
    await Vendor.find()
        .then((data) => {
            res.status(200).send(data);
        })
        .catch(error => {
            res.send(error);
        });
}

//delete Vendor
const deleteVendor = async (req, res) => {
    if (req.params.id) {
        await Vendor.findByIdAndDelete(req.params.id, (err, result) => {
            if (err) return res.status(500).send(err);
            console.log(result);
            return res.status(200).send(result);
        });
    }
}

//getVendorById
const getVendorById = async (req, res) => {
    await Vendor.find({ _id: req.params.id }, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
            console.log(result);
        }
    })
};

//Search Vendor
const searchVendor = async (req, res) => {

    await Vendor.find({ 'name': { $regex: '.*' + req.params.name + '.*' } }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
};

module.exports = {
    createVendor,
    updateVendor,
    deleteVendor,
    getAllVendors,
    getVendorById,
    searchVendor
}