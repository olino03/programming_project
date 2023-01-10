import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import L from "leaflet";

let DefaultIcon = L.icon({
  // iconUrl:
  //   "https://www.freepnglogos.com/uploads/among-us-png/green-among-us-png-character-0.png",
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Trash_Can.svg/1200px-Trash_Can.svg.png",
  shadowUrl: iconShadow,
  iconAnchor: [16, 37],
  iconSize: [50, 60],
});

L.Marker.prototype.options.icon = DefaultIcon;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
