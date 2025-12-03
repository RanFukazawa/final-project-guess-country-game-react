// Admin page
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import "bootstrap/dist/css/bootstrap.min.css";

import CountryList from "../components/admin/CountryList.jsx";
import CountryForm from "../components/admin/CountryForm.jsx";

export default function AdminPage() {
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingCountry, setEditingCountry] = useState(null);
  const [resetForm, setResetForm] = useState(0);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await fetch("/api/countries");

      if (!res.ok) {
        throw new Error(`HTTP ERROR! staus: ${res.status}`);
      }

      const data = await res.json();
      setCountries(data);
    } catch (err) {
      console.error("Failed to fetch countries:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (country) => {
    console.log("✏️ Editing country data:", country);
    setEditingCountry(country);
  }

  const handleDelete = async (countryId) => {
    console.log("🗑️ Deleting country with ID:", countryId);

    if (!window.confirm("Are you sure you want to delete this country data?")) {
      return;
    }

    try {
      const res = await fetch(`/api/countries/${countryId}`, {
        method: "DELETE",
      });

      console.log("DELETE response status:", res.status);

      if (!res.ok) {
        throw new Error("Failed to delete country data");
      }
      await fetchCountries();
    } catch (err) {
      console.error("Error deleting country data:", err);
      alert("Failed to delete country data. Please try again.");
    }
  }

  const handleSubmit = async (formData) => {
    console.log("🚀 Submitting:", formData);

    try {
      const url = editingCountry ? `/api/countries/${editingCountry._id}` : "/api/countries";

      const method = editingCountry ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("📥 Response status:", res.status);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save country data");
      }

      await fetchCountries(); // Refresh list
      setEditingCountry(null); // Clear editing state
      setResetForm(prev => prev + 1); // Increment to trigger reset
      alert(editingCountry ? "Country updated!" : "Country added!");
    } catch (err) {
      console.error("❌ Error:", err);
      alert(`Failed to save country: ${err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingCountry(null);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/login");
    }
  };

  if (loading) return <Container><p>Loading countries...</p></Container>;
  if (error) return <Container><p>Error: {error}</p></Container>;

  return (
    <Container>
      <div className="admin-page">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Admin Panel - Manage Countries</h1>
          <div>
            <span className="me-3">Welcome, {user?.name}!</span>
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        <Row>
          <Col md={8} xs={12}>
            <CountryList 
              countries={countries} 
              onEdit={handleEdit} 
              onDelete={handleDelete} />
          </Col>
          <Col md={4} xs={12}>
            <CountryForm 
              onSubmit={handleSubmit} 
              editingCountry={editingCountry} 
              onCancel={handleCancelEdit}
              resetForm={resetForm} />
          </Col>
        </Row>
      </div>  
    </Container>
  )
}