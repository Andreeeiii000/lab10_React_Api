import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Поиск изображений (например, cats, nature)..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Найти</button>
    </form>
  );
}

export default SearchBar;
