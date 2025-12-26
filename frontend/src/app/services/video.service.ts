import {Injectable} from "@angular/core";
@Injectable({providedIn: 'root'})
export class VideoService {
  private player: any;

  public initializePlayer(
    onPlayerStateChange: (data: any) => void,
    options?: Partial<{
      autoplay: boolean;
      controls: boolean,
      rel: boolean,
      showInfo: boolean,
      playsinline: boolean,
      mute: boolean,
    }>,
  ): void {
    (<any>window).onYouTubeIframeAPIReady = () => {
    this.player =
      new (<any>window).YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: +Boolean(options?.autoplay),
          controls: +Boolean(options?.controls),
          rel: +Boolean(options?.rel),
          showInfo: +Boolean(options?.showInfo),
          playsinline: +Boolean(options?.playsinline),
          mute: +Boolean(options?.mute),
        },
        events: {
          onReady: this.onPlayerReady.bind(this),
          onStateChange: onPlayerStateChange.bind(this),
        }
      });
    }
  };

  public getCurrentTime(): number {
    return this.player?.getCurrentTime() ?? 0;
  }

  public playVideo(videoId: string, metadata?: {
    currentTime?: number;
  }): void {
    if(!this.player) {
      throw new Error('Player not initialized');
    }

    console.log('player loaded with videoId: ', videoId, ' and metadata: ', metadata ?? 'no metadata');

    this.player.loadVideoById(videoId, metadata?.currentTime ?? 0);
  }

  public parseVideoIdByURL(rawURL: string): string | null {
    if(!rawURL) return null;

    return new URL(rawURL).searchParams.get('v');
  }

  // The API will call this function when the video player is ready
  private onPlayerReady(event: any) {
    event.target.playVideo();
  }

  pauseVideo() {
    if(this.player.getPlayerState() === (<any>window).YT.PlayerState.PAUSED) {return;}

    this.player.pauseVideo();
  }

  resumeVideo() {
    if(this.player.getPlayerState() === (<any>window).YT.PlayerState.PLAYING) {return;}
    this.player.playVideo();
  }

  seekTo(currentTimestamp: number) {
    this.player.seekTo(currentTimestamp, true);
  }
}