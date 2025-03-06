<script lang="ts">
    import type { CdekDeliveryPoint } from '#/api.d'

    // Привязка пропсов из родительского компонента к локальным переменным.
    // activeDeliveryPoint: выбранная точка доставки (может быть undefined);
    // sidebarIsOpened: флаг, показывающий, открыт ли сайдбар;
    // apiUrl: базовый URL для запросов к API.
    let {
        activeDeliveryPoint = $bindable(),
        deliveryPointComponentIsVisible = $bindable(),
        apiUrl
    }: {
        activeDeliveryPoint?: CdekDeliveryPoint
        deliveryPointComponentIsVisible: boolean
        apiUrl: string
    } = $props()

    // Функция для получения точки доставки по идентификатору.
    // Выполняется GET-запрос на адрес {apiUrl}/delivery-points/{deliveryPointId}.
    // При успешном ответе, обновляется activeDeliveryPoint и открывается сайдбар.
    export const getDeliveryPointById = async (deliveryPointId: string) => {
        try {
            // Отправка GET-запроса для получения данных точки доставки по ID.
            const response = await fetch(`${apiUrl}/delivery-points/${deliveryPointId}`, {
                method: 'GET'
            })

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
    export const getDeliveryPointByCode = async (code: string) => {
        try {
            // Отправка GET-запроса для получения данных точки доставки по коду.
            const response = await fetch(`${apiUrl}/delivery-points/code/${code}`, {
                method: 'GET'
            })

            // Преобразование ответа в JSON и сохранение в activeDeliveryPoint.
            activeDeliveryPoint = await response.json()

            // Установка флага sidebarIsOpened в true для автоматического открытия сайдбара.
            deliveryPointComponentIsVisible = true
        } catch (error: any) {
            // Обработка ошибок запроса: вывод сообщения с типом ошибки в консоль.
            console.log('Error fetching delivery point:', error.message)
        }
    }
</script>
