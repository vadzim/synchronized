//@flow

import synchronized from "./synchronized"

declare var test: any
declare var expect: any

const N = 10

test("type", async () => {
	const worker = synchronized(async (x: string, y: boolean) => {
		return x.length
	})
	// $FlowBug
	2 + 2
	1 * (await worker("", true))
})

test("standalone", async () => {
	let count = 0
	const worker = synchronized(async () => {
		for (let i = 0; i < N; ++i) {
			++count
			await new Promise(resolve => setTimeout(resolve, 1))
		}
		return count
	})
	const calls = []
	for (let i = 0; i < N; ++i) {
		calls.push(worker())
	}
	await new Promise(resolve => setTimeout(resolve, N * 1.5))
	for (let i = 0; i < N; ++i) {
		expect(await calls[i]).toBe((i + 1) * N)
	}
})

test("immediate call", async () => {
	let count = 0
	const worker = synchronized(async () => {
		++count
		await null
		++count
	})
	worker()
	expect(count).toBe(1)
})

test("decorator", async () => {
	class Worker {
		count = 0
		@synchronized
		async worker() {
			for (let i = 0; i < N; ++i) {
				++this.count
				await new Promise(resolve => setTimeout(resolve, 1))
			}
			return this.count
		}
	}
	const instances = []
	const calls = []
	for (let j = 0; j < N; ++j) {
		instances.push(new Worker())
		calls.push([])
	}
	for (let i = 0; i < N; ++i) {
		for (let j = 0; j < N; ++j) {
			calls[j].push(instances[j].worker())
		}
	}
	await new Promise(resolve => setTimeout(resolve, N * 1.5))
	for (let j = 0; j < N; ++j) {
		for (let i = 0; i < N; ++i) {
			expect(await calls[j][i]).toBe((i + 1) * N)
		}
	}
})
