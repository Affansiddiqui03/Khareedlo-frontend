import React, { useEffect, useState } from "react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
const brandId = user?.id;

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!brandId) return;

  fetch(`http://localhost:5000/api/brand-profile/${brandId}`)
    .then(res => res.json())
    .then(data => {
      setForm(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
}, [brandId]);

  const handleSave = async () => {
    await fetch(`/api/brand-profile/${brandId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Profile updated");
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="bg-white rounded-2xl shadow p-6 max-w-3xl">
      <h2 className="text-2xl font-bold mb-1">Brand Profile</h2>
      <p className="text-sm text-gray-500 mb-6">
        Manage how your brand appears on Khareedlo
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <input value={form.name} disabled className="input" />
        <input value={form.email} disabled className="input" />

        <input
          placeholder="Contact Number"
          value={form.contact || ""}
          onChange={e => setForm({ ...form, contact: e.target.value })}
          className="input"
        />

        <input
          placeholder="Website / Instagram"
          value={form.website || ""}
          onChange={e => setForm({ ...form, website: e.target.value })}
          className="input"
        />

        <input
          placeholder="City"
          value={form.city || ""}
          onChange={e => setForm({ ...form, city: e.target.value })}
          className="input"
        />

        <textarea
          placeholder="Brand Description"
          value={form.description || ""}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="input md:col-span-2"
        />

        <button
          onClick={handleSave}
          className="md:col-span-2 bg-indigo-600 text-white py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
