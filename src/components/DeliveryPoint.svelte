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
    <div class="flex flex-col h-full">
        <!-- Header: Тип и код точки доставки -->
        <div class="flex justify-between items-center">
            <span class="text-lg font-semibold">
                {CdekDeliveryPointType[activeDeliveryPoint.type]}
                {activeDeliveryPoint.code}
            </span>
        </div>
        
        <!-- Main content: Остальное с прокруткой, если текст большой -->
        <div class="flex-grow overflow-y-auto mt-4">
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
                    if (!activeDeliveryPoint) return

                    // Сохраняем ID точки доставки и вызываем callback уведомления.
                    selectedDeliveryPointId = activeDeliveryPoint.uuid
                    onDeliveryPointSelected &&
                        onDeliveryPointSelected($state.snapshot(activeDeliveryPoint))
                }}
            >
                {selectedDeliveryPointId === activeDeliveryPoint.uuid
                    ? 'Выбрано'
                    : 'Выбрать'}
            </button>
            <p class="mt-4">
                Nullam ac sapien a sapien interdum tincidunt. Vestibulum ante ipsum primis
                in faucibus orci luctus et ultrices posuere cubilia curae. Mauris non nisl
                quis nisi eleifend interdum. Suspendisse potenti. In hac habitasse platea
                dictumst. Pellentesque habitant morbi tristique senectus et netus et
                malesuada fames ac turpis egestas. Fusce at nisi lacus. Nulla facilisi.
                Morbi in tincidunt ex, in luctus risus. Ut nec massa vel erat fermentum
                tincidunt. Maecenas non nunc sit amet neque vehicula blandit. Praesent
                congue ex in ante cursus, ut convallis massa consequat. Donec ultricies,
                est vitae consequat tincidunt, lorem elit blandit est, mattis dui sapien
                at purus.
            </p>
        </div>
    </div>
{/if}
