// src/hooks/useFormValidation.js
export default function validate(fields) {
  // fields: { name: value, email: value, ... }
  // returns null | "error message"
  if ("name" in fields && !fields.name?.trim()) return "Please enter your name";
  if ("email" in fields) {
    const ok = /^\S+@\S+\.\S+$/.test(fields.email || "");
    if (!ok) return "Please enter a valid email address";
  }
  if ("message" in fields && !fields.message?.trim()) return "Please write a message";
  return null;
}
