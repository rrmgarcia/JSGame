import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div style={{backgroundColor: "#626cb8", padding: "20px", borderRadius: "5%"}}>
      <h1>Welcome to Task24!</h1>
      <h3>A to-do app created to help achieve your goals for the day!</h3>
      <h3>Stay on track, one task at a time!</h3>
      <p>
        Click <Link to={"/sign-in"} style={{fontWeight: "bold"}}>HERE</Link> to Sign-in
      </p>
      <p>or</p>
      <p>
        Sign-up <Link to={"/register" } style={{fontWeight: "bold"}}>HERE</Link> now!
      </p>
      <Outlet />
    </div>
  );
}

export default App;
