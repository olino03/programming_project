export default async function getUserLoggedInState() {
  const accessToken = localStorage.getItem("accessToken") || "";
  const email = localStorage.getItem("email") || "";
  try {
    const tokenLoginResponse = await fetch("http://localhost:5000/tokenLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, accessToken: accessToken }),
    }).then((response) => response.json());

    if (tokenLoginResponse?.success) return { isLoggedIn: true, ...tokenLoginResponse.user };
  } catch (error) {
    alert("Error during token check. Check devtools.");
    console.error(error);
    return { isLoggedIn: false, email: null, fname: null, lname: null, type: null };
  }
  return { isLoggedIn: false, email: null, fname: null, lname: null, type: null };
}
