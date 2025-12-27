import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";

type YoutubeSearchResultVideo = {
  etag: string,
  id: { kind: "youtube#video", videoId: string },
  snippet: {
    channelId: string,
    channelTitle: string,
    publishedAt: string,
    thumbnails: { medium: { url: string } },
    title: string,
  }
}
type YouTubeSearchResult = { items: Array<YoutubeSearchResultVideo> }

export type VideoThumbnail = {
  id: string,
  title: string,
  channelId: string,
  channelTitle: string,
  publishedAt: string,
  thumbnail: string,
}


@Injectable({providedIn: 'root'})
export class VideoSearcherService {
  private apiKey = environment.youtubeApiKey;

  private buildSearchURL(query: string, maxResults: number): string {
    const url = new URL('https://youtube.googleapis.com/youtube/v3/search');
    url.searchParams.set('key', this.apiKey);
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('maxResults', maxResults.toString());
    url.searchParams.set('q', query);
    url.searchParams.set('order', 'viewCount');
    console.log(url.toString());
    return url.toString();
  }

  public async search(query: string, {maxResults}: { maxResults: number } = {maxResults: 5}): Promise<VideoThumbnail[]> {
    const response: YouTubeSearchResult = await fetch(this.buildSearchURL(query, maxResults)).then(r => r.json());
    return response.items.map(video => ({
      id: video.id.videoId,
      title: video.snippet.title,
      channelId: video.snippet.channelId,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      thumbnail: video.snippet.thumbnails.medium.url,
    }))
  }
}