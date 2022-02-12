import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "../../contexts/PlayerContext";
import style from "./styles.module.scss";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    toggleLoop,
    playNext,
    playPrevious,
    setPlayingState,
    hasNext,
    toggleShuffle,
    isShuffling,
    hasPrevious,
    isLooping,
    clearPlayerState
  } = useContext(PlayerContext);

  const episode = episodeList[currentEpisodeIndex]; //45

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener(){
    audioRef.current.currentTime=0;

    audioRef.current.addEventListener('timeupdate',()=>{
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount:number){
      audioRef.current.currentTime=amount;
      setProgress(amount)
  }

  function handleEpisodeEnded(){
    if(hasNext){
      playNext();
    }else
      clearPlayerState();
  }

  return (
    <div className={style.playerContainer}>
      <header>
        <img src="/playing.svg" alt="tocando agora" />
        <strong>Tocando agora {episode?.title}</strong>
      </header>

      {episode ? (
        <div className={style.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          ></Image>
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={style.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? style.empty : ""}>
        <div className={style.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={style.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
                onChange={handleSeek}
              />
            ) : (
              <div className={style.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef} //1:06
            autoPlay
            loop={isLooping}
            onEnded={handleEpisodeEnded}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={style.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length == 1}
            onClick={toggleShuffle}
            className={isShuffling ? style.isActive : ""}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button
            type="button"
            disabled={!episode || !hasPrevious}
            onClick={playPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={style.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Tocar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button
            type="button"
            disabled={!episode || !hasNext}
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? style.isActive : ""}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
