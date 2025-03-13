<script lang="ts">
    import type { CdekFilters } from '#/api.d'

    let {
        filters = $bindable(),
        onUpdateDeliveryPoints
    }: { filters: CdekFilters; onUpdateDeliveryPoints: () => void } = $props()
</script>

<div class="filters">
    <!-- Header -->
    <div class="filters__header">
        <span class="filters__title">Фильтры</span>
    </div>

    <!-- Main content -->
    <div class="filters__content">
        <!-- Group 1 -->
        <div class="filters__group filters__group--first">
            <div class="filters__group-title">Тип</div>
            <label class="filters__label">
                <input
                    type="checkbox"
                    name="pickup"
                    bind:checked={filters.isPickupPoint}
                    onchange={onUpdateDeliveryPoints}
                    class="filters__input"
                /> Пункты выдачи
            </label>
            <label class="filters__label">
                <input
                    type="checkbox"
                    name="postomats"
                    bind:checked={filters.isPostamat}
                    onchange={onUpdateDeliveryPoints}
                    class="filters__input"
                /> Постаматы
            </label>
        </div>
        <!-- Group 2 -->
        <div class="filters__group">
            <div class="filters__group-title">Оплата</div>
            <label class="filters__label">
                <input
                    type="checkbox"
                    name="cash"
                    bind:checked={filters.hasCash}
                    onchange={onUpdateDeliveryPoints}
                    class="filters__input"
                /> Оплата наличными
            </label>
            <label class="filters__label">
                <input
                    type="checkbox"
                    name="card"
                    bind:checked={filters.hasCard}
                    onchange={onUpdateDeliveryPoints}
                    class="filters__input"
                /> Оплата картой
            </label>
        </div>
        <!-- Group 3 -->
        <div class="filters__group">
            <div class="filters__group-title">Другое</div>
            <label class="filters__label">
                <input
                    type="checkbox"
                    name="fittingRoom"
                    bind:checked={filters.hasFittingRoom}
                    onchange={onUpdateDeliveryPoints}
                    class="filters__input"
                /> Есть примерочная
            </label>
        </div>
    </div>
</div>

<style lang="postcss">
    @import 'tailwindcss';

    .filters {
        @apply flex flex-col h-full;
    }
    .filters__header {
        @apply flex min-h-[24px] h-[24px] items-center;
    }
    .filters__title {
        @apply text-base font-semibold;
    }
    .filters__content {
        @apply flex flex-col gap-1 flex-grow overflow-y-auto mt-1;
    }
    .filters__group {
        @apply flex flex-col gap-1 border border-gray-200 rounded px-2 py-1;
    }
    .filters__group--first {
        @apply mt-0.5;
    }
    .filters__group-title {
        @apply text-[11px] font-semibold uppercase;
    }
    .filters__label {
        @apply flex items-center text-sm gap-1;
    }
    .filters__input {
        @apply w-4 h-4 rounded accent-emerald-600 cursor-pointer;
    }
</style>
