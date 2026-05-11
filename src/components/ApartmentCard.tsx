import React from "react";
import type { Apartment } from "../types/apartment";

interface ApartmentCardProps {
  apartment: Apartment;
  onClick: (apartment: Apartment) => void;
}

const layoutLabels: Record<Apartment["layoutType"], string> = {
  studio: "Студия",
  "1-room": "1-комнатная",
  "2-room": "2-комнатная",
  "3-room": "3-комнатная",
  penthouse: "Пентхаус",
};

const _ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, onClick }) => {
  const priceFormatted = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(apartment.price);

  return (
    <article
      className="card"
      onClick={() => onClick(apartment)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(apartment)}>
      <div className="card__image-wrapper">
        <img src={apartment.mainImage} alt={apartment.buildingName} className="card__image" loading="lazy" />
        <span className={`card__badge card__badge--${apartment.status === "ready" ? "ready" : "construction"}`}>
          {apartment.status === "ready" ? "Сдан" : "Строится"}
        </span>
      </div>

      <div className="card__content">
        <div className="card__top">
          <h3 className="card__building">{apartment.buildingName}</h3>
          <p className="card__price">{priceFormatted}</p>
        </div>

        <p className="card__address">{apartment.address}</p>

        <div className="card__params">
          <span className="card__param">
            <span className="card__param-icon">🚪</span>
            {apartment.rooms === 0 ? "Студия" : `${apartment.rooms}-комн.`}
          </span>
          <span className="card__param">
            <span className="card__param-icon">📐</span>
            {apartment.area} м²
          </span>
          <span className="card__param">
            <span className="card__param-icon">🏢</span>
            {apartment.floor}/{apartment.totalFloors} эт.
          </span>
        </div>

        <span className="card__layout">{layoutLabels[apartment.layoutType]}</span>
      </div>
    </article>
  );
};

export const ApartmentCard = React.memo(_ApartmentCard, (prev, next) => {
  // Сравниваем только критичные пропсы
  return (
    prev.apartment.id === next.apartment.id &&
    prev.apartment.price === next.apartment.price &&
    prev.apartment.status === next.apartment.status
  );
});
