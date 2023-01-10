import leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import markerIcon from "./svg/trash-can.svg";

const trashCanMarkerIcon = leaflet.icon({
  iconUrl: markerIcon,
  iconAnchor: [25, 37],
  iconSize: [50, 60],
});

leaflet.Marker.prototype.options.icon = trashCanMarkerIcon;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
