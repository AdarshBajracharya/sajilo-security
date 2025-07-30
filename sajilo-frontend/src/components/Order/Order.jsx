import React, { useEffect, useState } from "react";
import { getAllOrdersApi, updateOrderStatusApi } from "../../apis/Api";
import "./ListOrder.css"; // New separate CSS for clarity

const ListOrder = () => {
  const [allOrders, setAllOrders] = useState([]);

  const fetchOrders = () => {
    getAllOrdersApi()
      .then((res) => {
        setAllOrders(res.data.orders);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  const updateOrder = (id, status) => {
    updateOrderStatusApi(id, status)
      .then(() => fetchOrders())
      .catch((error) => {
        console.error("Error updating order:", error);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (event, orderId) => {
    const newStatus = event.target.value;
    updateOrder(orderId, newStatus);
  };

  return (
    <div className="order-container">
      <h2>📦 Order Management</h2>
      <div className="order-grid">
        {allOrders.map((order, index) => (
          <div className="order-card" key={index}>
            <div className="order-info">
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Total:</strong> Rs. {order.grandTotal}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Customer:</strong> {order.receiverName}</p>
              <p><strong>Email:</strong> <span className="email">{order.receiverEmail}</span></p>
            </div>
            <div className="order-action">
              <label>
                Status:
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(e, order._id)}
                  className="status-dropdown"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListOrder;
