import EventQueueManager, { Event , EventQueueProcessorOptions} from './event-queue-manager';


class EventQueueProcessor {
  private eventQueueManager: EventQueueManager;

  constructor(options: EventQueueProcessorOptions) {
    this.eventQueueManager = new EventQueueManager(options);
  }

  addEventToQueue(event: Event, priority: boolean = false): void {
    this.eventQueueManager.addEventToQueue(event, priority);
  }
}

export default EventQueueProcessor;
