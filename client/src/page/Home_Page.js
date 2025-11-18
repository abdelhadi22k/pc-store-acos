import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import categories from "../data/categories";
import Offer_section from "../section/home page/Offer_section";
import Offer_banner from "../section/home page/Offer_banner";
import Product_home from "../section/home page/Product_home";

const Home_Page = () => {
  const heroStyles = {
    container: {
      position: "relative",
      width: "100%",
      height: "65vh",
      overflow: "hidden",
    },
    background: {
      position: "absolute",
      inset: 0,
      backgroundImage: "url(sources/img/home_page.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      zIndex: -1,
    },
    overlay: {
      position: "absolute",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 0,
    },
    content: {
      position: "relative",
      zIndex: 1,
      color: "#fff",
      padding: "20px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: 700,
      marginBottom: "0.75rem",
    },
    subtitle: {
      maxWidth: "600px",
      lineHeight: 1.5,
      fontSize: "1rem",
      opacity: 0.9,
    },
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero" style={heroStyles.container}>
        <div style={heroStyles.background} />
        <div style={heroStyles.overlay} />
        <div style={heroStyles.content}>
          <h1 style={heroStyles.title}>PC World Portal</h1>
          <p style={heroStyles.subtitle}>
            A store specialized in selling all PC parts and accessories to make
            your place more wonderful
          </p>
        </div>
      </section>

      {/* Categories Slider */}
      <section className="home-categories py-5">
        <Container>
          <div className="info_top d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">A variety of electronic products</h2>
            <Link to="/Product" className="main_btn">
              Discover More
            </Link>
          </div>

          <Swiper
            slidesPerView={1}
            spaceBetween={12}
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 28,
              },
            }}
            modules={[Pagination]}
            className="home-categories-swiper"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index} className="category_slide">
                <div className="category_box">
                  <div className="category_box_Shade">
                    <h5>{category.Category}</h5>
                  </div>

                  <img
                    alt={category.Category}
                    src={category.categoryImg}
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </section>

      {/* Other Sections */}
      <Offer_section />
      <Offer_banner />
      <Product_home />
    </div>
  );
};

export default Home_Page;
