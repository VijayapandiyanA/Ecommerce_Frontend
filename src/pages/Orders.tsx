import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchOrders } from "../store/slices/orderSlice";
import "../Orders.css";

export default function Orders() {
  const dispatch = useAppDispatch();

  const { orders, loading, error } = useAppSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <p className="orders-status">Loading orders...</p>;
  if (error) return <p className="orders-status orders-error">{error}</p>;

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h2 className="orders-title"> Order History</h2>

        {orders.length === 0 && <p className="orders-empty">No orders yet</p>}

        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3 className="order-id">Order #{order.id}</h3>
              <span className="order-status">{order.status}</span>
            </div>

            <div className="order-summary">
              <p>
                Total: <span>₹ {order.totalPrice}</span>
              </p>
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img
                    src={item.product.imageUrl || "https://via.placeholder.com/60"}
                    alt={item.product.name}
                    className="order-item-image"
                  />

                  <div className="order-item-details">
                    <p className="item-name">{item.product.name}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Price: ₹ {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}