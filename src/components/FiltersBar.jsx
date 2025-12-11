import React from "react";

function FiltersBar({
  orientation,
  onOrientationChange,
  orderBy,
  onOrderByChange,
  autoLoad,
  onAutoLoadChange,
}) {
  return (
    <div className="filters-bar">
      <div className="filter-group">
        <label>
          Ориентация:
          <select
            value={orientation}
            onChange={(e) => onOrientationChange(e.target.value)}
          >
            <option value="all">Любая</option>
            <option value="landscape">Горизонтальные</option>
            <option value="portrait">Вертикальные</option>
            <option value="squarish">Квадратные</option>
          </select>
        </label>
      </div>

      <div className="filter-group">
        <label>
          Сортировка:
          <select
            value={orderBy}
            onChange={(e) => onOrderByChange(e.target.value)}
          >
            <option value="relevant">По релевантности</option>
            <option value="latest">По новизне</option>
          </select>
        </label>
      </div>

      <div className="filter-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={autoLoad}
            onChange={(e) => onAutoLoadChange(e.target.checked)}
          />
          Infinite scroll
        </label>
      </div>
    </div>
  );
}

export default FiltersBar;
