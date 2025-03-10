<script lang="ts">
    import type { CdekFilters } from '#/api.d'

    let {
        filters = $bindable(),
        onUpdateDeliveryPoints
    }: { filters: CdekFilters; onUpdateDeliveryPoints: () => void } = $props()
</script>

<div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <span class="text-lg font-semibold">Фильтры</span>
    </div>

    <!-- Main content -->
    <div class="flex flex-col gap-2 flex-grow overflow-y-auto">
        <!-- Group 1 -->
        <div class="flex flex-col">
            <label class="block">
                <input
                    type="checkbox"
                    name="pickup"
                    bind:checked={filters.isPickupPoint}
                    onchange={onUpdateDeliveryPoints}
                /> Пункты выдачи
            </label>
            <label class="block">
                <input
                    type="checkbox"
                    name="postomats"
                    bind:checked={filters.isPostamat}
                    onchange={onUpdateDeliveryPoints}
                /> Постаматы
            </label>
        </div>
        <!-- Group 2 -->
        <div class="flex flex-col">
            <label class="block">
                <input
                    type="checkbox"
                    name="cash"
                    bind:checked={filters.hasCash}
                    onchange={onUpdateDeliveryPoints}
                /> Оплата наличными
            </label>
            <label class="block">
                <input
                    type="checkbox"
                    name="card"
                    bind:checked={filters.hasCard}
                    onchange={onUpdateDeliveryPoints}
                /> Оплата картой
            </label>
        </div>
        <!-- Group 3 -->
        <div class="flex flex-col">
            <label class="block">
                <input
                    type="checkbox"
                    name="fittingRoom"
                    bind:checked={filters.hasFittingRoom}
                    onchange={onUpdateDeliveryPoints}
                /> Есть примерочная
            </label>
        </div>
    </div>
</div>
