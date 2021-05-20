import { resolve, Command, version, HelpCommand } from "../../deps.ts";
import { createProject } from "./create.ts";
import { selectSyntax } from "./select-syntax.ts";

const estiloCommand = new Command();

const result = await estiloCommand
  .command("help", new HelpCommand().global())
  .reset()
  .name("estilo")
  .version(version)
  .description("Generate colorschemes for (neo)vim, airline and lightline")

  .command("create [folder]")
  .description("Initialize an estilo project in [folder] or current folder")
  .option("-y, --yes", "Skip questions")
  .option("-a, --all", "Skip questions and add all syntax templates")
  .action((options: Record<string, boolean>, folder = ".") => {
    createProject(resolve(folder), !!options.yes);
  })
  .reset()

  .command("render [folder]")
  .description("Render project")
  .action((_: unknown, folder = ".") => {
    console.log("Rendering:", folder);
  })
  .reset()

  .command("add-syntax")
  .description("Add syntax templates.")
  .option("-a, --all [all:boolean]", "Add add available syntax templates")
  .action((options: Record<string, []>) => {
    selectSyntax(".", !!options.all);
  })
  .reset()

  .command("add-lightline [styleName]")
  .description("Add new Lightline style")
  .action((_: unknown, styleName = [] as string[]) => {
    console.log("Adding lightline style:", styleName);
  })
  .reset()

  .command("add-airline [styleName]")
  .description("Add new Airline style")
  .action((_: unknown, styleName = [] as string[]) => {
    console.log("Adding lightline style:", styleName);
  })
  .reset()
  .parse(Deno.args);

if (!Object.entries(result.options).length && result.cmd._name === "estilo") {
  estiloCommand.showHelp();
}

// render: () => renderProject(createProject(projectPath)),
// "add-airline": () => installStatus(projectPath, "airline"),
// "add-lightline": () => installStatus(projectPath, "lightline"),
