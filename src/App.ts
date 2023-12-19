import {checkEnv, processArgs, readVersion} from "./helpers.js";


async function main(): Promise<void> {
	const testEnvValue = checkEnv();
	const userArgument = processArgs();
	const version = readVersion();

	console.log(`Hello from the Template! Version: ${version}`);
	console.log(`Test value from ".env": ${testEnvValue}`);
	console.log(`Test argument passed: ${userArgument}`);

	// Fake: You should await your application code here
	await Promise.resolve();
}

await main();