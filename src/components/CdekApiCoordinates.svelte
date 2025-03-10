<script lang="ts">
    import { onMount } from 'svelte'
    import debounce from 'lodash-es/debounce'

    // @ts-ignore
    import Queue from 'queue'

    import { parseJsonFromUintArray } from '@/utils/parseJsonFromUintArray'

    import MergeDeliveryPointsArrayWorker from '@/workers/mergeDeliveryPointsArrays?worker'
    import FilterDeliveryPointsInBoundingBoxWorker from '@/workers/filterDeliveryPointsInBoundingBox?worker'

    import type { CdekCoordinates, CdekFilters } from '#/api.d'

    let {
        apiUrl,
        bounds,
        filters,
        deliveryPointsCoordinates = $bindable(),
        onAddedDeliveryPoints,
        onRemovedDeliveryPoints
    }: {
        apiUrl: string
        bounds?: number[][]
        filters: CdekFilters
        deliveryPointsCoordinates: CdekCoordinates[]
        onAddedDeliveryPoints?: (added: object[]) => void
        onRemovedDeliveryPoints?: (removed: string[]) => void
    } = $props()

    let isFetchingDeliveryPoints = $state(false)
    let isParsingDeliveryPoints = $state(false)
    let isAbortingGettingDeliveryPoints = $state(false)

    let queue = new Queue({ autostart: true, concurrency: 1 })

    let abortController: AbortController = $state(new AbortController())

    let mergeWorker: Worker
    let filterWorker: Worker

    const updateDeliveryPoints = (newPoints: CdekCoordinates[]) => {
        queue.push(async () => {
            const { merged, added } = await new Promise<
                Record<'merged' | 'added', CdekCoordinates[]>
            >((resolve) => {
                mergeWorker = new MergeDeliveryPointsArrayWorker()

                mergeWorker.onmessage = (event) => {
                    resolve(event.data)
                }

                mergeWorker.postMessage({
                    array1: $state.snapshot(deliveryPointsCoordinates),
                    array2: $state.snapshot(newPoints)
                })
            })

            deliveryPointsCoordinates = merged
            onAddedDeliveryPoints && onAddedDeliveryPoints(added)

            filterDeliveryPointsInBoundingBoxDebounced()
        })
    }

    const filterDeliveryPointsInBoundingBox = () => {
        queue.push(async () => {
            if (!bounds) return

            const { filtered, removed } = await new Promise<{
                filtered: CdekCoordinates[]
                removed: string[]
            }>((resolve) => {
                filterWorker = new FilterDeliveryPointsInBoundingBoxWorker()

                filterWorker.onmessage = (event) => {
                    resolve(event.data)
                }

                filterWorker.postMessage({
                    deliveryPoints: $state.snapshot(deliveryPointsCoordinates),
                    bounds: $state.snapshot(bounds)
                })
            })

            deliveryPointsCoordinates = filtered
            onRemovedDeliveryPoints && onRemovedDeliveryPoints(removed)
        })
    }

    const filterDeliveryPointsInBoundingBoxDebounced = debounce(
        filterDeliveryPointsInBoundingBox,
        500
    )

    export const getDeliveryPoints = async () => {
        if (!bounds) return

        if (isFetchingDeliveryPoints) {
            abortController.abort()
            abortController = new AbortController()
        }

        if (isParsingDeliveryPoints) {
            isAbortingGettingDeliveryPoints = true

            queue.end()
            queue.start()

            await new Promise<void>((resolve) => {
                const interval = setInterval(() => {
                    if (!isAbortingGettingDeliveryPoints && !isParsingDeliveryPoints) {
                        clearInterval(interval)
                        resolve()
                    }
                }, 10)
            })

            mergeWorker?.terminate()
            filterWorker?.terminate()
        }

        const {
            0: [minLatitude, minLongitude],
            1: [maxLatitude, maxLongitude]
        } = bounds

        const activeFilters = Object.fromEntries(
            Object.entries(filters)
                .filter(([_key, value]) => !value)
                .map(([key, value]) => [key, value ? 'true' : 'false'])
        ) as Record<keyof CdekFilters, 'true' | 'false'>

        const params = new URLSearchParams({
            minLongitude: minLongitude.toString(),
            maxLatitude: maxLatitude.toString(),
            maxLongitude: maxLongitude.toString(),
            minLatitude: minLatitude.toString(),
            ...activeFilters
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

    onMount(() => {
        queue.start()
    })
</script>
