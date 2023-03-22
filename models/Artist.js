import { Schema, model, models } from "mongoose";

const PointSchema = new Schema({
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  });

const ArtistSchema = new Schema(
  {

    // create two fields: hometown and area that are geojson objects
    hometown: { type: PointSchema, required: false},
    area: { type: PointSchema, required: false},

    id: { type: String, required: true, unique: true },
    
    external_urls: { 
        spotify: { type: String, required: true }
     },
    followers: {
        href: { type: String, required: false },
        total: { type: Number, required: true }
    },
    genres: { type: [String], required: true },
    href: { type: String, required: true },
    images: [
        {
            height: { type: Number, required: true },
            url: { type: String, required: true },
            width: { type: Number, required: true }
        }
    ],
    name: { type: String, required: true },
    popularity: { type: Number, required: true },
    type: { type: String, required: true },
    uri: { type: String, required: true },
    },
    
  { timestamps: true }
);

export default models.Artist || model("Artist", ArtistSchema);