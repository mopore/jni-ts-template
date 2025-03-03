import { log } from "./logger/log.js";

export function parseEnvVariable(envName: string): string{
	const envRawValue = process.env[envName];
	let envValue: string;
	try {
		envValue = String(envRawValue);
		if (envValue.trim().length === 0 ){
			throw new Error( `Value for environment variable "${envName} is not set.`);
		}
		return envValue;
	}
	catch {
		const errorMessage = `Could not parse environment variable for '${envName}'. Please check.`;
		log.error(errorMessage);
		log.trace();
		throw new Error(errorMessage);
	}
}

export const sleepAsync = async (ms: number): Promise<void> => {
	return new Promise(resolve => setTimeout(resolve, ms))
};

export const managedCallAsync = async <T>(
	func: () => Promise<T>,
	retryCount: number,
	retryDelayMs: number,
): Promise<T> => {
	for (let i = 0; i <= retryCount; i++){
		try {
			return await func();
		}
		catch (err: unknown){
			log.warn(`Call failed. Retrying in ${retryDelayMs/1000} sec(s). Error: ${err}`);
			await sleepAsync(retryDelayMs);
		}
	}
	const errorMessage = `Call failed after ${retryCount}`;
	log.error(errorMessage);
	log.trace();
	throw new Error(errorMessage);
}
