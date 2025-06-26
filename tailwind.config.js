/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
  // Важные настройки для изоляции виджета
  important: '.cdek-widget', // Все стили будут иметь важность только внутри .cdek-widget
  corePlugins: {
    // Отключаем preflight (normalize.css), чтобы не влиять на внешние стили
    preflight: false,
  },
}
