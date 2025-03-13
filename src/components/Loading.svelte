<script lang="ts">
    import loadingIconUrl from '@/images/loading-icon.svg'
</script>

<div class="loading">
    <img src={loadingIconUrl} alt="Loading" class="loading__icon" />
</div>

<style lang="postcss">
    @import 'tailwindcss';

    .loading {
        @apply flex justify-center items-center absolute top-[14px] right-[85px];
    }
    .loading__icon {
        @apply w-5 h-5 text-gray-600 animate-spin;
    }
</style>
