import {checkEnv, processArgs, readVersion} from "./helpers.js";


async function main() {
	const testEnvValue = checkEnv();
	const userArgument = processArgs();
	const version = readVersion();

	// Add your application code and error handling here

	console.log(`Hello from the Template! Version: ${version}`);
	console.log(`Test value from ".env": ${testEnvValue}`);
	console.log(`Test argument passed: ${userArgument}`);
}


main();