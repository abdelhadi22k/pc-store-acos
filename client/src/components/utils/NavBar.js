import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from "react-bootstrap";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
 
import { userSignout } from "../../redux/user/UserAction";

function NavBar() {
  const likeData = useSelector((state) => state.like.like.likeItems);
  const cartData = useSelector((state) => state.cart.cart.cartItems);
  const userInfo = useSelector((state) => state.user.userInfo);

  const signoutHandler = () => {
    userSignout({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/singup";
  };

  return (
    <Container className="Nva_Container">
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary Navbar">
        <Navbar.Brand className="Nav_Brand" href="#home">
          <LinkContainer to="/">
            <img alt="Brand" src="sources/svg/mainLogo.svg" />
          </LinkContainer>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          className="Navbar_Toggle"
        />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="Nav_Link_Icon">
            <Link to="/search">
              Search...
              <SearchSharpIcon sx={{ fontSize: 24 }} />
            </Link>
            <Link to="/Product">
              Shopping...
              <LocalOfferOutlinedIcon sx={{ fontSize: 24 }} />
            </Link>

            <Link to="/cart">
              Cart <LocalMallOutlinedIcon sx={{ fontSize: 24 }} />
              {cartData.length > 0 && (
                <Badge pill bg="danger">
                  {cartData.reduce((a, c) => a + c.quantity, 0)}
                </Badge>
              )}
            </Link>

            {userInfo ? (
              <Link to="/Favorite" className="Nav nava NavDropdown">
                Favorite <FavoriteBorderIcon sx={{ fontSize: 24 }} />
                {likeData.length > 0 && (
                  <Badge pill bg="danger">
                    +
                  </Badge>
                )}
              </Link>
            ) : (
              <span> </span>
            )}

            {userInfo ? (
              <Link to="/profile" className="Nav nava NavDropdown">
                Profile <Person2OutlinedIcon sx={{ fontSize: 24 }} />
              </Link>
            ) : (
              <Link className="" to="/SingUp">
                SingUp
              </Link>
            )}

          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
}

export default NavBar;
