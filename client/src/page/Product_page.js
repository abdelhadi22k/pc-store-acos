import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import domain from "./../utils/config";
import Product from "./../components/product/Product";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Loading from "../components/utils/Loding";
import Message from "../components/utils/Message ";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Alert, AlertTitle } from "@mui/material";
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

const Product_page = () => {
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
  }, [category, brand, offer, error, order, page, price, query, rating ]);

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

  const [brands, setBrand] = useState([]);
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const { data } = await axios.get(`${domain}/api/products/brand`);
        setBrand(data);
      } catch (err) {
        <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        This is an error.{err.message}
      </Alert>;
      }
    };
    fetchBrand();
  }, [dispatch]);

  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const { data } = await axios.get(
          `${domain}/api/products/offer_description`
        );
        setOffers(data);
      } catch (err) {

       <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          This is an error.{err.message}
        </Alert>;
      }
    };
    fetchOffer();
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
      skipPathname ? "" : "/Product?"
    }category=${filterCategory}&offer=${filterOffer}&brand=${filterBrand}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };

  const handlePageChange = (event, value) => {
    navigate(getFilterUrl({ page: value }));
  };

  return (

    <div className="product_container">
      <Helmet>
        <title>Shop Product</title>
      </Helmet>
      <Row>
        <Col md={2} className="product_page_sort_by">
          <Col md={6}>
            <div>
              <h4 className="Check_out_product">Check out the products</h4>
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
                <Button variant="light" onClick={() => navigate("/Product")}>
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

            <ul>
              <DropdownButton
                className="Dropdown_button"
                id="dropdown-item-button"
                title="Category"
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
                title="Brand"
              >
                <Dropdown.ItemText>Available brand</Dropdown.ItemText>
                <li>
                  <Dropdown.Item as="button" className="">
                    <Link
                      className={"all" === brand ? "text-bold" : ""}
                      to={getFilterUrl({ brand: "all" })}
                    >
                      {" "}
                      Any
                    </Link>
                  </Dropdown.Item>
                </li>

                {brands.map((c) => (
                  <li key={c}>
                    <Dropdown.Item as="button" className="">
                      <Link
                        className={c === brand ? "text-bold" : ""}
                        to={getFilterUrl({ brand: c })}
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
                title="Offers"
              >
                <Dropdown.ItemText>Available offer</Dropdown.ItemText>
                <li>
                  <Dropdown.Item as="button" className="">
                    <Link
                      className={"all" === offer ? "text-bold" : ""}
                      to={getFilterUrl({ offer: "all" })}
                    >
                      {" "}
                      Any
                    </Link>
                  </Dropdown.Item>
                </li>

                {offers.map((c) => (
                  <li key={c}>
                    <Dropdown.Item as="button" className="">
                      <Link
                        className={c === offer ? "text-bold" : ""}
                        to={getFilterUrl({ offer: c })}
                      >
                        {c}
                      </Link>
                    </Dropdown.Item>
                  </li>
                ))}
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
              {
                products.map((product) => (
                  <div className="mb-3" key={product._id}>
                    <div className="searchBoxHolder">
                      <Product product={product}></Product>
                    </div>
                  </div>
                ))
             }
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

export default Product_page;
