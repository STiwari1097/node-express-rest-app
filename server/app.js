const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4 } = require('uuid');

const feedsRouter = require('./routes/feeds.routes');
const authRouter = require('./routes/auth.routes');

const app = express();
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/images')
    },
    filename: function (req, file, cb) {
        cb(null, v4() + path.extname(file.originalname))
    }
});
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
};

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/assets/images', express.static(path.join(__dirname, 'assets', 'images')));
app.use('/feeds', feedsRouter);
app.use('/auth', authRouter);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
});

mongoose.connect('mongodb+srv://shubham:newUser123@cluster0-3gwoz.mongodb.net/message-node?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(res => {
        app.listen(8080, () => {
            console.log('Node.js server is running on port:8080...')
        });
    })
    .catch(err => console.log(err));