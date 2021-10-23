import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useParams } from "react-router";
import {
  ProfileCard,
  ProfileReviews,
  ReviewModal,
} from "../../components/Profile";
import StrawhatSpinner from "../../components/StrawhatSpinner";
import { getCurrentUser } from "../../hooks/useAuth";
import { getAccount } from "../../services/account-service";
import {StreamCreator, StreamViewer} from "../../components/Livestream"

const Livestream = () => {
  const pageTitle = "Livestream";
  const {playbackId} = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  return <>
    <h1> Tuned into Livestream ID: {playbackId}</h1>
    <StreamCreator/>
    <StreamViewer playbackId={"12"}/>
  </>;
};

export default Livestream;
