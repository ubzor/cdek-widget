<script lang="ts">
    import { Buffer } from 'buffer'

    import type { LngLatBounds } from 'ymaps3'
    import type { CdekCoordinates } from '#/api'

    let { apiUrl }: { apiUrl: string } = $props()

    const parseFromUintArray = (
        value: Uint8Array<ArrayBufferLike>,
        lastReminder: string
    ) => {
        let remainder = ''

        let jsonString = Buffer.from(value)
            .toString('utf8')
            .replaceAll(/(\r\n|\n|\r)/gm, '')

        if (lastReminder) {
            jsonString = lastReminder + jsonString
        }

        if (jsonString.startsWith('[')) {
            jsonString = jsonString.slice(1)
        }

        if (jsonString.endsWith(']')) {
            jsonString = jsonString.slice(0, jsonString.length - 2)
        }

        if (jsonString.startsWith(',')) {
            jsonString = jsonString.slice(1)
        }

        if (!jsonString.endsWith('}')) {
            const separatorIndex = jsonString.indexOf(',{')
            if (separatorIndex !== -1) {
                remainder = jsonString.slice(separatorIndex)
                jsonString = jsonString.slice(0, separatorIndex)
            }
        }

        let parsedData: CdekCoordinates[] = []

        try {
            parsedData = JSON.parse('[' + jsonString + ']')

            // console.log(parsedData)
        } catch (error: any) {
            // console.log('cant parse', jsonString)
        }

        return { parsedData, remainder }
    }

    export const getDeliveryPointsInBoundingBox = async (bounds: LngLatBounds) => {
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

        const response = await fetch(`${apiUrl}/delivery-points/bounding-box?${params}`, {
            method: 'GET'
        })

        const reader = response.body?.getReader()
        let remainder = ''

        while (reader) {
            const { done, value } = await reader.read()

            if (value) {
                const { parsedData, remainder: newReminder } = parseFromUintArray(
                    value,
                    remainder
                )

                if (parsedData.length) {
                    console.log(parsedData)
                    // Here you can process the parsedData as needed
                }

                remainder = newReminder
            }

            if (done) {
                // Process any leftover JSON from the last chunk
                if (remainder) {
                    try {
                        const finalParsedData: CdekCoordinates[] = JSON.parse(
                            '[' + remainder.slice(1) + '}]'
                        )
                        console.log(finalParsedData)
                    } catch (error) {
                        console.log(remainder)
                        console.error('Error parsing the final remaining JSON:', error)
                    }
                }
                console.log('-------------------')
                return
            }
        }
    }
</script>
