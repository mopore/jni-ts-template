import { assert } from "chai";


const sleepAsync = async (ms: number)  => {
	return new Promise(resolve => setTimeout(resolve, ms))
};


const promiseResults = {
	FULFILLED: "fulfilled",
	REJECTED: "rejected",
} as const;


const work = async (ms: number, input: number) => {
	await sleepAsync(ms);
	if (input === 2){
		throw new Error("2 is not allowed");
	}
	return input * 2;
}


describe("await fulfilled promises", async () => {
	const input = [1, 2, 3, 4, 5];
	const timoutMs = [100, 200, 300, 400, 500];	

	const promises = input.map((value, index) => {
		return work(timoutMs[index], value);
	});

	const results = await Promise.allSettled(promises);

	const failedResults = results.filter(
		result => result.status === promiseResults.REJECTED
	);
	const successfullResults = results.filter(
		result => result.status === promiseResults.FULFILLED
	);

	it("it should wait for 5 promises and collect 4 successfull results", async () => {
		assert.equal(results.length, 5);
		assert.equal(failedResults.length, 1);
		assert.equal(successfullResults.length, 4);
	});	
});