const logger = require('../../utils/log').logger;
const { Room } = require("../Room");

// 直接匹配目标id
class DirectByUserId {
    static WaitLinkMap = {}; // 等待队列，key为目标userid

    static push({
        link,
        targetId
    } = {}) {
        logger.info(`push directByUserId link => ${link.userId}`);
        if (DirectByUserId.WaitLinkMap[link.userId] && targetId === DirectByUserId.WaitLinkMap[link.userId].userId) {
            Room.create(DirectByUserId.WaitLinkMap[link.userId], link);
            DirectByUserId.WaitLinkMap[link.userId] = null;
            logger.info(`directByUserId link success => ${link.userId} and ${targetId}`);
        } else {
            DirectByUserId.WaitLinkMap[targetId] = link;
            logger.info(`directByUserId append wait link => ${link.userId}`);
        }
    }

    static remove(link) {
        for (const key in DirectByUserId.WaitLinkMap) {
            if (DirectByUserId.WaitLinkMap[key] === link) {
                DirectByUserId.WaitLinkMap[key] = null;
                logger.info(`remove wait link success => ${link.userId}`);
            }
        }
    }
}

module.exports = {
    DirectByUserId
}