export default async function finishTask(taskID) {
  const email = localStorage.getItem("email") || "";
  if (email === "") return null;
  try {
    const taskFinishResponse = await fetch("http://localhost:5000/finishTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, taskid: taskID }),
    }).then((response) => response.json());

    if (taskFinishResponse?.success) return { success: true };

    console.error(taskFinishResponse?.message);
    return { success: false };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
