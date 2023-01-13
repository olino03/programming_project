import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import topDecorationSVG from "../svg/top-decoration.svg";
import getUserLoggedInState from "../utils/getUserLoggedInState";

export default function Home() {
  const navigate = useNavigate();

  const [activePane, setActivePane] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const openRegisterPane = useCallback(() => setActivePane("register"), []);
  const closeRegisterPane = useCallback(() => setActivePane(null), []);

  useEffect(() => {
    getUserLoggedInState().then(({ isLoggedIn: isUserLoggedIn }) => {
      if (isUserLoggedIn) navigate("/dashboard");

      setIsLoggedIn(isUserLoggedIn);
    });
  }, [navigate]);

  return (
    !isLoggedIn && (
      <div className="home">
        <img className="top-decoration" alt="Top" src={topDecorationSVG} />
        <div className="main">
          <div className="sus">
            <div className="sus-logo"></div>
            <div className="text-dinala">
              <p>
                GreenPath is a Timișoara-based business that aims to make this
                city greener, by collecting waste from citizens and making sure
                it gets to the right place — the proper recycling centres!
              </p>
            </div>
          </div>

          <div className="mijloc">
            <div className="call-to-action">
              <h1>Help us start making a difference.</h1>
              <button
                className="main-button get-started"
                onClick={openRegisterPane}
              >
                Get Started
              </button>
            </div>

            <div className="see-latest-routes">
              <h3>See our latest routes</h3>
              <div className="harta"></div>
            </div>
          </div>

          <div className="pollution-impact">
            <h1>Pollution impacts our day to day lives in undeniable ways.</h1>
            <div className="consequences">
              <div className="consequences-box">
                <div className="consequences-icon"></div>
                <p>
                  From the trash we sometimes observe when walking on the
                  street...
                </p>
              </div>
              <div className="consequences-box">
                <div className="consequences-icon"></div>
                <p>
                  ...to the areas of our city that have become uninhabitable due
                  to unrecycled waste.
                </p>
              </div>
            </div>
          </div>

          <div className="its-time-to-stop">
            <div className="time-to-stop-title-bar">
              <h1>This has become an issue we cannot ignore anymore.</h1>
            </div>
            <p>
              It is important to take action, not only for the planet, but also
              for our lives.
              <br />
              <br />
              This initiative is the result of inadequate infrastructure in our
              local community. Citizens lack both resources and access when it
              comes to recycling, so we decided to step in and take the lead! We
              want to bring the existent recycling centres to our costumers and
              facilitate the process in a responsible, sustainable, efficient
              manner.
            </p>
          </div>

          <div className="our-goals">
            <h1>
              OUR
              <br />
              GOALS
            </h1>
            <div className="goals">
              <div className="goals-goal">
                <p>
                  We aim to improve the existing local infrastructure, thus
                  facilitating the recycling process.
                </p>
              </div>
              <div className="goals-goal">
                <p>
                  Because we believe a circular economy is key to
                  sustainability, our goal is to put moral pressure on
                  policymakers and local administration to further implement
                  this system.
                </p>
              </div>
              <div className="goals-goal">
                <p>
                  Building a safe community is our ultimate goal. We advocate
                  for accessibility, responsibility, solidarity and ultimately —
                  care for the environment.
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={closeRegisterPane}
            className={`action-overlay ${
              activePane !== null ? "action-overlay-active" : ""
            }`}
          ></div>
          {activePane === "register" ? (
            <RegisterPane setActivePane={setActivePane} />
          ) : (
            activePane === "login" && (
              <LoginPane setActivePane={setActivePane} />
            )
          )}
        </div>
      </div>
    )
  );
}

function RegisterPane({ setActivePane }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    type: "Client",
    password: "",
  });

  const register = useCallback(async () => {
    const registerResponse = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .catch((error) => {
        alert("Error during register. Check devtools.");
        console.error(error);
      });

    if (registerResponse.success) {
      localStorage.setItem("accessToken", registerResponse.accessToken);
      localStorage.setItem("email", formData.email);
      navigate("/dashboard");
      return;
    }

    alert(registerResponse.message);
  }, [formData, navigate]);

  return (
    <div className="action-pane register-pane">
      <h1>Register</h1>
      <form>
        <div>
          <div style={{ flex: "1" }}>
            <label>First Name</label>
            <input
              type="text"
              onChange={({ target: { value } }) =>
                setFormData((oldFormData) => ({ ...oldFormData, fname: value }))
              }
              placeholder="Type your first name here"
            />
          </div>
          <div style={{ flex: "1" }}>
            <label>Last Name</label>
            <input
              type="text"
              onChange={({ target: { value } }) =>
                setFormData((oldFormData) => ({ ...oldFormData, lname: value }))
              }
              placeholder="Type your last name here"
            />
          </div>
        </div>
        <div>
          <label>E-Mail</label>
          <input
            type="email"
            onChange={({ target: { value } }) =>
              setFormData((oldFormData) => ({ ...oldFormData, email: value }))
            }
            placeholder="Type your e-mail here"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            onChange={({ target: { value } }) =>
              setFormData((oldFormData) => ({
                ...oldFormData,
                password: value,
              }))
            }
            placeholder="Type your password here"
          />
        </div>
        <div>
          <label>I am a...</label>
          <select
            onChange={({ target: { value } }) =>
              setFormData((oldFormData) => ({ ...oldFormData, type: value }))
            }
          >
            <option>Client</option>
            <option>Worker</option>
          </select>
        </div>
        <button type="button" className="main-button" onClick={register}>
          GO
        </button>
      </form>

      <div className="no-account-tip">
        <p>
          Already have an account?{" "}
          <button onClick={() => setActivePane("login")}>Log in</button>
        </p>
      </div>
    </div>
  );
}

function LoginPane({ setActivePane }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useCallback(async () => {
    const loginResponse = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => response.json())
      .catch((error) => {
        alert("Error during login. Check devtools.");
        console.error(error);
      });

    if (loginResponse.success) {
      localStorage.setItem("accessToken", loginResponse.accessToken);
      localStorage.setItem("email", email);
      navigate("/dashboard");
      return;
    }

    alert(loginResponse.message);
  }, [email, password, navigate]);

  return (
    <div className="action-pane login-pane">
      <h1>Log In</h1>
      <form>
        <div>
          <label>E-Mail</label>
          <input
            type="email"
            onChange={({ target: { value } }) => setEmail(value)}
            placeholder="Type your e-mail here"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            onChange={({ target: { value } }) => setPassword(value)}
            placeholder="Type your password here"
          />
        </div>
        <button type="button" className="main-button" onClick={login}>
          GO
        </button>
      </form>

      <div className="no-account-tip">
        <p>
          No account?{" "}
          <button onClick={() => setActivePane("register")}>Make one</button>
        </p>
      </div>
    </div>
  );
}
