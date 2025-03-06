<script lang="ts">
    import VirtualList from 'svelte-tiny-virtual-list'
    import InfiniteLoading from 'svelte-infinite-loading'

    import type { CdekDeliveryPoint } from '#/api.d'

    let {
        deliveryPointsInList = $bindable()
    }: { deliveryPointsInList: CdekDeliveryPoint[] } = $props()
</script>

<div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <span class="text-lg font-semibold">Пункты выдачи</span>
    </div>

    <!-- Main content -->
    <div class="flex-grow overflow-y-auto mt-4"></div>
</div>
