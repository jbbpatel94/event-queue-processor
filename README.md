# Event Queue Processor

[![npm version](https://badge.fury.io/js/event-queue-processor.svg)](https://badge.fury.io/js/event-queue-processor)

Event Queue Processor is a JavaScript library for client-side event batching and processing.

## Table of Contents

- [Installation](#installation)
- [API Reference](#api-reference)
- [Example](#Example)
- [Contributor Guidelines](#contributor-guidelines)
- [Acknowledgments](#acknowledgments)

## Installation

Install the library using npm:

```bash
npm install event-queue-processor
```

## API Reference

You can configure the `EventBatcher` by providing options during initialization. The available options include:

- `batchInterval` (default: 5000): The time interval (in milliseconds) between batches.
- `maxRetries` (default: 3): The maximum number of retry attempts for failed batches.
- `batchSize` (default: 5): The maximum number of events to include in a batch.
- `serverRequest` (default: _fakeServerRequest): The function responsible for sending events to the server.

## `addEventToBatch(event, priority)`

The `addEventToBatch` method is used to add events to the event batch queue. You can call this method to enqueue events for later batch processing. The method takes two parameters:

- `event`: The event object that you want to add to the batch. This can be any valid JavaScript object representing an event.
- `priority` (optional): A boolean flag indicating whether the added event has priority. If set to `true`, the batch will be immediately sent to the server, bypassing the regular batch interval and size constraints.

## Example

```javascript
const EventBatcher = require('event-queue-processor');

const options = {
    batchInterval: 3000,
    maxRetries: 5,
    batchSize: 10
};

const eventBatcher = new EventBatcher(options);


const EventBatcher = require('event-queue-processor');

// Create an instance of EventBatcher
const eventBatcher = new EventBatcher();

// Add events to the batch
eventBatcher.addEventToBatch({ type: 'click', target: 'button' }, true);
eventBatcher.addEventToBatch({ type: 'hover', target: 'element' }, false);

// Simulate adding events during processing
setTimeout(() => {
    eventBatcher.addEventToBatch({ type: 'scroll', target: 'window' });
    eventBatcher.addEventToBatch({ type: 'keydown', target: 'input' });
}, 2000);
```

# Contributor Guidelines

## Branching Strategy

We use the [GitHub flow](https://guides.github.com/introduction/flow/) for our branching model.

## Setting Up the Development Environment

To set up your local development environment, follow these steps:

1. Clone the repository.
2. Install dependencies with `npm install`.


## Bug Reports and Feature Requests

Please submit bug reports and feature requests through our [issue tracker](https://github.com/jbbpatel95/event-queue-processor/issues).

## Pull Request Guidelines

1. Fork the repository and create a new branch.


## Contribution Recognition

Contributors will be acknowledged in the project documentation and release notes.

Thank you for contributing to our project!
