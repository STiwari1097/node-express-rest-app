const express = require('express');
const bodyParser = require('body-parser');

const feedsRouter = require('./routes/feedsRoutes');

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/feeds', feedsRouter);

app.listen(8080, () => {
    console.log('Node.js server is running on port:8080...')
});