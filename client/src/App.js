import { Container, CssBaseline } from "@material-ui/core";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <div>
      <CssBaseline />
      <Container>
        <Router>
          <NavBar />
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Router>
      </Container>
    </div>
  );
}

export default App;
