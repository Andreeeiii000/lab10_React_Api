import React, { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar.jsx";
import FiltersBar from "./FiltersBar.jsx";
import HistoryBar from "./HistoryBar.jsx";
import ImageGrid from "./ImageGrid.jsx";
import LightboxModal from "./LightboxModal.jsx";

const PER_PAGE = 15;

function Gallery() {
  const [query, setQuery] = useState("cats"); // стартовый запрос
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);

  const [orientation, setOrientation] = useState("all"); // all | landscape | portrait | squarish
  const [orderBy, setOrderBy] = useState("relevant"); // relevant | latest (для UI, Pexels не сортирует)

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);

  const [searchHistory, setSearchHistory] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("searchHistory");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [autoLoad, setAutoLoad] = useState(true); // для infinite scroll

  const loaderRef = useRef(null);

  // --- сохранение истории в localStorage ---
  useEffect(() => {
    try {
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    } catch {
      // игнорируем ошибки
    }
  }, [searchHistory]);

  // --- сброс картинок при изменении запроса/фильтров ---
  useEffect(() => {
    if (!query) return;
    setImages([]);
    setPage(1);
    setHasMore(true);
  }, [query, orientation, orderBy]);

  // --- загрузка изображений при изменении page/query/фильтров ---
  useEffect(() => {
    if (!query) return;

    async function fetchImages() {
      setIsLoading(true);
      setError(null);

      try {
        const accessKey = import.meta.env.VITE_PEXELS_API_KEY;
        if (!accessKey) {
          throw new Error(
            "Не задан ключ API Pexels (VITE_PEXELS_API_KEY) в .env.local"
          );
        }

        const params = new URLSearchParams({
          query,
          per_page: String(PER_PAGE),
          page: String(page),
        });

        // фильтр ориентации (Pexels поддерживает: landscape, portrait, square)
        if (orientation !== "all") {
          const pexelsOrientation =
            orientation === "squarish" ? "square" : orientation;
          params.append("orientation", pexelsOrientation);
        }

        // сортировку orderBy Pexels не поддерживает — поле оставляем только для UI

        const response = await fetch(
          `https://api.pexels.com/v1/search?${params.toString()}`,
          {
            headers: {
              Authorization: accessKey, // ВАЖНО: без "Client-ID"
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Ошибка API Pexels: ${response.status}`);
        }

        const data = await response.json();

        // Преобразуем Pexels → “похожий на Unsplash” формат
        const mappedResults = (data.photos || []).map((photo) => ({
          id: photo.id,
          urls: {
            small: photo.src.medium,
            regular: photo.src.large,
            full: photo.src.original,
          },
          alt_description:
            photo.alt || `Photo by ${photo.photographer} on Pexels`,
          links: {
            html: photo.url,
          },
          user: {
            name: photo.photographer,
          },
        }));

        setImages((prev) =>
          page === 1 ? mappedResults : [...prev, ...mappedResults]
        );

        // Pexels отдаёт page, per_page, total_results
        // Проверяем, остались ли ещё результаты
        const totalResults = data.total_results ?? 0;
        setHasMore(page * PER_PAGE < totalResults && mappedResults.length > 0);
      } catch (err) {
        console.error(err);
        setError(err.message || "Не удалось загрузить изображения");
      } finally {
        setIsLoading(false);
      }
    }

    fetchImages();
  }, [page, query, orientation, orderBy]);

  // --- Infinite Scroll через IntersectionObserver ---
  useEffect(() => {
    if (!autoLoad) return;
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [autoLoad, hasMore, isLoading]);

  // --- обработчики ---

  // новый поиск
  const handleSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setQuery(trimmed);

    // обновляем историю (без дублей, максимум 7 записей)
    setSearchHistory((prev) => {
      const withoutCurrent = prev.filter(
        (x) => x.toLowerCase() !== trimmed.toLowerCase()
      );
      const updated = [trimmed, ...withoutCurrent];
      return updated.slice(0, 7);
    });
  };

  // выбор элемента из истории
  const handleHistoryClick = (term) => {
    handleSearch(term);
  };

  // загрузить ещё (кнопка)
  const handleLoadMore = () => {
    if (isLoading || !hasMore) return;
    setPage((prev) => prev + 1);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-container">
      <div className="top-controls">
        <SearchBar onSearch={handleSearch} />
        <FiltersBar
          orientation={orientation}
          onOrientationChange={setOrientation}
          orderBy={orderBy}
          onOrderByChange={setOrderBy}
          autoLoad={autoLoad}
          onAutoLoadChange={setAutoLoad}
        />
      </div>

      <HistoryBar history={searchHistory} onSelect={handleHistoryClick} />

      {error && <div className="error-message">Ошибка: {error}</div>}

      <ImageGrid images={images} onImageClick={handleImageClick} />

      {/* Лоадер / информация */}
      <div className="bottom-controls">
        {isLoading && <div className="loader">Загрузка...</div>}

        {!isLoading && images.length === 0 && (
          <div className="empty">Нет изображений. Попробуй другой запрос.</div>
        )}

        {hasMore && (
          <button
            className="load-more-btn"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "Загрузить ещё"}
          </button>
        )}

        {!hasMore && images.length > 0 && (
          <div className="no-more">Больше изображений нет.</div>
        )}

        {/* Сентинел для infinite scroll */}
        <div ref={loaderRef} className="infinite-scroll-sentinel" />
      </div>

      {selectedImage && (
        <LightboxModal image={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default Gallery;
