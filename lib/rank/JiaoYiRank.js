const logger = require('../../utils/log').logger;
const { Room } = require("../Room");

// 胶衣匹配
class JiaoYiRank {
    static waitList = [];

    static push(link) {
        JiaoYiRank.waitList.push(link);
        JiaoYiRank.tryMatch();
    }

    static remove(link) {
        JiaoYiRank.waitList.forEach((item, index) => {
            if (link === item) {
                JiaoYiRank.waitList.splice(index, 1);
            }
        });
    }

    static tryMatch() {
        if (JiaoYiRank.waitList.length >= 2) {
            JiaoYiRank.matchLink();
        } else if (JiaoYiRank.waitList.length > 0) {
            logger.info(`JiaoYiRank user need wait, list length => ${JiaoYiRank.waitList.length}`);
        }
    }

    static matchLink() {
        Room.create(JiaoYiRank.waitList.pop(), JiaoYiRank.waitList.pop());
        JiaoYiRank.tryMatch();
    }
}

module.exports = {
    JiaoYiRank
}