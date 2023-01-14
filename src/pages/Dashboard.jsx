import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import Task from "../components/Task";
import "../css/Dashboard.css";
import topDecorationDashboardSVG from "../svg/top-decoration-dashboard.svg";
import getUserLoggedInState from "../utils/getUserLoggedInState";
import { TaskTypeEnum } from "../utils/TaskTypeEnum";

export default function Dashboard() {
  const [isClient, setIsClient] = useState(true);
  const [isNewTaskPaneOpen, setNewTaskPane] = useState(false);
  const toggleNewTaskPane = useCallback(() => setNewTaskPane(!isNewTaskPaneOpen), [isNewTaskPaneOpen]);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ fname: "loading", lname: "loading" });

  useEffect(() => {
    window.scrollTo(0, 0);
    getUserLoggedInState().then(({ isLoggedIn, type, fname, lname }) => {
      if (!isLoggedIn) {
        navigate("/");
        return;
      }

      console.log(fname, lname);
      setIsClient(type === "Client");
      setUserDetails({
        fname: (fname ?? localStorage.getItem("fname")) || "loading",
        lname: (lname ?? localStorage.getItem("lname")) || "loading",
      });
    });
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.clear();
    navigate("/");
  }, [navigate]);

  return (
    <>
      <div className="dashboard">
        <img className="top-decoration top-decoration-dashboard" alt="Top" src={topDecorationDashboardSVG} />

        {isClient ? (
          <ClientDashboard userDetails={userDetails} logout={logout} toggleNewTaskPane={toggleNewTaskPane} />
        ) : (
          <WorkerDashboard userDetails={userDetails} logout={logout} />
        )}
      </div>

      <div
        onClick={toggleNewTaskPane}
        className={`action-overlay ${isNewTaskPaneOpen ? "action-overlay-active" : ""}`}
      ></div>
      {isNewTaskPaneOpen && <CreateNewTaskPane toggleNewTaskPane={toggleNewTaskPane} />}
    </>
  );
}

function ClientDashboard({ logout, userDetails, toggleNewTaskPane }) {
  return (
    <div className="type-dashboard">
      <div className="type-dashboard-left">
        <h1>
          Hello, {userDetails.fname} {userDetails.lname}
        </h1>
        <button className="main-button" onClick={toggleNewTaskPane}>
          Create a new task
        </button>
        <button className="secondary-button logout-dashboard-button" onClick={logout}>
          Log out
        </button>
      </div>
      <div className="type-dashboard-right">
        <div className="dashboard-right-section your-tasks">
          <div className="section-top first-section-top">
            <h2>Your tasks (4)</h2>
          </div>

          <Task taskID={57182} taskType={TaskTypeEnum.YOUR_TASKS} />
          <Task taskID={57182} taskType={TaskTypeEnum.YOUR_TASKS} />
        </div>
        <div className="dashboard-right-section finished-tasks">
          <div className="section-top finished-tasks-top">
            <h2>Finished tasks (3)</h2>
          </div>
          <Task taskID={57182} taskType={TaskTypeEnum.FINISHED_TASKS} />
          <Task taskID={57182} taskType={TaskTypeEnum.FINISHED_TASKS} />
          <Task taskID={57182} taskType={TaskTypeEnum.FINISHED_TASKS} />
        </div>
      </div>
    </div>
  );
}

function CreateNewTaskPane({ toggleNewTaskPane }) {
  const [markers, setMarkers] = useState([]);
  // const [pickupPoints, setPickup] = useState([]);
  const [newCenter, setCenter] = useState([45.7494, 21.2272]);

  useEffect(() => {
    // console.log(markers);
    // generateSummaryArray(markers);
    // getGeocodedWaypoints(markers).then((p) => {
    //   // setPickup(p);
    //   console.log(p);
    // });
  }, [markers]);

  /*const generateSummaryArray = async (waypoints) => {
    let data = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
      for (let j = i + 1; j <= waypoints.length - 1; j++) {
        // console.log(i, j);
        const routeData = await calculateRoute([waypoints[i], waypoints[j]]);
        // console.log(routeData);
        data.push({
          waypoints: [
            [waypoints[i].lat, waypoints[i].lng],
            [waypoints[j].lat, waypoints[j].lng],
          ],
          distance: routeData["totalDistance"],
          time: routeData["totalTime"],
        });
      }
    }
    return data;
  };
*/
  return (
    <div className="create-new-task">
      <form className="new-task-form-part">
        <h2 style={{ marginTop: 0 }}>Pick-up points:</h2>
        <div className="new-task-pickup-points">
          {markers.length === 0 ? (
            <div className="data-tag">
              {"<"}None selected{">"}
            </div>
          ) : (
            markers.map((p, i) => (
              <div className="data-tag" tabIndex={i} key={markers.indexOf(p)} onClick={() => setCenter([p.lat, p.lng])}>
                {p.lat.toFixed(5)},{p.lng.toFixed(5)}
              </div>
            ))
          )}
        </div>
        <div>
          <h2>Company name</h2>
          <input type="text" placeholder="Type your company name here" />
        </div>

        <div>
          <h2>Schedule:</h2>
          <div className="new-task-schedule-inputs">
            <div>
              <label>From</label>
              <select>
                <option>12:00</option>
                <option>13:00</option>
                <option>14:00</option>
              </select>
            </div>

            <div>
              <label>To</label>
              <select>
                <option>12:00</option>
                <option>13:00</option>
                <option>14:00</option>
              </select>
            </div>
          </div>
        </div>

        <div className="new-task-form-buttons">
          <button className="main-button" type="button">
            Create
          </button>
          <button className="secondary-button" onClick={toggleNewTaskPane}>
            Cancel
          </button>
        </div>
      </form>
      <div className="new-task-map-part">
        <Map getMarkers={setMarkers} editable={true} line={false} center={newCenter} />
      </div>
    </div>
  );
}

function WorkerDashboard({ logout, userDetails }) {
  return (
    <div className="worker-dashboard type-dashboard">
      <div className="type-dashboard-left">
        <h1>
          Hello, {userDetails.fname} {userDetails.lname}
        </h1>
        <button className="secondary-button logout-dashboard-button" onClick={logout}>
          Log out
        </button>
      </div>
      <div className="type-dashboard-right">
        <div className="dashboard-right-section">
          <div className="section-top first-section-top">
            <h2>Available tasks (4)</h2>
          </div>

          <Task taskID={57182} taskType={TaskTypeEnum.AVAILABLE_TASKS} />
          <Task taskID={57182} taskType={TaskTypeEnum.AVAILABLE_TASKS} />
        </div>
        <div className="dashboard-right-section">
          <div className="section-top">
            <h2>On-going tasks (3)</h2>
          </div>
          <Task taskID={57182} taskType={TaskTypeEnum.ONGOING_TASKS} />
          <Task taskID={57182} taskType={TaskTypeEnum.ONGOING_TASKS} />
          <Task taskID={57182} taskType={TaskTypeEnum.ONGOING_TASKS} />
        </div>
        <div className="dashboard-right-section">
          <div className="section-top">
            <h2>Finished tasks (1)</h2>
          </div>
          <Task taskID={57182} taskType={TaskTypeEnum.FINISHED_TASKS} />
        </div>
      </div>
    </div>
  );
}
