const logger = require('../../utils/log').logger;
const { Room } = require("../Room");

// 男同匹配
class AudioRank {
    static waitList = [];

    static push(link) {
        AudioRank.waitList.push(link);
        AudioRank.tryMatch();
    }

    static remove(link) {
        AudioRank.waitList.forEach((item, index) => {
            if (link === item) {
                AudioRank.waitList.splice(index, 1);
            }
        });
    }

    static tryMatch() {
        if (AudioRank.waitList.length >= 2) {
            AudioRank.matchLink();
        } else if (AudioRank.waitList.length > 0) {
            logger.info(`AudioRank user need wait, list length => ${AudioRank.waitList.length}`);
        }
    }

    static matchLink() {
        Room.create(AudioRank.waitList.pop(), AudioRank.waitList.pop());
        AudioRank.tryMatch();
    }
}

module.exports = {
    AudioRank
}