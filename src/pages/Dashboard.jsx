import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import { Tasks } from "../components/Tasks";
import "../css/Dashboard.css";
import topDecorationDashboardSVG from "../svg/top-decoration-dashboard.svg";
import { calculateRoute } from "../utils/calculateRoute";
import fetchAllTasks from "../utils/fetchAllTasks";
import fetchTasks from "../utils/fetchTasks";
import getUserLoggedInState from "../utils/getUserLoggedInState";
import { TaskTypeEnum } from "../utils/TaskTypeEnum";

export default function Dashboard() {
  const [isClient, setIsClient] = useState(true);
  const [isNewTaskPaneOpen, setNewTaskPane] = useState(false);
  const toggleNewTaskPane = useCallback(() => setNewTaskPane(!isNewTaskPaneOpen), [isNewTaskPaneOpen]);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    fname: "loading",
    lname: "loading",
  });
  const [userTasks, setUserTasks] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    getUserLoggedInState().then(({ isLoggedIn, type, fname, lname }) => {
      if (!isLoggedIn) {
        navigate("/");
        return;
      }

      setIsClient(type === "Client");
      setUserDetails({
        fname: (fname ?? localStorage.getItem("fname")) || "loading",
        lname: (lname ?? localStorage.getItem("lname")) || "loading",
      });
    });
  }, []);

  useEffect(() => {
    if (isClient) fetchTasks().then((fetchedTasks) => fetchedTasks !== null && setUserTasks(fetchedTasks));
    else fetchAllTasks().then((fetchedTasks) => fetchedTasks !== null && setUserTasks(fetchedTasks));
  }, [isClient]);

  const logout = useCallback(() => {
    localStorage.clear();
    navigate("/");
  }, []);

  return (
    <>
      <div className="dashboard">
        <img className="top-decoration top-decoration-dashboard" alt="Top" src={topDecorationDashboardSVG} />

        {isClient ? (
          <ClientDashboard
            userTasks={userTasks}
            userDetails={userDetails}
            logout={logout}
            toggleNewTaskPane={toggleNewTaskPane}
          />
        ) : (
          <WorkerDashboard userTasks={userTasks} userDetails={userDetails} logout={logout} />
        )}
      </div>

      <div
        onClick={toggleNewTaskPane}
        className={`action-overlay ${isNewTaskPaneOpen ? "action-overlay-active" : ""}`}
      ></div>
      {isNewTaskPaneOpen && <CreateNewTaskPane setUserTasks={setUserTasks} toggleNewTaskPane={toggleNewTaskPane} />}
    </>
  );
}

function ClientDashboard({ userTasks, logout, userDetails, toggleNewTaskPane }) {
  const getTaskTypeAmount = (taskTypes) =>
    userTasks?.taskTypes
      ? userTasks.taskTypes.reduce(
          (count, currentTaskType) => (taskTypes.some((taskType) => taskType === currentTaskType) ? count + 1 : count),
          0
        )
      : 0;

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
            <h2>Your tasks ({getTaskTypeAmount([TaskTypeEnum.YOUR_TASKS, TaskTypeEnum.AVAILABLE_TASKS])})</h2>
          </div>
          <Tasks userTasks={userTasks} allowedTaskTypes={[TaskTypeEnum.YOUR_TASKS, TaskTypeEnum.AVAILABLE_TASKS]} />
        </div>
        <div className="dashboard-right-section finished-tasks">
          <div className="section-top finished-tasks-top">
            <h2>Finished tasks ({getTaskTypeAmount([TaskTypeEnum.FINISHED_TASKS])})</h2>
          </div>
          <Tasks userTasks={userTasks} allowedTaskTypes={[TaskTypeEnum.FINISHED_TASKS]} />
        </div>
      </div>
    </div>
  );
}

function CreateNewTaskPane({ toggleNewTaskPane, setUserTasks }) {
  const [markers, setMarkers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [newCenter, setCenter] = useState([45.7494, 21.2272]);
  const [formData, setFormData] = useState({
    company: "",
    schedule: ["12:00", "12:00"],
    waypoints: [],
  });

  const generateSummaryArray = async (waypoints) => {
    let data = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
      for (let j = i + 1; j <= waypoints.length - 1; j++) {
        const routeData = await calculateRoute([waypoints[i], waypoints[j]]);

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
    return JSON.stringify({ data: data });
  };

  const sendTaskData = useCallback(async () => {
    if (
      Object.values(formData).some((datum) => typeof datum !== "object" && datum.toString().trim() === "") ||
      markers.length === 0
    ) {
      alert("You left a field incomplete.");
      return;
    }

    setLoading(true);
    try {
      const taskSendResponse = await fetch("http://localhost:5000/createTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          waypoints: markers,
          email: localStorage.getItem("email") ?? "",
          data: await generateSummaryArray(markers),
        }),
      }).then((response) => response.json());

      if (taskSendResponse?.success) {
        setLoading(false);
        toggleNewTaskPane();
        fetchTasks().then((fetchedTasks) => fetchedTasks !== null && setUserTasks(fetchedTasks));
        alert("Task created successfully.");
        return;
      }

      if (taskSendResponse) alert(taskSendResponse.message);
      else alert("Sorry, but the task data could not be sent.");

      setLoading(false);
    } catch (error) {
      alert("Sorry, but the task data could not be sent.");
      console.error(error);
      setLoading(false);
    }
  }, [formData, markers]);

  return (
    <>
      {isLoading && (
        <div className="create-task-loading-screen">
          <h1>Sending task...</h1>
        </div>
      )}
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
                <div
                  className="data-tag"
                  tabIndex={i}
                  key={markers.indexOf(p)}
                  onClick={() => setCenter([p.lat, p.lng])}
                >
                  {p.lat.toFixed(5)},{p.lng.toFixed(5)}
                </div>
              ))
            )}
          </div>
          <div>
            <h2>Company name</h2>
            <input
              type="text"
              onChange={({ target: { value } }) => setFormData({ ...formData, company: value })}
              placeholder="Type your company name here"
            />
          </div>

          <div>
            <h2>Schedule:</h2>
            <div className="new-task-schedule-inputs">
              <div>
                <label>From</label>
                <select
                  onChange={({ target: { value } }) =>
                    setFormData({
                      ...formData,
                      schedule: [value, formData.schedule[1]],
                    })
                  }
                >
                  <option>12:00</option>
                  <option>13:00</option>
                  <option>14:00</option>
                  <option>15:00</option>
                  <option>16:00</option>
                  <option>17:00</option>
                  <option>18:00</option>
                  <option>19:00</option>
                  <option>20:00</option>
                </select>
              </div>

              <div>
                <label>To</label>
                <select
                  onChange={({ target: { value } }) =>
                    setFormData({
                      ...formData,
                      schedule: [formData.schedule[0], value],
                    })
                  }
                >
                  <option>12:00</option>
                  <option>13:00</option>
                  <option>14:00</option>
                  <option>15:00</option>
                  <option>16:00</option>
                  <option>17:00</option>
                  <option>18:00</option>
                  <option>19:00</option>
                  <option>20:00</option>
                </select>
              </div>
            </div>
          </div>

          <div className="new-task-form-buttons">
            <button className="main-button" type="button" onClick={sendTaskData}>
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
    </>
  );
}

function WorkerDashboard({ userTasks, logout, userDetails }) {
  const getTaskTypeAmount = (taskTypes) =>
    userTasks?.taskTypes
      ? userTasks.taskTypes.reduce(
          (count, currentTaskType) => (taskTypes.some((taskType) => taskType === currentTaskType) ? count + 1 : count),
          0
        )
      : 0;

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
            <h2>Available tasks ({getTaskTypeAmount([TaskTypeEnum.YOUR_TASKS, TaskTypeEnum.AVAILABLE_TASKS])})</h2>
          </div>

          <Tasks userTasks={userTasks} allowedTaskTypes={[TaskTypeEnum.YOUR_TASKS, TaskTypeEnum.AVAILABLE_TASKS]} />
        </div>
        <div className="dashboard-right-section">
          <div className="section-top">
            <h2>On-going tasks ({getTaskTypeAmount([TaskTypeEnum.ONGOING_TASKS])})</h2>
          </div>
          <Tasks userTasks={userTasks} allowedTaskTypes={[TaskTypeEnum.ONGOING_TASKS]} />
        </div>
        <div className="dashboard-right-section">
          <div className="section-top">
            <h2>Finished tasks ({getTaskTypeAmount([TaskTypeEnum.FINISHED_TASKS])})</h2>
          </div>
          <Tasks userTasks={userTasks} allowedTaskTypes={[TaskTypeEnum.FINISHED_TASKS]} />
        </div>
      </div>
    </div>
  );
}
