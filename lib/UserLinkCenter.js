const { WebsocketConnect } = require("./WebsocketConnect");
const { VideoRank } = require("./rank/VideoRank");
const { AudioRank } = require("./rank/AudioRank");
const { JiaoYiRank } = require("./rank/JiaoYiRank");
const { NvZhuangRank } = require("./rank/NvZhuangRank");
const { NanNiangRank } = require("./rank/NanNiangRank");
const logger = require('../utils/log').logger;

const rankMap = {
    video: VideoRank, // 视频匹配, 后续看情况去除
    audio: AudioRank, // 男同匹配
    jiaoyi: JiaoYiRank, // 胶衣匹配
    nvzhuang: NvZhuangRank, // 女装匹配
    nanniang: NanNiangRank // 男娘匹配
}
class UserLinkCenter {
    static linkMap = {};

    static async addLink({
        userId,
        type
    } = {}) {
        if (!UserLinkCenter.linkMap[userId]) {
            logger.info(`create link for user => ${userId}`)
            const rank = rankMap[type];
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