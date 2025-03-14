"use client";
import Stack from "@mui/material/Stack";
import AppTheme from "../theme/AppTheme";
import Copyright from "../internals/components/Copyright";
import SignInSide from "./sign-in-side/SignInSide";
import Header from "./Header";
import Header1 from "./Header1";

export default function SignIn(props: any) {
  return (
    <AppTheme {...props}>
      <Header1 />
      <Stack
        direction="column"
        component="main"
        sx={[
          {
            justifyContent: "center",
            height: "calc((1 - var(--template-frame-height, 0)) * 100%)",
            marginTop: "max(0px - var(--template-frame-height, 0px), 0px)",
            minHeight: "100%",
          },
          (theme) => ({
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              zIndex: -1,
              inset: 0,
              backgroundImage:
                "radial-gradient(ellipse at 50% 50%, hsl(211, 86.20%, 94.30%), hsl(0, 9.10%, 95.70%))",
              backgroundRepeat: "no-repeat",
              ...theme.applyStyles("dark", {
                backgroundImage:
                  "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
              }),
            },
          }),
        ]}
      >
        {" "}
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          sx={{
            justifyContent: "center",
            gap: { xs: 6, sm: 12 },
            p: 2,
            mx: "auto",
          }}
        >
          <Stack
            direction={{ xs: "column-reverse", md: "row" }}
            sx={{
              justifyContent: "left",
              gap: { xs: 6, sm: 12 },
              p: { xs: 2, sm: 4 },
              m: "auto",
            }}
          >
            {" "}
            {/* <Content path="/entity-registration" pathtype="Register" />{" "} */}
            <SignInSide />
          </Stack>
        </Stack>
        <Copyright />
      </Stack>
    </AppTheme>
  );
}
