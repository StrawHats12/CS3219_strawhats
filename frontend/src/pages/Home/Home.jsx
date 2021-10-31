import { Container } from "react-bootstrap";
import "./Home.css";
import logo from "./logo192.png";
import hero from "./hero.png";
import { useEffect, useState } from "react";
import { getAllListings } from "../../services/listings-service";
import StrawhatSpinner from "../../components/StrawhatSpinner";
import ListingsCardVertical from "../../components/Listings/ListingsCardVertical";

const Home = () => {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllListings().then((res) => {
      if (!res) {
        setIsLoading(false);
        return;
      }
      
      setListings(res.slice(0,9));
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-around align-items-center text-white hero">
        <div>
          <div className="d-flex justify-content-left align-items-center">
            <img src={logo} alt="" style={{ width: "80px" }}></img>
            <div className="mx-2">
              <h1>Strawhats</h1>
              <h3>Auctions made easy.</h3>
            </div>
          </div>
          <ul className="pl-7 mt-3">
            <li>
              <h5>Live Video Streaming</h5>
            </li>
            <li>
              <h5>Easy to use</h5>
            </li>
            <li>
              <h5>Free forever</h5>
            </li>
          </ul>
        </div>
        <img src={hero} alt="" className="hero-img" />
      </div>
      <Container>
        <h1 className="heading">Featured Listings</h1>
        <div className="d-flex justify-content-around align-items-center flex-wrap">
          {isLoading ? (
            <StrawhatSpinner />
          ) : (
            listings?.map((listing, i) => (
              <ListingsCardVertical listing={listing} key={i} />
            ))
          )}
        </div>
      </Container>
    </div>
  );
};

export default Home;
