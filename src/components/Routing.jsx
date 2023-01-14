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
  return routeC;
};

const Routing = createControlComponent(routeControl);

export default Routing;
