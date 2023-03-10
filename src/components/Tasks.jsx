import { useCallback, useState } from "react";
import cancelTaskClient from "../utils/cancelTaskClient";
import cancelTaskWorker from "../utils/cancelTaskWorker";
import claimTask from "../utils/claimTask";
import finishTask from "../utils/finishTask";
import { TaskTypeEnum } from "../utils/TaskTypeEnum";
import Map from "./Map";

export function Tasks({ userTasks, allowedTaskTypes }) {
  const getPrecalculatedIndex = (i) => {
    const selectedWaypoint =
      userTasks.tasks[i].claimedPoint.length != 0
        ? {
            lat: userTasks.tasks[i].claimedPoint[0],
            lng: userTasks.tasks[i].claimedPoint[1],
          }
        : userTasks.tasks[i].waypoints[0];
    return userTasks.tasks[i].waypoints.findIndex((wp) => {
      return wp.lat == selectedWaypoint.lat && wp.lng == selectedWaypoint.lng;
    });
  };

  const formatToLatLng = (routes) => {
    let wps = [];
    for (let wp of routes) {
      wps.push({ lat: wp[0], lng: wp[1] });
    }
    return wps;
  };

  return userTasks?.taskTypes?.map(
    (taskType, i) =>
      allowedTaskTypes.some((allowedTaskType) => taskType === allowedTaskType) && (
        <Task
          key={`task__${i}`}
          taskID={userTasks.tasks[i].taskid}
          company={userTasks.tasks[i].company}
          claimed={userTasks.tasks[i].claimed}
          schedule={userTasks.tasks[i].schedule}
          waypoints={
            userTasks.tasks[i].claimedPoint.length == 0
              ? userTasks.tasks[i].waypoints
              : formatToLatLng(userTasks.tasks[i].precalculatedRoutes[getPrecalculatedIndex(i)][1])
          }
          // waypoints={getPrecalculatedRoute(i)}
          // precalculatedRoutes={() => getPrecalculatedRoute(i)}
          taskType={taskType}
        />
      )
  );
}

export function Task({ taskID, taskType, company, claimed, precalculatedRoutes, schedule, waypoints }) {
  const [isToggled, setToggle] = useState(false);
  const [claimedPoint, setClaimedPoint] = useState(waypoints[0]);
  const [isMapPreviewed, setMapPreview] = useState(false);

  const markTaskAsFinished = useCallback(() => {
    if (!claimed) return;

    finishTask(taskID).then(({ success, message }) => {
      if (!success) {
        alert(message || "Could not mark task as finished");
        return;
      }

      window.location.reload();
    });
  }, [claimed, taskID]);

  const claimTaskClickHandler = useCallback(() => {
    if (!taskID) {
      alert("The ID of the task is somehow undefined...?");
      return;
    }

    if (claimedPoint.some((coordinate) => isNaN(coordinate))) {
      alert("You did not select a point on the map");
      return;
    }

    claimTask(taskID, claimedPoint).then(({ success, message }) =>
      success ? window.location.reload() : alert(message || "Could not claim task")
    );
  }, [claimedPoint, taskID]);

  const cancelTaskClientClickHandler = useCallback(() => {
    cancelTaskClient(taskID).then(({ success, message }) =>
      success ? window.location.reload() : alert(message || "Could not cancel task")
    );
  }, [taskID]);

  const cancelTaskWorkerClickHandler = useCallback(() => {
    cancelTaskWorker(taskID).then(({ success, message }) =>
      success ? window.location.reload() : alert(message || "Could not cancel task")
    );
  }, [taskID]);

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
                <div
                  className={`data-tag ${lat === claimedPoint[0] && lng === claimedPoint[1] ? "data-tag-focused" : ""}`}
                  tabIndex={i}
                  onClick={() => setClaimedPoint([lat, lng])}
                  key={`action-tag__${i}`}
                >
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
                <>
                  {isMapPreviewed ? (
                    <>
                      <div
                        className={`${isMapPreviewed ? "map-preview-on-overlay" : ""}`}
                        onClick={() => isMapPreviewed && setMapPreview(!isMapPreviewed)}
                      ></div>

                      <Map center={claimedPoint} data={waypoints} editable={false} line={false} getMarkers={() => {}} />
                    </>
                  ) : (
                    <Map center={claimedPoint} data={waypoints} editable={false} line={false} getMarkers={() => {}} />
                  )}
                </>
              )}
              {(taskType === TaskTypeEnum.ONGOING_TASKS || taskType === TaskTypeEnum.FINISHED_TASKS) && (
                <>
                  {isMapPreviewed ? (
                    <>
                      <div
                        className={`${isMapPreviewed ? "map-preview-on-overlay" : ""}`}
                        onClick={() => isMapPreviewed && setMapPreview(!isMapPreviewed)}
                      ></div>
                      <Map center={claimedPoint} data={waypoints} editable={false} line={true} getMarkers={() => {}} />
                    </>
                  ) : (
                    <Map center={claimedPoint} data={waypoints} editable={false} line={true} getMarkers={() => {}} />
                  )}
                </>
              )}
            </div>
          </div>
          <div className="task-buttons">
            {taskType === TaskTypeEnum.YOUR_TASKS && (
              <>
                <button className="task-button secondary-button" disabled={!claimed} onClick={markTaskAsFinished}>
                  Mark as finished
                </button>
                <button className="task-button secondary-button" onClick={cancelTaskClientClickHandler}>
                  Cancel
                </button>
              </>
            )}
            {taskType === TaskTypeEnum.ONGOING_TASKS && (
              <button className="task-button secondary-button" onClick={cancelTaskWorkerClickHandler}>
                Cancel
              </button>
            )}
            {taskType === TaskTypeEnum.AVAILABLE_TASKS && (
              <button className="task-button secondary-button" onClick={claimTaskClickHandler}>
                Claim
              </button>
            )}

            <button className="task-button secondary-button" onClick={() => setMapPreview(!isMapPreviewed)}>
              Preview map
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
