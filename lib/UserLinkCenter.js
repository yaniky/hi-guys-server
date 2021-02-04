const { WebsocketConnect } = require("./WebsocketConnect");
const { VideoRank } = require("./rank/VideoRank");
const { AudioRank } = require("./rank/AudioRank");
const logger = require('../utils/log').logger;

class UserLinkCenter {
    static linkMap = {};

    static async addLink({
        userId,
        type
    } = {}) {
        if (!UserLinkCenter.linkMap[userId]) {
            logger.info(`create link for user => ${userId}`)
            const rank = type === "audio" ? AudioRank : VideoRank;
            const connect = new WebsocketConnect({
                userId
            });
            UserLinkCenter.linkMap[userId] = connect;
            UserLinkCenter.linkMap[userId].onClose = (code, reason) => {
                rank.remove(UserLinkCenter.linkMap[userId]);
                UserLinkCenter.linkMap[userId] = null;
            }
            logger.info(`push rank for user => ${userId}`)
            rank.push(UserLinkCenter.linkMap[userId]);
        }
        return UserLinkCenter.linkMap[userId];
    }
}

module.exports = {
    UserLinkCenter
}