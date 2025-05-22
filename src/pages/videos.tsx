import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Toolbar,
  IconButton,
  AppBar,
  Button,
  Box,
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Close } from "@mui/icons-material";

import { useMediaQuery } from "@mui/material";

import { PlayCircle } from "@mui/icons-material";
import { cyan } from "@mui/material/colors";

// Interface for Video
interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  type: string;
  uploadTime: string;
}

// Component to display a video card
const VideoCard: React.FC<{
  video: Video;
  onReadMore: (video: Video) => void;
}> = ({ video, onReadMore }) => {
  const theme = createTheme(); // Create theme here to access it within the component

  return (
    <Card
      onClick={() => onReadMore(video)}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.spacing(2),
        boxShadow: theme.shadows[5],
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
        },
        cursor: "pointer",
      }}
    >
      <CardContent
        sx={{
          padding: theme.spacing(3),
          "&:last-child": {
            paddingBottom: theme.spacing(3),
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.palette.primary.main,
            fontWeight: theme.typography.fontWeightMedium,
            textTransform: "uppercase",
            marginBottom: theme.spacing(0.5),
          }}
        >
          {video.type}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontSize: theme.typography.h5.fontSize,
            fontWeight: theme.typography.fontWeightBold,
            color: theme.palette.text.primary,
            marginBottom: theme.spacing(1),
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {video.title}
        </Typography>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 0,
            paddingBottom: "56.25%",
            marginBottom: "16px",
            overflow: "hidden",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& img": {
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            },
          }}
        >
          <img src={`https://c.mamed.org/images/code.png`} alt={video.title} />
        </Box>
        <Typography
          variant="body1"
          sx={{
            fontSize: theme.typography.body1.fontSize,
            color: theme.palette.text.secondary,
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {video.description}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.palette.text.primary,
          }}
        >
          {video.uploadTime}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Main App component
const Videos: React.FC<{ defaultVideoType?: string }> = ({
  defaultVideoType,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = import.meta.env.VITE_VIDEO_DATA;
  const [stageN, setStageN] = useState(
    defaultVideoType ? defaultVideoType : "utangulizi"
  );
  const [videos, setVideos] = useState<Video[]>([]);
  const theme = createTheme(); // Create theme for the main component

  const handleReadMore = (video: Video) => {
    setSelectedVideo(video);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedVideo(null);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Video[] = await response.json();
        setVideos(data);
      } catch (e: any) {
        console.error("Failed to fetch video data:", e);
        setError(`Failed to load video data: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, []);

  // Filter videos based on the defaultVideoType prop
  const filteredVideos = videos.filter((video) => video.type === stageN);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8, textAlign: "center" }}>
        <Typography variant="h6">Loading videos...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        maxWidth="lg"
        sx={{ mt: 8, mb: 8, textAlign: "center", color: "error.main" }}
      >
        <Typography variant="h6">Error: {error}</Typography>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        {/* No filter dropdown here, as filtering is handled via props */}

        {filteredVideos.length === 0 && (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: theme.palette.text.secondary }}
          >
            Hakuna video za aina ya "{stageN}" zilizopatikana.
          </Typography>
        )}
        <Grid container spacing={4}>
          {filteredVideos.map((video) => (
            <Grid key={video.id} item xs={12} sm={6} md={4}>
              <VideoCard video={video} onReadMore={handleReadMore} />
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          fullScreen={isMobile}
          maxWidth="md" // Set max width for desktop
          fullWidth // Make dialog take full width up to maxWidth
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 2 : "12px", // Rounded corners for desktop dialog
              backgroundColor: theme.palette.background.default, // Ensure dialog background is consistent
            },
          }}
        >
          {selectedVideo && (
            <>
              {isMobile ? (
                <AppBar
                  sx={{
                    position: "relative",
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Toolbar>
                    <IconButton
                      edge="start"
                      color="success"
                      onClick={handleCloseDialog}
                      aria-label="close"
                    >
                      <Close />
                    </IconButton>
                    <Typography
                      variant="h6"
                      sx={{ ml: 2, flex: 1, color: theme.palette.text.primary }}
                    >
                      {selectedVideo.title}
                    </Typography>
                  </Toolbar>
                </AppBar>
              ) : (
                <DialogTitle
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: `1px solid ${theme.palette.divider}`, // Subtle divider
                  }}
                >
                  {selectedVideo.title}
                  <IconButton
                    onClick={handleCloseDialog}
                    sx={{ color: cyan[900] }}
                  >
                    <Close />
                  </IconButton>
                </DialogTitle>
              )}
              <DialogContent
                sx={{
                  p: isMobile ? 2 : 4,
                  backgroundColor: theme.palette.background.default,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 0,
                    paddingBottom: "56.25%",
                    marginBottom: "16px",
                    overflow: "hidden",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    "& iframe": {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <iframe
                    src={selectedVideo.videoUrl}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </Box>
                <Typography
                  variant="body2" // Changed to body2 for slightly larger text
                  sx={{
                    display: "block",
                    color: theme.palette.text.secondary, // Changed to secondary for consistency
                    mb: 1,
                  }}
                >
                  Type:{" "}
                  <span style={{ color: theme.palette.primary.main }}>
                    {selectedVideo.type}
                  </span>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-line",
                    color: theme.palette.text.primary,
                    mb: 1,
                  }}
                >
                  {selectedVideo.description}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", color: theme.palette.text.secondary }}
                >
                  Uploaded: {selectedVideo.uploadTime}
                </Typography>
                {!isMobile && (
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                  >
                    <Button
                      onClick={handleCloseDialog}
                      variant="contained"
                      sx={{
                        color: "success",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark, // Darken on hover
                        },
                      }}
                    >
                      Close
                    </Button>
                  </Box>
                )}
              </DialogContent>
            </>
          )}
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default Videos;
