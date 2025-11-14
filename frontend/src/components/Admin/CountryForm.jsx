// Add/edit country form
import { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import "bootstrap/dist/css/bootstrap.min.css";

export default function CountryForm({ onSubmit, editingCountry = null, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    capitals: "",
    population: "",
    region: "",
    languages: "",
    flagUrl:"",
    countryCode: "",
  });

  useEffect(() => {
    if (editingCountry) {
      const cleanFlagUrl = editingCountry.flagUrl?.includes("undefined") ? "" : (editingCountry.flagUrl || "");

      setFormData({
        name: editingCountry.name || "",
        capitals: editingCountry.capitals?.join(", ") || "",
        population: editingCountry.population || "",
        region: editingCountry.region || "",
        languages: editingCountry.languages?.join(", ") || "",
        flagUrl: cleanFlagUrl,
        countryCode: editingCountry.countryCode || "",
      });
    } else {
      // Reset form when not editing
      setFormData({
        name: "",
        capitals: "",
        population: "",
        region: "",
        languages: "",
        flagUrl: "",
        countryCode: "",
      });
    }
  }, [editingCountry]);

  const handleChange= (e) => {
    const {id, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const capitalsArray = formData.capitals
    .split(",")
    .map(cap => cap.trim())
    .filter(cap => cap);

    const languagesArray = formData.languages
      .split(",")
      .map(lang => lang.trim())
      .filter(lang => lang);

    const dataToSubmit = {
      ...formData,
      capitals: capitalsArray,
      languages: languagesArray,
      flagUrl: formData.flagUrl?.includes('undefined') ? "" : formData.flagUrl,
    };

    console.log("📝 Form data:", dataToSubmit);
    onSubmit(dataToSubmit);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>{editingCountry ? "Edit Country" : "Add New Country"}</h3>
      <Form.Group as={Row} className="mb-3" controlId="name">
        <Form.Label column sm={4}>Country:</Form.Label>
        <Col sm={8}>
          <Form.Control
            type="text"
            placeholder="Country Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="capitals">
        <Form.Label column sm={4}>Capital(s):</Form.Label>
        <Col sm={8}>
          <Form.Control 
            as="textarea" 
            placeholder="Capitals  (comma-separated)"
            value={formData.capitals}
            onChange={handleChange}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="population">
        <Form.Label column sm={4}>Population:</Form.Label>
        <Col sm={8}>
          <Form.Control 
            type="number" 
            placeholder="Population"
            value={formData.population}
            onChange={handleChange}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="region">
        <Form.Label column sm={4}>Region:</Form.Label>
        <Col sm={8}>
          <Form.Select 
            value={formData.region}
            onChange={handleChange}
            required
          >
            <option value="">Select Region</option>
            <option value="Africa">Africa</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="North America">North America</option>
            <option value="South America">South America</option>
            <option value="Oceania">Oceania</option>
          </Form.Select>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="languages">
        <Form.Label column sm={4}>Language(s):</Form.Label>
        <Col sm={8}>
          <Form.Control
            as="textarea" 
            placeholder="Languages (comma-separated)"
            value={formData.languages}
            onChange={handleChange}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="countryCode">
        <Form.Label column sm={4}>Country Code:</Form.Label>
        <Col sm={8}>
          <Form.Control
            type="text"
            placeholder="e.g., us, jp, br (2-letter code)"
            value={formData.countryCode}
            onChange={handleChange}
            required
          />
          <Form.Text className="text-muted">
            Flag will be: https://flagcdn.com/w320/{formData.countryCode}.png
          </Form.Text>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Col sm={10}>
          <Button type="submit" variant="primary">
            {editingCountry ? "Update" : "Submit"}
          </Button>
          {editingCountry && (
            <Button
              type="button"
              variant="secondary"
              className="ms-2"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </Col>
      </Form.Group>
    </Form>
  );
}