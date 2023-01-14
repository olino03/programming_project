import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

let routeC = null;

const routeControl = (props) => {
  routeC = L.Routing.control({
    waypoints: props.waypoints,
    autoRoute: true,
    lineOptions: {
      styles: [
        {
          color: "red",
          display: "none",
          weight: 5,
        },
      ],
    },
    collapsible: true,
    createMarker: (p1, p2) => {},
  });
  // console.log(props.line);
  // if (!props.line) routeC.remove();
  // routeC.on("routesfound", (e) => {
  //   // console.log(e);
  // });
  //   routeC.hide();
  // console.log(
  //   calculateRoute([
  //     [45.7494, 21.2272],
  //     [45.752433, 21.20704],
  //   ])
  // );
  return routeC;
};

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

// routeC.hide();

// const routeItinerary = L.Routing.itinerary.hide();

const Routing = createControlComponent(routeControl);

export default Routing;
