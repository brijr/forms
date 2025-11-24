import { CopyCommand } from "./copy-command";
import { Button } from "./ui/button";

const INSTALL_COMMAND =
  "pnpx shadcn@latest add https://forms.bridger.to/r/inline-edit.json https://forms.bridger.to/r/form-builder.json";
const GITHUB_URL = "https://github.com/brijr/forms";

export function SiteNav() {
  return (
    <nav className="border-b px-4 py-2 bg-background">
      <div className="mx-auto flex items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-3">
          <h2>brijr/forms</h2>
          <h3 className="text-muted-foreground">Open Source Form Builder</h3>
        </div>
        <div className="flex items-center gap-3">
          <CopyCommand command={INSTALL_COMMAND} />
          <GithubButton />
        </div>
      </div>
    </nav>
  );
}

const GithubButton = () => {
  return (
    <Button asChild variant="outline">
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
        View on Github
      </a>
    </Button>
  );
};
