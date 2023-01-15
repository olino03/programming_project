import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateNewTaskPane from "../components/CreateNewTaskPane";
import { Tasks } from "../components/Tasks";
import "../css/Dashboard.css";
import topDecorationDashboardSVG from "../svg/top-decoration-dashboard.svg";
import fetchTasks from "../utils/fetchTasks";
import fetchWorkerTasks from "../utils/fetchWorkerTasks";
import getUserLoggedInState from "../utils/getUserLoggedInState";
import { TaskTypeEnum } from "../utils/TaskTypeEnum";

export default function Dashboard() {
  const [isClient, setIsClient] = useState(null);
  const [isNewTaskPaneOpen, setNewTaskPane] = useState(false);
  const toggleNewTaskPane = useCallback(() => setNewTaskPane(!isNewTaskPaneOpen), [isNewTaskPaneOpen]);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    fname: "loading",
    lname: "loading",
  });

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
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.clear();
    navigate("/");
  }, [navigate]);

  return (
    <>
      <div className="dashboard">
        <img className="top-decoration top-decoration-dashboard" alt="Top" src={topDecorationDashboardSVG} />
        {isClient !== null ? (
          isClient ? (
            <ClientDashboard userDetails={userDetails} logout={logout} toggleNewTaskPane={toggleNewTaskPane} />
          ) : (
            <WorkerDashboard userDetails={userDetails} logout={logout} />
          )
        ) : null}
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
  const [userTasks, setUserTasks] = useState(null);
  const getTaskTypeAmount = (taskTypes) =>
    userTasks?.taskTypes
      ? userTasks.taskTypes.reduce(
          (count, currentTaskType) => (taskTypes.some((taskType) => taskType === currentTaskType) ? count + 1 : count),
          0
        )
      : 0;

  useEffect(() => {
    fetchTasks().then((fetchedTasks) => fetchedTasks !== null && setUserTasks(fetchedTasks));
  }, []);

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

function WorkerDashboard({ logout, userDetails }) {
  const [userTasks, setUserTasks] = useState(null);

  const getTaskTypeAmount = (taskTypes) =>
    userTasks?.taskTypes
      ? userTasks.taskTypes.reduce(
          (count, currentTaskType) => (taskTypes.some((taskType) => taskType === currentTaskType) ? count + 1 : count),
          0
        )
      : 0;

  useEffect(() => {
    fetchWorkerTasks().then((fetchedTasks) => fetchedTasks !== null && setUserTasks(fetchedTasks));
  }, []);

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
