// Single country information
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import "/src/index.css";

export default function CountryItem({ country, onEdit, onDelete }) {
  return (
    <ListGroup.Item>
      <div className="country-item-header">
        <img 
          src={country.flagUrl} 
          alt={`Flag of ${country.name}`}
          className="country-flag"
        />
        <h4 className="country-name">{country.name}</h4>
      </div>
      <div className="country-info-row">
        <p className="country-details">
          Capital(s): {country.capitals?.join(", ") || "N/A"} | 
          Population: {country.population?.toLocaleString() || "N/A"} |
          Region: {country.region} |
          Language(s): {country.languages?.join(", ") || "N/A"}
        </p>

        <div className="country-actions">
          <Button variant="primary" size="sm" onClick={() => onEdit(country)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(country._id)}>
            Delete
          </Button>
        </div>
      </div>
    </ListGroup.Item>
  );
}