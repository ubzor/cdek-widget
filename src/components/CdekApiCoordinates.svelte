<script lang="ts">
    import { onMount } from 'svelte'
    import debounce from 'lodash-es/debounce'

    // @ts-ignore
    import Queue from 'queue'

    import { parseJsonFromUintArray } from '@/utils/parseJsonFromUintArray'

    import MergeDeliveryPointsArrayWorker from '@/workers/mergeDeliveryPointsArrays?worker&inline'
    import FilterDeliveryPointsInBoundingBoxWorker from '@/workers/filterDeliveryPointsInBoundingBox?worker&inline'

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
    let fetchQueue = new Queue({ autostart: true, concurrency: 1 })

    queue.addEventListener('end', () => {
        cdekApiCoordinatesIsLoading = false
    })

    fetchQueue.addEventListener('start', () => {
        cdekApiCoordinatesIsLoading = true
    })

    fetchQueue.addEventListener('end', () => {
        cdekApiCoordinatesIsLoading = false
    })

    let mergeWorker: Worker
    let filterWorker: Worker

    let updatedDeliveryPointsIds: string[] = $state([])

    const updateDeliveryPoints = (newPoints: CdekCoordinates[]) => {
        queue.push(async () => {
            const { merged, added } = await new Promise<
                // TODO: переменная merged и всё связанное с ней имеет неправильную типизацию
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
                filterWorker = new FilterDeliveryPointsInBoundingBoxWorker()

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

        // Очищаем очередь и добавляем новое задание
        fetchQueue.end()
        fetchQueue.start()

        fetchQueue.push(async () => {
            const abortController = new AbortController()

            try {
                const {
                    0: [minLatitude, minLongitude],
                    1: [maxLatitude, maxLongitude]
                } = bounds

                const activeFilters = Object.fromEntries(
                    Object.entries(filters).map(([key, value]) => [
                        key,
                        value ? 'true' : 'false'
                    ])
                ) as Record<keyof CdekFilters, 'true' | 'false'>

                const params = new URLSearchParams({
                    minLongitude: minLongitude.toString(),
                    maxLatitude: maxLatitude.toString(),
                    maxLongitude: maxLongitude.toString(),
                    minLatitude: minLatitude.toString(),
                    ...activeFilters
                })

                const response = await fetch(
                    `${apiUrl}/delivery-points/bounding-box?${params}`,
                    {
                        method: 'GET',
                        signal: abortController.signal
                    }
                )

                const reader = response.body?.getReader()
                let remainder = ''
                updatedDeliveryPointsIds = []

                while (reader) {
                    const { done, value } = await reader.read()

                    if (value) {
                        const { parsedData, remainder: newReminder } =
                            parseJsonFromUintArray<CdekCoordinates[]>(value, remainder)

                        remainder = newReminder

                        if (parsedData) {
                            updateDeliveryPoints(parsedData)
                        }
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
                                console.error(
                                    'Error parsing the final remaining JSON:',
                                    error
                                )
                            }
                        }
                        return
                    }
                }
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.log('Error fetching delivery points:', error.message)
                }
            }
        })
    }

    onMount(() => {
        queue.start()
        fetchQueue.start()
    })
</script>
