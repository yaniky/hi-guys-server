const logger = require('../../utils/log').logger;
const { Room } = require("../Room");

// 胶衣匹配
class NvZhuangRank {
    static waitList = [];

    static push(link) {
        NvZhuangRank.waitList.push(link);
        NvZhuangRank.tryMatch();
    }

    static remove(link) {
        NvZhuangRank.waitList.forEach((item, index) => {
            if (link === item) {
                NvZhuangRank.waitList.splice(index, 1);
            }
        });
    }

    static tryMatch() {
        if (NvZhuangRank.waitList.length >= 2) {
            NvZhuangRank.matchLink();
        } else if (NvZhuangRank.waitList.length > 0) {
            logger.info(`NvZhuangRank user need wait, list length => ${NvZhuangRank.waitList.length}`);
        }
    }

    static matchLink() {
        Room.create(NvZhuangRank.waitList.pop(), NvZhuangRank.waitList.pop());
        NvZhuangRank.tryMatch();
    }
}

module.exports = {
    NvZhuangRank
}