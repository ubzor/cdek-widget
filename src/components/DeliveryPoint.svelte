<script lang="ts">
    import { CdekDeliveryPointType } from '#/api'
    import type { CdekDeliveryPoint } from '#/api.d'

    import clockIconUrl from '@/images/clock-icon.svg'

    // Получаем параметры через $props() и двустороннюю привязку через $bindable().
    // activeDeliveryPoint - объект точки доставки (может отсутствовать).
    // selectedDeliveryPointId - ID выбранной точки доставки.
    // onSelectDeliveryPoint - callback уведомления родителя.
    let {
        activeDeliveryPoint,
        selectedDeliveryPointId,
        onSelectDeliveryPoint
    }: {
        activeDeliveryPoint: CdekDeliveryPoint
        selectedDeliveryPointId?: string
        onSelectDeliveryPoint: (deliveryPointId: string) => void
    } = $props()
</script>

<div class="delivery-point">
    <!-- Header: Тип и код точки доставки -->
    <div class="delivery-point__header">
        <span class="delivery-point__type"
            >{CdekDeliveryPointType[activeDeliveryPoint.type]}</span
        >
        <span class="delivery-point__code">
            {activeDeliveryPoint.code}
        </span>
    </div>

    <!-- Main content: Остальное с прокруткой, если текст большой -->
    <div class="delivery-point__content">
        <div class="delivery-point__location">
            {activeDeliveryPoint.location.city}, {activeDeliveryPoint.location.address}
        </div>
        <div class="delivery-point__worktime">
            <img
                src={clockIconUrl}
                alt="Часы работы"
                class="delivery-point__clock-icon"
            />
            {#each activeDeliveryPoint.workTime.split(', ') as time}
                <div class="delivery-point__time">
                    {time}
                </div>
            {/each}
        </div>

        {#if activeDeliveryPoint.haveCash || activeDeliveryPoint.haveCashless || activeDeliveryPoint.isDressingRoom}
            <div class="delivery-point__tags">
                {#if activeDeliveryPoint.haveCash}
                    <span class="delivery-point__tag">Оплата наличными</span>
                {/if}
                {#if activeDeliveryPoint.haveCashless}
                    <span class="delivery-point__tag">Оплата картой</span>
                {/if}
                {#if activeDeliveryPoint.isDressingRoom}
                    <span class="delivery-point__tag">Примерочная</span>
                {/if}
            </div>
        {/if}

        {#if activeDeliveryPoint.addressComment}
            <div class="delivery-point__comment">
                {activeDeliveryPoint.addressComment}
            </div>
        {/if}

        <button
            class="delivery-point__button"
            disabled={selectedDeliveryPointId === activeDeliveryPoint.uuid
                ? true
                : undefined}
            onclick={() => {
                onSelectDeliveryPoint(activeDeliveryPoint.uuid)
            }}
        >
            {selectedDeliveryPointId === activeDeliveryPoint.uuid ? 'Выбрано' : 'Выбрать'}
        </button>
    </div>
</div>

<style lang="postcss">
    @import 'tailwindcss';

    .delivery-point {
        @apply flex flex-col h-full;
    }

    .delivery-point__header {
        @apply flex min-h-[24px] h-[24px] items-center gap-1.5 text-sm;
    }
    .delivery-point__type {
        @apply text-sm font-semibold uppercase;
    }
    .delivery-point__code {
        @apply bg-emerald-100 text-emerald-800 rounded-lg h-[20px] px-[0.3rem] text-[14px] font-semibold leading-[20px];
    }

    .delivery-point__content {
        @apply flex flex-col gap-2 flex-grow overflow-y-auto mt-1;
    }
    .delivery-point__location {
        @apply font-bold leading-[20px];
    }
    .delivery-point__worktime {
        @apply flex gap-1 items-center;
    }
    .delivery-point__clock-icon {
        @apply w-[12px] h-[12px];
    }
    .delivery-point__time {
        @apply text-[12px] font-bold text-gray-400 leading-[16px];
    }

    .delivery-point__tags {
        @apply flex gap-2 flex-wrap;
    }
    .delivery-point__tag {
        @apply bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded;
    }

    .delivery-point__comment {
        @apply text-sm;
    }

    .delivery-point__button {
        @apply uppercase bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded hover:bg-emerald-700 cursor-pointer disabled:bg-gray-500 disabled:cursor-default;
    }
</style>
