import dotenv from "dotenv";
import fs from "fs";


const HELP_MESSAGE = `
Usage: node dist/index.js <argument>
`;

export const checkEnv = (): string => {
	try{
		dotenv.config();
		const testVarValue = process.env["TEST_VAR"];
		if (!testVarValue) {
			throw new Error("Define 'TEST_VAR' in .env file in project's root");
		}
		return testVarValue;
	} catch (error) {
		const errorMessage = `INTERNAL ERROR - Could load preferences: ${error}`;
		console.error(errorMessage);
		process.exit(9);
	}
}


export const processArgs = (): string => {
	const args = process.argv;
	if (args.length === 3){
		const userArgument = args[2];
		return userArgument;
	}
	else {
		console.error(HELP_MESSAGE)
		process.exit(9);
	}
}


export const readVersion = (): string => {
	try{
		const rawText =	fs.readFileSync("package.json",  "utf8");
		const packageJson = JSON.parse(rawText);
		const version = packageJson.version;
		return version;
	} catch (error) {
		const errorMessage = `Could not read version: ${error}`;
		console.error(errorMessage);
		console.trace();
		throw new Error(errorMessage);
	}
}
