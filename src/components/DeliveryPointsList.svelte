<script lang="ts">
    import { onMount } from 'svelte'
    import { VList } from 'virtua/svelte'

    import { CdekDeliveryPointType } from '#/api'
    import type { CdekDeliveryPoint, CdekCoordinates } from '#/api.d'

    let {
        deliveryPointsInList = $bindable(),
        deliveryPointsCoordinates = $bindable(),
        onLoadMore
    }: {
        deliveryPointsInList: CdekDeliveryPoint[]
        deliveryPointsCoordinates: CdekCoordinates[]
        onLoadMore: () => Promise<void>
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

<div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <span class="text-lg font-semibold">Пункты выдачи</span>
    </div>

    <!-- Main content -->
    <div class="flex-1 min-h-0 mt-4">
        <VList
            bind:this={virtualList}
            class="h-full v-full"
            data={deliveryPointsInList}
            onscroll={onScroll}
        >
            {#snippet children(item: CdekDeliveryPoint, _index)}
                <div class="p-2 bg-gray-100">
                    <div>{CdekDeliveryPointType[item.type]} {item.code}</div>
                    <div>{item.location.city}, {item.location.address}</div>
                    <div>
                        {#each item.workTime.split(', ') as time}
                            <div>{time}</div>
                        {/each}
                    </div>
                </div>
            {/snippet}
        </VList>
    </div>
</div>
