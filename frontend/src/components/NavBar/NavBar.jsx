import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import useAuth from "../../hooks/useAuth";

const NavBar = () => {
  const { currentUser } = useAuth();

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>StrawHats</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <NavDropdown title="Listings">
              <LinkContainer exact to="/listings">
                <NavDropdown.Item>View Listings</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer exact to="/listings/create">
                <NavDropdown.Item>Create Listing</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
            <LinkContainer to="/messenger">
              <Nav.Link>Messenger</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav>
            {currentUser ? (
              <NavDropdown title={currentUser.username}>
                <LinkContainer exact to={`/profile/${currentUser.username}`}>
                  <NavDropdown.Item>My Profile</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer exact to={`/listings/self`}>
                  <NavDropdown.Item>My Listings</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer exact to="/authentication">
                  <NavDropdown.Item>Sign Out</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            ) : (
              <LinkContainer to="/authentication">
                <Nav.Link>Sign In</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
