import React from "react";
import Gallery from "./components/Gallery.jsx";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Image Gallery</h1>
        <p>Поиск изображений с Unsplash: поиск, фильтры, история, лайтбокс</p>
      </header>

      <main>
        <Gallery />
      </main>
    </div>
  );
}

export default App;
