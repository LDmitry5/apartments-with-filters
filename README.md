# Квартиры — Фильтр

React-приложение для фильтрации квартир с моковым бэкендом через MSW.

## 🛠 Стек

- **React 18** + **TypeScript**
- **Vite** (сборщик)
- **Tailwind CSS** + **BEM** (стили)
- **MSW 2.x** (моки API)

## 🚀 Запуск

```bash
# 1. Установка зависимостей
npm install

# 2. Инициализация MSW (скопирует mockServiceWorker.js в public/)
npm run setup-msw

# 3. Запуск в режиме разработки
npm run dev
# → http://localhost:3000

# 4. Сборка для продакшена
npm run build

# 5. Превью продакшен-сборки
npm run preview