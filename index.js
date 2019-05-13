const delay = require('delay');
const pForever = require('p-forever');

function start(emitter, eventName, ms) {
	if (this.trackedEmitter && this.trackedEmitter.emitter === emitter) {
		return this.trackedEmitter;
	}

	if (this.trackedEmitter) {
		this.trackedEmitter.emit = false;
	}

	const context = {
		emit: true
	};

	const forever = pForever(async ctx => {
		if (!context.emit) {
			return pForever.end;
		}

		await delay(ms);

		emitter.emit(eventName);

		return ctx;
	}, context);

	context.emitter = emitter;
	context.forever = forever;

	this.trackedEmitter = context;

	return context;
}

const pulsarService = {
	trackedEmitter: null
};

pulsarService.start = start.bind(pulsarService);

const pulsar = (emitter, eventName, ms) => {
	return pulsarService.start(emitter, eventName, ms);
};

module.exports = pulsar;

