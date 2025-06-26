import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

// Получение __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CSS_PATH: string = path.join(__dirname, 'dist/style.css')

if (!fs.existsSync(CSS_PATH)) {
    console.error('style.css not found in dist/')
    process.exit(1)
}

const css: string = fs.readFileSync(CSS_PATH, 'utf8')

// Функция для поиска соответствующей закрывающей скобки
function findClosingBrace(text: string, startIndex: number): number {
    let braceLevel = 1
    for (let i = startIndex; i < text.length; i++) {
        if (text[i] === '{') braceLevel++
        else if (text[i] === '}') {
            braceLevel--
            if (braceLevel === 0) return i
        }
    }
    return -1
}

// Анализируем CSS и удаляем дубликаты @layer блоков
const layerTypes: string[] = ['theme', 'base', 'components', 'utilities']
const seen: Set<string> = new Set()
let result: string = ''
let currentPos: number = 0

// Ищем блоки @layer
while (currentPos < css.length) {
    const layerMatch = /@layer\s+(theme|base|components|utilities)\s*\{/.exec(
        css.slice(currentPos)
    )

    if (!layerMatch) {
        // Больше блоков @layer не найдено, добавляем оставшуюся часть CSS
        result += css.slice(currentPos)
        break
    }

    const layerType = layerMatch[1]
    const layerStartIndex = currentPos + layerMatch.index
    const braceStartIndex = layerStartIndex + layerMatch[0].length - 1
    const braceEndIndex = findClosingBrace(css, braceStartIndex + 1)

    if (braceEndIndex === -1) {
        console.error('Failed to find closing brace for a @layer block')
        process.exit(1)
    }

    // Добавляем текст до текущего блока @layer
    result += css.slice(currentPos, layerStartIndex)

    if (!seen.has(layerType)) {
        // Если это первое вхождение данного типа слоя, сохраняем его
        const layerBlock = css.slice(layerStartIndex, braceEndIndex + 1)
        result += layerBlock
        seen.add(layerType)
    }

    // Перемещаем указатель за текущий блок
    currentPos = braceEndIndex + 1
}

// Удаляем все одиночные @layer components;
// Создаем новую строку, заменяя все @layer components; на пустую строку
const singleLayerComponentsPattern = /@layer\s+components\s*;/g
result = result.replace(singleLayerComponentsPattern, '')

// Функция для добавления префикса виджета ко всем CSS селекторам
function addWidgetScope(css: string): string {
    const WIDGET_PREFIX = '.cdek-widget'

    // Более простой подход - заменяем весь CSS блок за блоком
    let result = css

    // Обрабатываем @layer блоки с помощью regex
    result = result.replace(
        /@layer\s+(theme|base|components|utilities)\s*\{([^{}]*(?:\{[^}]*\}[^{}]*)*)\}/g,
        (match, layerName, content) => {
            // Обрабатываем содержимое layer блока
            const scopedContent = addPrefixToSelectors(content, WIDGET_PREFIX, layerName)
            return `@layer ${layerName}{${scopedContent}}`
        }
    )

    return result
}

// Функция для добавления префикса к селекторам
function addPrefixToSelectors(css: string, prefix: string, layerName: string): string {
    // Более точная обработка CSS с учетом @media правил
    return css.replace(
        /@media[^{]*\{([^{}]*(?:\{[^}]*\}[^{}]*)*)\}|([^{}]*)\{([^{}]*)\}/g,
        (match, mediaContent, selector, declarations) => {
            if (mediaContent !== undefined) {
                // Это @media правило - рекурсивно обрабатываем содержимое
                const mediaPrefix = match.substring(0, match.indexOf('{') + 1)
                const processedContent = addPrefixToSelectors(
                    mediaContent,
                    prefix,
                    layerName
                )
                return `${mediaPrefix}${processedContent}}`
            } else if (selector !== undefined && declarations !== undefined) {
                // Это обычное CSS правило
                const processedSelectors = selector
                    .split(',')
                    .map((sel) => {
                        sel = sel.trim()

                        // Пропускаем пустые селекторы
                        if (!sel) return ''

                        // Пропускаем некоторые специальные селекторы
                        if (
                            sel.startsWith(':root') ||
                            sel.startsWith(':host') ||
                            sel.startsWith('@') ||
                            sel.includes(':where(') ||
                            sel.includes('::file-selector-button') ||
                            sel.includes('::-webkit-') ||
                            sel.includes(':-moz-') ||
                            sel.includes('::placeholder') ||
                            sel.includes('::backdrop')
                        ) {
                            return sel
                        }

                        // Для base слоя удаляем некоторые глобальные селекторы
                        if (layerName === 'base') {
                            if (
                                sel === 'html' ||
                                sel === 'body' ||
                                sel === '*' ||
                                sel.match(/^(html|body|\*)(\s|$|,)/)
                            ) {
                                return '' // Удаляем эти селекторы
                            }
                        }

                        // Добавляем префикс если его еще нет
                        if (!sel.includes(prefix)) {
                            // Для селекторов тегов, классов и ID
                            if (
                                sel.match(/^[a-zA-Z]/) ||
                                sel.startsWith('.') ||
                                sel.startsWith('#')
                            ) {
                                return `${prefix} ${sel}`
                            }
                            // Для псевдо-элементов и псевдо-классов
                            if (sel.startsWith('::') || sel.startsWith(':')) {
                                return `${prefix}${sel}`
                            }
                        }

                        return sel
                    })
                    .filter((s) => s.trim()) // Удаляем пустые селекторы
                    .join(',')

                if (!processedSelectors.trim()) {
                    return '' // Если все селекторы были удалены
                }

                return `${processedSelectors}{${declarations}}`
            }

            return match
        }
    )
}

// Применяем изоляцию стилей
result = addWidgetScope(result)

// Если были найдены дубликаты или одиночные @layer components;, сохраняем изменения
const duplicatesRemoved = layerTypes.filter((type) => seen.has(type)).length > 0
const singleLayerComponentsRemoved = css !== result
const stylesScoped = result !== css

if (duplicatesRemoved || singleLayerComponentsRemoved || stylesScoped) {
    fs.writeFileSync(CSS_PATH, result, 'utf8')

    if (duplicatesRemoved) {
        console.log(`Duplicate @layer blocks removed from style.css`)
    }

    if (singleLayerComponentsRemoved) {
        console.log(`Standalone @layer components; declarations removed from style.css`)
    }

    if (stylesScoped) {
        console.log(`Styles scoped to .cdek-widget container`)
    }
} else {
    console.log(
        'No duplicate @layer blocks or standalone @layer components; declarations found'
    )
}
