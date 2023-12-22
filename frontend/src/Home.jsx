import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const bringToUpload = () => {
    navigate("/upload");
  };

  return (
    <div className="home-center fadeInAnimation">
      <div className="home-content">
        <h1>Rapids</h1>
        <h2>
          Upload <span className="underline">files</span> and share <br />
          <span className="underline">instantaneously</span>
        </h2>
        <button className="button" onClick={bringToUpload}>
          Get Started
        </button>
      </div>
      <img className="logo" src="/logo.png" alt="Rapids logo" />
    </div>
  );
}

export default Home;
