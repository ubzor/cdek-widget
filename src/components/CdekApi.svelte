<script lang="ts">
    import { useDebounce } from 'runed'

    import { mergeUnique } from '@/utils/mergeUnique'
    import { parseJsonFromUintArray } from '@/utils/parseJsonFromUintArray'

    import type { LngLatBounds } from 'ymaps3'
    import type { CdekCoordinates } from '#/api'

    let {
        apiUrl,
        bounds,
        deliveryPoints = $bindable(),
        onAddedDeliveryPoints,
        onRemovedDeliveryPoints
    }: {
        apiUrl: string
        bounds?: LngLatBounds
        deliveryPoints: CdekCoordinates[]
        onAddedDeliveryPoints: (deliveryPoints: CdekCoordinates[]) => void
        onRemovedDeliveryPoints: (deliveryPoints: CdekCoordinates[]) => void
    } = $props()

    let isFetchingDeliveryPoints = false
    let isParsingDeliveryPoints = false
    let isAbortingGettingDeliveryPoints = false

    let abortController: AbortController = new AbortController()

    const filterDeliveryPointsInBoundingBoxDebounced = useDebounce(() => {
        if (!bounds) return

        const {
            0: [minLongitude, maxLatitude],
            1: [maxLongitude, minLatitude]
        } = bounds

        const { filtered, removed } = deliveryPoints.reduce(
            (acc: { filtered: CdekCoordinates[]; removed: CdekCoordinates[] }, point) => {
                const { longitude, latitude } = point
                if (
                    longitude >= minLongitude &&
                    longitude <= maxLongitude &&
                    latitude >= minLatitude &&
                    latitude <= maxLatitude
                ) {
                    acc.filtered.push(point)
                } else {
                    acc.removed.push(point)
                }
                return acc
            },
            { filtered: [], removed: [] }
        )

        deliveryPoints = filtered

        onRemovedDeliveryPoints(removed)
    }, 500)

    // New helper function extracting repeated logic
    function updateDeliveryPoints(newPoints: CdekCoordinates[]) {
        const { merged, added } = mergeUnique<CdekCoordinates>(
            deliveryPoints,
            newPoints,
            'deliveryPointId'
        )
        deliveryPoints = merged

        onAddedDeliveryPoints(added)
        filterDeliveryPointsInBoundingBoxDebounced()
    }

    export const getDeliveryPointsInBoundingBox = async (bounds: LngLatBounds) => {
        if (isFetchingDeliveryPoints) {
            abortController.abort()
            abortController = new AbortController()
        }

        if (isParsingDeliveryPoints) {
            isAbortingGettingDeliveryPoints = true

            await new Promise<void>((resolve) => {
                const interval = setInterval(() => {
                    if (!isAbortingGettingDeliveryPoints && !isParsingDeliveryPoints) {
                        clearInterval(interval)
                        resolve()
                    }
                }, 10)
            })
        }

        const {
            0: [minLongitude, maxLatitude],
            1: [maxLongitude, minLatitude]
        } = bounds

        const params = new URLSearchParams({
            minLongitude: minLongitude.toString(),
            maxLatitude: maxLatitude.toString(),
            maxLongitude: maxLongitude.toString(),
            minLatitude: minLatitude.toString()
        })

        let response: Response

        isFetchingDeliveryPoints = true

        try {
            response = await fetch(`${apiUrl}/delivery-points/bounding-box?${params}`, {
                method: 'GET',
                signal: abortController.signal
            })

            isFetchingDeliveryPoints = false
        } catch (error: any) {
            isFetchingDeliveryPoints = false

            if (error.name !== 'AbortError') {
                console.log('Error fetching delivery points:', error.message)
            }

            return
        }

        const reader = response.body?.getReader()
        let remainder = ''

        isParsingDeliveryPoints = true

        while (reader) {
            if (isAbortingGettingDeliveryPoints) {
                reader.cancel()

                isAbortingGettingDeliveryPoints = false
                isParsingDeliveryPoints = false

                return
            }

            const { done, value } = await reader.read()

            if (value) {
                const { parsedData, remainder: newReminder } = parseJsonFromUintArray<
                    CdekCoordinates[]
                >(value, remainder)

                remainder = newReminder

                if (!parsedData) continue

                updateDeliveryPoints(parsedData)
            }

            if (done) {
                // Process any leftover JSON from the last chunk
                if (remainder) {
                    try {
                        updateDeliveryPoints(
                            JSON.parse(
                                '[' +
                                    (remainder.startsWith(',')
                                        ? remainder.slice(1)
                                        : remainder) +
                                    '}]'
                            )
                        )
                    } catch (error) {
                        console.error('Error parsing the final remaining JSON:', error)
                    }
                }

                isParsingDeliveryPoints = false
                return
            }
        }
    }
</script>
