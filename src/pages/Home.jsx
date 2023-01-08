import { useCallback, useState } from "react";
import "../css/Home.css";
// import { Link } from "react-router-dom";

export default function Home() {
  const [activePane, setActivePane] = useState(null);

  const openRegisterPane = useCallback(() => setActivePane("register"), [])
  const closeRegisterPane = useCallback(() => setActivePane(null), [])

  return (
    <div className="home">
      <div className="main">
        <div className="sus">
          <div className="sus-logo"></div>
          <div className="text-dinala">
            <p>
              The Earth is getting dirtier, and people lazier with their product waste.
              We’re here to help with that, so less stuff goes to the landfill, and more
              back into the industry.
            </p>
          </div>
        </div>
        <div className="mijloc">
            <div className="call-to-action">
              <h1>Help us start making a difference.</h1>
              <button className="get-started" onClick={openRegisterPane}>Get Started</button>  
            </div>    

            <div className="see-latest-routes">
              <h3>See our latest routes</h3>
              <div className="harta"></div>
            </div>
        </div>

        <div onClick={closeRegisterPane} className={`action-overlay ${activePane !== null ? "action-overlay-active" : ""}`}></div>
        {activePane === "register" ? <RegisterPane /> : activePane === "login" && <LoginPane />}
      </div>
    </div>
  );
}

function RegisterPane() {
  return <div className="register-pane">Register pane!</div>
}

function LoginPane() {
  return <div className="login-pane">Login Pane!</div>
}

