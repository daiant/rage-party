import {Injectable, signal} from "@angular/core";

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
  private url = 'http://localhost:5723/room/';
  private joinedRoom = signal<Room | null>(null);

  public getId(): string {
    return this.joinedRoom()?.roomId ?? '';
  }

  public availableListeners(): string[] {
    return this.joinedRoom()?.listeners ?? [];
  }

  getEvents() {
    const roomId = this.joinedRoom()?.roomId;
    if (!roomId) return Promise.reject('No room joined');

    return fetch(`${this.url + roomId}/streaming?name=${this.joinedRoom()!.userName}`, {method: 'GET'});
  }

  public async joinRoom(roomId: string, name: string): Promise<Room | null> {
    const room: Room = await fetch(this.url + roomId + '?name=' + name).then(res => res.json());
    if (!room) return null;

    room.userName = name;
    this.joinedRoom.set(room);
    return this.joinedRoom();
  }

  public async setVideoId(videoId: string): Promise<void> {
    const room = this.joinedRoom();
    if (!room) return;
    await fetch(`${this.url + room.roomId}/videoId/${videoId}?name=${this.joinedRoom()!.userName}`, {method: 'PATCH'});
  }

  public async setPlayerMetadata(roomId: string, metadata: RoomPlayerMetadata): Promise<void> {
    await fetch(`${this.url + roomId}/playerMetadata?name=${this.joinedRoom()!.userName}`, {
      method: 'PATCH',
      body: JSON.stringify(metadata),
      headers: {'Content-Type': 'application/json'}
    });
  }

  public async setCurrentTimestamp(roomId: string, timestamp: number): Promise<void> {
    await fetch(`${this.url + roomId}/currentTimestamp?name=${this.joinedRoom()!.userName}`, {
      method: 'POST',
      body: JSON.stringify({currentTimestamp: timestamp}),
      headers: {'Content-Type': 'application/json'}
    });
  }

  public anyRoomJoined(): boolean {
    return Boolean(this.joinedRoom());
  }

  playVideo(): void {
    const roomId = this.joinedRoom()?.roomId;
    if (!roomId) return;

    void fetch(`${this.url + roomId}/resume?name=${this.joinedRoom()!.userName}`, {
      method: 'POST',
    });
  }

  pauseVideo(): void {
    const roomId = this.joinedRoom()?.roomId;
    if (!roomId) return;

    void fetch(`${this.url + roomId}/pause?name=${this.joinedRoom()!.userName}`, {
      method: 'POST',
    });
  }

  addListener(emitter: string) {
    this.joinedRoom()?.listeners.push(emitter);
  }
}