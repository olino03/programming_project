import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Main.css";
import Map from "../components/Map";
import { calculateRoute } from "../utils/calculateRoute";

export default function Main() {
  const navigate = useNavigate();
  const [markers, setMarkers] = useState([]);

  const getMarkers = (markers) => {
    setMarkers(markers);
  };

  // const waypoints = [
  //   [45.7494, 21.2272],
  //   [45.752433, 21.20704],
  //   [45.753451025581775, 21.231252751945977],
  //   [45.75614592646953, 21.225058547362323],
  //   [45.75740350234746, 21.231028466175978],
  // ];

  useEffect(() => {
    generateSummaryArray(markers);
  }, [markers]);

  const generateSummaryArray = async (waypoints) => {
    let data = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
      for (let j = i + 1; j <= waypoints.length - 1; j++) {
        // console.log(i, j);
        const routeData = await calculateRoute([waypoints[i], waypoints[j]]);
        // console.log(routeData);
        data.push({
          waypoints: [waypoints[i], waypoints[j]],
          distance: routeData["totalDistance"],
          time: routeData["totalTime"],
        });
      }
    }
    console.log(data);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    navigate("/");
  }, [navigate]);

  return (
    <div className="main-page">
      <div className="menu">
        <button onClick={logout} className="main-button get-started">
          Log out
        </button>
        <h1>Map Points:</h1>
        <p>{markers.join("\n")}</p>
      </div>
      <div className="logs">
        <div className="mapp">
          <Map getMarkers={getMarkers} editable={true} line={false} />
        </div>
      </div>
    </div>
  );
}
