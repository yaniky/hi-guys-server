const { WebsocketConnect } = require("./WebsocketConnect");
const { VideoRank } = require("./rank/VideoRank");
const { AudioRank } = require("./rank/AudioRank");

class UserLinkCenter {
    static linkMap = {};

    static async addLink({
        userId,
        type
    } = {}) {
        if (!UserLinkCenter.linkMap[userId]) {
            const rank = type === "audio" ? AudioRank : VideoRank;
            const connect = new WebsocketConnect({
                userId
            });
            UserLinkCenter.linkMap[userId] = connect;
            UserLinkCenter.linkMap[userId].onClose = (code, reason) => {
                rank.remove(UserLinkCenter.linkMap[userId]);
                UserLinkCenter.linkMap[userId] = null;
            }
            rank.push(UserLinkCenter.linkMap[userId]);
        }
        return UserLinkCenter.linkMap[userId];
    }
}

module.exports = {
    UserLinkCenter
}