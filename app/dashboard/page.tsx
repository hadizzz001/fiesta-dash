'use client';

import { useState, useEffect } from 'react';
import Upload from '../components/Upload';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('/api/products');
    if (response.ok) {
      const data = await response.json();
      setProducts(data);
    } else {
      console.error('Failed to fetch products');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (response.ok) {
          alert('Product deleted successfully');
          fetchProducts();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdate = async (updatedProduct) => {
    try {
      const response = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        alert('Product updated successfully');
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 text-[12px]">
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onSave={handleUpdate}
        />
      )}

      <h1 className="text-2xl font-bold mb-4">Product List</h1>

      <table className="table-auto w-full border-collapse border border-gray-200 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th> 
            <th className="border p-2">Image</th> 
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border p-2">{product.title}</td> 
              <td className="border p-2">
                {product.img?.[0] && (
                  <img src={product.img[0]} alt="Product" className="w-24 h-auto" />
                )}
              </td>
         
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 text-white px-2 py-1 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditProductForm({ product, onCancel, onSave }) {
  const [title, setTitle] = useState(product.title);
  const [subtitle, setSubtitle] = useState(product.subtitle || "");
  const [description, setDescription] = useState(product.description);
  const [img, setImg] = useState(product.img || []);
  const [colorback, setColorback] = useState(product.colorback || "#ffffff");
  const [colorback2, setColorback2] = useState(product.colorback2 || "#ffffff");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...product,
      title,
      subtitle,
      description,
      img,
      colorback,
      colorback2,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-[12px] border p-4 bg-gray-100 rounded"
    >
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2"
          required
        />
      </div>

      {/* Subtitle */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Subtitle</label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full border p-2"
        />
      </div>

      {/* Description */}
      <label className="block text-sm font-medium mb-2">Description</label>
      <ReactQuill
        value={description}
        onChange={setDescription}
        className="mb-4"
        theme="snow"
        placeholder="Write your product description..."
      />

      {/* Colorback */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Color Back</label>
        <input
          type="color"
          value={colorback}
          onChange={(e) => setColorback(e.target.value)}
          className="w-full border p-2 h-10"
        />
      </div>

      {/* Colorback2 */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Color font</label>
        <input
          type="color"
          value={colorback2}
          onChange={(e) => setColorback2(e.target.value)}
          className="w-full border p-2 h-10"
        />
      </div>

      {/* Image Upload */}
      <Upload onFilesUpload={(url) => setImg(url)} />

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
