<script lang="ts">
    import type { Snippet } from 'svelte'

    import closeIconUrl from '@/images/close-icon.svg'

    // Распаковка свойств, переданных в компонент:
    let {
        onClose,
        children // слот для вложенного содержимого компонента, типизированный как Snippet
    }: {
        onClose: () => void
        children: Snippet
    } = $props()
</script>

<div class="sidebar">
    {@render children()}

    <button class="sidebar__close" aria-label="Закрыть" onclick={onClose}>
        <img src={closeIconUrl} alt="Закрыть" class="sidebar__close-icon" />
    </button>
</div>

<style lang="postcss">
    @import 'tailwindcss';

    .sidebar {
        @apply min-w-[300px] max-w-[300px] flex-grow-0 flex-shrink-0 basis-[300px] p-2 h-full shadow relative border-l border-gray-300;
    }
    .sidebar__close {
        @apply text-gray-500 hover:text-gray-700 cursor-pointer absolute top-2 right-2;
    }
    .sidebar__close-icon {
        @apply h-6 w-6;
    }
</style>
