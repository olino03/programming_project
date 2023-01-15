import { useState } from "react";
import finishTask from "../utils/finishTask";
import { TaskTypeEnum } from "../utils/TaskTypeEnum";
import Map from "./Map";

export function Tasks({ userTasks, allowedTaskTypes }) {
  return userTasks?.taskTypes?.map(
    (taskType, i) =>
      allowedTaskTypes.some((allowedTaskType) => taskType === allowedTaskType) && (
        <Task
          key={`task__${i}`}
          taskID={userTasks.tasks[i].taskid}
          company={userTasks.tasks[i].company}
          claimed={userTasks.tasks[i].claimed}
          schedule={userTasks.tasks[i].schedule}
          waypoints={userTasks.tasks[i].waypoints}
          taskType={taskType}
        />
      )
  );
}

export function Task({ taskID, taskType, company, claimed, precalculatedRoutes, schedule, waypoints }) {
  const [isToggled, setToggle] = useState(false);

  return (
    <div className="task">
      <div className={`task-top ${isToggled ? "task-top-toggled" : ""}`}>
        <h2>Task #{taskID}</h2>

        <button className="see-details-toggle" onClick={() => setToggle(!isToggled)}>
          See {!isToggled ? "details" : "less"}
        </button>
        <h3>
          <div className="date-icon"></div>
          {new Date().toLocaleDateString()}
        </h3>
      </div>

      {isToggled && (
        <div className="task-content">
          <div className="pickup-points">
            <h3>Pick-up points</h3>
            <div className="task-pickup-locations">
              {waypoints.map(({ lat, lng }, i) => (
                <div className="data-tag" key={`action-tag__${i}`}>
                  {lat.toFixed(5)}, {lng.toFixed(5)}
                </div>
              ))}
            </div>
          </div>

          <div className="company-schedule-map">
            <div>
              <div className="task-company-name">
                <h3>Company name</h3>
                <div className="data-tag">{company}</div>
              </div>

              <div className="task-schedule">
                <h3>Schedule</h3>
                <div className="data-tag">{schedule[0]}</div>
                <div className="schedule-hours-connector"></div>
                <div className="data-tag">{schedule[1]}</div>
              </div>
            </div>

            <div className="task-map-preview">
              {(taskType === TaskTypeEnum.YOUR_TASKS || taskType === TaskTypeEnum.AVAILABLE_TASKS) && (
                <Map center={waypoints[0]} data={waypoints} editable={false} line={false} getMarkers={() => {}} />
              )}
              {(taskType === TaskTypeEnum.ONGOING_TASKS || taskType === TaskTypeEnum.FINISHED_TASKS) && (
                <Map center={waypoints[0]} data={waypoints} editable={false} line={true} getMarkers={() => {}} />
              )}
            </div>
          </div>
          {taskType === TaskTypeEnum.YOUR_TASKS && (
            <div className="task-buttons">
              <button
                className="task-button secondary-button"
                disabled={!claimed}
                onClick={() => {
                  if (!claimed) return;

                  finishTask(taskID).then(({ success, message }) => {
                    if (!success) {
                      alert(message || "Could not mark task as finished");
                      return;
                    }

                    window.location.reload();
                  });
                }}
              >
                Mark as finished
              </button>
              <button className="task-button secondary-button">Cancel</button>
            </div>
          )}
          {taskType === TaskTypeEnum.ONGOING_TASKS && <button className="task-button secondary-button">Cancel</button>}
          {taskType === TaskTypeEnum.AVAILABLE_TASKS && <button className="task-button secondary-button">Claim</button>}
        </div>
      )}
    </div>
  );
}
