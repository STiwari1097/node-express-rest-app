const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

exports.signup = (req, res, next) => {
    console.log(req.body);
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const error = new Error('Validations falied!');
        error.statusCode = 422;
        error.data = validationErrors.array();
        throw error;
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPass => {
            const user = new User({
                name: name,
                email: email,
                password: hashedPass
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'User created successfully!',
                userId: result._id
            });
        })
        .catch(err => next(err));
};

exports.signin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('User with this Email ID doesn\'t exist');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Password is incorrect!');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString()
                },
                'supersecretkey',
                { expiresIn: '1h' }
            );
            res.status(200).json({ token: token, userId: loadedUser._id.toString(), expiresIn: 3600 });
        })
        .catch(err => next(err));
};

exports.getUserStatus = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found!');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ status: user.status });
        })
        .catch(err => next(err));
};

exports.updateUserStatus = (req, res, next) => {
    const userStatus = req.body.status;
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found!');
                error.statusCode = 404;
                throw error;
            }
            user.status = userStatus;
            return user.save();
        })
        .then(user => {
            res.status(200).json({ message: 'Status updated successfully!' });
        })
        .catch(err => next(err));
};