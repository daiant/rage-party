import {RoomService} from "./room.service";
import {VideoService} from "./video.service";
import {Injectable, signal} from "@angular/core";

@Injectable({providedIn: "root"})
export class DirectorService {
  public async subscribeToEvents(room: RoomService, video: VideoService): Promise<void> {
    const roomId = room.getId();
    if(!roomId) return;

    const response = await room.getEvents();

    if (!response.ok) {
      throw Error(response.statusText);
    }

    for (const reader = response.body?.getReader(); ;) {
      if (!reader) throw new Error('No reader found');

      const {value, done} = await reader.read();

      if (done) {
        break;
      }

      const chunk = new TextDecoder().decode(value).replace(/data: /g, '').trim();
      const subchunks = chunk.split('\n\n').filter(Boolean);
      for (const subchunk of subchunks) {
        const event = JSON.parse(subchunk) as {
          data?: any,
          type: 'timestamp_request' | 'player_metadata' | (string & {}),
          consumed: boolean,
          id: string,
          emitter: string,
        };

        if (event.type === 'timestamp_request') {
          await room.setCurrentTimestamp(video.getCurrentTime());
        } else if (event.type === 'current_timestamp' && event.data?.currentTimestamp) {
          console.log('Received timestamp: ', event.data.currentTimestamp);
          video.seekTo(event.data.currentTimestamp);
        } else if (event.type === 'video_paused') {
          video.pauseVideo();
        } else if (event.type === 'video_resumed') {
          video.resumeVideo();
        } else if (event.type === 'video_added' && event.data.videoId) {
          video.playVideo(event.data.videoId);
        } else if (event.type === 'listener_joined') {
          room.addListener(event.emitter);
        } else if (event.type === 'listener_left') {
          room.removeListener(event.emitter);
        }
      }
    }
  }
}