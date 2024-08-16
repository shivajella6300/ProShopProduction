const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  //Calculte items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  //calculate the Shipping Price (If order is over $100 then free,else $10 shipping)
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

  //calcuate the tax Price (15%)
  state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice).toFixed(2));

  //calculate the Total Price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);
  localStorage.setItem("cart", JSON.stringify(state));
  return state;
};
