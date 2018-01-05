//@flow

const noop = () => {}

export function synchronizedStatic<F: Function>(func: F): F {
	let previousResult = undefined
	return (function(...args) {
		const result: any = !previousResult
			? new Promise(resolve => resolve(func.apply(this, args)))
			: previousResult.catch(noop).then(() => func.apply(this, args))
		previousResult = result
		result.finally(() => {
			if (previousResult === result) {
				previousResult = undefined
			}
		})
		return result
	}: any)
}

export function synchronizedMethod<F: Function>(method: F): F {
	const previousResults = new WeakMap()
	return (function(...args) {
		const previousResult = previousResults.get(this)
		const result: any = !previousResult
			? new Promise(resolve => resolve(method.apply(this, args)))
			: previousResult.catch(noop).then(() => method.apply(this, args))
		previousResults.set(this, result)
		result.finally(() => {
			if (previousResults.get(this) === result) {
				previousResults.delete(this)
			}
		})
		return result
	}: any)
}

export const synchronized: typeof synchronizedStatic = (function (target, name, descriptor) {
	if (name === undefined) {
		return synchronizedStatic((target: any))
	} else {
		return {
			...descriptor,
			value: synchronizedMethod(descriptor.value),
		}
	}
}: any)

export default synchronized
