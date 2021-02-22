const logger = require('../../utils/log').logger;
const { Room } = require("../Room");

// 胶衣匹配
class NanNiangRank {
    static waitList = [];

    static push(link) {
        NanNiangRank.waitList.push(link);
        NanNiangRank.tryMatch();
    }

    static remove(link) {
        NanNiangRank.waitList.forEach((item, index) => {
            if (link === item) {
                NanNiangRank.waitList.splice(index, 1);
            }
        });
    }

    static tryMatch() {
        if (NanNiangRank.waitList.length >= 2) {
            NanNiangRank.matchLink();
        } else if (NanNiangRank.waitList.length > 0) {
            logger.info(`NanNiangRank user need wait, list length => ${NanNiangRank.waitList.length}`);
        }
    }

    static matchLink() {
        Room.create(NanNiangRank.waitList.pop(), NanNiangRank.waitList.pop());
        NanNiangRank.tryMatch();
    }
}

module.exports = {
    NanNiangRank
}