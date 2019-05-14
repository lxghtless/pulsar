# pulsar

> Given an emitter, event name and pulse delay, emit events until you want them to stop

![npm](https://img.shields.io/npm/v/@lxghtless/pulsar.svg?style=popout) &nbsp; [![CircleCI](https://circleci.com/gh/lxghtless/pulsar.svg?style=svg)](https://circleci.com/gh/lxghtless/pulsar) &nbsp; [![codecov](https://codecov.io/gh/lxghtless/pulsar/branch/master/graph/badge.svg)](https://codecov.io/gh/lxghtless/pulsar) &nbsp; [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)

## Install

```
$ npm install @lxghtless/pulsar
```

## Usage

```js
const pulsar = require('@lxghtless/pulsar');

const emitter = new EventEmitter(); // any emitter
const eventName = 'pulse'; // any string
const pulseDelay = 10; // ms

emitter.on(eventName, () => {
    // do stuff every {pulseDelay}
});

const context = pulsar(emitter, eventName, pulseDelay);
// context.emit => true
// context.forever => p-forever promise return
// context.trackedEmitter => emitter

// stop pulsar
context.emit = false;

// wait for complete spin down if needed
await Promise.resolve(context.forever);
```

> Prevents multiple emitters

```js
const test = require('ava');
const pulsar = require('@lxghtless/pulsar');

test('pulsar pulses and stops', async t => {
    const emitter = new EventEmitter();
    const eventName = 'pulse'; // any string
    const pulseDelay = 10; // ms
    const context = pulsar(emitter, eventName, pulseDelay);

    const emitter2 = new EventEmitter();
    const context2 = pulsar(emitter2, eventName, pulseDelay);

    t.false(emitter.emit, 'second emitter was not stopped');
    t.true(context2.emit, 'third emitter has not started');
    t.false(emitter === context2.trackedEmitter);

    context2.emit = false;

    // Wait for spin down
    await Promise.resolve(context.forever);
    await Promise.resolve(context2.forever);
});
```

## API

### pulsar(emitter, eventName, pulseDelay)

#### emitter

Type: `object`

Any emitter (e.g. `require('events').EventEmitter`, `npm i emittery`, etc.).

#### eventName

Type: `string`

Name of the event to emit.

##### pulseDelay

Type: `number`<br>

Milliseconds to delay between events

## License

[ISC](http://opensource.org/licenses/ISC) © 2019, [lxghtlxss](github.com/lxghtless)
