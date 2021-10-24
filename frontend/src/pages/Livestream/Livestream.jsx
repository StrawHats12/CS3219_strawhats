import { useEffect, useState } from "react";
import {Button, Card, Container} from "react-bootstrap";
import { useParams } from "react-router";
import {
  ProfileCard,
  ProfileReviews,
  ReviewModal,
} from "../../components/Profile";
import StrawhatSpinner from "../../components/StrawhatSpinner";
import { getCurrentUser } from "../../hooks/useAuth";
import { getAccount } from "../../services/account-service";
import {StreamControlPanel, StreamViewer} from "../../components/Livestream"
import {fetchPrivateStreamDetails} from "../../services/livestream-service";

const Livestream = () => {
  const pageTitle = "Livestream";
  const {streamerId} = useParams();
  // const [playbackIds, setPlaybackIds] = useState([])

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  //
  // // attempt to fetch private stream details from the backend:
  // useEffect(async () => {
  //   const response = await fetchPrivateStreamDetails(streamerId)
  //   if (response) {
  //     const {playback_ids} = response
  //     setPlaybackIds(playback_ids);
  //   }
  // }, [])

  // const updatePlaybackIds = (updatedPlaybackIds) => {
  //   console.log("updating playback ids state in livestream component")
  //   setPlaybackIds(updatedPlaybackIds)
  // }

  return <>
    <h1> Hi there Streamer @{streamerId}</h1>
    {/*<StreamControlPanel streamerId={streamerId} playbackIds={playbackIds} updatePlaybackIds={updatePlaybackIds}/>*/}
    <StreamControlPanel streamerId={streamerId}/>
    {/*{console.log("playback ids", playbackIds)}*/}
    {/*{playbackIds.length > 0*/}
    {/*    ? <StreamViewer playbackIds{...playbackIds}/>*/}
    {/*    : <Card> No streams to view now</Card>*/}
    {/*}*/}
  </>;
};

export default Livestream;
