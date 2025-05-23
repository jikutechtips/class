import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { cyan } from "@mui/material/colors";
import Articles from "./articles"; // Assuming this component exists and accepts 'articles' prop
import Videos from "./videos"; // Assuming this component exists
import AudioPlayerPage from "./audio"; // Assuming this component exists
import { useSession } from "../SessionContext";

// Interface for Article
interface Article {
  id: number;
  title: string;
  body: string;
  type: string;
  postDate: string;
}

const DashboardPage1: React.FC<{ stageName?: string }> = ({ stageName }) => {
  const theme = useTheme();

  const urlParams = new URLSearchParams(window.location.search);
  const [appBarColor, setAppBarColor] = useState("transparent");
  const { session } = useSession();
  // State to hold fetched articles
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeComponent, setActiveComponent] = useState<React.ReactNode>(
    // Initially, show a loading message or an empty Articles component
    <Articles articles={[]} />
  );
  useEffect(() => {
    // Fetch articles from the API
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/articles/type/${stageName != null ? stageName : "utangulizi"}`
        );
        if (!response.ok) {
          throw new Error(`${response.status}`);
        }
        const data: Article[] = await response.json();
        setArticles(data);
        // Set the active component to Articles once data is fetched
        setActiveComponent(<Articles articles={data} />);
      } catch (err: any) {
        setError(
          err.message == 404 ? "No Data " : `Error ${err.message} contact Admin`
        );
        console.error("Error fetching articles:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();

    // Handle AppBar color change on scroll
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setAppBarColor(cyan[900]);
      } else {
        setAppBarColor("transparent");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!loading && articles.length > 0) {
      if (
        activeComponent &&
        (activeComponent as any).type === Articles &&
        (activeComponent as any).props.articles.length === 0
      ) {
        setActiveComponent(<Articles articles={articles} />);
      }
    }
  }, [articles, loading, activeComponent]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h5">Inapakia Makala...</Typography>{" "}
        {/* Loading message */}
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          color: "red",
        }}
      >
        <Typography variant="h5"> {error}</Typography> {/* Error message */}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CssBaseline />

      <Box
        sx={{
          marginTop: "64px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingX: { xs: 2, sm: 4, md: 8 },
          paddingTop: 4,
          paddingBottom: 8,
        }}
      >
        <Stack
          direction="row"
          spacing={3}
          sx={{ display: { xs: "flex", md: "flex", color: "black" } }}
        >
          <Button
            variant="contained"
            color="inherit"
            onClick={() => {
              setActiveComponent(<Articles articles={articles} />); // Pass fetched articles
            }}
            sx={{
              borderRadius: "0",
              padding: "0.5rem 1rem",
              fontWeight: 500,
              textTransform: "uppercase",
              color: "success",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                textDecoration: "none",
              },
            }}
          >
            Makala
          </Button>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => {
              setActiveComponent(
                <Videos defaultVideoType={stageName?.toLowerCase()} />
              );
            }}
            sx={{
              borderRadius: "0",
              padding: "0.5rem 1rem",
              fontWeight: 500,
              textTransform: "uppercase",
              color: "success",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                textDecoration: "none",
              },
            }}
          >
            Video za Vitendo
          </Button>{" "}
          <Button
            variant="contained"
            color="inherit"
            onClick={() => {
              setActiveComponent(
                <AudioPlayerPage defaultAudioType={stageName?.toLowerCase()} />
              );
            }}
            sx={{
              borderRadius: "0",
              padding: "0.5rem 1rem",
              fontWeight: 500,
              textTransform: "uppercase",
              color: "success",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                textDecoration: "none",
              },
            }}
          >
            Masomo ya Sauti
          </Button>
        </Stack>{" "}
        {activeComponent}
      </Box>
    </Box>
  );
};

export default DashboardPage1;
