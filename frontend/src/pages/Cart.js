import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Cart({ cartItems, setCartItems }) {
    const navigate = useNavigate();

    const increaseQty = (item) => {
        if (item.product.stock == item.qty) {
            return;
        }
        const updatedCartItems = cartItems.map((i) => {
            if(i.product._id == item.product._id) {
                i.qty++
            }
            return i;
        })
        setCartItems(updatedCartItems)
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }

    const decreaseQty = (item) => {
        if (item.qty > 1) {
            const updatedCartItems = cartItems.map((i) => {
                if(i.product._id == item.product._id) {
                    i.qty--
                }
                return i;
            })
            setCartItems(updatedCartItems)
            localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        }
    }

    const removeItem = (item) => {
        const updatedCartItems = cartItems.filter((i) => {
            if(i.product._id !== item.product._id) {
                return true;
            }
        })
        setCartItems(updatedCartItems)
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }

    const placeOrderHandler = () => {
        fetch(process.env.REACT_APP_API_URL + 'order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cartItems: cartItems.map((item) => ({
                    product: item.product._id,
                    qty: item.qty,
                    price: item.product.price,
                    name: item.product.name,
                    image: item.product.images[0].image
                }))
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                setCartItems([]);
                localStorage.removeItem("cartItems");
                toast.success("Order Placed Successfully!");
                navigate("/");
            } else {
                toast.error("Failed to place order!");
            }
        });
    }

    return (
        cartItems.length === 0 ? 
        <h2 className="mt-5">Your Cart is Empty</h2>
        :
        <Fragment>
            <h2 className="mt-5">Your Cart: <b>{cartItems.length} items</b></h2>
            <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8">
                    {cartItems.map((item) => (
                        <Fragment key={item.product._id}>
                            <hr />
                            <div className="cart-item">
                                <div className="row">
                                    <div className="col-4 col-lg-3">
                                        <img src={item.product.images[0].image} alt={item.product.name} height="90" width="115" />
                                    </div>
                                    <div className="col-5 col-lg-3">
                                        <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                                    </div>
                                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                        <p id="card_item_price">${item.product.price}</p>
                                    </div>
                                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                        <div className="stockCounter d-inline">
                                            <span className="btn btn-danger minus" onClick={() => decreaseQty(item)}>-</span>
                                            <input type="number" className="form-control count d-inline" value={item.qty} readOnly />
                                            <span className="btn btn-primary plus" onClick={() => increaseQty(item)}>+</span>
                                        </div>
                                    </div>
                                    <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                        <i id="delete_cart_item" className="fa fa-trash btn btn-danger" onClick={() => removeItem(item)}></i>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    ))}
                    <hr />
                </div>

                <div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4>Order Summary</h4>
                        <hr />
                        <p>Subtotal:  <span className="order-summary-values">{cartItems.reduce((acc, item)=> (acc + item.qty), 0)} (Units)</span></p>
                        <p>Est. total: <span className="order-summary-values">${Number(cartItems.reduce((acc, item)=> (acc + item.product.price * item.qty), 0)).toFixed(2)}</span></p>
                        <hr />
                        <button id="checkout_btn" onClick={placeOrderHandler} className="btn btn-primary btn-block">Check out</button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
