import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { Container, Row, Col, ListGroup, Button, Card } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";

import domain from "../utils/config";

function CardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cart.cartItems);
  const userInfo = useSelector((state) => state.user.userInfo);

  const [alert, setAlert] = useState(null);

  const showAlert = (content, severity = "success") => {
    setAlert(
      <Alert icon={<CheckIcon fontSize="inherit" />} severity={severity}>
        {content}
      </Alert>
    );

    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const removeItemHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const updateCartHandler = async (item, quantity) => {
    try {
      const { data } = await axios.get(`${domain}/api/products/${item._id}`);

      if (data.countInStock < quantity) {
        showAlert("Sorry. Product is out of stock", "error");
        return;
      }

      dispatch({
        type: "CART_ADD_ITEM",
        payload: { ...item, quantity },
      });
    } catch (error) {
      showAlert("Error updating cart. Please try again.", "error");
    }
  };

  const addToLike = async (productId) => {
    if (!productId) {
      showAlert("Invalid product id", "error");
      return;
    }

    try {
      const { data } = await axios.get(`${domain}/api/products/${productId}`);

      dispatch({
        type: "LIKE_ADD_ITEM",
        payload: { ...data },
      });

      showAlert("The product was added to Favorites successfully");
    } catch (err) {
      showAlert(`Error adding to Favorites: ${err.message}`, "error");
    }
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    } else {
      navigate("/shipping");
    }
  };

  const getDiscountedPrice = (item) => {
    if (!item.discount?.discountAvailable) {
      return Number(item.price).toFixed(2);
    }

    const discounted =
      item.price - (item.price * item.discount.discountValue) / 100;

    return discounted.toFixed(2);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems
    .reduce(
      (sum, item) =>
        sum + parseFloat(getDiscountedPrice(item)) * item.quantity,
      0
    )
    .toFixed(2);

  const isCartEmpty = cartItems.length === 0;

  return (
    <Container className="cartSection py-4">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>

      <div className="mb-3">{alert}</div>

      <Row>
        {/* قائمة المنتجات في السلة */}
        <Col md={8}>
          {isCartEmpty ? (
            <div className="empty_page text-center">
              <script src="https://cdn.lordicon.com/lordicon.js"></script>
              <lord-icon
                src="https://cdn.lordicon.com/pbrgppbb.json"
                trigger="hover"
                colors="primary:#151515"
                style={{ width: "250px", height: "250px" }}
              ></lord-icon>

              <h3 className="mt-3">
                Your Shopping Cart Is Empty <br />
                <Link to="/Product">Go Shopping</Link>
              </h3>
            </div>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id} className="cart-item">
                  <Row className="align-items-center">
                    {/* الصورة + الاسم + الريفيو */}
                    <Col md={6} className="d-flex align-items-center">
                      <div className="cart-item-image-wrapper">
                        {item.discount?.discountAvailable && (
                          <span className="discount_btn">
                            -{item.discount.discountValue}%
                          </span>
                        )}

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
                            className="cart-item-image"
                          />
                        </Link>
                      </div>

                      <div className="product_info cartProject ms-3">
                        <h5 className="mb-2">{item.name}</h5>

                        <div className="d-flex align-items-center gap-2">
                          <div className="review_box">
                            <StarIcon
                              sx={{ fontSize: 18, color: "#DDC531" }}
                            />
                            <span className="ms-1">
                              {item.rating?.toFixed(2)} (
                              {item.numberReviews} review
                              {item.numberReviews !== 1 ? "s" : ""})
                            </span>
                          </div>
                        </div>

                        {item.discount?.discountAvailable && (
                          <div className="discount_price mt-2">
                            <span className="old_price">
                              {Number(item.price).toFixed(2)} DZD
                            </span>
                          </div>
                        )}
                      </div>
                    </Col>

                    {/* التحكم في الكمية */}
                    <Col md={3} className="text-center mb-3 mb-md-0">
                      <Button
                        variant="light"
                        size="sm"
                        disabled={item.quantity === 1}
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>

                      <span className="mx-2 fw-semibold">{item.quantity}</span>

                      <Button
                        variant="light"
                        size="sm"
                        disabled={item.quantity === item.countInStock}
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>

                    {/* السعر + زر الحذف */}
                    <Col
                      md={3}
                      className="text-md-end text-center d-flex flex-column align-items-md-end align-items-center gap-2"
                    >
                      <h5 className="mb-0">
                        {getDiscountedPrice(item)} DZD
                      </h5>

                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant="outline-danger"
                        size="sm"
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

        {/* ملخّص السلة / المجموع */}
        <Col md={4} className="mt-4 mt-md-0">
          <Card className="cart-summary shadow-sm">
            <Card.Body>
              <h5 className="mb-3 text-center text-md-start">Shopping Cart</h5>

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Products:</span>
                    <span className="fw-semibold">{totalItems}</span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span>Total:</span>
                    <span className="fw-bold">{totalPrice} DZD</span>
                  </div>
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className="d-grid mt-3">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={isCartEmpty}
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
    </Container>
  );
}

export default CardPage;
