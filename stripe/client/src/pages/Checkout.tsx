import { useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import AddItemForm from "../components/AddItemForm";

interface Product {
  name: string;
  description: string;
  amount: number;
  quantity: number;
}

const Checkout: React.FC = () => {
  const stripe = useStripe();
  const [items, setItems] = useState<Product[]>([]);
  const [email, setEmail] = useState("");

  const handleAddItem = (item: Product) => {
    setItems([...items, item]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCheckout = async () => {
    const response = await fetch("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: items,
        customer: {
          email: email,
        },
      }),
    });

    const session = await response.json();

    const result = await stripe?.redirectToCheckout({
      sessionId: session.id,
    });

    if (result?.error) {
      console.error(result.error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2 border rounded w-full max-w-lg mb-4"
        required
      />
      <AddItemForm onAddItem={handleAddItem} />
      <ul className="mt-6 space-y-4 w-80 max-w-7xl">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex flex-row justify-between items-center p-4 bg-white rounded shadow w-full"
          >
            <div className="flex-1">
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p>{item.description}</p>
              <p>Amount: ₹{item.amount}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <button
              onClick={() => handleRemoveItem(index)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleCheckout}
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        disabled={!stripe || items.length === 0 || !email}
      >
        Checkout
      </button>
    </div>
  );
};

export default Checkout;
