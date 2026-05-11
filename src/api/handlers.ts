import { http, HttpResponse } from "msw";
import { apartments } from "./data";
import type { FilterState } from "../types/apartment";

export const handlers = [
  http.get("/api/apartments", ({ request }) => {
    const url = new URL(request.url);

    // 👇 Исправленные парсеры
    const parseQueryNumbers = (key: string): number[] | undefined => {
      const val = url.searchParams.get(key);
      if (!val) return undefined;
      return val
        .split(",")
        .map((v) => Number(v.trim()))
        .filter((n) => !isNaN(n));
    };

    const parseRange = (key: string): [number, number] | undefined => {
      const val = url.searchParams.get(key);
      if (!val) return undefined;
      const [min, max] = val.split("-").map(Number);
      return [min, max];
    };

    const rooms = parseQueryNumbers("rooms"); // 👈 Теперь числа!
    const layoutType = url.searchParams.get("layoutType") as FilterState["layoutType"] | null;
    const status = url.searchParams.get("status") as FilterState["status"] | null;
    const areaRange = parseRange("area");
    const floorRange = parseRange("floor");

    let filtered = apartments;

    if (rooms?.length) {
      if (rooms?.length) {
        filtered = filtered.filter((a) => rooms.some((r) => (r === 4 ? a.rooms >= 4 : a.rooms === r)));
      }
    }

    if (layoutType) {
      filtered = filtered.filter((a) => a.layoutType === layoutType);
    }

    if (status) {
      filtered = filtered.filter((a) => a.status === status);
    }

    if (areaRange) {
      filtered = filtered.filter((a) => a.area >= areaRange[0] && a.area <= areaRange[1]);
    }

    if (floorRange) {
      filtered = filtered.filter((a) => a.floor >= floorRange[0] && a.floor <= floorRange[1]);
    }

    return HttpResponse.json(filtered);
  }),
];
