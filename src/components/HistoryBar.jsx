import React from "react";

function HistoryBar({ history, onSelect }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="history-bar">
      <span className="history-label">История запросов:</span>
      <div className="history-items">
        {history.map((term) => (
          <button
            key={term}
            className="history-item"
            onClick={() => onSelect(term)}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HistoryBar;
