import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";

export default function FormDialog() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const fullName = formJson.fullName;
            console.log(fullName);

            //Try to Send Dta to the server in here
            handleClose();
          },
        }}
      >
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />{" "}
          <div>
            <TextField
              required
              id="fullname"
              label="Full Name"
              type="search"
              name="fullName"
              variant="standard"
            />
            <TextField
              required
              id="address"
              label="Physical Address"
              type="search"
              name="address"
              variant="standard"
            />
            <TextField
              required
              id="phone-number"
              label="Phone Number"
              type="search"
              variant="standard"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="title"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
            />
            <TextField
              id="password"
              label="Password"
              name="password"
              type="search"
              variant="standard"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
