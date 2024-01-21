import EventBatchManager from './event-batch-manager.js';

class EventBatcher {
    constructor(options) {
        this.eventBatchManager = new EventBatchManager(options);
    }

    addEventToBatch(event, priority = false) {
        this.eventBatchManager.addEventToQueue(event, priority);
    }
}

export default EventBatcher;
