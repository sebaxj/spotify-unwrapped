import { IconButton, Stack, Typography } from "@mui/material";
import * as React from "react";
import Map, { Marker, Popup } from "react-map-gl";
import globalPlaylists from "../playlistData.json";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export default function MapBox({
  markers,
  activeMarkerIndex,
  setActiveMarkerIndex,
  showGlobalPlaylists,
}) {
  const mapRef = React.useRef(null);
  const popupInfo = markers.find(
    (marker) => marker.index === activeMarkerIndex
  );

  function flyToNewCenter(newActiveMarkerIndex) {
    const newPopupInfo = markers.find(
      (marker) => marker.index === newActiveMarkerIndex
    );
    mapRef.current?.flyTo({
      center: [newPopupInfo.longitude, newPopupInfo.latitude],
      // zoom: 2,
      speed: 1,
      curve: 1,
      easing: (t) => t,
    });
  }

  React.useEffect(() => {
    if (activeMarkerIndex !== null) {
      flyToNewCenter(activeMarkerIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMarkerIndex]);

  return (
    <Map
      initialViewState={{
        longitude: -100,
        latitude: 40,
        zoom: 2,
      }}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      attributionControl={false}
      logoPosition="bottom-right"
      ref={mapRef}
    >
      {/* MARKERS OF MUSIC FROM SPOTIFY */}
      {markers.map((marker, index) => {
        return (
          <Marker
            key={index}
            longitude={marker.longitude}
            latitude={marker.latitude}
            color={stringToColor(marker.name)}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setActiveMarkerIndex(marker.index);
            }}
          />
        );
      })}

      {/* MARKERS FROM PLAYLISTS OF THE WORLD */}
      {showGlobalPlaylists &&
        globalPlaylists.map((country, index) => {
          return (
            <Marker
              key={index}
              longitude={country.lng}
              latitude={country.lat}
              color={"ffffff"}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                // setPopupInfo(country);
                window.open(`https://open.spotify.com${country.url}`, "_blank");
              }}
            />
          );
        })}

      {/* POPUP FOR MARKERS */}
      {popupInfo && (
        <Popup
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onClose={() => setActiveMarkerIndex(null)}
          closeButton={false}
          maxWidth={"300px"}
        >
          <Stack direction="row" spacing={1} sx={{ marginBottom: "10px" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "black" }}
            >
              {popupInfo.name}
            </Typography>
            <IconButton
              component="a"
              target="_blank"
              href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${popupInfo.name}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={"/Wikipedia-logo-v2.svg"}
                alt="logo"
                width={30}
                height={30}
                priority
              />
            </IconButton>
          </Stack>
          <Typography variant="subtitle1" sx={{ color: "black" }}>
            {popupInfo.locationName}
          </Typography>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img width="100%" src={popupInfo.image} alt={"album image"} />
        </Popup>
      )}
    </Map>
  );
}
