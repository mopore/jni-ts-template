import { assert } from "chai";

const shapeKinds = {
	Circle: "circle",
	Square: "square",
} as const;

type ShapeKind = (typeof shapeKinds[keyof typeof shapeKinds]);

interface Shape {
	kind: ShapeKind;
}

describe("switch with all cases.", () => {
	it("should not throw because all handeled.", () => {
		const myCircle: Shape = { kind: shapeKinds.Circle };		

		switch (myCircle.kind) {
			case shapeKinds.Circle:
				assert.equal(myCircle.kind, shapeKinds.Circle);
				break;
			case shapeKinds.Square:
				assert.equal(myCircle.kind, shapeKinds.Square);
				break;
			default:
				throw new Error("unreachable");
		} 
	});
});
