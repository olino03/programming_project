import { useState } from "react";
import { TaskTypeEnum } from "../utils/TaskTypeEnum";
import Map from "./Map";

export default function Task({ taskID, taskType }) {
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
              <div className="data-tag">Str. Charles, nr. 7</div>
              <div className="data-tag">Str. Charles, nr. 7</div>
              <div className="data-tag">Str. Charles, nr. 7</div>
              <div className="data-tag">Str. Charles, nr. 7</div>
            </div>
          </div>

          <div className="company-schedule-map">
            <div>
              <div className="task-company-name">
                <h3>Company name</h3>
                <div className="data-tag">NumeCompanieEpic12345</div>
              </div>

              <div className="task-schedule">
                <h3>Schedule</h3>
                <div className="data-tag">14:00</div>
                <div className="schedule-hours-connector"></div>
                <div className="data-tag">17:00</div>
              </div>
            </div>

            <div className="task-map-preview">
              {(taskType === TaskTypeEnum.YOUR_TASKS || taskType === TaskTypeEnum.AVAILABLE_TASKS) && (
                <Map editable={false} line={false} getMarkers={() => {}} />
              )}
              {(taskType === TaskTypeEnum.ONGOING_TASKS || taskType === TaskTypeEnum.FINISHED_TASKS) && (
                <Map editable={false} line={true} getMarkers={() => {}} />
              )}
            </div>
          </div>
          {taskType === TaskTypeEnum.YOUR_TASKS && (
            <div className="task-buttons">
              <button className="task-button secondary-button">Mark as finished</button>
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
