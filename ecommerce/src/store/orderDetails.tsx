import type { UserOrder } from "../UserProfile/userOrders";

interface OrderDetailsProps {
  order: UserOrder;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <div>
      <h3>Order Details</h3>
      <p>Order ID: {order.id}</p>
      <p>Date: {new Date(order.createdAt).toLocaleString()}</p>

      {order.products.map((product) => (
        <div key={product.productId} className="cart-item">
          <p>{product.title}</p>
          <p>Price: ${product.price.toFixed(2)}</p>
          <p>Qty: {product.quantity}</p>
        </div>
      ))}

      <p>Total: ${order.totalPrice.toFixed(2)}</p>
    </div>
  );
}