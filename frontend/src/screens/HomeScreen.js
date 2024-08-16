// import axios from "axios";
// import { React, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
// import products from "../products";
import Loader from "../components/Loader.js";
import Message from "../components/Message.js";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productApiSlice.js";

const HomeScreen = () => {
  const { data, isLoading, error } = useGetProductsQuery();
  //console.log(data);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row>
            {data.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
