<script lang="ts">
    import type { Snippet } from 'svelte'

    // Распаковка свойств, переданных в компонент:
    let {
        onClose,
        children // слот для вложенного содержимого компонента, типизированный как Snippet
    }: {
        onClose: () => void
        children: Snippet
    } = $props()
</script>

<div
    class="min-w-[300px] max-w-[300px] flex-[0 0 300px] p-2 h-full shadow relative border-l border-gray-300"
>
    {@render children()}

    <button
        class="text-gray-500 hover:text-gray-700 cursor-pointer absolute top-2 right-2"
        aria-label="Закрыть"
        onclick={onClose}
    >
        <img src="/images/close-icon.svg" alt="Закрыть" class="h-6 w-6" />
    </button>
</div>
