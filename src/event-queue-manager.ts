export type ServerRequestFunction = (events: Event[]) => Promise<boolean>;
export type Event = any;
export type EventQueueProcessorOptions =  {
    serverRequest?: ServerRequestFunction;
    batchInterval?: number;
    maxRetries?: number;
    batchSize?: number;
}

class EventQueueManager {
    private eventsQueue: { event: Event; priority: boolean }[] = [];
    private newEventsQueue: { event: Event; priority: boolean }[] = [];
    private isProcessing: boolean = false;
    private batchInterval: number;
    private maxRetries: number;
    private batchSize: number;
    private serverRequest: (events:  Event[]) => Promise<boolean>;
    private retryDelayEnabled: boolean = true;
    private retryDelayDuration: number = 1000;
    private timer: number;
    private batchProcessingLock: boolean = false;

    constructor(options?: EventQueueProcessorOptions) {
        // Set default values for options
        const {
            serverRequest,
            batchInterval = 5000,
            maxRetries = 3,
            batchSize = 5
        } = options || {};

        this.batchInterval = batchInterval;
        this.maxRetries = maxRetries;
        this.batchSize = batchSize;
        this.serverRequest = serverRequest || this._defaultFakeServerRequest;
        this.timer = window.setTimeout(() => this._handleTimer(), this.batchInterval);
    }

    addEventToQueue(event: Event, priority: boolean = false): void {
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

    private _defaultFakeServerRequest(events: Event[]): Promise<boolean> {
        return new Promise(resolve => {
            setTimeout(() => {
                const success = Math.random() < 0.8;
                console.log('Server received events:', events);
                resolve(success);
            }, 500);
        });
    }

    private async _sendBatch(events: { event: Event; priority: boolean }[]): Promise<void> {
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

    private async _retrySendBatch(events: { event: Event; priority: boolean }[]): Promise<void> {
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

    private _handleTimer(): void {
        clearTimeout(this.timer);

        if (this.eventsQueue.length > 0) {
            this._sendBatch([...this.eventsQueue, ...this.newEventsQueue]);
        }

        this.timer = window.setTimeout(() => this._handleTimer(), this.batchInterval);
    }
}

export default EventQueueManager;
