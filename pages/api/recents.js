import dbConnect from "@/lib/dbConnect";
import spotifyApi from "@/lib/spotify";
import { getToken } from "next-auth/jwt";
import Artist from "@/models/Artist";

export default async function handler(req, res) {
  const { method } = req;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  await Promise.all([spotifyApi.setAccessToken(token.accessToken), dbConnect()])

  switch (method) {
    case "GET":
      try {
        console.log("IN DA MIX", req.query)
        const playlistId = req.query.playlist
        let response, items, count;
        switch (playlistId) {
          case "recents":
            response = await spotifyApi.getMyRecentlyPlayedTracks({limit: 50});
            items = response.body.items.map(item => item.track)
            count = response.body.total
            break;
          case "top":
            response = await spotifyApi.getMyTopTracks({limit: 50});
            items = response.body.items
            count = response.body.total
            break;
          case "liked":
            response = await spotifyApi.getMySavedTracks({limit: 50});
            items = response.body.items.map(item => item.track)
            count = response.body.total
            break;
          default:
            response = await spotifyApi.getPlaylist(playlistId)
            items = response.body.tracks.items.map(item => item.track)
            count = response.body.tracks.total
            break;
        }
        // const response = await spotifyApi.getMyRecentlyPlayedTracks({limit: 50});
        // const response = await spotifyApi.getMyTopTracks({limit: 50});
        // console.log(response.body.items)
        // let items = response.body.items;

        const artists = await Artist.find({id: {$in: items.map(item => item.artists[0].id)}})

        items = items.map(item => {
          // console.log(item)
          item.artists[0].hometown = artists.find(artist => artist.id === item.artists[0].id)?.hometown
          item.artists[0].area = artists.find(artist => artist.id === item.artists[0].id)?.area
          item.artists[0].image = artists.find(artist => artist.id === item.artists[0].id)?.images[0]?.url
          return item
        })

        res.status(200).json({ items, count });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
