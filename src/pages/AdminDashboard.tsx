import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../store/slices/productSlice";
import "../AdminDashboard.css";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setStock("");
    setCategory("");
    setIsEdit(false);
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!name || !price) {
      alert("Name and price required");
      return;
    }

    const payload = {
      name,
      description,
      price: Number(price),
      imageUrl,
      stock: Number(stock),
      category,
    };

    if (isEdit && editId !== null) {
      await dispatch(
        updateProduct({
          id: editId,
          data: payload,
        })
      );
    } else {
      await dispatch(createProduct(payload));
    }

    resetForm();
    dispatch(fetchProducts());
  };

  const handleEdit = (product: any) => {
    setIsEdit(true);
    setEditId(product.id);

    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setImageUrl(product.imageUrl || "");
    setStock(product.stock.toString());
    setCategory(product.category);
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2 className="admin-title"> Admin Dashboard</h2>

        {/* FORM */}
        <div className="admin-form-card">
          <h3 className="admin-form-title">
            {isEdit ? "Edit Product" : "Add Product"}
          </h3>

          <div className="admin-form-grid">
            <input
              className="admin-input"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="admin-input"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              className="admin-input"
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              className="admin-input"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            <input
              className="admin-input"
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />

            <input
              className="admin-input"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="admin-btn-group">
            <button className="admin-submit-btn" onClick={handleSubmit}>
              {isEdit ? "Update Product" : "Create Product"}
            </button>

            {isEdit && (
              <button className="admin-cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* PRODUCT LIST */}
        <div className="admin-products-grid">
          {products.map((product) => (
            <div key={product.id} className="admin-product-card">
              <img
                src={product.imageUrl || "https://via.placeholder.com/100"}
                alt={product.name}
                className="admin-product-image"
              />

              <div className="admin-product-content">
                <h3 className="admin-product-name">{product.name}</h3>
                <p className="admin-product-desc">{product.description}</p>
                <p className="admin-product-price">₹ {product.price}</p>
                <p className="admin-product-stock">Stock: {product.stock}</p>
                <p className="admin-product-category">
                  Category: {product.category}
                </p>

                <div className="admin-card-actions">
                  <button
                    className="admin-edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="admin-delete-btn"
                    onClick={() => dispatch(deleteProduct(product.id))}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}