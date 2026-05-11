import React, { useState, useEffect, useCallback } from "react";
import type { Apartment, FilterState } from "./types/apartment";
import { FiltersPanel } from "./components/Filters/FiltersPanel";
import { ApartmentCard } from "./components/ApartmentCard";
import { ApartmentPopup } from "./components/ApartmentPopup";
import { apartments as ALL_APARTMENTS } from "./api/data";

const API_URL = "/api/apartments";

const buildQueryString = (filters: FilterState): string => {
  const params = new URLSearchParams();
  if (filters.rooms.length > 0) params.set("rooms", filters.rooms.join(","));
  if (filters.area[0] !== 15 || filters.area[1] !== 200) params.set("area", `${filters.area[0]}-${filters.area[1]}`);
  if (filters.floor[0] !== 1 || filters.floor[1] !== 30) params.set("floor", `${filters.floor[0]}-${filters.floor[1]}`);
  if (filters.layoutType) params.set("layoutType", filters.layoutType);
  if (filters.status) params.set("status", filters.status);
  const query = params.toString();
  return query ? `${API_URL}?${query}` : API_URL;
};

const loadApartments = async (
  filters: FilterState,
  setApartments: (data: Apartment[]) => void,
  setLoading: (v: boolean) => void,
  setError: (v: string | null) => void,
) => {
  setLoading(true);
  setError(null);
  try {
    await new Promise((res) => setTimeout(res, import.meta.env.PROD ? 300 : 0));

    if (import.meta.env.PROD) {
      let filtered = [...ALL_APARTMENTS];
      if (filters.rooms.length)
        filtered = filtered.filter((a) => filters.rooms.some((r) => (r === 4 ? a.rooms >= 4 : a.rooms === r)));
      if (filters.layoutType) filtered = filtered.filter((a) => a.layoutType === filters.layoutType);
      if (filters.status) filtered = filtered.filter((a) => a.status === filters.status);
      if (filters.area[0] !== 15 || filters.area[1] !== 200)
        filtered = filtered.filter((a) => a.area >= filters.area[0] && a.area <= filters.area[1]);
      if (filters.floor[0] !== 1 || filters.floor[1] !== 30)
        filtered = filtered.filter((a) => a.floor >= filters.floor[0] && a.floor <= filters.floor[1]);
      setApartments(filtered);
    } else {
      const url = buildQueryString(filters);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Ошибка загрузки данных");
      setApartments(await res.json());
    }
  } catch (e) {
    setError(e instanceof Error ? e.message : "Неизвестная ошибка");
  } finally {
    setLoading(false);
  }
};

export const App: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    rooms: [],
    area: [15, 200],
    floor: [1, 30],
    layoutType: "",
    status: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      loadApartments(filters, setApartments, setLoading, setError);
    }, 0);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleRetry = useCallback(() => {
    loadApartments(filters, setApartments, setLoading, setError);
  }, [filters]);

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__logo">🏠 Квартиры</h1>
        <p className="app__subtitle">Найдите идеальное жильё</p>
      </header>

      <main className="app__main">
        <FiltersPanel filters={filters} onFilterChange={handleFilterChange} />
        <section className="app__content">
          {/* Строгая цепочка: показывается только один блок */}
          {loading ? (
            <div className="app__loading">
              <div className="spinner" />
              <p>{apartments.length > 0 ? "Фильтрация..." : "Загрузка квартир..."}</p>
            </div>
          ) : error ? (
            <div className="app__error">
              <p>{error}</p>
              <button className="app__retry" onClick={handleRetry}>
                Повторить
              </button>
            </div>
          ) : (
            <>
              <div className="app__results">
                Найдено: <strong>{apartments.length}</strong> квартир
              </div>
              {apartments.length === 0 ? (
                <div className="app__empty">
                  <p>Квартиры не найдены</p>
                  <p className="app__empty-hint">Попробуйте изменить параметры фильтра</p>
                </div>
              ) : (
                <div className="cards-grid">
                  {apartments.map((apt) => (
                    <ApartmentCard key={apt.id} apartment={apt} onClick={setSelectedApartment} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <ApartmentPopup apartment={selectedApartment} onClose={() => setSelectedApartment(null)} />
    </div>
  );
};
