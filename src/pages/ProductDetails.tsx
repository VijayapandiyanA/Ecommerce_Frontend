import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProductById } from "../store/slices/productSlice";
import { addToCartAPI, fetchCart } from "../store/slices/cartSlice";
import "../ProductDetails.css";

export const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { selectedProduct, loading, error } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }
  }, [id, dispatch]);

  if (loading) return <p className="product-status">Loading.....</p>;
  if (error) return <p className="product-status error-text">{error}</p>;
  if (!selectedProduct) return <p className="product-status">Product Not Found</p>;

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    await dispatch(
      addToCartAPI({
        productId: selectedProduct.id,
        quantity: 1,
      })
    );

    await dispatch(fetchCart()); // refresh cart state
    navigate("/cart");
  };

  return (
    <div className="product-details-page">
      <div className="product-details-card">
        <div className="product-image-box">
          <img
            src={selectedProduct.imageUrl || "https://via.placeholder.com/300"}
            alt={selectedProduct.name}
            className="product-detail-image"
          />
        </div>

        <div className="product-info-box">
          <h2 className="product-title">{selectedProduct.name}</h2>

          <p className="product-description">{selectedProduct.description}</p>

          <h3 className="product-price">₹ {selectedProduct.price}</h3>

          <p className="product-category">
            Category: <span>{selectedProduct.category}</span>
          </p>

          <p
            className={
              selectedProduct.stock > 0
                ? "product-stock in-stock"
                : "product-stock out-stock"
            }
          >
            {selectedProduct.stock > 0
              ? `In Stock (${selectedProduct.stock})`
              : "Out of Stock"}
          </p>

          <button
            className="add-cart-btn"
            onClick={handleAddToCart}
            disabled={selectedProduct.stock <= 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};