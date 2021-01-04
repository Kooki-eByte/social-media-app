import { Container, CssBaseline } from "@material-ui/core";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import { AuthProvider } from "./context/auth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthRoute from "./utils/authRoute";

function App() {
  return (
    <div>
      <CssBaseline />
      <Container>
        <AuthProvider>
          <Router>
            <NavBar />
            <Route exact path="/" component={Home} />
            <AuthRoute exact path="/login" component={Login} />
            <AuthRoute exact path="/register" component={Register} />
          </Router>
        </AuthProvider>
      </Container>
    </div>
  );
}

export default App;
