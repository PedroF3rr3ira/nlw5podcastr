import { createContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Array<Episode>;
    currentEpisodeIndex: number; //35
    isPlaying: boolean;
    play: (episode:Episode)=>void;
    togglePlay:()=>void;
}

export const PlayerContext = createContext({} as PlayerContextData);