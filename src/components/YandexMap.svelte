<script lang="ts">
    import { onMount } from 'svelte'

    let { yandexMapsApiKey }: { yandexMapsApiKey: string } = $props()

    let mapContainer: HTMLDivElement

    const initMap = async () => {
        await window.ymaps3.ready

        const map = new window.ymaps3.YMap(mapContainer, {
            location: {
                center: [37.588144, 55.733842],
                zoom: 10
            }
        })

        map.addChild(new window.ymaps3.YMapDefaultSchemeLayer({}))
    }

    const setLocation = (location: string) => {
        console.log(`set location to ${location}`)
    }

    onMount(() => {
        if (!window.ymaps3) {
            const script = document.createElement('script')
            script.src = `https://api-maps.yandex.ru/v3/?apikey=${yandexMapsApiKey}&lang=ru_RU`
            script.async = true
            document.head.appendChild(script)
            script.onload = () => initMap()
        } else {
            initMap()
        }
    })

    export { setLocation }
</script>

<div bind:this={mapContainer} class="map"></div>

<style>
    .map {
        width: 100%;
        height: 400px;
    }
</style>
