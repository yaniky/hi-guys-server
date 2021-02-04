const express = require('express');
const router = express.Router();
const logger = require('../utils/log').logger;
const { UserLinkCenter } = require("../lib/UserLinkCenter");
const { port } = require("../config");

let launchTime = 0;

router.post('/launch', function(req, res, next) {
    if (!req.body.userId) {
        res.send({
            code: -1,
            msg: "userId is need"
        });
        return;
    }
    next();
}, async function(req, res) {
    logger.info(`${req.body.userId} launch`);
    launchTime += 1;
    logger.info(`launch num => ${launchTime}`)
    const link = await UserLinkCenter.addLink({
        userId: req.body.userId,
        type: req.body.type
    });
    res.send({
        code: 1,
        data: {
            port: port,
            path: link.path,
            userId: req.body.userId
        }
    });
});
 
module.exports = router;