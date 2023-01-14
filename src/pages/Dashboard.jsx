import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Task from "../components/Task";
import "../css/Dashboard.css";
import topDecorationDashboardSVG from "../svg/top-decoration-dashboard.svg";
import getUserLoggedInState from "../utils/getUserLoggedInState";
import { TaskTypeEnum } from "../utils/TaskTypeEnum";
import Map from "../components/Map";

export default function Dashboard() {
  const [isClient, setIsClient] = useState(true);
  const [isNewTaskPaneOpen, setNewTaskPane] = useState(false);
  const toggleNewTaskPane = useCallback(
    () => setNewTaskPane(!isNewTaskPaneOpen),
    [isNewTaskPaneOpen]
  );
  const navigate = useNavigate();

  useEffect(() => {
    getUserLoggedInState().then(({ isLoggedIn, type }) =>
      !isLoggedIn ? navigate("/") : setIsClient(type === "Client")
    );
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    navigate("/");
  }, [navigate]);

  return (
    <>
      <div className="dashboard">
        <img
          className="top-decoration top-decoration-dashboard"
          alt="Top"
          src={topDecorationDashboardSVG}
        />

        {isClient ? (
          <ClientDashboard
            logout={logout}
            toggleNewTaskPane={toggleNewTaskPane}
          />
        ) : (
          <WorkerDashboard logout={logout} />
        )}
      </div>

      <div
        onClick={toggleNewTaskPane}
        className={`action-overlay ${
          isNewTaskPaneOpen ? "action-overlay-active" : ""
        }`}
      ></div>
      {isNewTaskPaneOpen && (
        <CreateNewTaskPane toggleNewTaskPane={toggleNewTaskPane} />
      )}
    </>
  );
}

function ClientDashboard({ logout, toggleNewTaskPane }) {
  return (
    <div className="type-dashboard">
      <div className="type-dashboard-left">
        <h1>Hello, [first name] [last name]</h1>
        <button className="main-button" onClick={toggleNewTaskPane}>
          Create a new task
        </button>
        <button
          className="secondary-button logout-dashboard-button"
          onClick={logout}
        >
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
  return (
    <div className="create-new-task">
      <form className="new-task-form-part">
        <div>
          <h2 style={{ marginTop: 0 }}>Pick-up points:</h2>
          <div className="data-tag">Str. Charles, nr. 7</div>
          <div className="data-tag">Str. Charles, nr. 7</div>
          <div className="data-tag">Str. Charles, nr. 7</div>
          <div className="data-tag">Str. Charles, nr. 7</div>
          <h2>Company name</h2>
          <input type="text" placeholder="Type your company name here" />
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

          <div className="new-task-form-buttons">
            <button className="main-button">Create</button>
            <button className="secondary-button" onClick={toggleNewTaskPane}>
              Cancel
            </button>
          </div>
        </div>
      </form>
      <div className="new-task-map-part">
        <Map getMarkers={() => {}} editable={true} line={false} />
      </div>
    </div>
  );
}

function WorkerDashboard({ logout }) {
  return (
    <div className="worker-dashboard type-dashboard">
      <div className="type-dashboard-left">
        <h1>Hello, [first name] [last name]</h1>
        <button
          className="secondary-button logout-dashboard-button"
          onClick={logout}
        >
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
