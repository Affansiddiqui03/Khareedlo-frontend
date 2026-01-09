// src/pages/brand/Support.jsx
import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'; // 👈 Import the icons
    

export default function Support() {
    const [msg, setMsg] = useState("");

    const submit = (e) => {
        e.preventDefault();

        // TODO: Send to backend support system
        alert("Message sent to KHAREEDLO support!");
        setMsg("");
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="bg-white p-6 rounded-2xl shadow max-w-xl w-full">
                <h2 className="text-xl font-bold mb-4">Support</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Contact KHAREEDLO admin for help with your account, orders, or listings.
                </p>

                {/* FORM */ }
                <form onSubmit={ submit } className="space-y-3">
                    <textarea
                        required
                        value={ msg }
                        onChange={ (e) => setMsg(e.target.value) }
                        className="w-full p-3 border rounded"
                        rows={ 5 }
                        placeholder="Describe your issue..."
                    ></textarea>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        >
                            Send
                        </button>
                    </div>
                </form>

                {/* SOCIAL LINKS */ }
                <div className="flex justify-center gap-6 mt-6 text-2xl">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400"><FaFacebookF /></a>

                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400"><FaInstagram /></a>

                     <a
                                    href="https://wa.me/YOURPHONENUMBER" // 👈 Change this to your WhatsApp link
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-pink-400"
                                    aria-label="Contact us on WhatsApp"
                                  >
                                    <FaWhatsapp /> {/* 👈 The new WhatsApp icon */ }
                                  </a>
                </div>
            </div>
        </div>
    );
}
