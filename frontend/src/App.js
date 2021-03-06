import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import {
  CreateListingPage,
  EditListingPage,
  ListingPage,
  ListingsPage,
} from "./pages/Listings";
import Messenger from "./pages/Messenger";
import NotFound from "./pages/NotFound";
import "./App.css";
import Authentication from "./pages/Authentication";
import ProtectedRoute from "./utils/ProtectedRoute";
import { ProfilePage } from "./pages/Profile";
import Livestream from "./pages/Livestream";
import ErrorBoundary from "./utils/ErrorBoundary";
import MyListingsPage from "./pages/Listings/MyListingsPage";
import UserBids from "./pages/Bids/UserBids";
import Admin from "./pages/Admin";

function App() {
  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column">
        <ErrorBoundary>
          <NavBar />
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/profile/:username" component={ProfilePage} exact />
            <Route path="/listings" component={ListingsPage} exact />
            <ProtectedRoute
              path="/listings/self"
              component={MyListingsPage}
              exact
            />
            <ProtectedRoute
              path="/listings/create"
              component={CreateListingPage}
              exact
            />
            <ProtectedRoute
              path="/listings/edit/:id"
              component={EditListingPage}
              exact
            />
            <Route path="/listings/:id" component={ListingPage} exact />
            <ProtectedRoute
              path="/tv/:streamerId"
              component={Livestream}
              exact
            />
            <Route path="/authentication" component={Authentication} exact />
            <ProtectedRoute
              path="/tv/:streamerId"
              component={Livestream}
              exact
            />
            <ProtectedRoute path="/messenger" component={Messenger} exact />
            <ProtectedRoute path="/UserBids" component={UserBids} exact />
            <ProtectedRoute path="/admin" component={Admin} exact />
            <Route component={NotFound} />
          </Switch>
        </ErrorBoundary>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
