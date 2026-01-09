// src/components/uploader/ImageUploader.jsx
import React from "react";


export default function ImageUploader({ images = [], onChange }) {
    
    const handleFiles = (e) => {
        // Use optional chaining for safer access to files
        const files = Array.from(e.target?.files || []);
        if (!files.length) return;
        
        // Read as data URLs (mock). Replace with upload-to-server later
        const readers = files.map(
            (f) =>
                new Promise((res) => {
                    const r = new FileReader();
                    // Generate a stable unique ID
                    r.onload = () => res({ id: 'img-' + Math.random().toString(36).slice(2) + Date.now(), url: r.result, name: f.name });
                    r.readAsDataURL(f);
                })
        );
        
        // Ensure images is always treated as an array before spreading
        Promise.all(readers).then((arr) => onChange([...(images || []), ...arr]));
    };


    const remove = (id) => {
        // Ensure images is always treated as an array
        onChange((images || []).filter((img) => img.id !== id));
    };


    return (
        <div>
            <div className="flex items-center gap-3">
                <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFiles} 
                    className="text-sm file:mr-4 file:py-2 file:px-4
                               file:rounded-full file:border-0
                               file:text-sm file:font-semibold
                               file:bg-indigo-50 file:text-indigo-700
                               hover:file:bg-indigo-100 transition duration-150
                               cursor-pointer" // Added Tailwind file input styling for better appearance
                />
            </div>
            {images?.length > 0 && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {images.map((img) => (
                        <div key={img.id} className="relative group border rounded-lg overflow-hidden">
                            <img src={img.url} alt={img.name || "Image preview"} className="w-full h-24 object-cover" />
                            <button
                                type="button"
                                onClick={() => remove(img.id)}
                                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition duration-300 shadow-lg hover:bg-red-700" // Improved styling
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}