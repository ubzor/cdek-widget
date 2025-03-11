<script lang="ts">
    import { onMount } from 'svelte'
    import { VList } from 'virtua/svelte'

    import { CdekDeliveryPointType } from '#/api'
    import type { CdekDeliveryPoint, CdekCoordinates } from '#/api.d'

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

<div class="flex flex-col h-full text-sm">
    <!-- Header -->
    <span class="text-base font-semibold">Пункты выдачи</span>

    <!-- Main content -->
    <div class="flex-1 min-h-0 mt-1">
        <VList
            bind:this={virtualList}
            class="h-full v-full"
            data={deliveryPointsInList}
            onscroll={onScroll}
        >
            {#snippet children(item: CdekDeliveryPoint, _index)}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div
                    class="my-0.5 border border-gray-200 px-2 py-1 rounded cursor-pointer flex flex-col gap-0.5"
                    role="button"
                    tabindex="0"
                    onclick={() => onSetActiveDeliveryPoint(item.uuid)}
                >
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <a
                        class="text-sm font-medium truncate"
                        title={`${item.location.city}, ${item.location.address}`}
                    >
                        {item.location.city}, {item.location.address}
                    </a>

                    <!-- Updated: Wrap type and code in flex container -->
                    <div class="flex items-center gap-1 text-sm">
                        <span class="text-[11px] font-semibold uppercase"
                            >{CdekDeliveryPointType[item.type]}</span
                        >
                        <span
                            class="bg-emerald-100 text-emerald-800 rounded-lg h-[14px] px-[0.3rem] text-[11px] font-semibold leading-[14px]"
                        >
                            {item.code}
                        </span>
                    </div>

                    <!-- Updated: work time style modified -->
                    <div class="flex gap-1 items-center">
                        <img
                            src="/images/clock-icon.svg"
                            alt="Часы работы"
                            class="w-[12px] h-[12px]"
                        />
                        {#each item.workTime.split(', ') as time}
                            <div
                                class="text-[11px] font-bold text-gray-400 leading-[16px]"
                            >
                                {time}
                            </div>
                        {/each}
                    </div>
                </div>
            {/snippet}
        </VList>
    </div>
</div>
