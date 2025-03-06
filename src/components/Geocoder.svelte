<script lang="ts">
    // Получение параметров из свойств компонента.
    // Параметры:
    // - yandexMapsApiKey: строка API-ключа для Яндекс.Карт.
    // - onGetCityBoundingBox: функция, принимающая границы города (двумерный массив чисел).
    let {
        yandexMapsApiKey,
        onGetCityBoundingBox
    }: {
        yandexMapsApiKey: string
        onGetCityBoundingBox: (bounds: number[][]) => void
    } = $props()

    // Экспортируем асинхронную функцию getCityBoundingBox, которая принимает название города.
    export const getCityBoundingBox = async (city: string) => {
        // Формирование URL для запроса к API Яндекс Геокодера с использованием API-ключа и кодировки названия города.
        const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${yandexMapsApiKey}&geocode=${encodeURIComponent(city)}&format=json`

        try {
            // Отправляем GET-запрос по сформированному URL.
            const response = await fetch(url)

            // Если ответ от сервера не успешен (статус не "ok"), выбрасываем ошибку.
            if (!response.ok) throw new Error('Failed to fetch geocoder response')

            // Парсим тело ответа как JSON.
            const data = await response.json()

            // Навигация по объектной структуре ответа:
            // Получаем массив объектов, содержащих информацию о найденных элементах.
            const featureMember = data.response?.GeoObjectCollection?.featureMember
            if (!featureMember || featureMember.length === 0) return null

            // Из первого найденного элемента извлекаем объект, содержащий границы (envelope).
            const envelope = featureMember[0].GeoObject.boundedBy?.Envelope
            if (!envelope) return null

            // Преобразуем строковые координаты нижнего левого и верхнего правого углов в массивы чисел.
            const lowerLeft = envelope.lowerCorner.split(' ').map(Number).reverse()
            const upperRight = envelope.upperCorner.split(' ').map(Number).reverse()

            // Вызываем переданную функцию onGetCityBoundingBox с полученными границами.
            onGetCityBoundingBox([lowerLeft, upperRight])
        } catch (error) {
            // В случае возникновения ошибки логируем её в консоль.
            console.error(error)
        }
    }
</script>
