import React, { useState } from "react";
import UserSidebar from "../../components/UserSideBar";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    // backend delete API later
    localStorage.removeItem("user");
    navigate("/");
  };

  const submitFeedback = async () => {
    if (!feedback) return alert("Please write feedback");

    await fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: JSON.parse(localStorage.getItem("user")),
        message: feedback
      }),
    });

    setFeedback("");
    alert("Feedback sent successfully");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex gap-8">
      <UserSidebar />

      <div className="bg-white p-8 rounded-xl shadow flex-1 space-y-10">
        <h2 className="text-3xl font-bold">Account Settings</h2>

        {/* DELETE ACCOUNT */ }
        { showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl">
              <h3 className="font-bold text-lg">Delete Account?</h3>
              <p className="text-sm text-gray-500">
                This action is permanent.
              </p>

              <div className="flex gap-3 mt-4">
                <button onClick={ () => setShowConfirm(false) }>No</button>
                <button className="bg-red-600 text-white px-4 py-2">
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        ) }

        {/* POLICIES */ }
        <div>
          <h3 className="text-xl font-bold mb-3">Policies</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Khareedlo is a discovery platform only. All products, prices,
            redirections, and purchases are managed directly by brands.
            Khareedlo is not responsible for order fulfillment, returns, or
            delivery issues.
          </p>
        </div>

        {/* FEEDBACK */ }
        <div>
          <h3 className="text-xl font-bold mb-3">Feedback</h3>
          <textarea
            value={ feedback }
            onChange={ (e) => setFeedback(e.target.value) }
            rows="4"
            placeholder="Write your feedback..."
            className="w-full p-3 border rounded-lg"
          />
          <button
            onClick={ submitFeedback }
            className="mt-3 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Send Feedback
          </button>
        </div>
      </div>

      {/* CONFIRM MODAL */ }
      { showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-xl font-bold mb-3">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete your account?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={ () => setShowModal(false) }
                className="px-4 py-2 border rounded-lg"
              >
                No
              </button>
              <button
                onClick={ handleDelete }
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      ) }
    </div>
  );
}
