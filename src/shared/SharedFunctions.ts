import { log } from "./logger/log.js";

export const parseEnvVariable = (envName: string): string => {
	const envRawValue = process.env[envName];
	if (envRawValue === undefined){
		const errMsg = `Environment variable "${envName}" is not set.`;
		throw new Error(errMsg);
	}
	let envValue: string;
	try {
		envValue = String(envRawValue);
		if (envValue.trim().length === 0 ){
			throw new Error( `Value for environment variable "${envName} is not set.`);
		}
		return envValue;
	}
	catch (error){
		const errorMessage = `Could not parse environment variable for '${envName}'. Please check.`;
		log.error(errorMessage);
		console.trace();
		throw new Error(errorMessage);
	}
}

export const parseEnvVariableOr = (envName: string, defaultValue: string): string => {
	let envRawValue = process.env[envName];
	if (envRawValue === undefined){
		envRawValue = defaultValue;
	}
	let envValue: string;
	try {
		envValue = String(envRawValue);
		if (envValue.trim().length === 0 ){
			throw new Error( `Value for environment variable "${envName} is not set.`);
		}
		return envValue;
	}
	catch (error){
		const errorMessage = `Could not parse environment variable for '${envName}'. Please check.`;
		log.error(errorMessage);
		console.trace();
		throw new Error(errorMessage);
	}
}

