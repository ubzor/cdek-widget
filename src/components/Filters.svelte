<script lang="ts">
    import type { CdekFilters } from '#/api.d'

    let {
        filters = $bindable(),
        onUpdateDeliveryPoints
    }: { filters: CdekFilters; onUpdateDeliveryPoints: () => void } = $props()
</script>

<div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex min-h-[24px] h-[24px] items-center">
        <span class="text-base font-semibold">Фильтры</span>
    </div>

    <!-- Main content -->
    <div class="flex flex-col gap-1 flex-grow overflow-y-auto mt-1">
        <!-- Group 1 -->
        <div class="flex flex-col gap-1 border border-gray-200 rounded px-2 py-1 mt-0.5">
            <div class="text-[11px] font-semibold uppercase">Тип</div>
            <label class="flex items-center text-sm gap-1">
                <input
                    type="checkbox"
                    name="pickup"
                    bind:checked={filters.isPickupPoint}
                    onchange={onUpdateDeliveryPoints}
                    class="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                /> Пункты выдачи
            </label>
            <label class="flex items-center text-sm gap-1">
                <input
                    type="checkbox"
                    name="postomats"
                    bind:checked={filters.isPostamat}
                    onchange={onUpdateDeliveryPoints}
                    class="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                /> Постаматы
            </label>
        </div>
        <!-- Group 2 -->
        <div class="flex flex-col gap-1 border border-gray-200 rounded px-2 py-1">
            <div class="text-[11px] font-semibold uppercase">Оплата</div>
            <label class="flex items-center text-sm gap-1">
                <input
                    type="checkbox"
                    name="cash"
                    bind:checked={filters.hasCash}
                    onchange={onUpdateDeliveryPoints}
                    class="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                /> Оплата наличными
            </label>
            <label class="flex items-center text-sm gap-1">
                <input
                    type="checkbox"
                    name="card"
                    bind:checked={filters.hasCard}
                    onchange={onUpdateDeliveryPoints}
                    class="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                /> Оплата картой
            </label>
        </div>
        <!-- Group 3 -->
        <div class="flex flex-col gap-1 border border-gray-200 rounded px-2 py-1">
            <div class="text-[11px] font-semibold uppercase">Другое</div>
            <label class="flex items-center text-sm gap-1">
                <input
                    type="checkbox"
                    name="fittingRoom"
                    bind:checked={filters.hasFittingRoom}
                    onchange={onUpdateDeliveryPoints}
                    class="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                /> Есть примерочная
            </label>
        </div>
    </div>
</div>
