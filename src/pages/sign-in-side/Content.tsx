import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CreateIcon from "@mui/icons-material/Create";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";

import { SitemarkIcon } from "./CustomIcons";
import { Title } from "@mui/icons-material";
import { Button, createSvgIcon } from "@mui/material";
import CreateSvgIcon from "@mui/material/utils/createSvgIcon";

const items = [
  {
    icon: (
      <img src="https://mamed.org/assets/meno.png?w=161&fit=crop&auto=format" />
    ),
    title: "Dentures",
    description:
      "Removable false teeth made of acrylic (plastic), nylon or metal. They fit snugly over the gums to replace missing teeth and eliminate potential problems caused by gaps",
  },
  {
    icon: (
      <img
        src="https://mamed.org/assets/implant.png?w=161&fit=crop&auto=format"
        alt="dental lab"
      />
    ),
    title: "Implants",
    description:
      "To replace a missing biological structure, support a damaged biological structure, or enhance an existing biological structure",
  },
  {
    icon: (
      <img
        src="https://mamed.org/assets/crown.jpg?w=161&fit=crop&auto=format"
        alt="dental lab"
      />
    ),
    title: "Crown",
    description:
      "Tooth-shaped cap that covers a damaged tooth or dental implant to improve its appearance and strength",
  },
];

export default function Content(props: any) {
  return (
    <Stack
      direction={"column"}
      sx={{
        alignSelf: "left",
        gap: 2,
        maxWidth: 600,
        marginBottom: 10,
        marginTop: 0,
      }}
    >
      <Box sx={{ display: { md: "flex" } }}>
        <Button href={props.path} color="primary" variant="text">
          <Typography variant="body2"> {props.pathtype}</Typography>
        </Button>
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: "medium" }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
