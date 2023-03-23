import { useSession } from "next-auth/react";
import Avatar from "./Avatar";
import {
  IconButton,
  InputBase,
  Paper,
  CircularProgress,
  Divider,
  Autocomplete,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";

export default function SearchBar({
  selectedPlaylist,
  setSelectedPlaylist,
  showGlobalPlaylists,
  setShowGlobalPlaylists,
}) {
  const { data: session, status } = useSession({ required: false });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("Recently Played");

  // three playlists that everyone has
  const basicOptions = [
    { name: "Recently Played", image: "./playlist/history.jpg", id: "recents" },
    { name: "Top Songs", image: "./playlist/top.jpg", id: "top" },
    {
      name: "Liked Songs",
      image: "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png",
      id: "liked",
    },
  ];

  // the playlists specific to a user, only retrieved once
  const [userOptions, setUserOptions] = useState([]);
  // the options that are displayed in the autocomplete, includes basicOptions and sometimes userOptions
  const [options, setOptions] = useState(basicOptions);

  const formatPlaylistResponse = (items) => {
    return items.map((item) => ({
      name: item.name,
      image: item.images[0]?.url, // maybe make a default option
      id: item.id,
    }));
  };

  const getUserPlaylists = async () => {
    // setLoading(true);
    const res = await fetch("/api/myPlaylists");
    const { items } = await res.json();
    const itemsFormatted = formatPlaylistResponse(items);
    setUserOptions(itemsFormatted);
    setOptions(basicOptions.concat(itemsFormatted));
    // setLoading(false);
  };

  const searchPlaylists = async () => {
    // setLoading(true);
    const res = await fetch("/api/searchPlaylist?q=" + query);
    const { items } = await res.json();
    const itemsFormatted = formatPlaylistResponse(items);
    setOptions(basicOptions.concat(itemsFormatted));
    // setLoading(false);
  };

  useEffect(() => {
    getUserPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (query !== "") {
      searchPlaylists();
    } else {
      setOptions(basicOptions.concat(userOptions));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  if (!session) {
    return;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 1,
        marginRight: "10px",
        marginTop: "15px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={showGlobalPlaylists}
              onChange={() => setShowGlobalPlaylists(!showGlobalPlaylists)}
            />
          }
          label="Show Global Playlists"
        ></FormControlLabel>
      </FormGroup>

      <>
        <Autocomplete
          options={options}
          inputValue={query}
          onInputChange={(e, value, reason) => {
            setQuery(value);
          }}
          defaultValue={options[0]}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          onChange={(e, value) => {
            if (!value) {
              setOptions(userOptions);
            }

            setSelectedPlaylist(value ? value.id : null);
          }}
          renderInput={(params) => {
            const selectedOption = options.find(
              (option) => option.id === selectedPlaylist
            );
            // setQuery(params.inputProps.value);
            return (
              <div ref={params.InputProps.ref}>
                <Paper
                  component="form"
                  sx={{
                    p: "5px 15px 5px 7px",
                    display: "flex",
                    alignItems: "center",
                    width: "300px",
                    borderRadius: "15px",
                    border: "1px solid gray",
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search for a playlist"
                    inputProps={{ "aria-label": "Search for a playlist" }}
                    {...params.inputProps}
                    startAdornment={
                      selectedOption ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedOption.image}
                          alt={selectedOption.name}
                          style={{
                            height: "30px",
                            width: "30px",
                            marginRight: "10px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <SearchIcon
                          style={{
                            height: "30px",
                            width: "30px",
                            marginRight: "10px",
                          }}
                        />
                      )
                    }
                  />
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <Avatar
                    style={{ marginLeft: "15px" }}
                    user={session?.user}
                    size={35}
                    noLink
                  />
                </Paper>
              </div>
            );
          }}
          renderOption={(props, option) => {
            return (
              <div
                style={{ display: "flex", flexDirection: "row" }}
                {...props}
                key={option.id}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={option.image}
                  alt={option.name}
                  style={{
                    height: "30px",
                    width: "30px",
                    marginRight: "10px",
                    objectFit: "cover",
                  }}
                />
                <Typography>{option.name}</Typography>
              </div>
            );
          }}
        />
      </>
    </div>
  );
}
