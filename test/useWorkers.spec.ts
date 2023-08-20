import { assert } from "chai";
import { Worker } from "worker_threads";
import { JniResult } from "../src/workers/worker.js";


const devideWork = (workInput: number[], numberOfWorkers: number): number[][] => {
	const workPackages: number[][] = [];
	const workPackageSize = Math.ceil(workInput.length / numberOfWorkers);
	for (let i = 0; i < numberOfWorkers; i++){
		const start = i * workPackageSize;
		const end = start + workPackageSize;
		const workPackage = workInput.slice(start, end);
		workPackages.push(workPackage);
	}
	return workPackages;
}


const runWorkers = async (): Promise<JniResult[]> => {
	const numberOfWorkers = 5;
	let resultsCounter = 0;

	const oneThousands = Array.from(Array(1000).keys());
	const workPackages = devideWork(oneThousands, numberOfWorkers);
	
	let jniResults: JniResult[] = []; 
	workPackages.forEach(workPackage => {
		const worker = new Worker("./dist/src/workers/worker.js");
		worker.postMessage(workPackage);
		worker.on("message", (result) => {
			jniResults.push(result);
			resultsCounter++;
		});
	});

	let waitCounter = 0;
	while (resultsCounter < numberOfWorkers){
		await new Promise(resolve => setTimeout(resolve, 100));
		waitCounter++;
		if (waitCounter > 20){
			break;
		}
	}
	return jniResults;
}
describe("use workers to deploy work over multiple cores", async () => {

	const jniResults = await runWorkers();

	it("it should use multiple cores", async () => {
		assert.equal(jniResults.length, 5);
		for (const result of jniResults){
			assert.equal(result.success, true);
			assert.equal(result.result.length, 200);
		}
	});	
});