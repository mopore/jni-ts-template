import { assert } from "chai";
import { Option, none, optionalDefined, some } from "../src/optional/optional.js";

const functionWithDefined = (): Option<string> => optionalDefined("some");
const functionWithSome = (): Option<string> => some("some");
const functionWithNone = (): Option<string> => none();

describe("optional package", () => {
	it("Function with defined returns option with some", () => {
		assert.isTrue(functionWithDefined().isSome());
		assert.isFalse(functionWithDefined().isNone());
		const someString = functionWithDefined().unwrap();
		assert.equal(someString, "some");
	});

	it("Function with some returns option with some", () => {
		assert.isTrue(functionWithSome().isSome());
		assert.isFalse(functionWithSome().isNone());
		const someString = functionWithSome().unwrap();
		assert.equal(someString, "some");
	});

	it("Function with none returns option with none", () => {
		assert.isTrue(functionWithNone().isNone());
		assert.isFalse(functionWithNone().isSome());
		assert.throws( () => functionWithNone().unwrap());
	})
});
