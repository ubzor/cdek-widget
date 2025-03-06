<script lang="ts">
    import { CdekDeliveryPointType } from '#/api'

    import type { CdekDeliveryPoint } from '#/api.d'
    import type { CdekWidgetOptions } from '#/index.d'

    // Получаем параметры через $props() и двустороннюю привязку через $bindable().
    // activeDeliveryPoint - объект точки доставки (может отсутствовать).
    // selectedDeliveryPointId - ID выбранной точки доставки.
    // sidebarIsOpened - булев флаг: панель открыта.
    // onDeliveryPointSelected - callback уведомления родителя.
    let {
        activeDeliveryPoint = $bindable(),
        selectedDeliveryPointId = $bindable(),
        deliveryPointComponentIsVisible = $bindable(),
        onDeliveryPointSelected
    }: {
        activeDeliveryPoint?: CdekDeliveryPoint
        selectedDeliveryPointId?: string
        deliveryPointComponentIsVisible: boolean
        onDeliveryPointSelected: CdekWidgetOptions['onDeliveryPointSelected']
    } = $props()
</script>

{#if activeDeliveryPoint}
    <div class="bg-white rounded">
        <div class="flex justify-between items-center">
            <span class="text-lg font-semibold"
                >{CdekDeliveryPointType[activeDeliveryPoint.type]}
                {activeDeliveryPoint.code}</span
            >
            <button
                class="text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label="Закрыть"
                onclick={() => {
                    // Сбрасываем активную точку доставки и закрываем панель.
                    activeDeliveryPoint = undefined
                    deliveryPointComponentIsVisible = false
                }}
            >
                <img src="/close.svg" alt="Закрыть" class="h-6 w-6" />
            </button>
        </div>
        <div class="mt-4">
            <div class="font-bold text-lg">
                {activeDeliveryPoint.location.city}, {activeDeliveryPoint.location
                    .address}
            </div>
            <div class="mt-2">
                {#each activeDeliveryPoint.workTime.split(', ') as time}
                    <div>{time}</div>
                {/each}
            </div>
            <button
                class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                disabled={selectedDeliveryPointId === activeDeliveryPoint.uuid
                    ? true
                    : undefined}
                onclick={() => {
                    // Сохраняем ID точки доставки и вызываем callback уведомления.
                    if (!activeDeliveryPoint) return

                    selectedDeliveryPointId = activeDeliveryPoint.uuid
                    onDeliveryPointSelected &&
                        onDeliveryPointSelected($state.snapshot(activeDeliveryPoint))
                }}
            >
                {selectedDeliveryPointId === activeDeliveryPoint.uuid
                    ? 'Выбрано'
                    : 'Выбрать'}
            </button>
        </div>
    </div>
{/if}
