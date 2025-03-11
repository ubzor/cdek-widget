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
        onDeliveryPointSelected
    }: {
        activeDeliveryPoint: CdekDeliveryPoint
        selectedDeliveryPointId?: string
        onDeliveryPointSelected: CdekWidgetOptions['onDeliveryPointSelected']
    } = $props()
</script>

<div class="flex flex-col h-full">
    <!-- Header: Тип и код точки доставки -->
    <div class="flex min-h-[24px] h-[24px] items-center gap-1.5 text-sm">
        <span class="text-sm font-semibold uppercase"
            >{CdekDeliveryPointType[activeDeliveryPoint.type]}</span
        >
        <span
            class="bg-emerald-100 text-emerald-800 rounded-lg h-[20px] px-[0.3rem] text-[14px] font-semibold leading-[20px]"
        >
            {activeDeliveryPoint.code}
        </span>
    </div>

    <!-- Main content: Остальное с прокруткой, если текст большой -->
    <div class="flex flex-col gap-2 flex-grow overflow-y-auto mt-1">
        <div class="font-bold text-md leading-[20px]">
            {activeDeliveryPoint.location.city}, {activeDeliveryPoint.location.address}
        </div>
        <div class="flex gap-1 items-center">
            <img
                src="/images/clock-icon.svg"
                alt="Часы работы"
                class="w-[12px] h-[12px]"
            />
            {#each activeDeliveryPoint.workTime.split(', ') as time}
                <div class="text-[12px] font-bold text-gray-400 leading-[16px]">
                    {time}
                </div>
            {/each}
        </div>

        {#if activeDeliveryPoint.haveCash || activeDeliveryPoint.haveCashless || activeDeliveryPoint.isDressingRoom}
            <div class="flex gap-2 flex-wrap">
                {#if activeDeliveryPoint.haveCash}
                    <span
                        class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                        >Оплата наличными</span
                    >
                {/if}
                {#if activeDeliveryPoint.haveCashless}
                    <span
                        class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                        >Оплата картой</span
                    >
                {/if}
                {#if activeDeliveryPoint.isDressingRoom}
                    <span
                        class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                        >Примерочная</span
                    >
                {/if}
            </div>
        {/if}

        {#if activeDeliveryPoint.addressComment}
            <div class="text-sm">
                {activeDeliveryPoint.addressComment}
            </div>
        {/if}

        <button
            class="uppercase bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded hover:bg-emerald-700 cursor-pointer disabled:bg-gray-500 disabled:cursor-default"
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
            {selectedDeliveryPointId === activeDeliveryPoint.uuid ? 'Выбрано' : 'Выбрать'}
        </button>
    </div>
</div>
