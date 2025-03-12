<script lang="ts">
    import { onMount } from 'svelte'
    import debounce from 'lodash-es/debounce'

    // @ts-ignore
    import Queue from 'queue'

    import { parseJsonFromUintArray } from '@/utils/parseJsonFromUintArray'

    import type { CdekCoordinates, CdekFilters } from '#/api.d'

    let {
        apiUrl,
        bounds,
        filters,
        deliveryPointsCoordinates = $bindable(),
        cdekApiCoordinatesIsLoading = $bindable(),
        onAddedDeliveryPoints,
        onRemovedDeliveryPoints
    }: {
        apiUrl: string
        bounds?: number[][]
        filters: CdekFilters
        deliveryPointsCoordinates: CdekCoordinates[]
        cdekApiCoordinatesIsLoading: boolean
        onAddedDeliveryPoints?: (added: object[]) => void
        onRemovedDeliveryPoints?: (removed: string[]) => void
    } = $props()

    let queue = new Queue({ autostart: true, concurrency: 1 })

    queue.addEventListener('end', () => {
        cdekApiCoordinatesIsLoading = false
    })

    let abortController: AbortController = $state(new AbortController())

    let mergeWorker = new Worker(
        new URL('../workers/mergeDeliveryPointsArrays?worker', import.meta.url),
        { type: 'module' }
    )
    let filterWorker = new Worker(
        new URL('../workers/filterDeliveryPointsInBoundingBox?worker', import.meta.url),
        { type: 'module' }
    )

    let isFetchingDeliveryPoints = $state(false)
    let isParsingDeliveryPoints = $state(false)
    let isAbortingGettingDeliveryPoints = $state(false)

    let updatedDeliveryPointsIds: string[] = $state([])

    const updateDeliveryPoints = (newPoints: CdekCoordinates[]) => {
        queue.push(async () => {
            const { merged, added } = await new Promise<
                // TODO: переменная merged и всё связанное с ней имеет неправильную типизацию
                Record<'merged' | 'added', CdekCoordinates[]>
            >((resolve) => {
                mergeWorker.onmessage = (event) => {
                    resolve(event.data)
                }

                mergeWorker.postMessage({
                    array1: $state.snapshot(deliveryPointsCoordinates),
                    array2: $state.snapshot(newPoints)
                })
            })

            updatedDeliveryPointsIds = [
                ...updatedDeliveryPointsIds,
                ...newPoints.map(({ deliveryPointId }) => deliveryPointId)
            ]
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
                filterWorker.onmessage = (event) => {
                    resolve(event.data)
                }

                filterWorker.postMessage({
                    deliveryPoints: $state.snapshot(deliveryPointsCoordinates),
                    updatedDeliveryPointsIds: $state.snapshot(updatedDeliveryPointsIds)
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
            Object.entries(filters).map(([key, value]) => [key, value ? 'true' : 'false'])
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
        cdekApiCoordinatesIsLoading = true

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
        updatedDeliveryPointsIds = []

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
