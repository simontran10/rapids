import "./Error.css";

function Error() {
  return (
    <div className="center">
      <h1 className="error-message">
        The page you were looking for was not found
      </h1>
      <img className="error-icon" src="/error-icon.png" alt="Error icon" />
    </div>
  );
}

export default Error;
