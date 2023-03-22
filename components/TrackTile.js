import Image from "next/image";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Grid, Skeleton, Stack } from "@mui/material";

import spotifyLogo from "../public/spotify_white.png";

export default function TrackTile({ track, loading, selected }) {
  if (loading || !track) {
    return (
      <>
        <Card
          sx={{
            display: "flex",
            borderRadius: "0px 15px 15px 0px",
            marginTop: "15px",
          }}
          key={track?.id}
        >
          <Skeleton variant="rectangular" width={100} height={100} />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" variant="h6">
                <Skeleton width={200} />
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                <Skeleton width={100} />
              </Typography>
            </CardContent>
          </Box>
        </Card>
      </>
    );
  }

  return (
    <>
      <Card
        sx={{
          display: "flex",
          borderRadius: "0px 15px 15px 0px",
          marginTop: "15px",
          width: "100%",
          // have an awesome dark multicolor gradient background if selected
          // let the colors be pink blue and green
          ...(selected && { background: "linear-gradient(45deg, #FE7B8B 30%, #FF9E53 90%)" }),
        }}
        key={track?.id}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={track?.album.images[1]?.url}
          width={100}
          height={100}
          alt="album image"
        />

        <CardContent
          sx={{
            paddingTop: "16px",
            paddingBottom: "0px !important",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
          key={track?.id}
        >
          <Typography noWrap component="div" variant="h6">
            {track?.name}
          </Typography>

          <Box
            sx={{
              overflow: "hidden",
              display: "flex",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <Typography
              noWrap
              component="div"
              variant="subtitle1"
              color="text.secondary"
            >
              {track?.artists.map((artist) => artist.name).join(", ")}
            </Typography>

            <div style={{ marginLeft: "auto" }}>
              <SpotifyButton track={track} />
            </div>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

function SpotifyButton({ track }) {
    return (
      <a
        href={track.external_urls.spotify}
        target="_blank"
        rel="noreferrer"
      >
        <Image
          style={{ marginTop: "10px", marginLeft: "10px" }}
          src={spotifyLogo}
          width={21}
          height={21}
          alt="spotify logo"
          priority
        />
      </a>
    );
}
