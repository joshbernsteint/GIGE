import fs from 'fs';

/** Logger class to hold the methods for printing to the log */
class Logger{
    constructor(logPath, defaultConsole=console){
        this.logPath = logPath
        this.logConsole = defaultConsole;
    }
    
    createLog(){
        const fd = fs.openSync(this.logPath,'w+');//Creates the log file and immediately closes it (in case it doesn't exist)
        fs.closeSync(fd);
        const logFileStream = fs.createWriteStream(this.logPath);
        this.logConsole = new console.Console(logFileStream, logFileStream);//Creates a new console object
    }

    /**Get's the current date/time for printing to the log */
    static _getLogDate(){
        return new Date().toLocaleString().replace(", "," @ ");
    }

    /**
     * Prints something to the log file. If the log file is uninitialized, it prints to the default console object.
     * @param {string} str String to be printed
     */
    log(str){
        str = String(str);
        const toPrint = str.trim();
        this.logConsole.log(`[${Logger._getLogDate()}]: ${toPrint}`);
    }

    /**
     * Prints an error to the log file. If the log file is uninitialized, it prints to the default console object.
     * @param {string} str String to be printed
     */
    error(str){
        const toPrint = String(str).trim();
        this.logConsole.log(`[${Logger._getLogDate()}](Error): ${toPrint}`);
    }

    /** Prints the location of the log given a write function that takes in a string. */
    printLogLocationMessage(writeFn=console.log){
        writeFn(`Log can be found at: '${this.logPath}'`);
    }
}

export default Logger;