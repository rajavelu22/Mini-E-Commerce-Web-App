import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProductDetail({ cartItems, setCartItems }) {
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  // useParams reads the :id from the URL /product/:id
  const { id } = useParams();

  useEffect(() => {
    // Fetch the single product from the backend using its ID
    fetch(`${process.env.REACT_APP_API_URL}product/${id}`)
      .then((res) => res.json())
      // API returns { success: true, product: {...} }
      .then((data) => setProduct(data.product));
  }, [id]); // Re-fetch if the ID in the URL changes

  // Add to Cart handler — reads existing cart from localStorage,
  // adds this product with selected qty, then saves back to localStorage
  const addToCart = () => {
    // Check if this product is already in the cart
    const itemExist = cartItems.find((item) => item.product._id === product._id);
    let newCartItems;

    if (!itemExist) {
        const newItem = { product, qty };
        newCartItems = [...cartItems, newItem];
    } else {
        newCartItems = cartItems.map((item) => {
            if (item.product._id === product._id) {
                return { ...item, qty: item.qty + qty };
            }
            return item;
        });
    }
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    toast.success("Cart Item added successfully!");
  };

  const increaseQty = () => {
    if (product.stock == qty) {
      return;
    }
    setQty((prevQty) => prevQty + 1);
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty((prevQty) => prevQty - 1);
    }
  };

  if (!product) {
      return <div>Loading...</div>;
  }

  return (
    <div className="container container-fluid">
        <div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
                <img src={product.images && product.images.length > 0 ? product.images[0].image : ''} alt={product.name} height="500" width="500" />
            </div>

            <div className="col-12 col-lg-5 mt-5">
                <h3>{product.name}</h3>
                <p id="product_id">Product # {product._id}</p>

                <hr />

                <div className="rating-outer">
                    <div className="rating-inner" style={{width: `${(product.ratings / 5) * 100}%`}}></div>
                </div>
           
                <hr />

                <p id="product_price">${product.price}</p>
                <div className="stockCounter d-inline">
                    <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>
                    <input type="number" className="form-control count d-inline" value={qty} readOnly />
                    <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                </div>
                 <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" disabled={product.stock === 0} onClick={addToCart}>Add to Cart</button>

                <hr />

                <p>Status: <span id="stock_status" className={product.stock > 0 ? "text-success" : "text-danger"}>{product.stock > 0 ? "In Stock" : "Out of Stock"}</span></p>

                <hr />

                <h4 className="mt-2">Description:</h4>
                <p>{product.description}</p>
                <hr />
                <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
				
                <div className="rating w-50"></div>
						
            </div>

        </div>

    </div>
  );
}
