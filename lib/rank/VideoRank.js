const logger = require('../../utils/log').logger;
const { Room } = require("../Room");

class VideoRank {
    static waitList = [];

    static push(link) {
        VideoRank.waitList.push(link);
        VideoRank.tryMatch();
    }

    static remove(link) {
        VideoRank.waitList.forEach((item, index) => {
            if (link === item) {
                VideoRank.waitList.splice(index, 1);
            }
        });
    }

    static tryMatch() {
        if (VideoRank.waitList.length >= 2) {
            VideoRank.matchLink();
        } else if (VideoRank.waitList.length > 0) {
            logger.info(`VideoRank user need wait, list length => ${VideoRank.waitList.length}`);
        }
    }

    static matchLink() {
        Room.create(VideoRank.waitList.pop(), VideoRank.waitList.pop());
        VideoRank.tryMatch();
    }
}

module.exports = {
    VideoRank
}