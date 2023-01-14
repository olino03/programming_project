import L from "leaflet";
import "leaflet-routing-machine";

export const calculateRoute = async (waypoints) => {
  const r = L.Routing.control({
    waypoints: waypoints,
    autoRoute: true,
  });
  r.route();
  return new Promise((resolve, reject) => {
    r.on("routesfound", (e) => {
      resolve(e.routes[0].summary);
    });
  });
};

export const getGeocodedWaypoints = async (waypoints) => {
  const r = L.Routing.control({
    waypoints: waypoints,
    autoRoute: true,
  });
  r.route();
  return new Promise((resolve, reject) => {
    r.on("routesfound", (e) => {
      resolve(e.routes[0]);
    });
  });
};

// export const getGeocodedWaypoints = async (waypoints) => {
//   const r = L.Control.Geocoder
// };
