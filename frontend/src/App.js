import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import NotFound from "./pages/NotFound";
import "./App.css";
import Authentication from "./pages/Authentication";

function App() {
  return (
    <Router>
      <NavBar />
      <Container>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/listings" component={Listings} exact />
          <Route path="/authentication" component={Authentication} />
          <Route component={NotFound} />
        </Switch>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
