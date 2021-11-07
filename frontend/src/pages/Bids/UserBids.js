import { Container } from "react-bootstrap";
import UserBidTable from "../../components/Bids/UserBidTable";

const UserBids = () => {
  return (
    <Container>
      <h1> Bids made by you:</h1>
      <UserBidTable />
    </Container>
  );
};

export default UserBids;
