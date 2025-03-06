<script lang="ts">
    import { onMount } from 'svelte'

    // Извлекаем входящие параметры компонента.
    // yandexMapsApiIsLoaded - флаг, отслеживающий, загружена ли Яндекс.Карты API (инициализируется через двустороннюю привязку).
    // yandexMapsApiKey - ключ API для обращения к сервису Яндекс.Карт.
    let {
        yandexMapsApiIsLoaded = $bindable(), // Значение, привязанное к родительскому компоненту или состоянию.
        yandexMapsApiKey // Обязательный API ключ для загрузки скрипта Яндекс.Карт.
    }: { yandexMapsApiIsLoaded: boolean; yandexMapsApiKey: string } = $props()

    // Функция onMount вызывается после того, как компонент был добавлен в DOM.
    onMount(() => {
        // Если глобальный объект ymaps отсутствует (API еще не загружен)
        if (!window.ymaps) {
            // Создаем элемент script для динамической загрузки скрипта API Яндекс.Карт.
            const script = document.createElement('script')

            // Формируем URL скрипта, подставляя API ключ и указывая русский язык (ru_RU) интерфейса.
            script.src = `https://api-maps.yandex.ru/2.1/?apikey=${yandexMapsApiKey}&lang=ru_RU`

            // Скрипт загружается асинхронно, чтобы не блокировать рендеринг контента.
            script.async = true

            // Добавляем элемент script в head документа для начала загрузки.
            document.head.appendChild(script)

            // После полной загрузки скрипта вызывается функция onload.
            script.onload = () => {
                // По окончании загрузки устанавливаем флаг, сигнализирующий, что API Яндекс.Карт доступен.
                yandexMapsApiIsLoaded = true
            }
        } else {
            // Если API уже присутствует в объекте window, сразу устанавливаем флаг загрузки.
            yandexMapsApiIsLoaded = true
        }
    })
</script>
