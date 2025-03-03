export const parseJsonFromUintArray = <T>(
    value: Uint8Array<ArrayBufferLike>,
    lastReminder: string
) => {
    const decoder = new TextDecoder()

    let remainder = ''

    let jsonString = decoder.decode(value).replaceAll(/(\r\n|\n|\r)/gm, '')

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

    let parsedData: T | undefined = undefined

    try {
        parsedData = JSON.parse('[' + jsonString + ']')
    } catch (error: any) {
        remainder = jsonString
    }

    return { parsedData, remainder }
}
