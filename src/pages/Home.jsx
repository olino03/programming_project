import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Home.css";
import topDecorationSVG from "../svg/top-decoration.svg";

export default function Home() {
  const navigate = useNavigate();

  const [activePane, setActivePane] = useState(null);

  const openRegisterPane = useCallback(() => setActivePane("register"), []);
  const closeRegisterPane = useCallback(() => setActivePane(null), []);

  const checkToken = async (email, accessToken) => {
    const _resp = await fetch("http://localhost:5000/tokenLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, accessToken: accessToken }),
    });

    const resp = await _resp.json();
    console.log(resp);
    if (resp.success) {
      navigate("/main");
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || "";
    const email = localStorage.getItem("email") || "";

    checkToken(email, accessToken);
  }, []);

  return (
    <div className="home">
      <img className="top-decoration" alt="Top" src={topDecorationSVG} />
      <div className="main">
        <div className="sus">
          <div className="sus-logo"></div>
          <div className="text-dinala">
            <p>
              GreenPath is a Timișoara-based business that aims to make this
              city greener, by collecting waste from citizens and making sure it
              gets to the right place — the proper recycling centres!
            </p>
          </div>
        </div>

        <Link to="/main">
          <button className="main-button get-started">
            Go to main [debugging]
          </button>
        </Link>

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
                Because we believe a circular economy is key to sustainability,
                our goal is to put moral pressure on policymakers and local
                administration to further implement this system.
              </p>
            </div>
            <div className="goals-goal">
              <p>
                Building a safe community is our ultimate goal. We advocate for
                accessibility, responsibility, solidarity and ultimately — care
                for the environment.
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
          activePane === "login" && <LoginPane setActivePane={setActivePane} />
        )}
      </div>
    </div>
  );
}

function RegisterPane({ setActivePane }) {
  const navigate = useNavigate();

  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [errMessage, setErr] = useState("");

  const register = async () => {
    const _resp = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname: fname,
        lname: lname,
        email: email,
        phone: phone,
        password: password,
      }),
    });

    const resp = await _resp.json();
    if (resp.success) {
      localStorage.setItem("accessToken", resp.accessToken);
      localStorage.setItem("email", email);
      navigate("/main");
    } else setErr(resp.message);
  };

  return (
    <div className="action-pane register-pane">
      <h1>Register</h1>
      <form>
        <div>
          <label>First Name</label>
          <input
            type="text"
            onChange={(e) => {
              setFName(e.target.value);
              setErr("");
            }}
            placeholder="Type your first name here"
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            onChange={(e) => {
              setLName(e.target.value);
              setErr("");
            }}
            placeholder="Type your last name here"
          />
        </div>
        <div>
          <label>E-Mail</label>
          <input
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
              setErr("");
            }}
            placeholder="Type your e-mail here"
          />
        </div>
        <div>
          <label>Phone Number</label>
          <input
            type="phone"
            onChange={(e) => {
              setPhone(e.target.value);
              setErr("");
            }}
            placeholder="Type your phone number here"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
              setErr("");
            }}
            placeholder="Type your password here"
          />
          <button
            type="button"
            className="main-button"
            onClick={() => register()}
          >
            GO
          </button>
          <div className="err">
            <p>{errMessage}</p>
          </div>
        </div>
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

  const [errMessage, setErr] = useState("");

  const login = async () => {
    const _resp = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    const resp = await _resp.json();
    if (resp.success) {
      localStorage.setItem("accessToken", resp.accessToken);
      localStorage.setItem("email", email);
      navigate("/main");
    } else setErr(resp.message);
  };

  return (
    <div className="action-pane login-pane">
      <h1>Log In</h1>
      <form>
        <div>
          <label>E-Mail</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Type your e-mail here"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type your password here"
          />
        </div>
        <button type="button" className="main-button" onClick={() => login()}>
          GO
        </button>
        <div className="err">
          <p>{errMessage}</p>
        </div>
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
