const logger = require('../utils/log').logger;

class Room {
    static create(link1, link2) {
        logger.info(`mach => ${link1.userId} and ${link2.userId}`)
        link1.roommate = link2;
        link2.roommate = link1;
        link1.onMessage = (msg) => {
            let msgObj = msg;
            try {
                msgObj = JSON.parse(msg);
            } catch(e) {
                msgObj = msg;
            }
            if (msgObj) {
                link2.send(msg);
            }
        }
        link2.onMessage = (msg) => {
            let msgObj = msg;
            try {
                msgObj = JSON.parse(msg);
            } catch(e) {
                msgObj = msg;
            }
            if (msgObj) {
                link1.send(msg);
            }
        }
        link1.send(JSON.stringify({
            type: "join",
            role: "offer",
            tagId: link2.userId
        }));
        link2.send(JSON.stringify({
            type: "join",
            role: "answer",
            tagId: link1.userId
        }));
    }
}

module.exports = {
    Room
}