import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import domain from "../utils/config";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import { AlertTitle } from "@mui/material";

function CardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartData = useSelector((state) => state.cart.cart.cartItems);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [alert, setAlert] = useState(null);

  const removeItemHandler = (item) => {
    dispatch({
      type: "CART_REMOVE_ITEM",
      payload: item,
    });
  };

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`${domain}/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  }; 

  const addToLike = async (item) => {
    if (item) {
      try {
        const { data } = await axios.get(`${domain}/api/products/${item}`);

        dispatch({
          type: "LIKE_ADD_ITEM",
          payload: { ...data },
        });

        setAlert(
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            The product was added to the Favorite successfully
          </Alert>
        );

        setTimeout(() => {
          setAlert(null);
        }, 3000);
      } catch (err) {
        
        setAlert(
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
            Error adding to Favorite: {err.message}
          </Alert>
        );

        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }
    } else {
      <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          This is an error
        </Alert>;
    }
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
     
    } else {
      navigate("/shipping");
    }
  };

  return (
    <Container className="cartSection">
      <div className="alert"> {alert}</div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <div>
        
        <Row>
          <Col md={8}>
            {cartData.length === 0 ? (
              <div className="empty_page">
                <script src="https://cdn.lordicon.com/lordicon.js"></script>
                <lord-icon
                  src="https://cdn.lordicon.com/pbrgppbb.json"
                  trigger="hover"
                  colors="primary:#151515"
                  style={{ width: "250px", height: "250px" }}
                ></lord-icon>
                <h3>
                  Your Shopping Cart Is Empty <br />{" "}
                  <Link to="/Product">Go Shopping</Link>
                </h3>
              </div>
            ) : (
              <ListGroup>
              
                {cartData.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={8}>
                        <div className="">
                          <span>
                            {item.discount.discountAvailable === true ? (
                              <span className="discount_btn">
                                -{item.discount.discountValue}%
                              </span>
                            ) : (
                              <span></span>
                            )}
                          </span>

                          <FavoriteBorderIcon
                            onClick={() => addToLike(item._id)}
                            className="like_btn"
                            sx={{ fontSize: 24 }}
                          />
                          <Link to={`/Product/${item.slug}`}>
                            <img
                              loading="lazy"
                              alt={item.name}
                              src={item.product_image}
                            />
                          </Link>

                          <div className="product_info cartProject">
                            <h5>{item.name}</h5>

                            <div className="">
                              <div className="review_box">
                                <StarIcon
                                  sx={{ fontSize: 18, color: "#DDC531" }}
                                />
                                {item.rating.toFixed(2)}({item.numberReviews} review)
                              </div>
                              <h5>
                                {item.discount.discountAvailable === true ? (
                                  <div className="discount_price">
                                    <span className="old_price">
                                      {item.price.toFixed(2)} DZD
                                    </span>
                                  </div>
                                ) : (
                                  <span className="new_price"></span>
                                )}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col md={3}>
                        <Button
                          variant="light"
                          disabled={item.quantity === 1}
                          onClick={() =>
                            updateCartHandler(item, item.quantity - 1)
                          }
                        >
                          <i className="fas fa-minus-circle"></i>
                        </Button>{" "}
                        <span>{item.quantity}</span>{" "}
                        <Button
                          variant="light"
                          disabled={item.quantity === item.countInStock}
                          onClick={() =>
                            updateCartHandler(item, item.quantity + 1)
                          }
                        >
                          <i className="fas fa-plus-circle"></i>
                        </Button>
                      </Col>
                      <Col md={3}>
                        <h5>
                          {item.discount.discountAvailable
                            ? (
                                item.price -
                                (item.price * item.discount.discountValue) / 100
                              ).toFixed(2)
                            : item.price.toFixed(2)}{" "}
                          DZD
                        </h5>
                      </Col>
                      <Col md={2}>
                        <Button
                          onClick={() => removeItemHandler(item)}
                          variant="light"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                <h5>Shopping Cart</h5>
                  <ListGroup.Item>
                    <h3>
                      Product: {cartData.reduce((a, c) => a + c.quantity, 0)}{" "}
                      <br />
                      {cartData
                        .reduce(
                          (a, c) =>
                            a +
                            (c.price -
                              (c.price * c.discount.discountValue) / 100) *
                              c.quantity,
                          0
                        )
                        .toFixed(2)}{" "}
                      DZD
                    </h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={checkoutHandler}
                        disabled={cartData.length === 0}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default CardPage;
