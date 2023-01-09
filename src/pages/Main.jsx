import { LatLng } from "leaflet";
import { useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import "../css/Main.css";

function EditableMarker(props) {
  const { id, position, editMarker, deleteMarker } = props;
  const [clicked, setClicked] = useState(false);
  const [clickTimeout, setClickTimeout] = useState();

  //   const markerRef = useRef(null);
  // const eH
  //   useMapEvents({
  //     dragEnd: (e) => {
  //       editMarker(id, e.latlng);
  //       console.log(e);
  //     },
  //   });
  const eventHandlers = {
    dragend: (e) => {
      //   console.log(e.target._latlng);
      editMarker(id, e.target._latlng);
    },
    click: (e) => {
      //   console.log(clickTimeout);
      if (!clicked) {
        setClicked(true);
        setClickTimeout(
          setTimeout(() => {
            setClicked(false);
          }, 300)
        );
      } else {
        // console.log("double click");
        deleteMarker(id);
        clearTimeout(clickTimeout);
        setClicked(false);
      }
    },
  };

  return (
    <Marker
      autoPan={true}
      eventHandlers={eventHandlers}
      draggable={true}
      position={position}
    ></Marker>
  );
}

function MapMarkers(props) {
  const { setMapPoints } = props;

  const [markers, setMarkers] = useState([[45.7494, 21.2272]]);

  useMapEvents({
    click(e) {
      //   console.log(e);
      let _markers = [...markers];
      _markers.push(e.latlng);
      setMarkers(_markers);
      setMapPoints(_markers);
    },
  });

  const editMarker = (id, latlng) => {
    // console.log(id);
    let _markers = [...markers];
    _markers[id] = latlng;
    // console.log(_markers);
    setMarkers(_markers);
    setMapPoints(_markers);
  };

  const deleteMarker = (id) => {
    let _markers = [...markers];
    _markers.splice(id, 1);
    setMarkers(_markers);
    setMapPoints(_markers);
  };

  return (
    <>
      {markers.map((marker, i) => (
        <EditableMarker
          position={marker}
          key={i}
          id={i}
          editMarker={editMarker}
          deleteMarker={deleteMarker}
        ></EditableMarker>
      ))}
    </>
  );
}

export default function Main() {
  const [mapPoints, setMapPoints] = useState([[45.7494, 21.2272]]);

  //   const [markers, setMarkers] = useState([[45.7494, 21.2272]]);

  //   useMapEvents({
  //     click(e) {
  //       let _markers = [...markers];
  //       _markers.push(e.latlng);
  //       setMarkers(_markers);
  //     },
  //   });

  return (
    <div className="mainPage">
      <div className="menu">buttons</div>
      <MapContainer
        center={[45.7494, 21.2272]}
        zoom={15}
        // maxZoom={20}
        minZoom={10}
        scrollWheelZoom={true}
        className="map"
        maxBounds={[
          [45.683825, 21.111682],
          [45.834174, 21.327244],
        ]}
        doubleClickZoom={false}
        // maxBoundsViscosity={0}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapMarkers setMapPoints={setMapPoints} />
      </MapContainer>
      <div className="logs">
        <h1>Map Points:</h1>
        <p>{mapPoints.join("\n")}</p>
      </div>
    </div>
  );
}
