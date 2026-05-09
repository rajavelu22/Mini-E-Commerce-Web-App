import { Fragment } from "react/jsx-runtime";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);

  // useSearchParams reads the ?keyword= from the URL
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    // If there's a keyword, fetch filtered products — otherwise fetch all
    const url = keyword
      ? `http://localhost:8000/api/v1/products?keyword=${keyword}`
      : `http://localhost:8000/api/v1/products`;

    fetch(url)
      .then((res) => res.json())
      // API returns { success: true, products: [...] }
      // We extract just the products array
      .then((data) => setProducts(data.products));

  }, [searchParams]); // Re-run whenever the search keyword changes

  return (
    <Fragment>
      <h1 id="products_heading">Latest Products</h1>
      <section id="products" className="container mt-5">
        <div className="row">
          {/* Render one ProductCard per product from the API */}
          {products && products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </Fragment>
  );
}
