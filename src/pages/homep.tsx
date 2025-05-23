import { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  PersonAdd,
  Login,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { LoginDialog } from "./LoginDialog";
import CreateUserPage from "./RegisterDialog";
import { cyan } from "@mui/material/colors";

const RegisterDialog = ({
  open,

  onClose,
}: {
  open: boolean;

  onClose: () => void;
}) => {
  return (
    <Dialog
      sx={{
        border: "1px solid #d1d5db",

        borderRadius: "0.975rem",
      }}
      fullWidth
      open={open}
      onClose={onClose}
    >
      <DialogTitle
        sx={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          backgroundColor: "#00acc1",

          color: "white",
        }}
      >
        New User Registration{" "}
        <Button color="error" variant="contained" onClick={onClose}>
          Close{" "}
        </Button>{" "}
      </DialogTitle>{" "}
      <DialogContent>
        <CreateUserPage />{" "}
      </DialogContent>{" "}
    </Dialog>
  );
};
screenX;
const HeaderMainMenu = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false); // State for Register Dialog

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  const handleLoginClick = () => {
    setIsLoginDialogOpen(true);
  };

  const handleLoginDialogClose = () => {
    setIsLoginDialogOpen(false);
  };

  const handleRegisterClick = () => {
    setIsRegisterDialogOpen(true);
  };

  const handleRegisterDialogClose = () => {
    setIsRegisterDialogOpen(false);
  };

  // Mobile Menu (Drawer)
  if (isMobile) {
    return (
      <>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer(true)}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: "250px",
              background: "linear-gradient(to bottom, #e0f7fa, #b2ebf2)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: (theme) => theme.spacing(1, 1, 0, 0),
              ...theme.mixins.toolbar,
            }}
          >
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  toggleDrawer(false);
                  handleRegisterClick();
                }}
              >
                <PersonAdd sx={{ mr: 2 }} />
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  toggleDrawer(false);
                  handleLoginClick();
                }}
              >
                <Login sx={{ mr: 2 }} />
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <LoginDialog
          open={isLoginDialogOpen}
          onClose={handleLoginDialogClose}
        />
        <RegisterDialog
          open={isRegisterDialogOpen}
          onClose={handleRegisterDialogClose}
        />
      </>
    );
  }

  // Desktop Menu
  return (
    <>
      <Stack
        direction="row"
        spacing={3}
        sx={{ display: { xs: "none", md: "flex" } }}
      >
        <Button
          variant="text"
          color="inherit"
          startIcon={<PersonAdd />}
          onClick={handleRegisterClick}
          sx={{
            borderRadius: "0",
            padding: "0.5rem 1rem",
            fontWeight: 500,
            textTransform: "uppercase",
            color: "#fff",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              textDecoration: "none",
            },
          }}
        >
          Register
        </Button>
        <Button
          variant="text"
          color="inherit"
          startIcon={<Login />}
          onClick={handleLoginClick}
          sx={{
            borderRadius: "0",
            padding: "0.5rem 1rem",
            fontWeight: 500,
            textTransform: "uppercase",
            color: "#fff",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              textDecoration: "none",
            },
          }}
        >
          Login
        </Button>
      </Stack>
      <LoginDialog open={isLoginDialogOpen} onClose={handleLoginDialogClose} />
      <RegisterDialog
        open={isRegisterDialogOpen}
        onClose={handleRegisterDialogClose}
      />
    </>
  );
};

const DentalLabApp = () => {
  const theme = useTheme();
  const [appBarColor, setAppBarColor] = useState("transparent");
  const [openCardDialog, setOpenCardDialog] = useState(false);
  const [cardDialogContent, setCardDialogContent] = useState({
    title: "",
    description: "",
  });
  const [openFeaturesDialog, setOpenFeaturesDialog] = useState(false); // State for the new dialog

  useEffect(() => {
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
  }, [cyan[900]]);

  // Function to handle the "Explore Features" button click

  const handleLearnMoreClick = (title: string, description: string) => {
    setCardDialogContent({ title, description });
    setOpenCardDialog(true);
  };
  const getLimitedDescription = (text: string, maxLines = 3) => {
    const words = text.split(" ");
    let description = "";
    let lineCount = 0;
    for (let i = 0; i < words.length; i++) {
      description += words[i] + " ";
      if (description.length > 50 && description.slice(-1) === " ") {
        //Rough check for end of line
        lineCount++;
      }
      if (lineCount >= maxLines) {
        description += "...";
        break;
      }
    }
    return description;
  };
  const cardData = [
    {
      title: "Hatua ya 1: Utangulizi",
      description:
        "Katika Utangulizi, utapata maelezo muhimu kuhusu programu (programming) ni nini, umuhimu wake katika ulimwengu wa leo, na jinsi unavyoweza kuanza safari yako katika fani hii ya kusisimua. Lengo letu ni kukupa msingi thabiti, hata kama huna uzoefu wowote wa awali, ili uweze kuendelea kujifunza kwa vitendo na kufanikiwa kuwa Mtengenezaji wa Programu mahiri.",
    },
    {
      title: "Hatua ya 2: Academy",
      description:
        "Hatua ya Pili-Academy. Kama ilivyo kwa mchezaji wa soka anayejiunga na akademi kupata mafunzo ya kina na ya kimfumo, hapa ndipo utapata maarifa muhimu ya kukuwezesha kuanza safari yako ya vitendo katika utengenezaji programu. Sehemu hii itakupa zana na uelewa wa kuchagua hatua zako za kwanza za kiufundi, kuanzia kuchagua lugha ya programu hadi kutumia zana za msingi za kazi. Lengo kuu la Academy ni kukupa uwezo wa kujitegemea katika kujifunza na kufanya mazoezi. Hatutakufundisha kila kitu kuhusu lugha moja ya programu au zana moja, bali tutakupa msingi wa kuchagua zana sahihi zinazolingana na malengo yako na jinsi ya kuzitumia kwa ufanisi tangu mwanzo. Hii itakufanya uweze kuendelea kujifunza na kukua katika uga huu unaobadilika haraka",
    },
    {
      title: "Hatua ya 3: Practice",
      description: `Baada ya kupata msingi wa kutosha wa kinadharia kuhusu programming na jinsi ya kuchagua lugha na zana za
kuanzia katika sehemu ya "Utangulizi" na "Academy," sasa ni wakati wa kuweka mikono
yako kazini. Sehemu hii imejitolea kukupa maelekezo na mbinu za kufanya mazoezi ya
vitendo ili kujenga ujuzi wako kama mtengenezaji programu. Kama ilivyo kwa
mwanamuziki anayejifunza kinanda, au mchoraji anayejifunza kutumia brashi, ujuzi wa
programming hujengwa kwa kufanya mazoezi mara kwa mara na kutumia maarifa yako
kutatua matatizo halisi.
Lengo kuu hapa ni kukupa uwezo wa kujenga mazingira yako mwenyewe ya kufanyia
kazi, kuanza miradi, kusimamia kodi yako kwa ufanisi, na kukuza tabia muhimu za
utengenezaji software bora kama vile debugging, testing, na documentation. Kwa
kufanya mazoezi ya kutosha, utajenga ujasiri na ustadi unaohitajika kuwa Full Stack
Developer mahiri`,
    },
    {
      title: "Hatua 4: Inventory",
      description: `Karibu katika sehemu ya nne na ya mwisho ya mwongozo wetu, "Inventory." Baada ya kujifunza misingi ya programming, kuchagua zana zako za kwanza, na kufanya mazoezi ya vitendo kwa kujenga miradi mbalimbali katika sehemu zilizopita (Utangulizi, Academy, na Practice), sasa umefikia hatua muhimu sana: jinsi ya kuonyesha uwezo wako, kujitengenezea thamani katika soko, na kuanza kunufaika na ujuzi wako wa utengenezaji programu. 
 Sehemu hii ya Inventory haihusu tu kuhesabu 'vitu' ulivyojifunza, bali inahusu jinsi ya kuweka 'thamani' kwenye ujuzi na kazi zako. Itakupa maarifa ya jinsi ya kujitangaza, kujenga chapa yako binafsi (personal brand), kufikia wateja au watumiaji wa bidhaa zako, kusimamia ukuaji (scalability), na hatimaye, jinsi ya kugeuza ujuzi wako kuwa fursa za kiuchumi, iwe kwa kuajiriwa kazi nzuri au kujiajiri mwenyewe. Lengo hapa ni kukufundisha kuwa na mtazamo wa kibiashara katika safari yako ya utengenezaji programu. Haitoshi tu kuwa na uwezo wa kuandika kodi nzuri; unahitaji pia kujua jinsi ya kuuza ujuzi huo, kuwasiliana na wateja, na kusimamia miradi yako kama biashara. Sehemu hii itakuandaa kwa ulimwengu halisi wa kazi na kukusaidia kujenga njia yako mwenyewe ya mafanikio.
`,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: cyan[900],
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: appBarColor,
          color: "#fff",
          boxShadow:
            appBarColor === "transparent"
              ? "none"
              : "0 2px 4px rgba(0, 0, 0, 0.2)",
          transition: "background-color 0.3s ease",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "inherit" }}>
            Jiku Tech Tips
          </Typography>
          <HeaderMainMenu />
        </Toolbar>
      </AppBar>
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
        <Typography
          variant="h3"
          sx={{ fontWeight: 700, color: "#fff", textAlign: "center", mb: 4 }}
        >
          Mafunzo ya Software Development <br />
          (Web Apps, Mobile Apps, Desktop Apps, Pro. Websites)
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {cardData.map((card, index) => (
            <Grid item key={index} xs={12} md={6} lg={3}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {getLimitedDescription(card.description)}
                  </Typography>
                </CardContent>
                <CardContent>
                  <Button
                    variant="text"
                    sx={{ color: theme.palette.secondary.main }}
                    onClick={() =>
                      handleLearnMoreClick(card.title, card.description)
                    }
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>{" "}
      <Dialog
        open={openCardDialog}
        onClose={() => setOpenCardDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{cardDialogContent.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 4, p: 2 }}>
            <Typography variant="body1">
              {cardDialogContent.description}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DentalLabApp;
