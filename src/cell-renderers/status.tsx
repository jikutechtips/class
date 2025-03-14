import * as React from "react";
import Chip from "@mui/material/Chip";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import type { MenuProps } from "@mui/material/Menu";
import Select, { SelectProps } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import InfoIcon from "@mui/icons-material/Info";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  GridEditModes,
  GridRenderCellParams,
  GridRenderEditCellParams,
  useGridApiContext,
  useGridRootProps,
} from "@mui/x-data-grid";

export const STATUS_OPTIONS = [
  "Draft",
  "Received",
  "Pending",
  "Started",
  "Halfway",
  "Finalizing",
  "Completed",
];

interface StatusProps {
  status: string;
}

const StyledChip = styled(Chip)(({ theme }) => ({
  justifyContent: "left",
  "& .icon": {
    color: "inherit",
  },
  "&.Draft": {
    color:
      (theme as any)?.vars?.palette?.default?.dark ||
      (theme as any)?.palette?.default?.dark ||
      "grey",
    border: `1px solid ${(theme as any)?.vars?.palette?.default?.main || (theme as any)?.palette?.default?.main || "lightgrey"}`,
  },
  "&.Received": {
    color:
      (theme as any)?.vars?.palette?.info?.dark ||
      theme?.palette?.info?.dark ||
      "blue",
    border: `1px solid ${(theme as any)?.vars?.palette?.info?.main || theme?.palette?.info?.main || "lightblue"}`,
  },
  "&.Pending": {
    color:
      (theme as any)?.vars?.palette?.secondary?.dark ||
      theme?.palette?.secondary?.dark ||
      "purple",
    border: `1px solid ${(theme as any)?.vars?.palette?.secondary?.main || theme?.palette?.secondary?.main || "violet"}`,
  },
  "&.Started": {
    color:
      (theme as any)?.vars?.palette?.primary?.dark ||
      theme?.palette?.primary?.dark ||
      "darkgreen",
    border: `1px solid ${(theme as any)?.vars?.palette?.primary?.main || theme?.palette?.primary?.main || "green"}`,
  },
  "&.Halfway": {
    color:
      (theme as any)?.vars?.palette?.primary?.main ||
      theme?.palette?.primary?.main ||
      "green",
    border: `1px solid ${(theme as any)?.vars?.palette?.primary?.light || theme?.palette?.primary?.light || "lightgreen"}`,
  },
  "&.Finalizing": {
    color:
      (theme as any)?.vars?.palette?.warning?.dark ||
      theme?.palette?.warning?.dark ||
      "orange",
    border: `1px solid ${(theme as any)?.vars?.palette?.warning?.main || theme?.palette?.warning?.main || "yellow"}`,
  },
  "&.Completed": {
    color:
      (theme as any)?.vars?.palette?.success?.dark ||
      theme?.palette?.success?.dark ||
      "darkblue",
    border: `1px solid ${(theme as any)?.vars?.palette?.success?.main || theme?.palette?.success?.main || "blue"}`,
  },
}));

const Status = React.memo((props: StatusProps) => {
  const { status } = props;

  let icon: any = null;
  if (status === "Draft") {
    icon = <EditIcon className="icon" />;
  } else if (status === "Received") {
    icon = <InfoIcon className="icon" />;
  } else if (status === "Pending") {
    icon = <AccessTimeIcon className="icon" />;
  } else if (status === "Started") {
    icon = <AutorenewIcon className="icon" />;
  } else if (status === "Halfway") {
    icon = <LinearScaleIcon className="icon" />;
  } else if (status === "Finalizing") {
    icon = <CheckCircleIcon className="icon" />;
  } else if (status === "Completed") {
    icon = <DoneIcon className="icon" />;
  }

  let label: string = status;
  if (status === "Finalizing") {
    label = "Finalizing";
  }

  return (
    <StyledChip
      className={status}
      icon={icon}
      size="small"
      label={label}
      variant="outlined"
    />
  );
});

function EditStatus(props: GridRenderEditCellParams<any, string>) {
  const { id, value, field } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  const handleChange: SelectProps["onChange"] = async (event) => {
    const isValid = await apiRef.current.setEditCellValue({
      id,
      field,
      value: event.target.value,
    });

    if (isValid && rootProps.editMode === GridEditModes.Cell) {
      apiRef.current.stopCellEditMode({ id, field, cellToFocusAfter: "below" });
    }
  };

  const handleClose: MenuProps["onClose"] = (event, reason) => {
    if (reason === "backdropClick") {
      apiRef.current.stopCellEditMode({ id, field, ignoreModifications: true });
    }
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      MenuProps={{
        onClose: handleClose,
      }}
      sx={{
        height: "100%",
        "& .MuiSelect-select": {
          display: "flex",
          alignItems: "center",
          pl: 1,
        },
      }}
      autoFocus
      fullWidth
      open
    >
      {STATUS_OPTIONS.map((option) => {
        let IconComponent: any = null;
        if (option === "Draft") {
          IconComponent = EditIcon;
        } else if (option === "Received") {
          IconComponent = InfoIcon;
        } else if (option === "Pending") {
          IconComponent = AccessTimeIcon;
        } else if (option === "Started") {
          IconComponent = AutorenewIcon;
        } else if (option === "Halfway") {
          IconComponent = LinearScaleIcon;
        } else if (option === "Finalizing") {
          IconComponent = CheckCircleIcon;
        } else if (option === "Completed") {
          IconComponent = DoneIcon;
        }

        let label = option;
        if (option === "Finalizing") {
          label = "Finalizing";
        }

        return (
          <MenuItem key={option} value={option}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <IconComponent fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={label} sx={{ overflow: "hidden" }} />
          </MenuItem>
        );
      })}
    </Select>
  );
}

export function renderStatus(params: GridRenderCellParams<any, string>) {
  if (params.value == null) {
    return "";
  }

  return <Status status={params.value} />;
}

export function renderEditStatus(
  params: GridRenderEditCellParams<any, string>
) {
  return <EditStatus {...params} />;
}
