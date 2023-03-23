import Head from "next/head";
import Image from "next/image";

import { Button, Grid, Typography, Alert } from "@mui/material";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import spotifyLogo from "../public/spotify_white.png";

import { useRouter } from "next/router";
// import logo from "../public/logo.svg";

function nextCallbackUrl(callbackUrl) {
  if (!callbackUrl || callbackUrl === "/") {
    return "/";
  }
  return callbackUrl;
}

function Error({ error, setError }) {
  if (!error) return null;

  let message = "";
  switch (error) {
    case "SessionRequired":
      message = "You must be logged in to view that page";
      break;
    case "OAuthCallback":
      message = "You do not have access to the beta";
      break;
    default:
      return null;
  }
  return (
    <Alert severity="error" onClose={() => setError(undefined)}>
      {message}
    </Alert>
  );
}

export default function Home({ providers }) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [error, setError] = useState(router.query.error);

  useEffect(() => {
    setError(router.query.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>Login - Spotify Unwrapped</title>
        <meta name="description" content="See where your music comes from" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={6}
        >
          <Grid item sx={{ width: "100%" }}>
            <Error error={error} setError={setError} />
          </Grid>
          <Grid item>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                paddingLeft: "1rem",
                paddingRight: "1rem",
              }}
            >
              <Typography variant="h4" component="h4">
                Spotify Unwrapped
              </Typography>
              <Typography variant="body" component="p" textAlign="center">
                Welcome to Sebastian&apos;s CS 448B Final Project, Spotify
                Unwrapped! This application enables you to see where in the
                world your music comes from, and prompts you with music from new
                geographic regions. We hope you enjoy!
              </Typography>
            </div>
          </Grid>

          <Grid item>
            <Button
              sx={{
                color: "white",
                borderColor: "white",
                borderRadius: "25px",
                padding: "5px 35px",
              }}
              startIcon={
                <Image src={spotifyLogo} height="20" alt="spotify logo" />
              }
              variant="outlined"
              disabled={loading}
              onClick={() => {
                setLoading(true);
                signIn("spotify", {
                  callbackUrl: nextCallbackUrl(router.query.callbackUrl),
                });
              }}
            >
              Log in with Spotify
            </Button>
          </Grid>
        </Grid>
      </main>
    </>
  );
}
