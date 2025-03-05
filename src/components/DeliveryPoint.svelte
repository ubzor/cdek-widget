<script lang="ts">
    import { CdekDeliveryPointType } from '#/api'

    import type { CdekDeliveryPoint } from '#/api.d'
    import type { CdekWidgetOptions } from '#/index.d'

    let {
        activeDeliveryPoint = $bindable(),
        selectedDeliveryPointId = $bindable(),
        sidebarIsOpened = $bindable(),
        onDeliveryPointSelected
    }: {
        activeDeliveryPoint?: CdekDeliveryPoint
        selectedDeliveryPointId?: string
        sidebarIsOpened: boolean
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
                    activeDeliveryPoint = undefined
                    sidebarIsOpened = false
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
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
