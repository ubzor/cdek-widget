<script lang="ts">
    import loadingIconUrl from '@/images/loading-icon.svg'
</script>

<div class="loading">
    <img src={loadingIconUrl} alt="Loading" class="loading__icon" />
</div>

<style lang="postcss">
    @import 'tailwindcss';

    .loading {
        @apply w-full h-full flex justify-center items-center;
    }
    .loading__icon {
        @apply w-full h-full text-gray-600 animate-spin;
    }
</style>
