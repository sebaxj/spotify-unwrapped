
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "../components/Layout";

const storePathValues = () => {
  const storage = globalThis?.sessionStorage;
  if (!storage) return;
  // Set the previous path as the value of the current path.
  const prevPath = storage.getItem("currentPath");
  storage.setItem("prevPath", prevPath);
  // Set the current path value by looking at the browser's location object.
  storage.setItem("currentPath", globalThis.location.pathname);
}

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1DB954"
    }
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const getLayout = Component.getLayout || ((page) => <Layout key={router.asPath} {...pageProps}>{page}</Layout>);
  useEffect(() => storePathValues, [router.asPath]);
  
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        { getLayout(
            <Component {...pageProps} />
        )}
      </ThemeProvider>
    </SessionProvider>
  );
}
