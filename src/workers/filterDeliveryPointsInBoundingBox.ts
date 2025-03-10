import type { CdekCoordinates } from '#/api.d'

// Фильтруем точки доставки, оставляя только те, идентификаторы которых присутствуют в updatedDeliveryPointsIds.
self.onmessage = ({
    data: { deliveryPoints, updatedDeliveryPointsIds } // Получаем список точек доставки и список валидных идентификаторов.
}: MessageEvent<{
    deliveryPoints: CdekCoordinates[]
    updatedDeliveryPointsIds: string[]
}>) => {
    // Группируем точки доставки с использованием reduce.
    // filtered - точки с координатами, идентификаторы которых есть в updatedDeliveryPointsIds,
    // removed - идентификаторы точек, которые отсутствуют в updatedDeliveryPointsIds.
    const { filtered, removed } = deliveryPoints.reduce(
        ({ filtered, removed }, { deliveryPointId, longitude, latitude }) => {
            // Если идентификатор точки доставки содержится в списке, добавляем всю точку в filtered.
            if (updatedDeliveryPointsIds.includes(deliveryPointId)) {
                filtered.push({ deliveryPointId, longitude, latitude })
            } else {
                // Если условие не выполняется, записываем идентификатор для списка removed.
                removed.push(deliveryPointId)
            }
            return { filtered, removed }
        },
        // Инициализируем аккумулятор с пустыми массивами.
        { filtered: [], removed: [] } as {
            filtered: CdekCoordinates[]
            removed: string[]
        }
    )

    // Отправляем результат работы воркера.
    self.postMessage({ filtered, removed })
}
