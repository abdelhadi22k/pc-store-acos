import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import domain from "./../utils/config";
import Product from "./../components/product/Product";
import Rating from "../components/utils/Rating";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Search_box from "../components/utils/Search_box";
import Message from "./../components/utils/Message ";
import Loading from "./../components/utils/Loding";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Alert } from "react-bootstrap";
import { AlertTitle } from "@mui/material";
import SectionLoding from "../components/utils/SectionLoding";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: "1000 DZD to 5000 DZD",
    value: "1000-5000",
  },
  {
    name: "5001 DZD to 10000 DZD",
    value: "5001-10000",
  },
  {
    name: "10001 DZD to 50000 DZD",
    value: "10001-50000",
  },
  {
    name: "50001 DZD to 150000 DZD",
    value: "50001-150000",
  },
  {
    name: "150001 DZD to 500000 DZD",
    value: "150001-500000",
  },
  {
    name: "500001 DZD to 1000000 DZD",
    value: "500001-1000000",
  },
  {
    name: "1000001 DZD to 2000000 DZD",
    value: "1000000-2000000",
  },

];

export const ratings = [
  {
    name: "5stars & up",
    rating: 5,
  },
  {
    name: "4stars & up",
    rating: 4,
  },

  {
    name: "3stars & up",
    rating: 3,
  },

  {
    name: "2stars & up",
    rating: 2,
  },

  {
    name: "1stars & up",
    rating: 1,
  },
];

const Search_page = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") || "all";
  const brand = sp.get("brand") || "all";
  const offer = sp.get("offer") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const [{ loading, error, products, pages, countFood }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  // products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${domain}/api/products/search?page=${page}&query=${query}&brand=${brand}&offer=${offer}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: console.error(err),
        });
      }
    };
    fetchData();
  }, [category, brand, offer, error, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${domain}/api/products/categories`);
        setCategories(data);
      } catch (err) {
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          This is an error.{err.message}
        </Alert>;
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter, skipPathname) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterBrand = filter.brand || brand;
    const filterOffer = filter.offer || offer;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `${
      skipPathname ? "" : "/search?"
    }category=${filterCategory}&offer=${filterOffer}&brand=${filterBrand}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };

  const handlePageChange = (event, value) => {
    navigate(getFilterUrl({ page: value }));
  };

  return (
    <div className="product_container">
      <div className="alert"> {alert}</div>
      <Helmet>
        <title>Search products</title>
      </Helmet>
      <Row>
        <Col md={2} className="product_page_sort_by">
          <Search_box />

          <Col md={6}>
            <div>
              <h4 className="Check_out_product">Result</h4>
              {countFood === 0 ? "No" : countFood}
              {query !== "all" && " : " + query}
              {category !== "all" && " : " + category}
              {brand !== "all" && " : " + brand}
              {offer !== "all" && " : " + offer}
              {price !== "all" && " : Price " + price}
              {rating !== "all" && " : Rating " + rating + " & up"}
              {query !== "all" ||
              category !== "all" ||
              brand !== "all" ||
              offer !== "all" ||
              rating !== "all" ||
              price !== "all" ? (
                <Button variant="light" onClick={() => navigate("/search")}>
                  <i className="fas fa-times-circle"></i>
                </Button>
              ) : null}
            </div>
          </Col>
          <div>
            <Row className="justify-content-between mb-3 Sort_by">
              <Col className="text-start">
                Sort by
                <select
                  className="select"
                  value={order}
                  onChange={(e) => {
                    navigate(getFilterUrl({ order: e.target.value }));
                  }}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="toprated">Avg. Customer Reviews</option>
                  <option value="lowest">Price: Low to High</option>
                  <option value="highest">Price: High to Low</option>
                </select>
              </Col>
            </Row>
          </div>

          <div>
            <ul>
              <DropdownButton
                className="Dropdown_button"
                id="dropdown-item-button"
                title="category"
              >
                <Dropdown.ItemText>Available categories</Dropdown.ItemText>
                <li>
                  <Dropdown.Item as="button" className="">
                    <Link
                      className={"all" === category ? "text-bold" : ""}
                      to={getFilterUrl({ category: "all" })}
                    >
                      {" "}
                      Any
                    </Link>
                  </Dropdown.Item>
                </li>

                {categories.map((c) => (
                  <li key={c}>
                    <Dropdown.Item as="button" className="">
                      <Link
                        className={c === category ? "text-bold" : ""}
                        to={getFilterUrl({ category: c })}
                      >
                        {c}
                      </Link>
                    </Dropdown.Item>
                  </li>
                ))}
              </DropdownButton>
            </ul>
          </div>
          <div>
            <ul>
              <DropdownButton
                className="Dropdown_button"
                id="dropdown-item-button"
                title="Price"
              >
                <Dropdown.ItemText>Hot prices </Dropdown.ItemText>

                <li>
                  <Dropdown.Item as="button" className="">
                    <Link
                      className={"all" === price ? "text-bold" : ""}
                      to={getFilterUrl({ price: "all" })}
                    >
                      Any
                    </Link>
                  </Dropdown.Item>
                </li>

                {prices.map((p) => (
                  <li key={p.value}>
                    <Dropdown.Item as="button" className="">
                      <Link
                        to={getFilterUrl({ price: p.value })}
                        className={p.value === price ? "text-bold" : ""}
                      >
                        {p.name}
                      </Link>
                    </Dropdown.Item>
                  </li>
                ))}
              </DropdownButton>
            </ul>
          </div>
          <div>
            <ul>
              <DropdownButton
                className="Dropdown_button"
                id="dropdown-item-button"
                title="Review"
              >
                {ratings.map((r) => (
                  <li key={r.name}>
                    <Dropdown.Item as="button" className="">
                      <Link
                        to={getFilterUrl({ rating: r.rating })}
                        className={
                          `${r.rating}` === `${rating}` ? "text-bold" : ""
                        }
                      >
                        <Rating caption={" & up"} rating={r.rating}></Rating>
                      </Link>
                    </Dropdown.Item>
                  </li>
                ))}
                <li>
                  <Dropdown.Item as="button" className="">
                    <Link
                      to={getFilterUrl({ rating: "all" })}
                      className={rating === "all" ? "text-bold" : ""}
                    >
                      <Rating caption={" & up"} rating={0}></Rating>
                    </Link>
                  </Dropdown.Item>
                </li>
              </DropdownButton>
            </ul>
          </div>
        </Col>
        <Col md={10}>
        {loading ? (
          <SectionLoding></SectionLoding>
        ) : error ? (
          <Message variant="danger" message={error} />
        ) : (
            <>
              {products.length === 0 && (
                <div className="No_Product_Found">
                  <script src="https://cdn.lordicon.com/lordicon.js"></script>
                  <lord-icon
                    src="https://cdn.lordicon.com/fnxnvref.json"
                    trigger="hover"
                    colors="primary:#151515"
                    style={{ width: "250px", height: "250px" }}
                  ></lord-icon>
                  <h3>No Product Found</h3>
                </div>
              )}

              <div className="product_page_holder">

              

                {products.map((product) => (
                  <div className="mb-3" key={product._id}>
                    <div className="searchBoxHolder">
                      <Product product={product}></Product>
                    </div>
                  </div>
                ))}


              </div>

              <div className="page_next">
                <Stack spacing={2}>
                  <Pagination
                    count={pages}
                    page={Number(page)}
                    onChange={handlePageChange}
                    variant="outlined"
                    color="primary"
                  />
                </Stack>
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Search_page;
