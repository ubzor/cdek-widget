// Импортируем определение типа CdekCoordinates из общего API.
// Это гарантирует, что структура координат будет соответствовать ожидаемому формату.
import type { CdekCoordinates } from '#/api.d'

// Регистрируем обработчик события onmessage для воркера.
// Этот обработчик вызывается, когда воркер получает сообщение от основного потока.
self.onmessage = ({
    data: { deliveryPoints, bounds } // Получаем список точек доставки и границы области фильтрации.
}: MessageEvent<{ deliveryPoints: CdekCoordinates[]; bounds: number[][] }>) => {
    // Извлекаем минимальные и максимальные координаты из массива границ.
    // bounds[0] содержит [minLatitude, minLongitude],
    // bounds[1] содержит [maxLatitude, maxLongitude].
    const {
        0: [minLatitude, minLongitude],
        1: [maxLatitude, maxLongitude]
    } = bounds

    // Применяем метод reduce для группировки точек доставки:
    // filtered - точки, попавшие в указанный прямоугольник,
    // removed - идентификаторы тех точек, которые вне области.
    const { filtered, removed } = deliveryPoints.reduce(
        ({ filtered, removed }, { deliveryPointId, longitude, latitude }) => {
            // Если точка доставки находится в пределах заданных границ, добавляем её в filtered.
            // Условие проверяет, что долгота и широта лежат между минимальными и максимальными значениями.
            if (
                longitude >= minLongitude &&
                longitude <= maxLongitude &&
                latitude >= minLatitude &&
                latitude <= maxLatitude
            ) {
                filtered.push({ deliveryPointId, longitude, latitude })
            } else {
                // Если точка не удовлетворяет условию, сохраняем только её идентификатор в removed.
                removed.push(deliveryPointId)
            }
            // Возвращаем аккумулятор с обновёнными массивами для использования в следующей итерации.
            return { filtered, removed }
        },
        // Инициализируем аккумулятор с пустыми массивами.
        { filtered: [], removed: [] } as {
            filtered: CdekCoordinates[]
            removed: string[]
        }
    )

    // Отправляем обратно результат работы воркера.
    // filtered содержит объекты с координатами точек, а removed – идентификаторы исключенных точек.
    self.postMessage({ filtered, removed })
}
