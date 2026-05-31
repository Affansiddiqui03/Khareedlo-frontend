const handleLogin = async (e) => {
  e.preventDefault();
  const res = await axios.post("https://khareedlo-backend-production.up.railway.app/api/login", { email, password });

  // ✅ Save token + user info in localStorage
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  // redirect to home
  navigate("/");
};
