import CountryItem from "./CountryItem.jsx"

import "bootstrap/dist/css/bootstrap.min.css";

// List all countries
export default function CountryList({ countries = [], onEdit, onDelete }) {
  if (countries.length === 0) {
    return (
      <div className="country-list">
        <p>No countries added yet.</p>
      </div>
    )
  }

  const listCountries = countries.map(country => (
    <CountryItem 
      key={country._id}
      country={country}
      onEdit={onEdit}
      onDelete={onDelete}
    />
    )
  )

  return (
    <div className="country-list">
      <ul>{listCountries}</ul>
    </div>
  );
}