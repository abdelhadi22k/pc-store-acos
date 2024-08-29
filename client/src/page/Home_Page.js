import React from "react";
import categories from "../data/categories";
import { Container } from "react-bootstrap";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";
import Offer_section from "../section/home page/Offer_section";
import Offer_banner from "../section/home page/Offer_banner";
import Product_home from "../section/home page/Product_home";
import NavBar from "../components/utils/NavBar";
import { Link } from "react-router-dom";

const Home_Page = () => {
  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "65vh",
  };

  const backgroundStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: "url(sources/img/home_page.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: -1,
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 0,
  };

  const contentStyle = {
    position: "relative",
    zIndex: 1,
    color: "white",
    padding: "20px",
    textAlign: "center",
  };

  return (
    <div>
      <div className="Home_Page" style={containerStyle}>
        <div style={backgroundStyle}></div>
        <div style={overlayStyle}></div>
        <div style={contentStyle} className="home_page_content">
          <h1>PC World Portal</h1>
          <p>
            A store specialized in selling all PC parts and accessories to make
            your place more wonderful
          </p>
        </div>
      </div>

      <div className="Home_Page_category"></div>

      <Container>
        <div className="info_top">
          <h2>A variety of electronic products</h2>
          <Link to="/Product" className="main_btn">Discover More</Link>
        </div>
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {categories.map((Category, index) => {
            return (
              <SwiperSlide key={index} className="category_slide">
                <div className="category_box">
                  <div className="category_box_Shade">
                    {" "}
                    <h5>{Category.Category}</h5>{" "}
                  </div>
                  <img alt={Category.Category} src={Category.categoryImg} />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper> 
      </Container>

      <Offer_section />
      <Offer_banner />
      <Product_home />
    </div>
  );
};

export default Home_Page;
