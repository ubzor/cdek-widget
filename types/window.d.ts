import ymaps from 'yandex-maps'

declare global {
    interface Window {
        ymaps: typeof ymaps
    }
}

export {}
