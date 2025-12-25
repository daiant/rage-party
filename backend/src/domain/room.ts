export type RoomEvent = {
  type: string;
  consumed: {id: string, consumed: boolean}[];
  id: string;
  data?: any;
}

export type RoomId = string;

export class Room {
  private readonly roomId: RoomId;
  listeners: string[] = [];
  videoId: string | null = null;
  playerMetadata: { currentTimestamp: number } | null = null;
  events: RoomEvent[] = [];

  constructor(roomId: RoomId) {
    this.roomId = roomId;
    this.addEvent({type: 'room_created', id: Math.random().toString()});
  }

  private addEvent(event: Omit<RoomEvent, 'consumed'>) {
    this.events.push({...event, consumed: this.listeners.map(listener => ({id: listener, consumed: false}))});
  }

  public getPendingEvents(name: string): RoomEvent[] {
    return this.events.filter(event => {
      if(event.consumed.length <= 0) return false;
      return event.consumed.some(consumed => consumed.id === name && !consumed.consumed);
    });
  }

  public addVideo(id: string) {
    this.videoId = id;
    this.addEvent({type: 'video_added', id: Math.random().toString()});
  }

  public requestTimestamp(): void {
    if(!this.videoId) return;

    this.addEvent({type: 'timestamp_request', id: Math.random().toString()});
  }

  public addMetadata(body: any): void {
    this.playerMetadata = {
      ...this.playerMetadata,
      ...body,
    };
    this.addEvent({type: 'player_metadata', data: this.playerMetadata, id: Math.random().toString()});
  }

  public toClient()  {
    return {
      roomId: this.roomId,
      videoId: this.videoId,
      listeners: this.listeners,
      playerMetadata: this.playerMetadata,
    }
  }

  removeListener(name: string): void {
    this.listeners = this.listeners.filter(listener => listener !== name);
  }

  addListener(name: string) {
    if(!this.listeners.includes(name)) this.listeners.push(name);
  }
}
