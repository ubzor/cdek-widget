<script lang="ts">
    import { onMount } from 'svelte'
    import { VList } from 'virtua/svelte'

    import { CdekDeliveryPointType } from '#/api'
    import type { CdekDeliveryPoint, CdekCoordinates } from '#/api.d'

    import clockIconUrl from '../../static/images/clock-icon.svg'

    let {
        deliveryPointsInList = $bindable(),
        deliveryPointsCoordinates = $bindable(),
        onLoadMore,
        onSetActiveDeliveryPoint
    }: {
        deliveryPointsInList: CdekDeliveryPoint[]
        deliveryPointsCoordinates: CdekCoordinates[]
        onLoadMore: () => Promise<void>
        onSetActiveDeliveryPoint: (deliveryPointId: string) => void
    } = $props()

    let virtualList: VList<CdekDeliveryPoint> | undefined = $state()

    const onScroll = async (_offset: number) => {
        if (
            deliveryPointsInList.length < deliveryPointsCoordinates.length &&
            virtualList &&
            virtualList.findEndIndex() + 10 > deliveryPointsInList.length
        ) {
            await onLoadMore()
        }
    }

    onMount(async () => {
        if (!deliveryPointsInList.length) {
            await onLoadMore()
        }
    })
</script>

<div class="delivery-points-list">
    <!-- Header -->
    <span class="delivery-points-list__header">Пункты выдачи</span>

    <!-- Main content -->
    <div class="delivery-points-list__content">
        <VList
            bind:this={virtualList}
            class="delivery-points-list__vlist"
            data={deliveryPointsInList}
            onscroll={onScroll}
        >
            {#snippet children(item: CdekDeliveryPoint, _index)}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div
                    class="delivery-points-list__item"
                    role="button"
                    tabindex="0"
                    onclick={() => onSetActiveDeliveryPoint(item.uuid)}
                >
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <a
                        class="delivery-points-list__item-link"
                        title={`${item.location.city}, ${item.location.address}`}
                    >
                        {item.location.city}, {item.location.address}
                    </a>

                    <!-- Updated: Wrap type and code in flex container -->
                    <div class="delivery-points-list__item-header">
                        <span class="delivery-points-list__item-type">
                            {CdekDeliveryPointType[item.type]}
                        </span>
                        <span class="delivery-points-list__item-code">
                            {item.code}
                        </span>
                    </div>

                    <!-- Updated: work time style modified -->
                    <div class="delivery-points-list__item-worktime">
                        <img
                            src={clockIconUrl}
                            alt="Часы работы"
                            class="delivery-points-list__item-clock-icon"
                        />
                        {#each item.workTime.split(', ') as time}
                            <div class="delivery-points-list__item-time">
                                {time}
                            </div>
                        {/each}
                    </div>
                </div>
            {/snippet}
        </VList>
    </div>
</div>

<style lang="postcss">
    @import 'tailwindcss';

    .delivery-points-list {
        @apply flex flex-col h-full text-sm;
    }
    .delivery-points-list__header {
        @apply text-base font-semibold;
    }
    .delivery-points-list__content {
        @apply flex-1 min-h-0 mt-1;
    }
    .delivery-points-list__vlist {
        @apply h-full w-full;
    }
    .delivery-points-list__item {
        @apply my-0.5 border border-gray-200 px-2 py-1 rounded cursor-pointer flex flex-col gap-0.5;
    }
    .delivery-points-list__item-link {
        @apply text-sm font-medium truncate;
    }
    .delivery-points-list__item-header {
        @apply flex items-center gap-1 text-sm;
    }
    .delivery-points-list__item-type {
        @apply text-[11px] font-semibold uppercase;
    }
    .delivery-points-list__item-code {
        @apply bg-emerald-100 text-emerald-800 rounded-lg h-[14px] px-[0.3rem] text-[11px] font-semibold leading-[14px];
    }
    .delivery-points-list__item-worktime {
        @apply flex gap-1 items-center;
    }
    .delivery-points-list__item-clock-icon {
        @apply w-[12px] h-[12px];
    }
    .delivery-points-list__item-time {
        @apply text-[11px] font-bold text-gray-400 leading-[16px];
    }
</style>
