export default function SummaryReport() {
  const user = JSON.parse(localStorage.getItem("user"));
  const brandName = user?.name;

  return (
    <div className="bg-white p-10 rounded-xl shadow print:p-0">
      <h1 className="text-3xl font-bold mb-2">{brandName}</h1>
      <p className="text-gray-500 mb-6">Brand Performance Summary</p>

      <ul className="space-y-2">
        <li>Total Products</li>
        <li>Add To Cart Clicks</li>
        <li>Buy Now Redirects</li>
        <li>Top Performing Product</li>
      </ul>

      <button
        onClick={() => window.print()}
        className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded print:hidden"
      >
        Print Report
      </button>
    </div>
  );
}
