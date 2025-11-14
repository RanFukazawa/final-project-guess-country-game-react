// Admin dashboard
import { useState, useEffect } from "react";

import CountryList from "./CountryList.jsx";

export default function AdminPanel() {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const reloadCountries = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/countries?q=${query}`);
        if(!res.ok) {
          throw new Error(`Failed to fetch:", ${res.statusText}`);
        }

        const data = await res.json();
        console.log("✅ Fetched data:", data);
        setCountries(data.data);
      } catch (err) {
        console.log("❌ Failed to fetch countries list:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(reloadCountries, 300);

    return () => {
      console.log("Fetching effect cleanup");
      clearTimeout(timeout);
    };
  }, [query]);

  const onQuery = (event) => {
    setQuery(event.target.value);
  };

  console.log("📋 Render CountryList", countries);
  return (
    <div class-name="admin-page">
      <h1>Admin Panel - Manage Countries</h1>
      <input 
        type="text"
        placeholder="Search countries..."
        value={query}
        onChange={onQuery}
      />

      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}

      <CountryList countries={countries} />  
    </div>
  );
}