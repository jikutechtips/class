import * as React from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import SecurityIcon from "@mui/icons-material/Security";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import {
  randomCreatedDate,
  randomUpdatedDate,
} from "@mui/x-data-grid-generator";
import EditIcon from "@mui/icons-material/Edit";

function EditUserActionItem({ idd, ...props }) {
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState();
  const data = ColumnTypesGrid().data;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [fullName, setFullName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [phone_number, setPhoneNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [entity_name, setEntityName] = React.useState("");
  React.useEffect(() => {
    fetch(`${API_BASE_URL}/users/update/${idd}`, {
      method: "GET",
    })
      .then(async (response) => {
        if (!response.ok) {
          const e = await response.json();
          setErrorMessage(e.message);
          throw new Error(e.message);
        } // No need to set users state here, we only care about email
        return response.json(); // Parse the response as JSON
      })

      .then((data) => {
        // Assuming the response structure has an "email" property

        if (data) {
          setFullName(data.fullName);
          setAddress(data.address);
          setPhoneNumber(data.phone_number);
          setEmail(data.email);
          setTitle(data.title);
          setEntityName(data.entity_name);
          setPassword(data.password);
        }
      })

      .catch((error) => {
        console.error("Error fetching user data:", error);

        reject(error);
      });
  }, []);

  return (
    <React.Fragment>
      <GridActionsCellItem {...props} onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Edit This User</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <Box
            component="form"
            sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                id="fullname"
                label="Full Name"
                onChange={(e) => setFullName(e.target.value)}
                type="search"
                value={fullName}
                variant="standard"
              />
              <TextField
                id="address"
                label="Physical Address"
                type="search"
                onChange={(e) => setAddress(e.target.value)}
                variant="standard"
                value={address}
              />
              <TextField
                id="phone-number"
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                label="Phone Number"
                type="search"
                variant="standard"
              />
              <TextField
                id="email"
                label="Email Address"
                value={email}
                type="search"
                onChange={(e) => setEmail(e.target.value)}
                variant="standard"
              />
              <TextField
                id="title"
                label="Title (isAdmin ?) "
                onChange={(e) => setTitle(e.target.value)}
                type="search"
                value={title}
                variant="standard"
              />
              <TextField
                id="entityname"
                label="Entity Name"
                onChange={(e) => setEntityName(e.target.value)}
                type="search"
                value={entity_name}
                variant="standard"
              />
              <TextField
                id="password"
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                type="search"
                value={password}
                variant="standard"
              />
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              fetch(
                `http://localhost:8080/users/${idd}?fullName=${fullName}&address=${address}&phone_number=${phone_number}&email=${email}&password=${password}&title=${title}&entity_name=${entity_name}`,
                {
                  method: "PUT",
                }
              )
                .then(async (response) => {
                  if (!response.ok) {
                    const e = await response.json();
                    setErrorMessage(e.message);
                    throw new Error(e.message);
                  } // No need to set users state here, we only care about email
                  return null; // Parse the response as JSON
                })

                .then((data) => {
                  // Assuming the response structure has an "email" property

                  if (data) {
                    console.log("done");
                  }
                })

                .catch((error) => {
                  console.error("Error fetching user data:", error);
                });
              setOpen(false);
              deleteUser();
            }}
            color="primary"
            autoFocus
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default function ColumnTypesGrid() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [users, setUsers] = React.useState([]);
  const [id, setId] = React.useState();
  const [rows, setRows] = React.useState([]);

  //const router = useRouter();

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/users`, { method: "GET" })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((data) => {
        if (data !== null) {
          setRows(data);
        }
      });
  }, []);
  const deleteUser = React.useCallback(
    (id) => () => {
      setTimeout(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      });
      console.log(id);
    },
    []
  );

  const toggleAdmin = React.useCallback(
    (id) => () => {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, isAdmin: !row.isAdmin } : row
        )
      );
      setId(id);
    },
    []
  );

  const editUser = React.useCallback();

  const duplicateUser = React.useCallback(
    (id) => () => {
      setRows((prevRows) => {
        const rowToDuplicate = prevRows.find((row) => row.id === id);
        return [...prevRows, { ...rowToDuplicate, id: Date.now() }];
      });
    },
    []
  );

  const columns = React.useMemo(
    () => [
      { field: "fullName", type: "string" },
      { field: "address", type: "string" },
      { field: "phone_number", type: "string", width: 130 },
      { field: "email", type: "string", width: 180 },
      { field: "title", type: "boolean", width: 120 },
      {
        field: "password",
        type: "string",
        width: 120,
      },
      {
        field: "entity_name",
        type: "string",
        width: 120,
      },
      {
        field: "registration_date",
        type: "string",
        width: 120,
      },
      {
        field: "actions",
        type: "actions",
        width: 120,
        getActions: (params) => [
          <EditUserActionItem
            icon={<EditIcon />}
            label="Edit"
            idd={params.id}
          />,
          <GridActionsCellItem
            icon={<SecurityIcon />}
            label="Toggle Admin"
            onClick={toggleAdmin(params.id)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<FileCopyIcon />}
            label="Duplicate User"
            onClick={duplicateUser(params.id)}
            showInMenu
          />,
        ],
      },
    ],
    [deleteUser, toggleAdmin, duplicateUser]
  );

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid columns={columns} rows={rows} />
    </div>
  );
}
