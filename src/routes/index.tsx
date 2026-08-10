import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, ShieldCheck, Puzzle, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import extensionAsset from "@/assets/aether-extension.zip.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aether 5.5.1 — Chrome Extension Download" },
      {
        name: "description",
        content:
          "Download the Aether Chrome extension (v5.5.1) and load it unpacked in any Chromium browser. Licensed automation and prompt tooling for Lovable.",
      },
      { property: "og:title", content: "Aether 5.5.1 — Chrome Extension Download" },
      {
        property: "og:description",
        content:
          "Download the Aether Chrome extension (v5.5.1) and load it unpacked in any Chromium browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const VERSION = "5.5.1";

const STEPS = [
  "Unzip the downloaded file to a permanent folder.",
  "Open chrome://extensions in Chrome, Edge, Brave, Arc or Opera.",
  "Enable Developer mode using the toggle in the top-right corner.",
  "Click Load unpacked and select the unzipped folder.",
  "Pin Aether, then open the side panel on lovable.dev.",
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "License validation",
    body: "Device-bound keys validated on every session before any action runs.",
  },
  {
    icon: Sparkles,
    title: "Prompt optimization",
    body: "Rewrites and enriches prompts in the side panel before they are sent.",
  },
  {
    icon: Puzzle,
    title: "Side panel + overlay",
    body: "Injects controls directly into lovable.dev with templates and build-error tooling.",
  },
];

function Index() {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  const download = async () => {
    setState("loading");
    try {
      const res = await fetch(extensionAsset.url);
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `aether-extension-${VERSION}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
      setState("idle");
    } catch {
      setState("error");
    }
  };

  const sizeMb = (extensionAsset.size / 1024 / 1024).toFixed(1);

  return (
    <main className="veil min-h-screen bg-background">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 md:py-28">
        <header className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Manifest V3 · version {VERSION}
          </span>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] md:text-6xl">
            <span className="blade-text">Aether</span> for Chromium
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            The packaged extension bundle, ready to load unpacked. Licensed automation, prompt
            optimization and an integrated side panel for lovable.dev.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              onClick={download}
              disabled={state === "loading"}
              className="h-12 gap-2 px-6 text-base"
              style={{ boxShadow: "var(--shadow-blade)" }}
            >
              {state === "loading" ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Download className="size-5" />
              )}
              Download ZIP
            </Button>
            <span className="text-sm text-muted-foreground">
              {sizeMb} MB · Chrome, Edge, Brave, Arc, Opera
            </span>
          </div>
          {state === "error" && (
            <p className="mt-3 text-sm text-destructive">
              Download failed. Please retry in a moment.
            </p>
          )}
        </header>

        <section className="mt-20 grid gap-4 md:grid-cols-3" aria-label="Capabilities">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-6"
              style={{ boxShadow: "var(--shadow-panel)" }}
            >
              <Icon className="size-5 text-primary" aria-hidden />
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 rounded-xl border border-border bg-card p-8" aria-label="Installation">
          <h2 className="text-xl font-semibold">Install in under a minute</h2>
          <ol className="mt-6 space-y-4">
            {STEPS.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-sm leading-relaxed text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
            Unpacked extensions cannot install automatically — one-click installation requires
            publishing to the Chrome Web Store. A valid license key is required for automation
            features.
          </p>
        </section>
      </div>
    </main>
  );
}
