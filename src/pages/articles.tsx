import React, { useState } from "react";
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
  Divider,
} from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { Close } from "@mui/icons-material";
//import { useTheme } from '@mui/material/styles'; // Import useTheme
import { useMediaQuery } from "@mui/material";

// Interface ya Makala
interface Article {
  id: number;
  title: string;
  body: string;
  type: string;
  postDate: string;
}

// Data ya makala kutoka kwa JSON

// Styled Components za MUI
const StyledCard: any = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[5],
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
  },
  cursor: "pointer",
}));

const StyledCardContent: any = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  "&:last-child": {
    paddingBottom: theme.spacing(3),
  },
}));

const TitleTypography: any = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h5.fontSize,
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
}));

const BodyTypography: any = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.body1.fontSize,
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
}));

const TypeTypography: any = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  color: theme.palette.primary.main,
  fontWeight: theme.typography.fontWeightMedium,
  textTransform: "uppercase",
  marginBottom: theme.spacing(0.5),
}));

const PostDateTypography: any = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  color: theme.palette.text.primary,
}));

// Component ya kuonyesha makala
const ArticleCard: React.FC<{
  article: Article;
  onReadMore: (article: Article) => void;
}> = ({ article, onReadMore }) => {
  return (
    <StyledCard onClick={() => onReadMore(article)}>
      <StyledCardContent>
        <TypeTypography variant="caption">{article.type}</TypeTypography>
        <TitleTypography variant="h5">{article.title}</TitleTypography>
        <BodyTypography variant="body1">{article.body}</BodyTypography>
        <PostDateTypography variant="caption">
          Tarehe: {article.postDate}
        </PostDateTypography>
      </StyledCardContent>
    </StyledCard>
  );
};

// Component ya App
const Articles: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const theme = createTheme();

  const handleReadMore = (article: Article) => {
    setSelectedArticle(article);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedArticle(null);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Grid container spacing={4}>
          {articles.map((article) => (
            <Grid key={article.id} item xs={12} sm={6} md={4}>
              <ArticleCard article={article} onReadMore={handleReadMore} />
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          fullScreen={isMobile}
        >
          {selectedArticle && (
            <>
              {isMobile ? (
                <AppBar
                  sx={{ position: "relative", backgroundColor: "#006064" }}
                >
                  <Toolbar>
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={handleCloseDialog}
                      aria-label="close"
                    >
                      <Close />
                    </IconButton>
                    <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
                      {selectedArticle.title}
                    </Typography>
                  </Toolbar>
                </AppBar>
              ) : (
                <DialogTitle>{selectedArticle.title}</DialogTitle>
              )}
              <DialogContent sx={{ p: isMobile ? 2 : 4 }}>
                <Typography variant="caption" style={{ display: "block" }}>
                  {selectedArticle.type}
                </Typography>
                <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
                  {selectedArticle.body}
                </Typography>
                <Typography variant="caption" style={{ display: "block" }}>
                  Tarehe: {selectedArticle.postDate}
                </Typography>
                {!isMobile && (
                  <Button onClick={handleCloseDialog}>Close</Button>
                )}
              </DialogContent>
            </>
          )}
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};
export default Articles;
