import { createContext, useState, ReactNode, useContext } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Array<Episode>;
  currentEpisodeIndex: number; //35
  isPlaying: boolean;
  isLooping:boolean;
  hasNext:boolean;
  hasPrevious:boolean;
  isShuffling:boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[],index:number) => void;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
  playNext:()=>void;
  playPrevious:()=>void;
  toggleLoop:()=>void;
  toggleShuffle:()=>void;
  clearPlayerState:()=>void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
};

export function PlayerContextProvider({children}: PlayerContextProviderProps) {

  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisode] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping,setIsLooping] = useState(false);
  const [isShuffling,setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisode(0);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop(){
    setIsLooping(!isLooping);
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling);
  }

  function playList(list: Episode[], index:number){
    setEpisodeList(list);
    setCurrentEpisode(index);
    setIsPlaying(true);
  }

  const hasNext = isShuffling||currentEpisodeIndex+1<episodeList.length;
  const hasPrevious = currentEpisodeIndex>0;

  function playNext(){
    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random()*episodeList.length)
      setCurrentEpisode(nextRandomEpisodeIndex)
      
    }else if(hasNext)
    setCurrentEpisode(currentEpisodeIndex+1)
  }

  function playPrevious(){
    if(hasPrevious)
    setCurrentEpisode(currentEpisodeIndex-1)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerState(){
    setEpisodeList([]);
    setCurrentEpisode(0);
  }

  //15:15

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        isPlaying,
        playList,
        playNext,
        playPrevious,
        togglePlay,
        setPlayingState,
        hasNext,
        hasPrevious,
        toggleLoop,
        isLooping,
        toggleShuffle,
        isShuffling,
        clearPlayerState
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(){
  return useContext(PlayerContext);
}