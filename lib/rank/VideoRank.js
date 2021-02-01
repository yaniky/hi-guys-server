const logger = require('../../utils/log').logger;
const { Room } = require("../Room");

class VideoRank {
    static waitList = [];

    static push(link) {
        Rank.waitList.push(link);
        Rank.tryMatch();
    }

    static remove(link) {
        Rank.waitList.forEach((item, index) => {
            if (link === item) {
                Rank.waitList.splice(index, 1);
            }
        });
    }

    static tryMatch() {
        if (Rank.waitList.length >= 2) {
            Rank.matchLink();
        } else if (Rank.waitList.length > 0) {
            logger.info(`user need wait, list length => ${Rank.waitList.length}`);
        }
    }

    static matchLink() {
        Room.create(Rank.waitList.pop(), Rank.waitList.pop());
        Rank.tryMatch();
    }
}

module.exports = {
    VideoRank
}