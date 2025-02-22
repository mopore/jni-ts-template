
import { assert } from "chai";

interface Person {
	name: string;
	age: number;
}


const identifyUnkownObject = (unknownObject: unknown): (Person | number | string | Array<any>) => {
	if (typeof unknownObject === 'number') {
		return unknownObject;
	}
	if (typeof unknownObject === 'string') {
		return unknownObject;
	}
	if (Array.isArray(unknownObject)) {
		return unknownObject;
	}
	if (
		unknownObject &&
		typeof unknownObject === 'object' &&
		'name' in unknownObject &&
		'age' in unknownObject
	) {	
		return unknownObject as Person;
	}
	throw new Error(`Could not determine type of unknownObject: ${unknownObject}`);
}


describe("identify unkown objects", () => {
	it("should identify the number", () => {
		const numberCandidate = JSON.parse("1");
		const result = identifyUnkownObject(numberCandidate);
		assert.equal(result, 1);
		assert.equal(typeof result, "number");	
	});
	it("should fail to identify the number", () => {
		const numberCandidate = JSON.parse('"Text"');
		const result = identifyUnkownObject(numberCandidate) as number;
		assert.notEqual(result, 1);
		assert.notEqual(typeof result, "number");
	});
	it("should identify the string", () => {
		const stringCandidate = JSON.parse('"string"');
		const result = identifyUnkownObject(stringCandidate);
		assert.equal(result, "string");
		assert.equal(typeof result, "string");	
	});
	it("should identify the array", () => {
		const arrayCandidate = JSON.parse('[1, 2]');
		const result = identifyUnkownObject(arrayCandidate);
		assert.isTrue(Array.isArray(result)); // Check if result is an array
	});
	it ("should identify the person", () => {
		const personCandidate = JSON.parse('{"name": "John", "age": 42}');
		const result = identifyUnkownObject(personCandidate) as Person;
		assert.equal(result.name, "John");
		assert.equal(result.age, 42);
		assert.equal(typeof result, "object");	
	});
});
