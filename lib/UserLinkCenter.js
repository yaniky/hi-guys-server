const { WebsocketConnect } = require("./WebsocketConnect");
const { VideoRank } = require("./rank/VideoRank");
const { AudioRank } = require("./rank/AudioRank");
const { JiaoYiRank } = require("./rank/JiaoYiRank");
const { NvZhuangRank } = require("./rank/NvZhuangRank");
const { NanNiangRank } = require("./rank/NanNiangRank");

const { DirectByUserId } = require("./direct/DirectByUserId");
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

    static LinkWayMap = {
        Rank: "rank", // 排队匹配
        DirectById: "directById" // 直接匹配目标id
    }

    static async addLink({
        userId,
        linkWay = UserLinkCenter.LinkWayMap.Rank,
        type,
        targetId // 直接匹配目标id
    } = {}) {
        if (!UserLinkCenter.linkMap[userId]) {
            logger.info(`create link for user => ${userId}`)
            switch(linkWay) {
                case UserLinkCenter.LinkWayMap.DirectById: {
                    await UserLinkCenter.addDirectLink({
                        userId,
                        linkWay,
                        targetId
                    });
                    break;
                }
                case UserLinkCenter.LinkWayMap.Rank:
                default: {
                    await UserLinkCenter.addRankLink({
                        userId,
                        type
                    })
                    break;
                }
            }
        }
        return UserLinkCenter.linkMap[userId];
    }

    static async addRankLink({
        userId,
        type
    } = {}) {
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

    static async addDirectLink({
        userId,
        targetId
    } = {}) {
        const connect = new WebsocketConnect({
            userId
        });
        UserLinkCenter.linkMap[userId] = connect;
        UserLinkCenter.linkMap[userId].onClose = (code, reason) => {
            DirectByUserId.remove(UserLinkCenter.linkMap[userId]);
            UserLinkCenter.linkMap[userId] = null;
        }
        logger.info(`push direct for user => ${userId}`)
        DirectByUserId.push({
            link: UserLinkCenter.linkMap[userId],
            targetId
        });
    }
}

module.exports = {
    UserLinkCenter
}