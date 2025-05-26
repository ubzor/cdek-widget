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

// Если были найдены дубликаты или одиночные @layer components;, сохраняем изменения
const duplicatesRemoved = layerTypes.filter((type) => seen.has(type)).length > 0
const singleLayerComponentsRemoved = css !== result

if (duplicatesRemoved || singleLayerComponentsRemoved) {
    fs.writeFileSync(CSS_PATH, result, 'utf8')

    if (duplicatesRemoved) {
        console.log(`Duplicate @layer blocks removed from style.css`)
    }

    if (singleLayerComponentsRemoved) {
        console.log(`Standalone @layer components; declarations removed from style.css`)
    }
} else {
    console.log(
        'No duplicate @layer blocks or standalone @layer components; declarations found'
    )
}
