const express = require('express');
const app = express();
const { port } = require("./config");
const rootRoute = require("./routes/rootRoute");
const logger = require('./utils/log').logger;
const { WebsocketConnect } = require("./lib/WebsocketConnect");
const expressWs = require('express-ws')(app);

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

app.use(express.json());
app.use('/static', express.static('static'));

app.use(rootRoute);

app.use(function (err, req, res, next) {
    logger.error(err.toString());
    res.status(500).send('Something broke!')
});

WebsocketConnect.app = app;

app.listen(port, () => console.log(`hi-friend server listening on port ${port}!`))