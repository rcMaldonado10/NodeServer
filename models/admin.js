const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("../config/database");

//User Schema
const AdminSchema = mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    adminLevel: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Admin = module.exports = mongoose.model("admin", AdminSchema);

module.exports.getAdminById = function (id, callback) {
    Admin.findById(id, callback);
}

module.exports.getAdminByUsername = function (username, callback) {
    const query = { username: username };
    Admin.findOne(query, callback);
}

module.exports.addAdmin = function (newAdmin, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) throw err;
            newAdmin.password = hash;
            newAdmin.save(callback);
        })
    });
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}