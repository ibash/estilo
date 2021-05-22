import { resolve, version } from "../deps.ts";

import { loadYml, ymlsInFolder } from "./util.ts";

import {
  loadPalette,
  loadStatus,
  loadSyntax,
  loadTerminal,
} from "./loaders.ts";

import { Palettes, Project, StatusBrand, StatusStyles } from "./common.ts";

export function loadProject(folderPath: string): Project {
  return {
    folderPath,
    estiloVersion: version,
    config: loadYml(folderPath, "estilo.yml").content,
    palettes: loadPalettes(folderPath),
    syntax: ymlsInFolder(folderPath, "estilo/syntax").flatMap(loadSyntax),
    terminalSyntax: loadTerminal(folderPath),
    airlineStyles: loadAllStatus(folderPath, "airline"),
    lightlineStyles: loadAllStatus(folderPath, "lightline"),
  };
}

function loadPalettes(folderPath: string): Palettes {
  const filepaths = ymlsInFolder(folderPath, "estilo/palettes");
  const palettes = {} as Palettes;
  filepaths.forEach((file) => {
    const palette = loadPalette(file);
    palettes[palette.name] = palette;
  });
  return palettes;
}

function loadAllStatus(folderPath: string, brand: StatusBrand): StatusStyles {
  const brandpath = resolve(folderPath, "estilo");
  const filepaths = ymlsInFolder(brandpath, brand);
  const statusStyle = {} as StatusStyles;
  filepaths.forEach((filepath) => {
    const style = loadStatus(filepath, brand);
    statusStyle[style.name] = style;
  });
  return statusStyle;
}
