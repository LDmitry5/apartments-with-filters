import React, { useState, useEffect, useCallback } from "react";
import type { Apartment, FilterState } from "./types/apartment";
import { FiltersPanel } from "./components/Filters/FiltersPanel";
import { ApartmentCard } from "./components/ApartmentCard";
import { ApartmentPopup } from "./components/ApartmentPopup";

const API_URL = "/api/apartments";

const buildQueryString = (filters: FilterState): string => {
  const params = new URLSearchParams();

  if (filters.rooms.length > 0) {
    params.set("rooms", filters.rooms.join(","));
  }
  if (filters.area[0] !== 15 || filters.area[1] !== 200) {
    params.set("area", `${filters.area[0]}-${filters.area[1]}`);
  }
  if (filters.floor[0] !== 1 || filters.floor[1] !== 30) {
    params.set("floor", `${filters.floor[0]}-${filters.floor[1]}`);
  }
  if (filters.layoutType) {
    params.set("layoutType", filters.layoutType);
  }
  if (filters.status) {
    params.set("status", filters.status);
  }

  const query = params.toString();
  return query ? `${API_URL}?${query}` : API_URL;
};

export const App: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    rooms: [],
    area: [15, 200],
    floor: [1, 30],
    layoutType: "",
    status: "",
  });

  const fetchApartments = useCallback(async () => {
    setLoading(true);
    setIsFiltering(true);
    setError(null);
    try {
      const url = buildQueryString(filters);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Ошибка загрузки данных");
      const data = await res.json();
      setApartments(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__logo">🏠 Квартиры</h1>
        <p className="app__subtitle">Найдите идеальное жильё</p>
      </header>

      <main className="app__main">
        <FiltersPanel filters={filters} onFilterChange={setFilters} />

        <section className="app__content">
          {loading && (
            <div className="app__loading">
              <div className="spinner" />
              <p>Загрузка квартир...</p>
            </div>
          )}

          {error && (
            <div className="app__error">
              <p>⚠️ {error}</p>
              <button className="app__retry" onClick={fetchApartments}>
                Повторить
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="app__results">
                Найдено: <strong>{apartments.length}</strong> квартир
              </div>

              <div className="relative min-h-[200px]">
                {/* Оверлей фильтрации (не влияет на поток документа) */}
                {isFiltering && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[2px] rounded-xl transition-opacity duration-200">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="spinner spinner--small" />
                      <span className="text-sm text-gray-700 font-medium">Фильтрация...</span>
                    </div>
                  </div>
                )}

                {apartments.length === 0 ? (
                  <div className="app__empty">
                    <p>😔 Квартиры не найдены</p>
                    <p className="app__empty-hint">Попробуйте изменить параметры фильтра</p>
                  </div>
                ) : (
                  <div className="cards-grid">
                    {apartments.map((apt) => (
                      <ApartmentCard key={apt.id} apartment={apt} onClick={setSelectedApartment} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </main>

      <ApartmentPopup apartment={selectedApartment} onClose={() => setSelectedApartment(null)} />
    </div>
  );
};
