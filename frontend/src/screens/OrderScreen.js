import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetOrderDetailsQuery,
  useGetPayPalClinetIdQuery,
  usePayOrderMutation,useDeliverOrderMutation
} from "../slices/ordersApiSlice";
import Loader from "./../components/Loader.js";
import Message from "./../components/Message.js";

function OrderScreen() {
  const { id: orderId } = useParams();
  //console.log(`OrderId:${orderId}`);
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  //console.log(order);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClinetIdQuery();
  const [deliverOrder,{isLoading:loadingDeliver}]=useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [clientId, setClientId] = useState("");
  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clinetId) {
       setClientId(paypal.clinetId);
      const loadPayPalScript = async () => {
        console.log(`Hello world This is PayPalId ${paypal.clinetId}`);
        paypalDispatch({
          type: "resetOptions",
          value: {
            "clinet-id": paypal.clinetId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  function onApprove(data, actions) 
  {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment successful");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  }
  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success("Payment successful");
  }

  function onError(err) {
    toast.error(err.message);
  }
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice.toFixed(2),
              currency_code: "USD",
            },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }
async function deliverOrderHandler(){
  try {
    await deliverOrder(orderId);
    refetch();
    toast.success('Order delivered')
  } catch (err) {
    toast.error(err?.data?.message|| err.message);
  }

}
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger" />
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name:</strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email:</strong>
                {order.user.email}
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address},{order.shippingAddress.city}, ,
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/*PAY ORDER PLACEORDER */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      <Button
                        onClick={onApproveTest}
                        style={{ marginBottom: "10px" }}
                      >
                        Test Pay Order
                      </Button>
                      <div>
                        <PayPalScriptProvider
                          options={{ "client-id": clientId }}
                        >
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </PayPalScriptProvider>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
              {/* MARK As Delivered PLACEHOLDER*/}
              {loadingDeliver && <Loader/>}
              {userInfo && userInfo.isAdmin && order.isPaid &&!order.isDelivered &&(
                <ListGroup.Item>
                  <Button type='button' className='btn btn-block'
                   onClick={deliverOrderHandler}
                  >
                    Mark As Delivered

                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default OrderScreen;
