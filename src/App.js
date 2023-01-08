// import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import topDecorationSVG from "./svg/top-decoration.svg";

function App() {
  return (
    <>
      <img className="top-decoration" alt="Top" src={topDecorationSVG} />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
