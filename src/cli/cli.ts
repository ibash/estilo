import { Command, HelpCommand } from "cliffy-command";
import { resolve } from "path";

import { existsSync, version } from "../common.ts";
import { crash } from "../crash.ts";
import { createProject } from "./create.ts";
import { loadProjectFiles } from "../load-project.ts";
import { renderProject } from "../render-project.ts";

const estiloCommand = new Command();

await estiloCommand
  .command("help", new HelpCommand().global())
  .reset()
  .name("estilo")
  .version(version)
  .description("Generate colorschemes for (neo)vim, airline and lightline")
  .command("create [folder]")
  .description("Initialize an estilo project in [folder] or current folder")
  .option("-y, --yes", "Skip questions")
  .action((options: Record<string, boolean>, folder = ".") => {
    createProject(resolve(folder), !!options.yes);
  })
  .reset()
  .command("render [folder]")
  .description("Render project")
  .action((_: unknown, folder = ".") => {
    const projectPath = resolve(folder);
    checkProject(projectPath);
    const project = loadProjectFiles(projectPath);
    renderProject(project);
  })
  .reset()
  .parse(Deno.args);

if (!Object.entries(Deno.args).length) {
  estiloCommand.showHelp();
}

function checkProject(projectPath: string) {
  const paths = [
    "estilo.yml",
    "estilos/syntax",
    "estilos/palettes",
    "estilos/terminal.yml",
  ];
  const notOk = paths
    .map((path) => resolve(projectPath, path))
    .filter((path) => !existsSync(path));
  if (notOk.length) {
    if (existsSync(resolve(projectPath, "estilo"))) {
      crash(`⚠ Wrong project folder. Follow upgrade instructions please`);
    } else {
      crash(`⚠ Wrong project folder. Missing paths:\n${notOk.join("\n")}`);
    }
  }
}
