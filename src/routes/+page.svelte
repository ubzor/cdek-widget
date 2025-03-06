<script lang="ts">
    import { onMount } from 'svelte'

    import { PUBLIC_API_URL, PUBLIC_YANDEX_MAPS_API_KEY } from '$env/static/public'

    import { CdekWidget } from '@/lib'

    // Создаем переменную для хранения ссылки на HTML-элемент контейнера карты,
    // который используется для размещения виджета.
    let mapContainer: HTMLDivElement

    // Создаем переменную для хранения экземпляра виджета CdekWidget,
    // который будет инициализирован после монтирования компонента.
    let widget: CdekWidget

    // Инициализируем reactive-массив для логирования событий виджета.
    // Каждая запись в массиве будет отражать событие, произошедшее в виджете.
    let log: string[] = $state([])

    // onMount - Svelte жизненный цикл, вызываемый после монтирования компонента в DOM.
    // Здесь мы инициализируем виджет и настраиваем его поведение.
    onMount(() => {
        // Создаем экземпляр виджета CdekWidget,
        // передавая контейнер для отображения и объект с настройками.
        widget = new CdekWidget(mapContainer, {
            // Указываем URL API из переменных окружения.
            apiUrl: PUBLIC_API_URL,
            // Указываем API-ключ для Yandex Maps из переменных окружения.
            yandexMapsApiKey: PUBLIC_YANDEX_MAPS_API_KEY,
            // Колбэк, вызываемый при успешной инициализации виджета.
            onReady: () => {
                // Добавляем сообщение в лог об успешной инициализации виджета.
                log.push('Виджет успешно инициализирован')
            },
            // Колбэк, вызываемый при выборе пользователем точки доставки в виджете.
            onDeliveryPointSelected: (deliveryPoint) => {
                // Добавляем в лог сообщение с кодом выбранной точки доставки.
                log.push(`Выбрана точка доставки: ${deliveryPoint.code}`)
            }
        })
    })
</script>

<main class="p-4">
    <div bind:this={mapContainer}></div>

    <div class="flex gap-4 mt-4">
        <textarea class="flex-grow border border-gray-300 h-[200px] p-2" disabled
            >{log.join('\n')}</textarea
        >
        <div class="flex flex-col gap-2">
            <button
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                onclick={() => widget.selectDeliveryPointByCode('LYT13')}
                >Выбрать пункт выдачи</button
            >
            <button
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                onclick={() => {
                    widget.clearSelection()
                    log.push('Сброшена выбранная точка доставки')
                }}>Сбросить выбранное</button
            >
            <button
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                onclick={() => {
                    widget.scrollToCity('Лыткарино')
                    log.push('Прокрутка карты к городу Лыткарино')
                }}>Прокрутить к городу</button
            >
        </div>
    </div>
</main>
