<script lang="ts">
    let {
        deliveryPointsListComponentIsVisible = $bindable()
    }: { deliveryPointsListComponentIsVisible: boolean } = $props()
</script>

<button
    class="absolute top-2 right-2 bg-white shadow rounded p-2 cursor-pointer"
    aria-label="Список точек доставки"
>
    <img src="/list.svg" alt="Список точек доставки" class="h-6 w-6" />
</button>
