import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import StrawhatSpinner from "../../components/StrawhatSpinner";
import useAuth from "../../hooks/useAuth";
import { deleteListing, getAllListings } from "../../services/listings-service";

const Admin = () => {
  const auth = useAuth();
  const [isAdmin, setIsAdmin] = useState(false); // set to false
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const groups =
      auth?.currentUser?.signInUserSession?.idToken?.payload["cognito:groups"];
    if (groups && groups.includes("strawhats-admin")) {
      setIsAdmin(true);
    }
  }, [auth]);

  useEffect(() => {
    if (isAdmin) {
      getAllListings()
        .then((listings) => {
          setListings(listings);
        })
        .catch((err) => {
          alert(err);
        })
        .finally(setIsLoading(false));
    }
  }, [isAdmin]);

  const onDeleteListing = (id) => {
    setIsLoading(true);
    deleteListing(id)
      .then(() => {
        getAllListings()
          .then((listings) => {
            setListings(listings);
          })
          .catch((err) => {
            alert(err);
          })
          .finally(setIsLoading(false));
      })
      .catch((err) => {
        alert(err);
        setIsLoading(false);
      });
  };

  if (!isAdmin) {
    return (
      <Container>
        <h3 className="pt-5 text-center">
          You need to be an admin to view this page
        </h3>
      </Container>
    );
  }

  return (
    <Container className="mt-2">
      <h1>Listings</h1>
      {isLoading ? (
        <StrawhatSpinner />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>id</th>
              <th>title</th>
              <th>username</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {listings &&
              listings.map(({ id, listing_name, seller_username }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{listing_name}</td>
                  <td>{seller_username}</td>
                  <td>
                    <Button onClick={() => onDeleteListing(id)}>delete</Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Admin;
