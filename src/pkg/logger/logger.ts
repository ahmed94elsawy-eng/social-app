export type Level = 'error' | 'warn' | 'info' | 'debug';

class Logger {
    static instance: Logger;

    constructor() {
        if (!Logger.instance) {
            Logger.instance = this;// {}
        }
        return Logger.instance
    }


    log(level: Level, message: string, metaData = {}) {
        let messageObj = {
            level: level, message: message, timestamp: new Date().toISOString(), ...metaData
        };
        console.log(JSON.stringify(messageObj));
    }

    error(message: string, metaData = {}) {
        this.log('error', message, metaData);
    }

    warn(message: string, metaData = {}) {
        this.log('warn', message, metaData);
    }

    info(message: string, metaData = {}) {
        this.log('info', message, metaData);
    }

    debug(message: string, metaData = {}) {
        this.log('debug', message, metaData);
    }
}

export const logger = new Logger();
// single tone + Dependency injection
