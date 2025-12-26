import {RoomEvent, RoomEvents} from "./room-event.js";

export enum RoomPlayerState {
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  ENDED = 0,
  NOT_STARTED = -1,
}

export type RoomId = string;
export class Room {
  private readonly roomId: RoomId;
  listeners: string[] = [];
  videoId: string | null = null;
  playerMetadata: Partial<{ currentTimestamp: number, state: RoomPlayerState }> | null = null;
  events: RoomEvents = new RoomEvents([]);

  constructor(roomId: RoomId) {
    this.roomId = roomId;
    this.addEvent('room_created', 'system');
  }

  private addEvent(event: string, emitter: 'system' | string & {}, data?: any): void {
    this.addEventToListeners(event, emitter, this.listeners, data);
  }

  private addEventToListeners(event: string, emitter: 'system' | string & {}, listeners: string[], data?: any): void {
    this.events.addEvent(
      new RoomEvent(
        event,
        emitter ?? 'unknown',
        data,
        listeners,
      )
    );
  }

  public getPendingEvents(name: string): RoomEvent[] {
    return this.events.getPendingEventsByConsumer(name);
  }

  public addVideo(id: string, emitter: string) {
    this.videoId = id;
    this.addEvent('video_added', emitter, {videoId: id});
  }

  public requestTimestamp(emitter: string): void {
    if(!this.videoId) return;

    this.addEvent('timestamp_request', emitter);
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
    if(this.listeners.includes(name)) return;

    this.listeners.push(name);
    this.addEvent('listener_joined', name);
  }

  pauseVideo(emitter: string = 'system') {
    if(this.playerMetadata?.state === RoomPlayerState.PAUSED) return;
    this.playerMetadata = {...(this.playerMetadata ?? {}), state: RoomPlayerState.PAUSED};

    this.addEvent('video_paused', emitter);
  }

  resumeVideo(emitter: string) {
    if(this.playerMetadata?.state === RoomPlayerState.PLAYING) return;
    this.playerMetadata = {...(this.playerMetadata ?? {}), state: RoomPlayerState.PLAYING};

    this.addEvent('video_resumed', emitter);
    this.addEventToListeners('timestamp_request', 'system', [emitter]);
  }

  updateCurrentTimestamp(emitter: string, currentTimestamp: number) {
    this.addEvent('current_timestamp', emitter, {currentTimestamp});
  }
}
