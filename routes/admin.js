const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/database");

const Admin = require("../models/admin");

//Register
router.post('/register', (req, res, next) => {
    let newAdmin = new Admin({
        name: req.body.name,
        username: req.body.username,
        adminLevel: req.body.adminLevel,
        password: req.body.password
    });

    Admin.addAdmin(newAdmin, (err, admin) => {
        if (err) {
            res.json({ success: false, msg: "Failed to register admin" });
        } else {
            res.json({ success: true, msg: "Admin registered" });
        }
    });
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    Admin.getAdminByUsername(username, (err, admin) => {
        if (err) throw err;
        if (!admin) {
            return res.json({ succes: false, msg: "Admin not found" });
        }

        Admin.comparePassword(password, admin.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({ data: admin }, config.secret, {
                    expiresIn: 28800 // 1 hour - this must be set in seconds
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    admin: {
                        id: admin._id,
                        name: admin.name,
                        adminLevel: admin.adminLevel,
                    }
                });
            } else {
                return res.json({ success: false, msg: "Wrong password" });
            }
        });
    });
});

//Profile
// router.get('/profile', passport.authenticate("jwt", { session: false }), (req, res, next) => {
//     console.log(req.admin)
//     res.json({ admin: req.admin });
// });

module.exports = router;