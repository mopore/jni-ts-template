import winston from "winston";
import { parseEnvVariableOr } from "../SharedFunctions.js";
import { enums } from "../enums/enums.js";

const LOG_SETUP_NAME = "LOG_SETUP" as const;
enum LogSetup {
	PRODUCTION = "prod",
	DEVELOPMENT = "dev",
}

const colorizedDevFormat = winston.format.printf(({ level, message, timestamp }) => {
  const greyTimestamp = `\x1b[90m${timestamp}\x1b[39m`; // ANSI escape code for grey color
  return `${greyTimestamp} ${level}: ${message}`;
});

const logEnvVariable = parseEnvVariableOr(LOG_SETUP_NAME, LogSetup.DEVELOPMENT); 
const loglevel = enums.to(LogSetup, logEnvVariable);

let internalLog: winston.Logger;

switch (loglevel) {
	case LogSetup.PRODUCTION:
		internalLog = winston.createLogger({
			level: "info",
			format: winston.format.combine(
				winston.format.timestamp({
					format: "YYYY-MM-DD HH:mm:ss"
				}),
				winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
			),
			transports: [
				new winston.transports.Console(),
			],
		});
		break;
	case LogSetup.DEVELOPMENT:
		internalLog = winston.createLogger({
			level: "debug",
			format: winston.format.combine(
				winston.format.timestamp({
					format: "YYYY-MM-DD HH:mm:ss"
				}),
				winston.format.colorize(),
				colorizedDevFormat
			),
			transports: [
				new winston.transports.Console(),
				new winston.transports.File({ 
					dirname: "logs", 
					filename: "error.log", 
					level: "error" 
				}),
				new winston.transports.File({ 
					dirname: "logs", 
					filename: "all.log" 
				})
			]
		});
		break;
	default:
		throw new Error("Log level not supported");
}

export const log = internalLog;