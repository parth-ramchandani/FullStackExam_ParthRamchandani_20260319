import { GetServerSideProps } from "next";
import { useState } from "react";
import { apiRequest } from "../../lib/api";

type Product = {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
};

type ProductPageProps = {
  product: Product | null;
};

export default function ProductPage({ product }: ProductPageProps) {
  const [message, setMessage] = useState("");

  if (!product) {
    return <p>Product not found.</p>;
  }

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login first to add items to cart.");
      return;
    }

    try {
      await apiRequest("/cart/items", {
        method: "POST",
        token,
        body: { productId: product._id, quantity: 1 }
      });
      setMessage("Added to cart.");
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <section className="card">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Category: {product.category}</p>
      <p>Price: ${product.price.toFixed(2)}</p>
      <p>In stock: {product.stock}</p>
      <button className="btn" onClick={addToCart}>
        Add to Cart
      </button>
      {message && <p>{message}</p>}
    </section>
  );
}

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async ({ params }) => {
  const id = params?.id;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
  const response = await fetch(`${apiUrl}/products/${id}`);

  if (!response.ok) {
    return { props: { product: null } };
  }

  const product = await response.json();
  return { props: { product } };
};
