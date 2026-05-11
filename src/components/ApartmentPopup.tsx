import React, { useEffect, useRef, useState } from "react";
import type { Apartment } from "../types/apartment";

interface ApartmentPopupProps {
  apartment: Apartment | null;
  onClose: () => void;
}

const layoutLabels: Record<Apartment["layoutType"], string> = {
  studio: "Студия",
  "1-room": "1-комнатная",
  "2-room": "2-комнатная",
  "3-room": "3-комнатная",
  penthouse: "Пентхаус",
};

// Gallery вынесен ВНЕ ApartmentPopup — компилятор доволен
const Gallery: React.FC<{ apartment: Apartment }> = ({ apartment }) => {
  const [index, setIndex] = useState(0);
  const images = [apartment.mainImage, ...apartment.gallery];
  const current = images[index] || apartment.mainImage;

  return (
    <div className="popup__gallery">
      <img src={current} alt={apartment.buildingName} className="popup__gallery-main" />
      <div className="popup__gallery-thumbs">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            className={`popup__gallery-thumb-wrapper ${i === index ? "popup__gallery-thumb-wrapper--active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Фото ${i + 1}`}>
            <img src={img} alt={`Фото ${i + 1}`} className="popup__gallery-thumb" />
          </button>
        ))}
      </div>
    </div>
  );
};

export const ApartmentPopup: React.FC<ApartmentPopupProps> = ({ apartment, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (apartment) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [apartment, onClose]);

  if (!apartment) return null;

  const priceFormatted = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(apartment.price);

  return (
    <div
      className="popup-overlay animate-fade-in"
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}>
      {/* key={apartment.id} + вынесенный Gallery = сброс состояния без useEffect */}
      <div className="popup animate-scale-in" role="dialog" aria-modal="true" key={apartment.id}>
        <button className="popup__close" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>
        <Gallery apartment={apartment} />
        <div className="popup__scroll">
          <div className="popup__info">
            <div className="popup__header">
              <div>
                <h2 className="popup__building">{apartment.buildingName}</h2>
                <p className="popup__address">{apartment.address}</p>
              </div>
              <span className={`popup__badge popup__badge--${apartment.status === "ready" ? "ready" : "construction"}`}>
                {apartment.status === "ready" ? "Сдан" : "Строится"}
              </span>
            </div>
            <p className="popup__price">{priceFormatted}</p>
            <p className="popup__description">{apartment.description}</p>
            <div className="popup__params">
              <div className="popup__param-item">
                <span className="popup__param-label">Комнаты</span>
                <span className="popup__param-value">{apartment.rooms === 0 ? "Студия" : `${apartment.rooms}`}</span>
              </div>
              <div className="popup__param-item">
                <span className="popup__param-label">Планировка</span>
                <span className="popup__param-value">{layoutLabels[apartment.layoutType]}</span>
              </div>
              <div className="popup__param-item">
                <span className="popup__param-label">Площадь</span>
                <span className="popup__param-value">{apartment.area} м²</span>
              </div>
              <div className="popup__param-item">
                <span className="popup__param-label">Этаж</span>
                <span className="popup__param-value">
                  {apartment.floor} из {apartment.totalFloors}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
