import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
import { auth } from "../client/FireBaseConfig";
import { getUserOrders } from "../UserProfile/userOrders";
import OrderDetails from "./orderDetails";

export default function OrderHistory() {
  const [uid, setUid] = useState<string | null>(auth.currentUser?.uid ?? null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
      setSelectedOrderId(null);
    });

    return unsubscribe;
  }, []);

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", uid],
    queryFn: () => getUserOrders(uid as string),
    enabled: Boolean(uid),
  });

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? null,
    [orders, selectedOrderId],
  );

  if (!uid) {
    return <p>Please log in to view your order history.</p>;
  }

  if (isLoading) {
    return <p>Loading your orders...</p>;
  }

  if (error) {
    return (
      <p>
        Unable to load orders right now. Please refresh, and ensure you are
        logged in with the account used at checkout.
      </p>
    );
  }

  if (!orders.length) {
    return <p>No previous orders yet.</p>;
  }

  return (
    <div>
      <h2>Order History</h2>
      {orders.map((order) => (
        <div key={order.id} className="cart-item">
          <h3>Order #{order.id}</h3>
          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p>Total: ${order.totalPrice.toFixed(2)}</p>
          <button onClick={() => setSelectedOrderId(order.id)}>
            View Details
          </button>
        </div>
      ))}

      {selectedOrder && <OrderDetails order={selectedOrder} />}
    </div>
  );
}
