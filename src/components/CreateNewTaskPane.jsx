import { useCallback, useState } from "react";
import { calculateRoute } from "../utils/calculateRoute";
import Map from "./Map";

export default function CreateNewTaskPane({ toggleNewTaskPane }) {
  const [markers, setMarkers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [newCenter, setCenter] = useState([45.7494, 21.2272]);
  const [formData, setFormData] = useState({
    company: "",
    schedule: ["12:00", "12:00"],
    waypoints: [],
  });

  const generateSummaryArray = async (waypoints) => {
    const data = [];
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
    return JSON.stringify({ data });
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
        alert("Task created successfully.");
        window.location.reload();
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
