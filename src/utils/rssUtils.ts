/**
 * Mock utility for handling the future Mumtaz Health Podcast RSS feed.
 */
export interface PodcastEpisode {
  id: string;
  title: string;
  audioUrl: string;
  duration: number; // in seconds
  description: string;
}

export const mockPodcastEpisodes: PodcastEpisode[] = [
  {
    id: "yoga-nidra-1",
    title: "Yoga Nidra for Deep Rest",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // placeholder safe audio
    duration: 360,
    description: "A restorative session designed to guide you into profound relaxation.",
  },
  {
    id: "breath-sakinah",
    title: "Breath of Sakinah (Tranquility)",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", // placeholder
    duration: 180,
    description: "A short breathwork exercise to quickly lower cortisol and ground the nervous system.",
  }
];

export async function fetchPodcastFeed(): Promise<PodcastEpisode[]> {
  // In the future:
  // const response = await fetch("https://rss.art19.com/mumtaz-health");
  // const xmlText = await response.text();
  // parse xml and map to PodcastEpisode[]
  
  return Promise.resolve(mockPodcastEpisodes);
}
