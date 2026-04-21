import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchCart,
  updateCart,
  removeCart,
  clearCartAPI,
} from "../store/slices/cartSlice";
import { placeOrder } from "../store/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import "../Cart.css";

export default function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, loading, error } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) return <p className="cart-status">Loading cart...</p>;
  if (error) return <p className="cart-status cart-error">{error}</p>;

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2 className="cart-title">🛒 Your Cart</h2>

        {items.length === 0 && <p className="cart-empty">Cart is empty</p>}

        {items.map((item) => (
          <div key={item.id} className="cart-card">
            <img
              src={item.product.imageUrl || "https://via.placeholder.com/100"}
              alt={item.product.name}
              className="cart-image"
            />

            <div className="cart-details">
              <h3 className="cart-product-name">{item.product.name}</h3>
              <p className="cart-price">₹ {item.product.price}</p>

              <div className="cart-quantity-box">
                <button
                  className="qty-btn"
                  onClick={() =>
                    dispatch(
                      updateCart({
                        productId: item.productId,
                        quantity: item.quantity - 1,
                      })
                    )
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </button>

                <span className="cart-quantity">{item.quantity}</span>

                <button
                  className="qty-btn"
                  onClick={() =>
                    dispatch(
                      updateCart({
                        productId: item.productId,
                        quantity: item.quantity + 1,
                      })
                    )
                  }
                >
                  +
                </button>
              </div>

              <button
                className="remove-btn"
                onClick={() => dispatch(removeCart(item.productId))}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {items.length > 0 && (
          <div className="cart-summary">
            <h2 className="cart-total">Total: ₹ {total}</h2>

            <div className="cart-actions">
              <button
                className="clear-cart-btn"
                onClick={() => dispatch(clearCartAPI())}
              >
                Clear Cart
              </button>

              <button
                className="place-order-btn"
                onClick={async () => {
                  await dispatch(placeOrder());
                  await dispatch(clearCartAPI());
                  navigate("/orders");
                }}
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}