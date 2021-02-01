
const logger = require('../utils/log').logger;

class WebsocketConnect {
    static app = null;

    constructor({
        userId
    } = {}) {
        if (!WebsocketConnect.app) {
            logger.error("websocketconnect.app is miss");
        }
        this.userId = userId;
        this.path = `/${Date.now()}-${parseInt(Math.random() * 10000, 10)}`;
        this.waitSendMsg = [];
        this.roommate = null;
        this._initWss();
    }

    release() {
        this.ws = null;
        WebsocketConnect.app._router.stack.forEach((route, i, routes) => {
            const reg = new RegExp(this.path);
            if (reg.test(route.path)) {
                routes.splice(i, 1);
            }
        })
    }

    send(msg) {
        if (this.ws && this.ws.readyState === 1) {
            this.ws.send(msg);
        } else {
            this.waitSendMsg.push(msg);
        }
    }

    _initWss() {
        WebsocketConnect.app.ws(this.path, this._wssEvent.bind(this)); 
        // 1分钟未连接收回资源
        clearTimeout(this.closeTimer);
        this.closeTimer = setTimeout(() => {
            ws.close(4001);
        }, 60000);     
    }

    _wssEvent(ws) {
        this.ws = ws;
        clearTimeout(this.closeTimer);
        while(this.waitSendMsg.length > 0) {
            this.send(this.waitSendMsg.pop());
        }
        ws.on('message', (msg) => {
            if (this.onMessage) {
                this.onMessage(msg);
            }
        });
        ws.on("close", (code, reason) => {
            this.release();
            if (this.onClose) {
                this.onClose(code, reason);
            }
        });
        ws.on("error", (msg) => {
            logger.error(`create wss error => ${msg.toString()}`)
        });  
    }
}

module.exports = {
    WebsocketConnect
}