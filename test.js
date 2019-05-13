const {EventEmitter} = require('events');
const test = require('ava');
const deley = require('delay');
const pulsar = require('.');

test('pulsar pulses and stops', async t => {
	const emitter = new EventEmitter();
	const eventName = 'pulse'; // Could be any string
	const pulseDelay = 10; // Ms
	const runTime = 120; // Ms

	let pulseCount = 0;

	emitter.on(eventName, () => {
		pulseCount++;
	});

	const context = pulsar(emitter, eventName, pulseDelay);

	await deley(runTime);

	// Stop pulsar
	context.emit = false;

	// Wait for spin down
	await Promise.resolve(context.forever);

	// With spin up times, there seems to be two pulses off consistently
	const minPulseCount = ((runTime / pulseDelay) - 2);

	t.true(pulseCount >= minPulseCount,
		`pulseCount was not the expected value: ${pulseCount} >= ${minPulseCount}`);

	const emitter2 = new EventEmitter();

	const context2 = pulsar(emitter2, eventName, pulseDelay);

	const emitter3 = new EventEmitter();

	const context3 = pulsar(emitter3, eventName, pulseDelay);

	t.false(context2.emit, 'second emitter was not stopped');
	t.true(context3.emit, 'third emitter has not started');
	t.false(emitter2 === context3.trackedEmitter);

	context3.emit = false;

	// Wait for spin down
	await Promise.resolve(context2.forever);
	await Promise.resolve(context3.forever);
});
