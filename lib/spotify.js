import SpotifyWebApi from "spotify-web-api-node";

// allow to read liked songs
const scopes = ["user-read-email", "user-read-recently-played", "user-top-read", "user-library-read"].join(",");

const params = {
  scope: scopes,
};

const queryParamString = new URLSearchParams(params).toString();

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString}`;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export default spotifyApi;

export { LOGIN_URL };
