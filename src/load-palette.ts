import path from 'path'
import hexterm from 'hexterm'
import { Palette } from './common'
import isHexColor from './is-hex-color'
import { loadYml } from './load-yml'

export function loadPalette (filepath: string): Palette {
  const file = loadYml(filepath)
  const { content } = file
  if (typeof content !== 'object') {
    throw new Error(`Content of palette (${filepath}) is not an object`)
  }

  const palette = {
    name: path.basename(filepath, '.yml'),
    path: filepath,
    colors: {}
  } as Palette

  Object.keys(content).forEach(name => {
    const value = content[name]

    if (typeof value !== 'string') {
      throw new Error(`Wrong type: ${filepath}: ${name}`)
    }

    const hexcolor = value.trim()
    if (!isHexColor(hexcolor)) {
      throw new Error(`Wrong color: ${filepath}: ${name}`)
    }

    palette.colors[name] = {
      hex: hexcolor.startsWith('#') ? hexcolor : '#' + hexcolor,
      xterm: hexterm(hexcolor)
    }
  })
  return palette
}