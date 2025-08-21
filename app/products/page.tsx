"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import Upload from '../components/Upload';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function AddProduct() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [colorback, setColorback] = useState('#ffffff');
  const [colorback2, setColorback2] = useState('#ffffff'); // ✅ new duplicate
  const [img, setImg] = useState(['']);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (img.length === 0 || (img.length === 1 && img[0] === '')) {
      alert('Please choose at least 1 image');
      return;
    }

    const payload = {
      title,
      subtitle,
      description,
      colorback,
      colorback2, // ✅ include new field
      img,
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Product added successfully!');
        window.location.href = '/dashboard';
      } else {
        alert('Failed to add product');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('An error occurred');
    }
  };

  const handleImgChange = (url) => {
    if (url) {
      setImg(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add New Product</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />

      <input
        type="text"
        placeholder="Subtitle"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      {/* Colorback */}
      <label className="block text-lg font-bold mb-2">Background Color</label>
      <input
        type="color"
        value={colorback}
        onChange={(e) => setColorback(e.target.value)}
        className="w-16 h-10 border mb-4"
      />
      <input
        type="text"
        placeholder="Or enter HEX code"
        value={colorback}
        onChange={(e) => setColorback(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      {/* Colorback2 */}
      <label className="block text-lg font-bold mb-2">Font Color</label>
      <input
        type="color"
        value={colorback2}
        onChange={(e) => setColorback2(e.target.value)}
        className="w-16 h-10 border mb-4"
      />
      <input
        type="text"
        placeholder="Or enter HEX code"
        value={colorback2}
        onChange={(e) => setColorback2(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      <label className="block text-lg font-bold mb-2">Description</label>
      <ReactQuill
        value={description}
        onChange={setDescription}
        className="mb-4"
        theme="snow"
        placeholder="Write your product description here..."
      />

      <Upload onFilesUpload={handleImgChange} /> Max 12 images

      <br />

      <button type="submit" className="bg-green-500 text-white px-4 py-2">
        Save Product
      </button>
    </form>
  );
}
