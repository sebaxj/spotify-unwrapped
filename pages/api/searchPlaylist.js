import spotifyApi from "@/lib/spotify";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const { method } = req;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  await spotifyApi.setAccessToken(token.accessToken);

  switch (method) {
    case "GET":
      try {
        const query = req.query.q;
        const response = await spotifyApi.searchPlaylists(query);
        let items = response.body.playlists.items;
        res.status(200).json({ items });
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
