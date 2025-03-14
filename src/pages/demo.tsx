import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ToothInfo } from "../interfaces/ToothInfo";
import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { CaseInfo } from "../interfaces/CaseInfo";
import { Clients } from "../interfaces/Clients";

const TAX_RATE = 0.07;
function capitalizeWords(str: string): any {
  if (typeof str === "string") {
    return str
      .toLowerCase() // Convert to lowercase first to handle mixed-case input
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return str;
}

function formatCurrency(
  amount: string | number,
  currencyCode = "TZS",
  locale = "en-US"
): string {
  const amountNumber = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(amountNumber)) {
    return "Invalid Amount"; // Handle invalid input
  }

  return amountNumber.toLocaleString(locale, {
    style: "currency",
    currency: currencyCode,
  });
}

function formatNumber(
  value: number | string,
  options?: Intl.NumberFormatOptions
): string {
  let numberValue: number;

  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      return "Invalid Number"; // Or handle the error as needed
    }
    numberValue = parsed;
  } else {
    numberValue = value;
  }

  // Ensure two decimal places, regardless of options
  const formatted = numberValue.toLocaleString(undefined, {
    ...options, // Preserve any provided options
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatted;
}

function subtotal(items: readonly ToothInfo[]): number {
  return items.reduce((sum, item) => {
    const price =
      typeof item.total_price === "string"
        ? parseFloat(item.total_price)
        : item.total_price;
    return sum + (isNaN(price) ? 0 : price);
  }, 0);
}
function getFutureDate(daysToAdd: number): string {
  const today = new Date();
  const futureDate = new Date(
    today.getTime() + daysToAdd * 24 * 60 * 60 * 1000
  ); // Add days in milliseconds

  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(futureDate.getDate()).padStart(2, "0");

  return `${day}-${month}-${year}`; // Format as YYYY-MM-DD
}

export default function SpanningTable(props: any) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [caseId, setCaseId] = React.useState(props.caseId);

  const [rows, setRows] = React.useState<ToothInfo[]>([]);

  const [uniqueCaseNumber, setUniqueCaseNumber] = React.useState<string | null>(
    null
  );
  const [uniqueDoctor, setUniqueDoctor] = React.useState<string | null>(null);
  const [entity_name, setEntityName] = React.useState("");

  const [caseinfo, setCaseInfo] = React.useState<CaseInfo | null>(null);
  const [clientinfo, setClientInfo] = useState<Clients | null>(null);
  const doctype = props.docttypee;
  const discount = props.discount;
  const bill_date = props.bill_date;
  const billend = props.billend;
  const additionalcost = props.additionalcost;
  const docnumber = props.docnumber;
  const invoiceSubtotal: number = subtotal(rows);
  const invoiceTotal =
    parseInt(additionalcost) + invoiceSubtotal - parseInt(discount);
  useEffect(() => {
    const fetchCaseInfo = async () => {
      if (caseId) {
        try {
          fetch(`${API_BASE_URL}/cases/${caseId}`, {
            method: "GET",
          })
            .then((response) => {
              if (response.status === 200) {
                return response.json();
              }
              return null;
            })
            .then((data) => {
              if (data !== null) {
                setCaseInfo(data);
                console.log(data);
              }
            });
        } catch (caseError) {
          console.error("Error fetching case:", caseError);
          setCaseInfo(null);
        }
      } else {
        setCaseInfo(null);
      }
    };
    fetchCaseInfo();
  }, [caseId]);
  ``;
  useEffect(() => {
    const fetchPatientTooth = async () => {
      if (caseId) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/task-info/patient/${caseId}`
          );
          if (response.ok) {
            const data = await response.json();
            setRows(data);
          } else {
            console.error("Failed to fetch patients:", response.status);
            setRows([]);
          }
        } catch (error) {
          console.error("Error fetching patients:", error);
          setRows([]);
        }
      } else {
        setRows([]);
      }
    };
    fetchPatientTooth();
  }, [caseId]);
  React.useEffect(() => {
    if (rows && rows.length > 0) {
      setUniqueDoctor(rows[0].doctor.toLocaleUpperCase());
      setUniqueCaseNumber(rows[0].caseNumber);
      setEntityName(rows[0].entity_name);
    } else {
      setUniqueDoctor(null);
      setUniqueCaseNumber(null);
      setEntityName("");
    }
  }, [rows]);

  useEffect(() => {
    if (uniqueDoctor) {
      fetch(`${API_BASE_URL}/clients/${uniqueDoctor}`, {
        method: "GET",
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
          return null;
        })
        .then((data) => {
          if (data !== null) {
            setClientInfo(data);
          }
        });
    }
  }, [uniqueDoctor]);
  return (
    <TableContainer component={Paper}>
      <Stack sx={{ border: 0 }}>
        <Stack
          spacing={2}
          direction={"column"}
          sx={{ width: 700, margin: "50px auto", p: 2, border: 3 }}
        >
          <Box sx={{ border: 0 }}>
            {entity_name && (
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: 36,
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                  fontStyle: "inherit",
                  mb: 7,
                }}
              >
                {entity_name.toUpperCase()}
              </Typography>
            )}{" "}
            <Typography
              sx={{
                textAlign: "center",
                fontSize: 24,
                fontWeight: "bold",
                fontFamily: "sans-serif",
                fontStyle: "inherit",
                mb: 5,
              }}
            >
              {doctype.toUpperCase()}
            </Typography>
          </Box>
          {uniqueCaseNumber && (
            <Stack spacing={2} direction={"row"}>
              <Typography
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                  fontStyle: "inherit",
                }}
              >
                {capitalizeWords(doctype)} Number:
              </Typography>
              <Typography sx={{ m: 0 }}>{docnumber}</Typography>
            </Stack>
          )}
          {clientinfo && (
            <Stack spacing={2} direction={"row"}>
              <Typography
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                  fontStyle: "inherit",
                }}
              >
                {doctype == "invoice" ? "Payer   :" : "Received From :"}
              </Typography>
              <Typography sx={{ border: 0, paddingLeft: 2 }}>
                {capitalizeWords(clientinfo.fullName)},{" "}
                {capitalizeWords(clientinfo.office)}
              </Typography>
            </Stack>
          )}

          {caseinfo && (
            <Stack spacing={2} direction={"row"}>
              <Typography
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                  fontStyle: "inherit",
                }}
              >
                Patient :
              </Typography>
              <Typography sx={{ border: 0, paddingLeft: 8 }}>
                {capitalizeWords(caseinfo.patient)}
              </Typography>
            </Stack>
          )}
          <Box sx={{ border: 1 }}></Box>
          <Table aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell>Teeth</TableCell>
                <TableCell>Product</TableCell>
                <TableCell align="right">Qty.</TableCell>
                <TableCell align="right">Unit</TableCell>
                <TableCell align="right">Sum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.teeth}</TableCell>
                  <TableCell>{row.product}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell align="right">{formatNumber(row.price)}</TableCell>
                  <TableCell align="right">
                    {formatNumber(row.total_price)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell rowSpan={5} />
                <TableCell colSpan={3}>Subtotal</TableCell>
                <TableCell align="right">
                  {formatNumber(invoiceSubtotal)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Discount</TableCell>
                <TableCell align="right">{`${parseInt(discount).toFixed(0)}`}</TableCell>
                <TableCell align="right" colSpan={3}>
                  {formatNumber(parseInt(discount))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Addittional Cost</TableCell>
                <TableCell align="right">{`${parseInt(additionalcost).toFixed(0)}`}</TableCell>
                <TableCell align="right" colSpan={3}>
                  {formatNumber(parseInt(additionalcost))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell
                  sx={{ fontStyle: "inherit", fontWeight: "bold" }}
                  align="right"
                >
                  {formatCurrency(invoiceTotal)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box sx={{ border: 0 }}>
            <Stack spacing={2} direction={"row"} sx={{ mt: 2 }}>
              <Typography
                sx={{
                  textAlign: "left",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                  fontStyle: "inherit",
                  mb: 1,
                }}
              >
                Created At :
              </Typography>
              <Typography
                sx={{
                  textAlign: "left",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                  fontStyle: "inherit",
                  mb: 1,
                }}
              >
                {bill_date}
              </Typography>
            </Stack>{" "}
            <Stack spacing={2} direction={"row"} sx={{ mt: 2 }}>
              <Typography
                sx={{
                  textAlign: "left",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                  fontStyle: "inherit",
                }}
              >
                Expires On:
              </Typography>
              <Typography
                sx={{
                  textAlign: "left",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                  fontStyle: "inherit",
                }}
              >
                {billend}
              </Typography>
            </Stack>{" "}
            <Stack
              direction="row"
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Typography
                sx={{
                  textAlign: "left",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                  fontStyle: "inherit",
                  mb: 1,
                }}
              >
                Prepared By: {"Admin"}
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                  fontStyle: "inherit",
                  mb: 1,
                  color: "GrayText",
                }}
              >
                {"How To Pay Contacts +255 000 000 000 "}
              </Typography>{" "}
            </Stack>{" "}
          </Box>
          <Box sx={{ border: 1 }}></Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <footer>
              <p>
                &copy; {new Date().getFullYear()}
                {"|"}
                {capitalizeWords(entity_name)}. All rights reserved.
              </p>
            </footer>
          </Box>
        </Stack>
      </Stack>
    </TableContainer>
  );
}
