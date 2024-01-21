class EventBatchManager {
    constructor(options) {
        // Set default values for options
        const {
            serverRequest,
            batchInterval = 5000,
            maxRetries = 3,
            batchSize = 5
        } = options || {};

        this.eventsQueue = [];
        this.newEventsQueue = [];
        this.isProcessing = false;
        this.batchInterval = batchInterval;
        this.maxRetries = maxRetries;
        this.batchSize = batchSize;
        this.serverRequest = serverRequest || this._defaultFakeServerRequest;
        this.retryDelayEnabled = true;
        this.retryDelayDuration = 1000;
        this.timer = setTimeout(() => this._handleTimer(), this.batchInterval);
        this.batchProcessingLock = false;
    }

    addEventToQueue(event, priority = false) {
        const eventObject = { event, priority };

        if (this.isProcessing) {
            this.newEventsQueue.push(eventObject);
        } else {
            if (this.newEventsQueue.length > 0) {
                this.eventsQueue = [...this.eventsQueue, ...this.newEventsQueue];
                this.newEventsQueue = [];
            }

            this.eventsQueue.push(eventObject);

            if (priority || this.eventsQueue.length >= this.batchSize) {
                this._sendBatch([...this.eventsQueue, ...this.newEventsQueue]);
            }
        }
    }

    _defaultFakeServerRequest(events) {
        return new Promise(resolve => {
            setTimeout(() => {
                const success = Math.random() < 0.8;
                console.log('Server received events:', events);
                resolve(success);
            }, 500);
        });
    }

    async _sendBatch(events) {
        if (this.isProcessing || events.length === 0 || this.batchProcessingLock) {
            return;
        }

        this.batchProcessingLock = true;

        console.log('Sending batch to server:', events);

        const eventsToSend = [...events];

        try {
            const serverResponse = await this.serverRequest(eventsToSend);

            if (serverResponse) {
                this.maxRetries = 3;
            } else {
                await this._retrySendBatch([...events, ...this.newEventsQueue]);
            }
        } finally {
            this.batchProcessingLock = false;
        }
    }

    async _retrySendBatch(events) {
        if (this.maxRetries > 0 && !this.isProcessing && !this.batchProcessingLock) {
            console.log('Batch failed to send. Retrying...');
            this.maxRetries--;

            this.isProcessing = true;

            this.eventsQueue = [];
            this.newEventsQueue = [];

            if (this.retryDelayEnabled) {
                await new Promise(resolve => setTimeout(resolve, this.retryDelayDuration));
            }

            await this._sendBatch(events);

            this.isProcessing = false;
        } else {
            console.error('Max retries reached. Unable to send batch.');
            this.maxRetries = 3;
        }
    }

    _handleTimer() {
        clearTimeout(this.timer);

        if (this.eventsQueue.length > 0) {
            this._sendBatch([...this.eventsQueue, ...this.newEventsQueue]);
        }

        this.timer = setTimeout(() => this._handleTimer(), this.batchInterval);
    }
}

export default EventBatchManager;
