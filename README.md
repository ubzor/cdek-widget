# CDEK Widget

Виджет для отображения пунктов выдачи СДЭК на карте с использованием API Яндекс.Карт.

## Установка

### npm

```bash
npm install cdek-widget
```

### yarn

```bash
yarn add cdek-widget
```

### pnpm

```bash
pnpm add cdek-widget
```

## Использование

```javascript
import { CdekWidget } from 'cdek-widget'
import 'cdek-widget/dist/style.css'

// Инициализация виджета
const widget = new CdekWidget(element, options)
```

### Параметры

Объект `options` может содержать следующие параметры:

```javascript
{
    // URL API бэкенда СДЭК
    apiUrl: 'url-бэкенда',

    // Ключ API Яндекс.Карт
    yandexMapsApiKey: 'ваш-ключ-api-яндекс-карт',

    // Callback-функция, которая вызывается когда виджет полностью загружен
    onReady: () => {
        console.log('Виджет загружен и готов к использованию')
        // Ваш код здесь
    },

    // Callback-функция, которая вызывается при выборе пункта выдачи
    onDeliveryPointSelected: (deliveryPoint) => {
        console.log('Выбран пункт выдачи:', deliveryPoint)
        // Ваш код здесь для обработки выбранного пункта
    }
}
```

### Методы

Виджет поддерживает следующие методы:

#### selectDeliveryPointByCode(code: string)

Метод для выбора пункта доставки по уникальному коду.

```javascript
widget.selectDeliveryPointByCode('CODE123')
```

#### clearSelection()

Метод для очистки текущего выбора пункта доставки.

```javascript
widget.clearSelection()
```

#### scrollToCity(city: string)

Метод для прокрутки к разделу, относящемуся к конкретному городу.

```javascript
widget.scrollToCity('Москва')
```

## Разработка

### Настройка окружения разработки

1. Клонируйте репозиторий:

```bash
git clone git@github.com:ubzor/cdek-widget.git
cd cdek-widget
```

2. Скопируйте файл `.env.example` в `.env`:

```bash
cp .env.example .env
```

3. Отредактируйте файл `.env`:
    - Установите `PUBLIC_API_URL` - адрес бэкенда для виджета
    - Установите `PUBLIC_YANDEX_MAPS_API_KEY` - ключ API Яндекс.Карт (версия 2)

### Команды

- Запуск в режиме разработки (песочница):

```bash
yarn dev
```

- Сборка для публикации:

```bash
yarn build
```
