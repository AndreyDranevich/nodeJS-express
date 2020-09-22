const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs')
const models = require('../models')

router.post('/register', (req, res) => {
    const {email, pass, firstName, secondName, address, addressDetails, city, zip} = req.body;

    if (!email) {
        res.json({
            ok: false,
            error: 'Empty email',
        });
    } else {
        models.user.findOne({email}).then(user => {
            console.log(user);
            if (!user) {
                bcrypt.hash(pass, null, null, (err, hash) => {
                    models.user.create({
                        email,
                        pass: hash,
                        firstName,
                        secondName,
                        address,
                        addressDetails,
                        city,
                        zip
                    }).then(user => {
                        console.log(user);
                        console.log('Registration success')
                        res.redirect('/');
                    }).catch(err => {
                        console.log(err);
                        res.json({
                            ok: false,
                            error: "All field with * must be filled"
                        });
                    });
                });
            } else {
                res.json({
                    ok: false,
                    error: 'This email already exists'
                });
            }
        }).catch(err => {
            res.json({
                ok: false,
                error: err
            });
        });
    }
});


router.post('/auth', (req, res) => {
    console.log(req.body);
    const {email, pass} = req.body;
    if (!email || !pass) {
        res.json({
            ok: false,
            error: "email or pass is empty!"
        });
    } else {
        models.user.findOne({email}).then(user => {
            if (!user) {
                res.json({
                    ok: false,
                    error: "Wrong user or password"
                });
            } else {
                bcrypt.compare(pass, user.pass, (err, result) => {
                    if (!result) {
                        res.json({
                            ok: false,
                            error: "Wrong user or password"
                        });
                    } else {
                        req.session.userId = user._id;
                        req.session.userEmail = user.email;
                        req.session.firstName = user.firstName
                        req.session.secondName = user.secondName
                        res.redirect('/');
                    }
                });
            }
        })
    }
})


module.exports = router;
