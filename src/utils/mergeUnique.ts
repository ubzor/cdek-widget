// Предполагается, что каждый объект имеет уникальный идентификатор, например, поле id.
export const mergeUnique = <T>(array1: T[], array2: T[], idKey: keyof T) => {
    const map = new Map<any, T>()
    const ids = array1.map((item) => item[idKey])
    const added: T[] = []

    // Проходим по обоим массивам и добавляем объект в мапу, если по его id его еще нет.
    ;[...array1, ...array2].forEach((obj) => {
        if (!map.has(obj[idKey])) {
            map.set(obj[idKey], obj)
        }

        if (!ids.find((id) => id === obj[idKey])) {
            added.push(obj)
        }
    })

    // Возвращаем массив уникальных объектов.
    return {
        merged: Array.from(map.values()).sort((a, b) => {
            if (a[idKey] < b[idKey]) return -1
            if (a[idKey] > b[idKey]) return 1
            return 0
        }),
        added
    }
}
