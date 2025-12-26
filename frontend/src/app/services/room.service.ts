import {Injectable, signal} from "@angular/core";
import {environment} from "../../environments/environment";

type RoomPlayerMetadata = Partial<{ currentTimestamp: number, state: 1 | 2 }>;

type Room = {
  roomId: string;
  userName: string;
  listeners: string[];
  videoId: string | null;
  playerMetadata: RoomPlayerMetadata | null;
}

@Injectable({providedIn: "root"})
export class RoomService {
  private url = `${environment.apiUrl}room/`;
  private joinedRoomUser = signal<string | null>(null);
  private joinedRoomId = signal<string | null>(null);
  private joinedRoomListeners = signal<string[]>([]);

  private abortController = new AbortController();

  public getId(): string {
    return this.joinedRoomId() ?? '';
  }

  public availableListeners(): string[] {
    return this.joinedRoomListeners() ?? [];
  }

  getEvents() {
    const roomId = this.joinedRoomId();
    if (!roomId) return Promise.reject('No room joined');

    return fetch(`${this.url + roomId}/streaming?name=${this.joinedRoomUser()}`, {method: 'GET', signal: this.abortController.signal});
  }

  public async joinRoom(roomId: string, name: string): Promise<Room | null> {
    const room: Room = await fetch(this.url + roomId + '?name=' + name)
      .then(res =>
        res.ok ? res.json() : Promise.reject(res.statusText)
      );

    if (!room) return null;

    room.userName = name;
    this.joinedRoomUser.set(room.userName);
    this.joinedRoomId.set(room.roomId);
    this.joinedRoomListeners.set(room.listeners);
    return room;
  }

  public async setVideoId(videoId: string): Promise<void> {
    const roomId = this.joinedRoomId();
    const roomUser = this.joinedRoomUser();
    if (!roomUser || !roomId) return;

    await fetch(`${this.url + roomId}/videoId/${videoId}?name=${roomUser}`, {method: 'PATCH'});
  }

  public async setCurrentTimestamp(timestamp: number): Promise<void> {
    const roomId = this.joinedRoomId();
    const roomUser = this.joinedRoomUser();
    if (!roomUser || !roomId) return;

    await fetch(`${this.url + roomId}/currentTimestamp?name=${roomUser}`, {
      method: 'POST',
      body: JSON.stringify({currentTimestamp: timestamp}),
      headers: {'Content-Type': 'application/json'}
    });
  }

  public anyRoomJoined(): boolean {
    return Boolean(this.joinedRoomId());
  }

  playVideo(): void {
    const roomId = this.joinedRoomId();
    const roomUser = this.joinedRoomUser();
    if (!roomUser || !roomId) return;

    void fetch(`${this.url + roomId}/resume?name=${roomUser}`, {
      method: 'POST',
    });
  }

  pauseVideo(): void {
    const roomId = this.joinedRoomId();
    const roomUser = this.joinedRoomUser();
    if (!roomUser || !roomId) return;

    void fetch(`${this.url + roomId}/pause?name=${roomUser}`, {
      method: 'POST',
    });
  }

  async createRoom(roomId: string) {
    await fetch(this.url + roomId, {method: 'POST'});
  }

  async leaveRoom(): Promise<void> {
    const roomId = this.joinedRoomId();
    const roomUser = this.joinedRoomUser();
    if (!roomUser || !roomId) return;

    await fetch(`${this.url + roomId}/listener/${roomUser}`, {method: 'DELETE'});

    this.joinedRoomId.set(null);
    this.joinedRoomUser.set(null);
    this.joinedRoomListeners.set([]);

    this.abortController.abort('User left the room.');
  }

  addListener(emitter: string) {
    this.joinedRoomListeners.update( listeners => ([...listeners, emitter]) );
  }

  removeListener(emitter: string) {
    this.joinedRoomListeners.update( listeners => listeners.filter(listener => listener !== emitter) );
  }
}