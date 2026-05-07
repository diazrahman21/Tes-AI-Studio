
export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
}

export const TRACKS: Track[] = [
  {
    id: "1",
    title: "Midnight Grid",
    artist: "Synth-Bot GPT",
    cover: "/synthwave_cover_1.png",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "2",
    title: "Neon Rain",
    artist: "Cyber-Soul AI",
    cover: "/synthwave_cover_2.png",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "3",
    title: "Data Stream",
    artist: "Binary Beats",
    cover: "/synthwave_cover_3.png",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];
