import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { removeFromCart, updateCount, clearCart } from "../store/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const totalCount = items.reduce((sum, i) => sum + i.count, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.count, 0);

  if (!items.length) return <p>Your cart is empty.</p>;

  return (
    <div>
      <h1>Shopping Cart</h1>
      <p>Total items: {totalCount}</p>
      <p>Total price: ${totalPrice.toFixed(2)}</p>

      {items.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.image} width={60} alt={item.title} />
          <h3>{item.title}</h3>
          <p>${item.price}</p>

          <input
            type="number"
            min="1"
            value={item.count}
            onChange={(e) =>
              dispatch(
                updateCount({ id: item.id, count: Number(e.target.value) }),
              )
            }
          />

          <button onClick={() => dispatch(removeFromCart(item.id))}>
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={() => {
          dispatch(clearCart());
          alert("Checkout complete!");
        }}
      >
        Checkout
      </button>
    </div>
  );
}
