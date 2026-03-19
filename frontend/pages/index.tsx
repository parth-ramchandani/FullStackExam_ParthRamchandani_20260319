import Link from "next/link";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { apiRequest } from "../lib/api";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
};

type HomeProps = {
  products: Product[];
  totalPages: number;
  page: number;
  search: string;
  category: string;
};

export default function Home({ products, totalPages, page, search, category }: HomeProps) {
  const [message, setMessage] = useState("");

  const addToCart = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please log in first to add items to cart.");
      return;
    }

    try {
      await apiRequest("/cart/items", {
        method: "POST",
        token,
        body: { productId, quantity: 1 }
      });
      setMessage("Item added to cart.");
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <div>
      <h2>Product Catalog</h2>
      <form style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input className="input" name="search" defaultValue={search} placeholder="Search by keyword" />
        <input className="input" name="category" defaultValue={category} placeholder="Category filter" />
        <button className="btn" type="submit">
          Apply
        </button>
      </form>
      <div className="card-grid">
        {products.map((product) => (
          <article key={product._id} className="card">
            <h3>{product.name}</h3>
            <p>{product.category}</p>
            <p>${product.price.toFixed(2)}</p>
            <Link href={`/products/${product._id}`}>View Details</Link>
            <div style={{ marginTop: "0.6rem" }}>
              <button className="btn" onClick={() => addToCart(product._id)}>
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>
      <p>
        Page {page} of {Math.max(totalPages, 1)}
      </p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {page > 1 && (
          <Link href={`/?page=${page - 1}&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`}>
            Previous
          </Link>
        )}
        {page < totalPages && (
          <Link href={`/?page=${page + 1}&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`}>
            Next
          </Link>
        )}
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({ query }) => {
  const page = Number(query.page || 1);
  const search = String(query.search || "");
  const category = String(query.category || "");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
  const response = await fetch(
    `${apiUrl}/products?page=${page}&limit=8&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`
  );
  const data = await response.json();

  return {
    props: {
      products: data.products || [],
      totalPages: data.totalPages || 1,
      page,
      search,
      category
    }
  };
};
