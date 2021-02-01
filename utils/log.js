const log4js = require('log4js');
const path = require("path")
log4js.configure({
    appenders: { 
        console: { type: "console" },
        dateFile: {
            type: "dateFile",
            filename: path.resolve(__dirname, '../logs/log.log'),
            pattern: "_yyyy-MM-dd",
            alwaysIncludePattern: false
        }
    },
    categories: { 
        default: { 
            appenders: ["dateFile"], level: "info" 
        } 
    },
    replaceConsole: true   //替换console.log
});
 
var dateFileLog = log4js.getLogger('dateFileLog');
 
exports.logger = dateFileLog;