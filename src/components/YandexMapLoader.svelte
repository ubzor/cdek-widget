<script lang="ts">
    import { onMount } from 'svelte'

    let {
        yandexMapsApiKey,
        onLoaded
    }: { yandexMapsApiKey: string; onLoaded: () => void } = $props()

    onMount(() => {
        if (!window.ymaps3) {
            const script = document.createElement('script')
            script.src = `https://api-maps.yandex.ru/v3/?apikey=${yandexMapsApiKey}&lang=ru_RU`
            script.async = true
            document.head.appendChild(script)
            script.onload = () => onLoaded()
        } else {
            onLoaded()
        }
    })
</script>
