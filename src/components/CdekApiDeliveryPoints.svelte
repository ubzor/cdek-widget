<script lang="ts">
    import throttle from 'lodash-es/throttle'

    import type { CdekCoordinates, CdekDeliveryPoint, CdekFilters } from '#/api.d'

    // Привязка пропсов из родительского компонента к локальным переменным.
    // activeDeliveryPoint: выбранная точка доставки (может быть undefined);
    // sidebarIsOpened: флаг, показывающий, открыт ли сайдбар;
    // apiUrl: базовый URL для запросов к API.
    let {
        activeDeliveryPoint = $bindable(),
        deliveryPointComponentIsVisible = $bindable(),
        deliveryPointsInList = $bindable(),
        deliveryPointsCoordinates = $bindable(),
        filters,
        apiUrl
    }: {
        activeDeliveryPoint?: CdekDeliveryPoint
        deliveryPointComponentIsVisible: boolean
        deliveryPointsInList: CdekDeliveryPoint[]
        deliveryPointsCoordinates: CdekCoordinates[]
        filters: CdekFilters
        apiUrl: string
    } = $props()

    // Функция для получения точки доставки по идентификатору.
    // Выполняется GET-запрос на адрес {apiUrl}/delivery-points/{deliveryPointId}.
    // При успешном ответе, обновляется activeDeliveryPoint и открывается сайдбар.
    export const getDeliveryPointById = async (
        deliveryPointId: string,
        allFields: boolean = false
    ) => {
        try {
            const params = new URLSearchParams({
                ...(allFields && { allFields: 'true' })
            })

            // Отправка GET-запроса для получения данных точки доставки по ID.
            const response = await fetch(
                `${apiUrl}/delivery-points/${deliveryPointId}?${params}`,
                {
                    method: 'GET'
                }
            )

            // Преобразование ответа в JSON и сохранение в activeDeliveryPoint.
            activeDeliveryPoint = await response.json()

            // Установка флага открытия сайдбара в true для отображения деталей точки доставки.
            deliveryPointComponentIsVisible = true
        } catch (error: any) {
            // Обработка ошибок запроса: вывод сообщения об ошибке в консоль.
            console.log('Error fetching delivery point:', error.message)
        }
    }

    // Функция для получения точки доставки по коду.
    // Выполняется GET-запрос на адрес {apiUrl}/delivery-points/code/{code}.
    // По успешном ответе, activeDeliveryPoint обновляется и сайдбар открывается.
    export const getDeliveryPointByCode = async (
        code: string,
        allFields: boolean = false
    ) => {
        try {
            const params = new URLSearchParams({
                ...(allFields && { allFields: 'true' })
            })

            // Отправка GET-запроса для получения данных точки доставки по коду.
            const response = await fetch(
                `${apiUrl}/delivery-points/code/${code}?${params}`,
                {
                    method: 'GET'
                }
            )

            // Преобразование ответа в JSON и сохранение в activeDeliveryPoint.
            activeDeliveryPoint = await response.json()

            // Установка флага sidebarIsOpened в true для автоматического открытия сайдбара.
            deliveryPointComponentIsVisible = true
        } catch (error: any) {
            // Обработка ошибок запроса: вывод сообщения с типом ошибки в консоль.
            console.log('Error fetching delivery point:', error.message)
        }
    }

    // Функция для получения массива точек доставки по их идентификаторам.
    // Принимает на вход массив строк (идентификаторы точек доставки).
    // Делает GET-запрос к бэкенду с передачей списка ID через query-параметры.
    // В случае успешного запроса возвращает массив объектов типа CdekDeliveryPoint,
    // иначе в блоке catch выводит сообщение об ошибке и возвращает пустой массив.
    export const loadMoreDeliveryPoints = throttle(async () => {
        const alreadyLoadedIds = deliveryPointsInList.map(({ uuid }) => uuid)
        const idsToLoad = deliveryPointsCoordinates
            .filter(({ deliveryPointId }) => !alreadyLoadedIds.includes(deliveryPointId))
            .slice(0, 10)
            .map(({ deliveryPointId }) => deliveryPointId)

        try {
            // Если массив идентификаторов не пуст
            if (idsToLoad.length) {
                const query = idsToLoad
                    .map((id) => `uuids=${encodeURIComponent(id)}`)
                    .join('&')
                const response = await fetch(`${apiUrl}/delivery-points/array?${query}`, {
                    method: 'GET'
                })

                // Преобразование ответа в JSON.
                // Ожидается, что API вернёт массив объектов точек доставки.
                const deliveryPoints: CdekDeliveryPoint[] = await response.json()

                // Возвращаем полученный массив точек доставки.
                deliveryPointsInList = [...deliveryPointsInList, ...deliveryPoints]
            }
        } catch (error: any) {
            // Логирование сообщения об ошибке в консоль с информацией о неудачном запросе.
            console.error('Error fetching delivery points:', error.message)
        }
    }, 500)
</script>
