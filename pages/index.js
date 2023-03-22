import Head from "next/head";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import SearchBar from "@/components/SearchBar";

const Map = dynamic(() => import("../components/Map"), {
  loading: () => "Loading...",
  ssr: false,
});

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getMapBoxTypesFromMusicBrainz(musicbrainz) {
  switch (musicbrainz.type) {
    case "Country":
      return "country"
    case "Subdivision":
      return "region"
    case "City":
      return "place%2Cneighborhood"
    case "County":
      return "region%2Cdistrict"
    case "District":
      return "neighborhood%2Clocality"
    default:
      return "place%2Ccountry"
}
}

export default function Home() {
  const { data: session, status } = useSession({
    required: true,
  });

  const [list, setList] = useState([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([])
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(null)
  const [selectedPlaylist, setSelectedPlaylist] = useState("recents")

  const getPlaylist = async (playlist) => {
    setLoading(true);
    const res = await fetch("/api/recents?playlist=" + playlist);
    const { items } = await res.json();
    setList(items.map((item, index) => ({...item, index})));
    setLoading(false);
  };

  const getLocations = async () => {

    // filter out list items with hometown or area
    const filteredList = list.filter(item => !item.artists[0].hometown && !item.artists[0].area)

    const cachedList = list.filter(item => item.artists[0].hometown || item.artists[0].area)
    setMarkers(cachedList.map(item => {
      const hometown = item.artists[0].hometown
      const area = item.artists[0].area
      return {
        locationName: hometown ? hometown.name : area.name,
        longitude: hometown ? hometown.coordinates[0] : area.coordinates[0],
        latitude: hometown ? hometown.coordinates[1] : area.coordinates[1],
        image: item.artists[0].image,
        name: item.artists[0].name,
        index: item.index
      }
    }))

    filteredList.forEach(async (item, index) => {
      await timeout(1000 * index)
      const res = await fetch(`https://musicbrainz.org/ws/2/artist?fmt=json&query=${item.artists[0].name}&limit=1`) 
      const hello = await res.json()

      if (hello.count === 0) {
        return
      }

      let hometown
      let area

      
      const hometownName = (hello.artists[0]["begin-area"]) ? hello.artists[0]["begin-area"].name : null
      const areaName = (hello.artists[0].area) ? hello.artists[0].area.name : null


      if (hometownName) {
        const mapres = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${hometownName}.json?types=${getMapBoxTypesFromMusicBrainz(hello.artists[0]['begin-area'])}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`)
        const mapdata = await mapres.json()
        if (mapdata.features[0]) {
          hometown = {...mapdata.features[0].geometry, name: mapdata.features[0].place_name}
        }
      }

      if (areaName) {
        const mapres = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${areaName}.json?types=${getMapBoxTypesFromMusicBrainz(hello.artists[0].area)}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`)
        const mapdata = await mapres.json()
        if (mapdata.features[0]) {
          area = {...mapdata.features[0].geometry, name: mapdata.features[0].place_name}
        }
      }

        const response = await fetch("/api/addArtists", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: item.artists[0].id,
            // make mapres into a geojson
            ...(hometown && {hometown}),
            ...(area && {area}),
          }),
        });

        if (!hometown && !area) {
          return
        }

        
      setMarkers(markers => markers.concat([
        {
          locationName: hometown ? hometown.name : area.name,
          longitude: hometown ? hometown.coordinates[0] : area.coordinates[0],
          latitude: hometown ? hometown.coordinates[1] : area.coordinates[1],
          image: item.album.images[0].url,
          name: item.artists[0].name,
          tags: hello.artists[0].tags,
          index: item.index
        }
      ]))
    })
  }

  useEffect(() => {
    if (status === "authenticated") {
      if (selectedPlaylist === null) {
        return
      } else {
        getPlaylist(selectedPlaylist);
      }
    }
  }, [status, selectedPlaylist]);

  useEffect(() => {
    if (Object.keys(list[0]).length !== 0) {
      getLocations();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  return (
    <>
    <Head>
        <title>Music Map</title>
        <meta name="description" content="See where your music comes from" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Map markers={markers} activeMarkerIndex={activeMarkerIndex} setActiveMarkerIndex={setActiveMarkerIndex} />
      </div>
      
        <SearchBar selectedPlaylist={selectedPlaylist} setSelectedPlaylist={setSelectedPlaylist}/>
        <Sidebar loading={loading} list={list} activeMarkerIndex={activeMarkerIndex} setActiveMarkerIndex={setActiveMarkerIndex} />
    </>
  );
}
