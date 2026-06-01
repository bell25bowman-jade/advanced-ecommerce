{
  orders?.map((order) => (
    <div key={order.id}>
      <h3>Order #{order.id}</h3>

      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

      <p>Total: ${order.totalPrice}</p>
    </div>
  ));
}
