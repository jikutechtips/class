import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Box,
  Slider,
  Typography,
  Grid,
  CircularProgress, // For loading indicator
  Alert, // For error messages
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeDown,
  VolumeMute,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Define a type for the audio data fetched from the API
interface AudioItem {
  title: string;
  url: string;
  id: string;
  file_type?: string; // Optional, based on API response
  type?: string; // Optional, based on API response
}

// Utility function for formatting time
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

const AudioPlayerPage: React.FC<{ defaultAudioType: any }> = ({
  defaultAudioType,
}) => {
  const [audioData, setAudioData] = useState<AudioItem[]>([]); // State to store fetched audio data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [stageN, setStageN] = useState(
    defaultAudioType ? defaultAudioType : "utangulizi"
  );
  const API_BASE_URL = import.meta.env.VITE_AUDIO_DATA;
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<Record<number, number>>({});
  const [duration, setDuration] = useState<Record<number, number>>({});
  const [volume, setVolume] = useState(1); // 0 to 1
  const [isMuted, setIsMuted] = useState(false);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const [audioLoaded, setAudioLoaded] = useState<Record<number, boolean>>({}); // Track loaded state

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  // Fetch audio data from the API
  useEffect(() => {
    const fetchAudioData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: AudioItem[] = await response.json();
        // Filter audio data based on the defaultAudioType prop
        const filteredAudioData = data.filter((audio) => audio.type === stageN);
        setAudioData(filteredAudioData);
      } catch (e: any) {
        console.log(API_BASE_URL);
        console.error("Failed to fetch audio data:", e);
        setError(`Failed to load audio data: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAudioData();
  }, [defaultAudioType]); // Empty dependency array means this runs once on mount

  // Initialize audio refs whenever audioData changes
  useEffect(() => {
    audioRefs.current = audioData.map(() => null);
  }, [audioData]);

  // Load and Play logic
  useEffect(() => {
    if (playingIndex !== null && audioData.length > 0) {
      const currentAudio = audioRefs.current[playingIndex];
      if (currentAudio) {
        // Only set src if it hasn't been loaded before
        if (!audioLoaded[playingIndex]) {
          currentAudio.src = audioData[playingIndex].url;
          setAudioLoaded((prev) => ({ ...prev, [playingIndex]: true }));
        }
        currentAudio.volume = isMuted ? 0 : volume; // Apply mute state to volume

        const handlePlay = () => {
          currentAudio.play().catch((err) => {
            console.error("Playback failed:", err);
            // Optionally, show a user-friendly message about playback failure
            setPlayingIndex(null);
          });
        };

        if (audioLoaded[playingIndex]) {
          handlePlay();
        }

        const handleTimeUpdate = () => {
          setCurrentTime((prevTime) => ({
            ...prevTime,
            [playingIndex]: currentAudio.currentTime,
          }));
        };

        const handleLoadedMetadata = () => {
          setDuration((prevDuration) => ({
            ...prevDuration,
            [playingIndex]: currentAudio.duration,
          }));
        };

        const handleEnded = () => {
          setPlayingIndex(null);
          setCurrentTime((prevTime) => ({ ...prevTime, [playingIndex]: 0 }));
        };

        // Add event listeners
        currentAudio.addEventListener("canplay", handlePlay);
        currentAudio.addEventListener("timeupdate", handleTimeUpdate);
        currentAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
        currentAudio.addEventListener("ended", handleEnded);

        // Cleanup function
        return () => {
          currentAudio.removeEventListener("canplay", handlePlay);
          currentAudio.removeEventListener("timeupdate", handleTimeUpdate);
          currentAudio.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
          currentAudio.removeEventListener("ended", handleEnded);
          currentAudio.pause(); // Pause the audio when component unmounts or playingIndex changes
        };
      }
    }

    // Pause other audios when a new one starts playing
    audioRefs.current.forEach((audio, index) => {
      if (index !== playingIndex && audio) {
        audio.pause();
      }
    });
  }, [playingIndex, volume, isMuted, audioLoaded, audioData]); // Added audioData to dependencies

  const togglePlayPause = (index: number) => {
    if (playingIndex === index) {
      setPlayingIndex(null); // Pause current audio
    } else {
      setPlayingIndex(index); // Play clicked audio
    }
  };

  const handleVolumeChange = (
    event: Event,
    value: number | number[],
    activeThumb?: number
  ) => {
    const newVolume = typeof value === "number" ? value : value[0];
    setVolume(newVolume);
    if (playingIndex !== null) {
      const currentAudio = audioRefs.current[playingIndex];
      if (currentAudio) {
        currentAudio.volume = newVolume;
      }
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted((prevMuted) => {
      const newMutedState = !prevMuted;
      const newVolume = newMutedState ? 0 : volume > 0 ? volume : 0.5; // Restore volume if unmuting from 0

      if (playingIndex !== null) {
        const currentAudio = audioRefs.current[playingIndex];
        if (currentAudio) {
          currentAudio.volume = newVolume;
        }
      }
      // If unmuting and volume was 0, set it to a default (e.g., 0.5)
      if (!newMutedState && volume === 0) {
        setVolume(0.5);
      }
      return newMutedState;
    });
  };

  const handleSeek = (event: Event, newValue: number | number[]) => {
    const seekTime = typeof newValue === "number" ? newValue : newValue[0];
    if (playingIndex !== null) {
      const currentAudio = audioRefs.current[playingIndex];
      if (currentAudio) {
        currentAudio.currentTime = seekTime;
        setCurrentTime((prevTime) => ({
          ...prevTime,
          [playingIndex]: seekTime,
        }));
      }
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeMute />;
    } else if (volume < 0.5) {
      return <VolumeDown />;
    } else {
      return <VolumeUp />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          padding: "2",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          mt: 8,
        }}
      >
        {loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#fff",
            }}
          >
            <CircularProgress color="success" />
            <Typography sx={{ marginTop: "1rem" }}>
              Loading audio data...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ width: "80%", maxWidth: "600px", marginBottom: "2rem" }}
          >
            {error}
          </Alert>
        )}

        {!loading && !error && audioData.length === 0 && (
          <Typography sx={{ color: "#fff", marginTop: "2rem" }}>
            No audio files available.
          </Typography>
        )}

        {!loading && !error && audioData.length > 0 && (
          <Grid
            container
            spacing={4}
            sx={{
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            {audioData.map((audio, index) => (
              <Grid item xs={12} sm={6} md={4} key={audio.id}>
                <Card
                  sx={{
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    },
                    borderRadius: "0.5rem",
                  }}
                >
                  <CardHeader
                    title={audio.title}
                    sx={{
                      color: "#fff",
                      textAlign: "center",
                      paddingBottom: "0.5rem",
                      "& .MuiCardHeader-title": {
                        fontSize: "1.2rem",
                        fontWeight: 500,
                      },
                    }}
                  />
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      paddingTop: 0,
                    }}
                  >
                    <audio
                      ref={(el) => {
                        if (el) {
                          audioRefs.current[index] = el;
                        }
                      }}
                      hidden
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                        paddingX: "1rem",
                      }}
                    >
                      <IconButton
                        onClick={() => togglePlayPause(index)}
                        aria-label={playingIndex === index ? "Pause" : "Play"}
                        sx={{
                          fontSize: "3rem",
                          color: "#fff",
                          "&:hover": {
                            color: "#f50057",
                          },
                        }}
                      >
                        {playingIndex === index ? (
                          <Pause sx={{ fontSize: "3rem" }} />
                        ) : (
                          <PlayArrow sx={{ fontSize: "3rem" }} />
                        )}
                      </IconButton>

                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          marginTop: "1rem",
                        }}
                      >
                        {/* Current Time */}
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ color: "#fff" }}
                        >
                          {formatTime(currentTime[index] || 0)}
                        </Typography>

                        {/* Progress Slider */}
                        <Slider
                          max={duration[index] || 0}
                          value={currentTime[index] || 0}
                          onChange={handleSeek}
                          aria-label="progress"
                          sx={{
                            width: "100%",
                            color: "#fff",
                            "& .MuiSlider-thumb": {
                              width: 16,
                              height: 16,
                            },
                          }}
                        />

                        {/* Duration */}
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ color: "#fff" }}
                        >
                          {formatTime(duration[index] || 0)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          marginTop: "1rem",
                        }}
                      >
                        <IconButton
                          onClick={handleMuteToggle}
                          aria-label="Volume"
                          sx={{ color: "#fff" }}
                        >
                          {getVolumeIcon()}
                        </IconButton>
                        <Slider
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          aria-label="volume"
                          max={1}
                          step={0.01}
                          sx={{
                            width: 100,
                            color: "#fff",
                            "& .MuiSlider-thumb": {
                              width: 12,
                              height: 12,
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default AudioPlayerPage;
