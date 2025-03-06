<script lang="ts">
    import type { Snippet } from 'svelte'
    import type { CdekDeliveryPoint } from '#/api.d'

    // Распаковка свойств, переданных в компонент:
    let {
        activeDeliveryPoint = $bindable(), // активная точка доставки; инициализируется методом $bindable() для двусторонней связи
        deliveryPointComponentIsVisible = $bindable(), // флаг видимости компонента точки доставки
        deliveryPointsListComponentIsVisible = $bindable(), // флаг видимости списка точек доставки
        children // слот для вложенного содержимого компонента, типизированный как Snippet
    }: {
        activeDeliveryPoint?: CdekDeliveryPoint
        deliveryPointComponentIsVisible: boolean
        deliveryPointsListComponentIsVisible: boolean
        children: Snippet
    } = $props()
</script>

<div class="min-w-[300px] max-w-[300px] flex-[0 0 300px] p-2 h-full shadow relative">
    {@render children()}

    <button
        class="text-gray-500 hover:text-gray-700 cursor-pointer absolute top-2 right-2"
        aria-label="Закрыть"
        onclick={() => {
            // Обработчик клика по кнопке "Закрыть":
            // Сброс активной точки доставки, чтобы очистить выбор
            activeDeliveryPoint = undefined

            // Скрытие компонента отдельной точки доставки
            deliveryPointComponentIsVisible = false

            // Скрытие списка точек доставки
            deliveryPointsListComponentIsVisible = false
        }}
    >
        <img src="/close.svg" alt="Закрыть" class="h-6 w-6" />
    </button>
</div>
