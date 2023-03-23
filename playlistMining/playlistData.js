const data = [
  ["Global", "/playlist/37i9dQZEVXbNG2KDcFcKOF"],
  ["Argentina", "/playlist/37i9dQZEVXbKPTKrnFPD0G"],
  ["Australia", "/playlist/37i9dQZEVXbK4fwx2r07XW"],
  ["Austria", "/playlist/37i9dQZEVXbM1EaZ0igDlz"],
  ["Belarus", "/playlist/37i9dQZEVXbLRLeF2cVSaP"],
  ["Belgium", "/playlist/37i9dQZEVXbND4ZYa46PaA"],
  ["Brazil", "/playlist/37i9dQZEVXbKzoK95AbRy9"],
  ["Canada", "/playlist/37i9dQZEVXbMda2apknTqH"],
  ["Chile", "/playlist/37i9dQZEVXbLJ0paT1JkgZ"],
  ["Colombia", "/playlist/37i9dQZEVXbL1Fl8vdBUba"],
  ["Denmark", "/playlist/37i9dQZEVXbMw2iUtFR5Eq"],
  ["Ecuador", "/playlist/37i9dQZEVXbJPVQvqZqpcM"],
  ["Egypt", "/playlist/37i9dQZEVXbMy2EcFg5F9m"],
  ["Finland", "/playlist/37i9dQZEVXbJQ9kF73GOT2"],
  ["France", "/playlist/37i9dQZEVXbKQ1ogMOyW9N"],
  ["Germany", "/playlist/37i9dQZEVXbK8BKKMArIyl"],
  ["Guatemala", "/playlist/37i9dQZEVXbJHSzlHx2ZJU"],
  ["Hungary", "/playlist/37i9dQZEVXbMYsavqzfk6k"],
  ["India", "/playlist/37i9dQZEVXbMWDif5SCBJq"],
  ["Indonesia", "/playlist/37i9dQZEVXbIZK8aUquyx8"],
  ["Ireland", "/playlist/37i9dQZEVXbJIvhIOxXxdp"],
  ["Israel", "/playlist/37i9dQZEVXbJ5J1TrbkAF9"],
  ["Italy", "/playlist/37i9dQZEVXbJUPkgaWZcWG"],
  ["Japan", "/playlist/37i9dQZEVXbKqiTGXuCOsB"],
  ["Kazakhstan", "/playlist/37i9dQZEVXbLeBcWrdps2V"],
  ["Malaysia", "/playlist/37i9dQZEVXbKcS4rq3mEhp"],
  ["Mexico", "/playlist/37i9dQZEVXbKUoIkUXteF6"],
  ["Morocco", "/playlist/37i9dQZEVXbNM8vS9cIqAG"],
  ["Netherlands", "/playlist/37i9dQZEVXbK4BFAukDzj3"],
  ["Nigeria", "/playlist/37i9dQZEVXbLw80jjcctV1"],
  ["Norway", "/playlist/37i9dQZEVXbLWYFZ5CkSvr"],
  ["Pakistan", "/playlist/37i9dQZEVXbNy9tB5elXf1"],
  ["Panama", "/playlist/37i9dQZEVXbNSiWnkYnziz"],
  ["Peru", "/playlist/37i9dQZEVXbMGcjiWgg253"],
  ["Philippines", "/playlist/37i9dQZEVXbJVKdmjH0pON"],
  ["Poland", "/playlist/37i9dQZEVXbMZ5PAcNTDXd"],
  ["Romania", "/playlist/37i9dQZEVXbMeCoUmQDLUW"],
  ["Singapore", "/playlist/37i9dQZEVXbN66FupT0MuX"],
  ["Slovakia", "/playlist/37i9dQZEVXbMwW10JmAnzE"],
  ["Spain", "/playlist/37i9dQZEVXbJwoKy8qKpHG"],
  ["Sweden", "/playlist/37i9dQZEVXbKVvfnL1Us06"],
  ["Switzerland", "/playlist/37i9dQZEVXbKx6qX9uN66j"],
  ["Taiwan", "/playlist/37i9dQZEVXbMVY2FDHm6NN"],
  ["Thailand", "/playlist/37i9dQZEVXbJ7qiJCES5cj"],
  ["Turkey", "/playlist/37i9dQZEVXbJARRcHjHcAr"],
  ["UAE", "/playlist/37i9dQZEVXbIZQf3WEYSut"],
  ["USA", "/playlist/37i9dQZEVXbLp5XoPON0wI"],
  ["Ukraine", "/playlist/37i9dQZEVXbNcoJZ65xktI"],
  ["Venezuela", "/playlist/37i9dQZEVXbNvXzC8A6ysJ"],
  ["Vietnam", "/playlist/37i9dQZEVXbKZyn1mKjmIl"],
];

const cleaned = data.map(async (item) => {
  const mapres = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${
      item[0]
    }.json?types=place%2Ccountry&access_token=${"pk.eyJ1IjoiY29ubm9yaG9nYW4iLCJhIjoiY2xlZXRzMzhjMDFzOTNybXFpMDNna2g0NSJ9.uJPkqfdUrU4AtCmv9CBAIg"}`
  );
  const mapdata = await mapres.json();
  return {
    country: item[0],
    url: item[1],
    lat: mapdata.features[0].center[1],
    lng: mapdata.features[0].center[0],
  };
});
