export type None = { _type: 'none' };
export type Some<T> = { _type: 'some', value: T };
export type Option<T> = None | Some<T>;

const none: None = { _type: 'none' };
const some = <T>(value: T): Some<T> => ({ _type: 'some', value });

export function optionalCatch<T>(fn: () => T): Option<T> {
	try {
		return some(fn());
	} catch (e) {
		return none;
	}
}


export async function optionalResolve<T>(promise: Promise<T>): Promise<Option<T>> {
	try {
		return some(await promise);
	} catch (err) {
		return none;
	}
}


function toOptional<I, O extends I>(fn: (input: I) => input is O) {
	 return function(arg: I): Option<O> {
		try{
			if (fn(arg)) {
				return some(arg);
			}
			return none;
		} catch (err) {
			return none;
		}
	}
}


export function unwrap<T>(option: Option<T>): T{
	if (option._type === 'some') {
		return option.value;
	}
	throw new Error("Could not unwrap option")
}


export function unwrapOr<T>(option: Option<T>, defaultValue: T): T {
	if (option._type === 'some') {
		return option.value;
	}
	return defaultValue;
}


export function unwrapExpect<T>(option: Option<T>, errMessage: string): T {
	if (option._type === 'some') {
		return option.value;
	}
	throw new Error(errMessage);
}


export const optionalDefined = toOptional(<T>(arg:T | undefined | null): arg is T => arg != null);


/*
 * Example usage of optional functions
 */
function getTimeDiff(arr: Array<Date>): number {
	const start = optionalDefined(arr[0]);
	const end = optionalDefined(arr[1]);

	const startVal = unwrapExpect(start, "Start date is not defined").valueOf();
	const endVal = unwrapOr(end, new Date()).valueOf();

	return endVal - startVal;
}
