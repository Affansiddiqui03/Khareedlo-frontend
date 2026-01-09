import React, { useMemo, useState } from "react";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Building2,
  Bug,
  Store,
  Shield,
  HelpCircle,
  Info,
} from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "general",
    brandName: "",
    message: "",
    agree: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const topics = useMemo(
    () => [
      { value: "general", label: "General Support", icon: HelpCircle },
      { value: "order", label: "Order Issue", icon: Store },
      { value: "brand", label: "Brand Partnership", icon: Building2 },
      { value: "pos", label: "POS Integration", icon: Shield },
      { value: "bug", label: "Bug Report", icon: Bug },
      { value: "other", label: "Other", icon: Info },
    ],
    []
  );

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email.";
    if (!form.message.trim()) return "Write a short message.";
    if (!form.agree) return "Please accept the consent checkbox.";
    if (form.topic === "brand" && !form.brandName.trim())
      return "Enter your brand name for partnership.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const err = validate();
    if (err) {
      setStatus({ type: "err", msg: err });
      return;
    }

    setSubmitting(true);

    try {
      await new Promise((r) => setTimeout(r, 800)); // mock delay
      setStatus({ type: "ok", msg: "Message received. We'll reply soon!" });
      setForm({
        name: "",
        email: "",
        phone: "",
        topic: "general",
        brandName: "",
        message: "",
        agree: false,
      });
    } catch {
      setStatus({ type: "err", msg: "Something went wrong. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#f7f7ff] to-[#ffb48f] min-h-screen py-10 px-4 lg:px-6">
      {/* Header */ }
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">Contact Us</h1>
        <p className="text-gray-800 mt-2">
          Support, brand partnership, technical issues — we’re here to help.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */ }
        <div className="space-y-6">
          <Card>
            <CardRow icon={ Mail } title="Email">
              <a
                className="text-indigo-600 hover:underline"
                href="mailto:support@khareedlo.pk"
              >
                support@khareedlo.pk
              </a>
            </CardRow>
            <CardRow icon={ Phone } title="Phone">
              +92 300 0000000
            </CardRow>
            <CardRow icon={ Clock } title="Support Hours">
              Mon–Sat • 11:00 AM – 8:00 PM (PKT)
            </CardRow>
            <CardRow icon={ MapPin } title="Head Office">
              Karachi, Pakistan
            </CardRow>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-800 mb-3">Quick Help</h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickLink icon={ Store } label="Orders & Returns" href="#faq-orders" />
              <QuickLink icon={ Shield } label="POS / Integration" href="#faq-pos" />
              <QuickLink
                icon={ Building2 }
                label="Brand Partnership"
                href="#faq-brand"
              />
              <QuickLink icon={ Bug } label="Report a Bug" href="#faq-bug" />
            </div>
          </Card>
        </div>

        {/* Form */ }
        <div className="lg:col-span-2">
          { status && (
            <div
              className={ `mb-6 rounded-xl border p-4 flex items-center gap-3 ${status.type === "ok"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
                }` }
            >
              { status.type === "ok" ? <CheckCircle2 /> : <AlertCircle /> }
              <span>{ status.msg }</span>
            </div>
          ) }

          <form
            className="bg-white rounded-3xl shadow-lg p-8 space-y-6"
            onSubmit={ onSubmit }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Your Name *">
                <input
                  name="name"
                  value={ form.name }
                  onChange={ onChange }
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </Field>

              <Field label="Email *">
                <input
                  name="email"
                  value={ form.email }
                  onChange={ onChange }
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </Field>

              <Field label="Phone (optional)">
                <input
                  name="phone"
                  value={ form.phone }
                  onChange={ onChange }
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </Field>

              <Field label="Topic *">
                <select
                  name="topic"
                  value={ form.topic }
                  onChange={ onChange }
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  { topics.map((t) => (
                    <option key={ t.value } value={ t.value }>
                      { t.label }
                    </option>
                  )) }
                </select>
              </Field>

              { form.topic === "brand" && (
                <Field className="md:col-span-2" label="Brand Name *">
                  <input
                    name="brandName"
                    value={ form.brandName }
                    onChange={ onChange }
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </Field>
              ) }
            </div>

            <Field label="Message *">
              <textarea
                name="message"
                rows={ 5 }
                value={ form.message }
                onChange={ onChange }
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </Field>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="agree"
                checked={ form.agree }
                onChange={ onChange }
                className="accent-indigo-600"
              />
              I agree to be contacted.
            </label>

            <button
              type="submit"
              disabled={ submitting }
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-[#f2976a] text-white font-semibold hover:from-red-700 hover:to-[#f2a77a] transition-colors duration-300"
            >
              { submitting ? "Sending…" : "Send Message" }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─────────── UI Helpers ─────────── */
function Card({ children }) {
  return <div className="bg-white rounded-2xl shadow-lg p-5">{ children }</div>;
}

function CardRow({ icon: Icon, title, children }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-5 w-5 text-indigo-600 mt-0.5" />
      <div>
        <div className="font-semibold text-sm text-gray-800">{ title }</div>
        <div className="text-sm text-gray-600">{ children }</div>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={ `block ${className}` }>
      <div className="font-medium mb-2 text-sm text-gray-700">{ label }</div>
      { children }
    </label>
  );
}

function QuickLink({ icon: Icon, label, href }) {
  return (
    <a
      href={ href }
      className="flex items-center gap-2 px-3 py-2 border rounded-xl hover:bg-gray-50 text-sm"
    >
      <Icon className="h-4 w-4" />
      <span>{ label }</span>
    </a>
  );
}
