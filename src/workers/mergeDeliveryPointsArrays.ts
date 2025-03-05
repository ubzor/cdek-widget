import type { CdekCoordinates } from '#/api.d'

// Регистрируем обработчик onmessage для воркера, который объединяет два массива точек доставки.
self.onmessage = ({
    data: { array1, array2 } // Извлекаем два массива точек доставки из входящего сообщения.
}: MessageEvent<{ array1: CdekCoordinates[]; array2: CdekCoordinates[] }>) => {
    // Создаем Map для хранения уникальных точек доставки, используя их идентификатор в качестве ключа.
    const map = new Map<any, CdekCoordinates>()

    // Извлекаем все идентификаторы точек из первого массива,
    // чтобы позже определять, какие точки были добавлены из второго массива.
    const ids = array1.map(({ deliveryPointId }) => deliveryPointId)

    // Массив для хранения "добавленных" точек в виде объектов гео-формата.
    const added: object[] = []

    // Объединяем оба массива в один итерируемый список
    ;[...array1, ...array2].forEach(({ deliveryPointId, latitude, longitude }) => {
        // Если ключ с таким идентификатором отсутствует, добавляем точку в Map.
        if (!map.has(deliveryPointId)) {
            map.set(deliveryPointId, { deliveryPointId, latitude, longitude })
        }

        // Если точка не содержится в исходном массиве array1,
        // создаем объект, представляющий новую гео-точку с необходимым форматом.
        if (!ids.find((id) => id === deliveryPointId)) {
            added.push({
                type: 'Feature',
                id: deliveryPointId,
                geometry: {
                    type: 'Point',
                    // Здесь координаты переупорядочены: широта выступает первой, затем долгота.
                    // Это соответствует стандартному формату GeoJSON.
                    coordinates: [latitude, longitude]
                }
            })
        }
    })

    // Преобразуем Map обратно в массив,
    // что дает нам объединенный список уникальных точек доставки.
    const merged = Array.from(map.values())

    // Отправляем обратно объединенный массив (merged) и список новых добавленных точек (added).
    self.postMessage({ merged, added })
}
