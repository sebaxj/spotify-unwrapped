import dbConnect from "@/lib/dbConnect";
import Artist from "@/models/Artist";
import { getToken } from "next-auth/jwt";
import spotifyApi from "@/lib/spotify";

export default async function handler(req, res) {
  const { method } = req;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  await Promise.all([spotifyApi.setAccessToken(token.accessToken), dbConnect()]);

  switch (method) {
    case "PUT":
      try {
        const {id, hometown, area} = req.body;
        const artistResponse = await spotifyApi.getArtist(id)
        // upsert artist based on id
        // const artist = await Artist.create({...artistResponse.body, hometown, area})
        const artist = await Artist.findOneAndUpdate({id}, {...artistResponse.body, hometown, area}, {upsert: true})
        return res.status(200).json({ success: true, artist: artist });
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
