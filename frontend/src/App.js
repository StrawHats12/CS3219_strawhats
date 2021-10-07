import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import { CreateListingPage, ListingPage, ListingsPage } from "./pages/Listings";
import NotFound from "./pages/NotFound";
import "./App.css";
import Authentication from "./pages/Authentication";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <Router>
      <NavBar />
      <Container>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/listings" component={ListingsPage} exact />
          <ProtectedRoute
            path="/listings/create"
            component={CreateListingPage}
            exact
          />
          <Route path="/listings/:id" component={ListingPage} exact />
          <Route path="/authentication" component={Authentication} exact />
          <Route component={NotFound} />
        </Switch>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
