<script lang="ts">
    import type { Snippet } from 'svelte'

    let { children }: { children: Snippet } = $props()
</script>

<div class="min-w-[300px] max-w-[300px] flex-[0 0 300px] p-2 h-full shadow">
    {@render children()}
</div>
