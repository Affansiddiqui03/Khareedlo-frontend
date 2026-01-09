// src/pages/brand/Products.jsx
import React, { useState, useEffect} from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Products() {
    useEffect(() => {
   const stored = JSON.parse(localStorage.getItem("brandProducts"));

  if (!stored || stored.length === 0) {
    const mock = [
      {
        id: 1,
        name: "Black Kurti",
        price: 1999,
        stock: 12,
        image: "/product1.jpg"
      },
      {
        id: 2,
        name: "Men's Casual Shirt",
        price: 2499,
        stock: 8,
        image: "/product2.jpg"
      }
    ];

    setProducts(mock);
    localStorage.setItem("brandProducts", JSON.stringify(mock));
  } else {
    setProducts(stored);
  }
}, []);

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // id to delete
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        image: "", // URL from your uploader (you said: "pictures uploading ko bahar mein dalo")
    });

    const resetForm = () =>
        setForm({ name: "", price: "", stock: "", category: "", description: "", image: "" });

    const handleAdd = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const newItem = {
                id: Date.now(),
                name: form.name,
                price: Number(form.price || 0),
                stock: Number(form.stock || 0),
                category: form.category || "",
                description: form.description || "",
                image: form.image, // must be provided by you from your uploader
            };
            setProducts((p) => [newItem, ...p]);
            setShowAdd(false);
            resetForm();
        } finally {
            setIsSaving(false);
        }
    };

    const askDelete = (id) => setShowDeleteConfirm(id);
    const handleDeleteConfirm = () => {
        setProducts((p) => p.filter((x) => x.id !== showDeleteConfirm));
        setShowDeleteConfirm(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Products</h2>
                <button
                    onClick={ () => navigate("/brand/products/new") }
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                </button>
            </div>

            {/* GRID */ }
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                { products.map((item) => (
                    <div key={ item.id } className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
                        {/* no default image — uses your uploaded URL */ }
                        { item.image ? (
                            <img src={ item.image } alt={ item.name } className="h-40 w-full object-cover rounded-lg mb-3" />
                        ) : (
                            <div className="h-40 w-full bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400 text-sm">
                                No image
                            </div>
                        ) }

                        <h3 className="font-semibold text-gray-800">{ item.name }</h3>
                        <p className="text-gray-500 text-sm">PKR { item.price }</p>
                        <p className="text-sm text-gray-600 mt-1">
                            Stock: <span className="font-medium">{ item.stock }</span>
                        </p>

                        <div className="flex justify-between mt-4">
                            <button className="flex items-center text-indigo-600 hover:underline">
                                <Edit className="w-4 h-4 mr-1" /> Edit
                            </button>
                            <button onClick={ () => askDelete(item.id) } className="flex items-center text-red-500 hover:underline">
                                <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </button>
                        </div>
                    </div>
                )) }

                { products.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-12">
                        No products added yet.
                        <br />
                        <span className="text-indigo-600 font-semibold">Click &quot;Add Product&quot; to begin.</span>
                    </div>
                ) }
            </div>

            {/* Add Product Modal */ }
            { showAdd && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <form onSubmit={ handleAdd } className="bg-white rounded-2xl p-6 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Add Product</h3>
                            <button type="button" onClick={ () => setShowAdd(false) } className="p-1 rounded hover:bg-gray-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input required placeholder="Name" value={ form.name } onChange={ (e) => setForm({ ...form, name: e.target.value }) } className="p-3 border rounded" />
                            <input required type="number" placeholder="Price" value={ form.price } onChange={ (e) => setForm({ ...form, price: e.target.value }) } className="p-3 border rounded" />
                            <input placeholder="Category" value={ form.category } onChange={ (e) => setForm({ ...form, category: e.target.value }) } className="p-3 border rounded" />
                            <input type="number" placeholder="Stock" value={ form.stock } onChange={ (e) => setForm({ ...form, stock: e.target.value }) } className="p-3 border rounded" />
                            <input placeholder="Image URL (from your uploader)" value={ form.image } onChange={ (e) => setForm({ ...form, image: e.target.value }) } className="p-3 border rounded md:col-span-2" />
                        </div>
                        <textarea placeholder="Description" value={ form.description } onChange={ (e) => setForm({ ...form, description: e.target.value }) } className="w-full mt-3 p-3 border rounded" rows={ 3 } />
                        <div className="flex justify-end gap-3 mt-4">
                            <button type="button" onClick={ () => setShowAdd(false) } className="px-4 py-2 rounded bg-gray-100">Cancel</button>
                            <button type="submit" disabled={ isSaving } className="px-4 py-2 rounded bg-indigo-600 text-white disabled:bg-indigo-400">
                                { isSaving ? "Saving..." : "Save Product" }
                            </button>
                        </div>
                    </form>
                </div>
            ) }

            {/* Delete Confirmation Modal */ }
            { showDeleteConfirm !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-red-600 mb-3">Confirm Deletion</h3>
                        <p className="text-gray-700 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={ () => setShowDeleteConfirm(null) } className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition">
                                Cancel
                            </button>
                            <button type="button" onClick={ handleDeleteConfirm } className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition">
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            ) }
        </div>
    );
}
