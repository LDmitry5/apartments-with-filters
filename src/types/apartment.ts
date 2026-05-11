export type LayoutType = "studio" | "1-room" | "2-room" | "3-room" | "penthouse";

export interface Apartment {
  id: string;
  rooms: number;
  layoutType: LayoutType;
  floor: number;
  totalFloors: number;
  area: number;
  buildingName: string;
  address: string;
  status: "ready" | "under-construction";
  price: number;
  mainImage: string;
  gallery: string[];
  description: string;
}

export type FilterState = {
  rooms: number[];
  area: [number, number];
  floor: [number, number];
  layoutType: LayoutType | "";
  status: "ready" | "under-construction" | "";
};
