export class RoomEvents {
  constructor(
    private readonly events: RoomEvent[],
  ) {
  }

  public getEvents(): RoomEvent[] {
    return this.events;
  }

  public addEvent(event: RoomEvent): void {
    this.events.push(event);
  }

  public getPendingEventsByConsumer(consumer: string): RoomEvent[] {
    return this.events.filter(event => !event.isAckedBy(consumer) && !event.isEmittedBy(consumer));
  }
}


export class RoomEvent {
  private readonly id: string = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  private acks: RoomEventACKs = new RoomEventACKs(new Map());

  constructor(
    private readonly type: string,
    private readonly emitter: string,
    private readonly data: any,
    listeners: string[],
  ) {
    this.acks = new RoomEventACKs(new Map(listeners.map(listener => [listener, new RoomEventACK(listener)])));
  }

  public isAckedBy(consumer: string): boolean {
    return this.acks.isAckedBy(consumer);
  }

  public ack(consumer: string): void {
    this.acks.acknowledge(consumer);
  }

  toClient() {
    return {
      id: this.id,
      type: this.type,
      emitter: this.emitter,
      data: this.data,
    }
  }

  isEmittedBy(consumer: string) {
    return this.emitter === consumer;
  }
}

export class RoomEventACKs {
  constructor(
    private readonly acknowledges: Map<string, RoomEventACK>,
  ) {
  }

  isAckedBy(consumer: string): boolean {
    if(!this.acknowledges.has(consumer)) return true;

    return this.acknowledges.get(consumer)?.isConsumed();
  }

  acknowledge(consumer: string) {
    this.acknowledges.get(consumer)?.ack();
  }
}

export class RoomEventACK {
  private consumed = false;
  private consumedAt: Date | null = null;

  constructor(
    private readonly consumer: string,
  ) {
  }

  isConsumed(): boolean {
    return this.consumed;
  }

  ack(): void {
    this.consumed = true;
    this.consumedAt = new Date();
  }
}
