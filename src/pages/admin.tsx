import * as React from "react";
import Accordion, {
  AccordionSlots,
  accordionClasses,
} from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails, {
  accordionDetailsClasses,
} from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Fade from "@mui/material/Fade";
import AddArticle from "./addarticle";
import ViewUsers from "./viewusers";
import PaymentInfo from "./paymentInfo";
import ViewArticles from "./viewarticles";

export default function AdminPanel() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <div>
      <Accordion
        expanded={expanded}
        onChange={handleExpansion}
        slots={{ transition: Fade as AccordionSlots["transition"] }}
        slotProps={{ transition: { timeout: 400 } }}
        sx={[
          expanded
            ? {
                [`& .${accordionClasses.region}`]: {
                  height: "auto",
                },
                [`& .${accordionDetailsClasses.root}`]: {
                  display: "block",
                },
              }
            : {
                [`& .${accordionClasses.region}`]: {
                  height: 0,
                },
                [`& .${accordionDetailsClasses.root}`]: {
                  display: "none",
                },
              },
        ]}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Create New Article</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AddArticle />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">View Articles</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ViewArticles />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">Jiku Tech Users</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ViewUsers />
        </AccordionDetails>
      </Accordion>{" "}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">How To Pay, Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PaymentInfo />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
