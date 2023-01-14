import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "../css/map.css";
import Routing from "./Routing";

function EditableMarker({ id, position, editMarker, deleteMarker }) {
  const eventHandlers = useMemo(
    () => ({
      dragend: (event) => {
        editMarker(id, event.target._latlng);
      },
      contextmenu: (event) => {
        deleteMarker(id);
        event.originalEvent.preventDefault();
      },
    }),
    [editMarker, deleteMarker, id]
  );

  return (
    <Marker
      autoPan={true}
      eventHandlers={eventHandlers}
      draggable={true}
      position={position}
    ></Marker>
  );
}

function MapMarkers({ markers, setMarkers }) {
  useMapEvents({
    click({ latlng }) {
      const isThisMarkerTooCloseToAnother = markers.some(
        (marker) =>
          Math.abs(latlng.lat - marker.lat) < 0.0001 &&
          Math.abs(latlng.lng - marker.lng) < 0.0001
      );
      if (isThisMarkerTooCloseToAnother) return;

      const markersWithNewEntry = markers.concat(latlng);
      setMarkers(markersWithNewEntry);
    },
    contextmenu(event) {
      event.originalEvent.preventDefault();
    },
  });

  const editMarker = useCallback(
    (targetMarkerID, latitudeLongitude) => {
      setMarkers((markers) => {
        const updatedMarkers = markers.slice(0);
        updatedMarkers[targetMarkerID] = latitudeLongitude;
        return updatedMarkers;
      });
    },
    [setMarkers]
  );

  const deleteMarker = useCallback(
    (targetMarkerID) =>
      setMarkers((markers) => {
        const markersWithoutTarget = markers.filter(
          (_, markerID) => targetMarkerID !== markerID
        );
        return markersWithoutTarget;
      }),
    [setMarkers]
  );

  const allMarkerElements = useMemo(
    () =>
      markers.map((marker, i) => (
        <EditableMarker
          position={marker}
          key={i}
          id={i}
          editMarker={editMarker}
          deleteMarker={deleteMarker}
        ></EditableMarker>
      )),
    [markers, editMarker, deleteMarker]
  );

  return allMarkerElements;
}

export default function Map(props) {
  const { getMarkers } = props;

  const navigate = useNavigate();

  const routingRef = useRef();

  const [markers, setMarkers] = useState([
    [45.7494, 21.2272],
    [45.752433, 21.20704],
  ]);

  useEffect(() => {
    getMarkers(markers);
    if (routingRef.current) {
      routingRef.current.setWaypoints(markers);
      routingRef.current.hide();
    }
  }, [markers, routingRef]);

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[45.7494, 21.2272]}
        zoom={15}
        minZoom={13}
        scrollWheelZoom={true}
        className="map"
        maxBounds={[
          [45.683825, 21.111682],
          [45.834174, 21.327244],
        ]}
        doubleClickZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Routing waypoints={markers} ref={routingRef} />
        <MapMarkers markers={markers} setMarkers={setMarkers} />
      </MapContainer>
    </div>
  );
}