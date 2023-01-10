import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
// import { Link } from "react-router-dom";
import topDecorationSVG from "../svg/top-decoration.svg";

export default function Home() {
  const [activePane, setActivePane] = useState(null);

  const openRegisterPane = useCallback(() => setActivePane("register"), []);
  const closeRegisterPane = useCallback(() => setActivePane(null), []);

  return (
    <div className="home">
      <img className="top-decoration" alt="Top" src={topDecorationSVG} />
      <div className="main">
        <div className="sus">
          <div className="sus-logo"></div>
          <div className="text-dinala">
            <p>
              The Earth is getting dirtier, and people lazier with their product waste. We’re here to help with that, so
              less stuff goes to the landfill, and more back into the industry.
            </p>
          </div>
        </div>

        <Link to="/main">
          <button className="main-button get-started">Go to main [debugging]</button>
        </Link>

        <div className="mijloc">
          <div className="call-to-action">
            <h1>Help us start making a difference.</h1>
            <button className="main-button get-started" onClick={openRegisterPane}>
              Get Started
            </button>
          </div>

          <div className="see-latest-routes">
            <h3>See our latest routes</h3>
            <div className="harta"></div>
          </div>
        </div>

        <div
          onClick={closeRegisterPane}
          className={`action-overlay ${activePane !== null ? "action-overlay-active" : ""}`}
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
  return (
    <div className="action-pane register-pane">
      <h1>Register</h1>
      <form>
        <div>
          <label>First Name</label>
          <input type="text" placeholder="Type your first name here" />
        </div>
        <div>
          <label>Last Name</label>
          <input type="text" placeholder="Type your last name here" />
        </div>
        <div>
          <label>E-Mail</label>
          <input type="email" placeholder="Type your e-mail here" />
        </div>
        <div>
          <label>Phone Number</label>
          <input type="phone" placeholder="Type your phone number here" />
        </div>
        <div>
          <label>Password</label>
          <input type="password" placeholder="Type your password here" />
          <button className="main-button">GO</button>
        </div>
      </form>

      <div className="no-account-tip">
        <p>
          Already have an account? <button onClick={() => setActivePane("login")}>Log in</button>
        </p>
      </div>
    </div>
  );
}

function LoginPane({ setActivePane }) {
  return (
    <div className="action-pane login-pane">
      <h1>Log In</h1>
      <form>
        <div>
          <label>E-Mail</label>
          <input type="email" placeholder="Type your e-mail here" />
        </div>
        <div>
          <label>Password</label>
          <input type="password" placeholder="Type your password here" />
        </div>
        <button className="main-button">GO</button>
      </form>

      <div className="no-account-tip">
        <p>
          No account? <button onClick={() => setActivePane("register")}>Make one</button>
        </p>
      </div>
    </div>
  );
}
