import type { LngLatBounds, LngLat } from 'ymaps3'

export function getBoundsForArrayOfCoordinates(coordinates: LngLat[]): LngLatBounds {
    let minLat = Infinity,
        minLng = Infinity
    let maxLat = -Infinity,
        maxLng = -Infinity

    for (const coords of coordinates) {
        const lat = coords[1]
        const lng = coords[0]

        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
        if (lng < minLng) minLng = lng
        if (lng > maxLng) maxLng = lng
    }

    return [
        [minLng, minLat],
        [maxLng, maxLat]
    ] as LngLatBounds
}
