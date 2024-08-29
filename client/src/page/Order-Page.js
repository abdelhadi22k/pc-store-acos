import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import domain from "../utils/config";
import { getError } from "../handelErorr/Utis";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Loading from "../components/utils/Loding";
import Message from "../components/utils/Message ";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import Form from "react-bootstrap/Form";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Accordion from "react-bootstrap/Accordion";
import { AlertTitle, Tooltip } from "@mui/material";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };

    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false };
    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      return state;
  }
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Order_Page() {
  const userInfo = useSelector((state) => state.user.userInfo);

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();
  const [{ loading, error, order, successPay, successDeliver }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: "",
      successPay: false,
      loadingPay: false,
    });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${domain}/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate("/login");
    }
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
      }
    }
  }, [
    order,
    userInfo,
    orderId,
    navigate,
    paypalDispatch,
    successPay,
    successDeliver,
  ]);

  const [name, setName] = useState();
  const [rating, setRating] = useState();
  const [comment, setComment] = useState();
  const [id, setId] = useState();
  const [alert, setAlert] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // event.preventDefault();
  const [isSubmitting, setIsSubmitting] = useState(false);



  const add_your_review = async (item) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`${domain}/api/products/addReview/${item}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();


        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          This is an error.{errorDetails}
        </Alert>;

        throw new Error(`Failed to add review: ${response.statusText}`);
      }

      const data = await response.json();
     

      setAlert(
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          Add your review successfully
        </Alert>
      );

      setTimeout(() => {
        setAlert(null);
      }, 3000);
    } catch (error) {
      setAlert(
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
          Error add your review: {error.message}
        </Alert>
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
        await axios.delete(`${domain}/api/orders/${orderId}`);

        setAlert(
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          Cancel Successfully
          </Alert>
        );
        setTimeout(() => {
          setAlert(null);
        }, 3000);
    } catch (error) {
      <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      This is an error. {error}
    </Alert>;
    } 
};

  return loading ? (
    <Loading />
  ) : error ? (
    <Message variant="danger" message={error} />
  ) : (
    <Container className="shipping">
      <div className="alert"> {alert}</div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h3 className="my-3">Order {orderId}</h3>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name: </strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong>
                {order.shippingAddress.address},<br />
                <strong>Municipality: </strong>
                {order.shippingAddress.city}, <br />
                <strong>Phone Number: </strong>
                {order.shippingAddress.postalCode}
                <br />
                <strong>Post Code: </strong>
                {order.shippingAddress.country}
              </Card.Text>

              {order.isDelivered === true ? (
                <h4 variant="danger">Your order is now being delivered</h4>
              ) : (
                <h4 variant="danger">
                  Your order will be delivered after it is reviewed and
                  confirmed
                </h4>
              )}

            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>

              {order.isPaid === true ? (
                <h4 variant="danger"> Your order has been paid</h4>
              ) : (
                <h4 variant="danger">Cash on delivery</h4>
              )}

            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                      
                        <Link
                          className="productTitle"
                          to={`/product/${item.slug}`}
                        >
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>
                      {item.price * item.quantity} DZD 
                      </Col>

                      <Col md={6}>

                      {order.isDelivered === true && order.isPaid === true ? (
                        
                        <Accordion defaultActiveKey={["0"]} >
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            {" "}
                            Add your review{" "}
                          </Accordion.Header>
                          <Accordion.Body>
                            <Form
                              onSubmit={(event) => {
                                event.preventDefault();
                                add_your_review(item._id);
                              }}
                            >
                              <Form.Group
                                className="mb-3"
                                controlId="formBasicName"
                              >
                                <Form.Label>Put Your Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Client Name"
                                  onChange={(e) => setName(e.target.value)}
                                />
                              </Form.Group>

                              <Form.Group
                                className="mb-3"
                                controlId="formBasicRating"
                              >
                                <Form.Label>
                                  Rate the product from 1 to 5
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  min="1"
                                  max="5"
                                  placeholder="Rating"
                                  onChange={(e) => setRating(e.target.value)}
                                />
                              </Form.Group>

                              <Form.Group
                                className="mb-3"
                                controlId="formBasicReview"
                              >
                                <Form.Label>
                                  Give your final review for the product{" "}
                                </Form.Label>
                                <Form.Control
                                  as="textarea"
                                  placeholder="Review"
                                  onChange={(e) => setComment(e.target.value)}
                                />
                              </Form.Group>

                              <Button
                                variant="primary"
                                type="submit"
                                disabled={isSubmitting}
                              >
                                Submit
                              </Button>
                            </Form>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                        
                      ) : (
                        
                        <Tooltip open={open} onClose={handleClose} onOpen={handleOpen} title="You can review your order immediately after confirming it">
                          <h6>review</h6>
                        </Tooltip>
                        
                      )}
                      
                      
                       

                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>{order.itemsPrice.toFixed(2)} DZD</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>{order.shippingPrice.toFixed(2)} DZD</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>{order.taxPrice.toFixed(2)} DZD</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>{order.totalPrice.toFixed(2)} DZD</strong>
                    </Col>
                    <Button
                    variant="danger"
                    onClick={() => deleteOrder(order._id)}
                    >
                    Cancel Order
                  </Button>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
