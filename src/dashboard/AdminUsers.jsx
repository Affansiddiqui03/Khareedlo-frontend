import React, { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(setUsers);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">
        Customers ({users.length})
      </h2>

      <table className="w-full text-sm">
        <thead className="border-b">
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.user_id} className="border-b">
              <td>{u.name}</td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}