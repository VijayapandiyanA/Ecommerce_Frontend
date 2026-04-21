import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProducts } from "../store/slices/productSlice";
import { addToCartAPI, fetchCart } from "../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import "../Products.css";

export default function Products() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: number
  ) => {
    e.stopPropagation();

    await dispatch(
      addToCartAPI({
        productId,
        quantity: 1,
      })
    );

    await dispatch(fetchCart());
    navigate("/cart");
  };

  return (
    <div className="products-page">
      <div className="products-container">
        <h2 className="products-title">👟 Products</h2>

        {loading && <p className="products-status">Loading...</p>}
        {error && <p className="products-status products-error">{error}</p>}

        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <img
                src={product.imageUrl || "https://via.placeholder.com/250"}
                alt={product.name}
                className="product-card-image"
              />

              <div className="product-card-content">
                <h3 className="product-card-name">{product.name}</h3>

                <p className="product-card-category">{product.category}</p>

                <p className="product-card-price">₹ {product.price}</p>

                <p
                  className={
                    product.stock > 0
                      ? "product-card-stock in-stock"
                      : "product-card-stock out-stock"
                  }
                >
                  {product.stock > 0
                    ? `In Stock (${product.stock})`
                    : "Out of Stock"}
                </p>

                <button
                  className="product-card-btn"
                  onClick={(e) => handleAddToCart(e, product.id)}
                  disabled={product.stock <= 0}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}