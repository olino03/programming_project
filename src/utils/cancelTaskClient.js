export default async function cancelTaskClient(taskID) {
  const email = localStorage.getItem("email") || "";
  if (email === "") return null;

  try {
    const taskFetchResponse = await fetch("http://localhost:5000/cancelTaskClient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, taskid: taskID }),
    }).then((response) => response.json());

    if (taskFetchResponse?.success) return taskFetchResponse;

    console.error(taskFetchResponse?.message);
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
