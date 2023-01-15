export default async function fetchAllTasks() {
  const email = localStorage.getItem("email") || "";
  if (email === "") return null;
  try {
    const taskFetchResponse = await fetch("http://localhost:5000/fetchAllTasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }).then((response) => response.json());

    console.log(taskFetchResponse);
    if (taskFetchResponse?.success) return taskFetchResponse;

    console.error(taskFetchResponse?.message);
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
