<script lang="ts">
    import type { CdekDeliveryPoint } from '#/api.d'

    let {
        apiUrl,
        onGetDeliveryPointById
    }: {
        apiUrl: string
        onGetDeliveryPointById: (deliveryPoint: CdekDeliveryPoint) => void
    } = $props()

    export const getDeliveryPointById = async (deliveryPointId: string) => {
        try {
            const response = await fetch(`${apiUrl}/delivery-points/${deliveryPointId}`, {
                method: 'GET'
            })

            onGetDeliveryPointById(await response.json())
        } catch (error: any) {
            console.log('Error fetching delivery point:', error.message)
        }
    }
</script>
