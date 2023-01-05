import "../css/Home.css";
// import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <div className="main">
        <div className="sus">
          <div className="sus-logo"></div>
          <div className="textDinala">
            <p>text dinala fillar cum ar veni</p>
          </div>
        </div>
        <div className="mijloc">
          <button className="get-started">Get Started</button>
        </div>
        <div className="jos">
          <div className="textDinalalalt">
            <p>See our latest routes</p>
            <div className="harta"></div>
          </div>
        </div>
      </div>
      {/* <Link to="/register">Catre register</Link>
      <Link to="/login">Catre login</Link> */}
    </div>
  );
}
