const host = "127.0.0.1";

function previewServer(directory: string, port: number, readyPath = "") {
  const origin = `http://${host}:${port}`;
  return {
    origin,
    webServer: {
      command: `npx vite preview --outDir ${directory} --host ${host} --port ${port} --strictPort`,
      url: `${origin}${readyPath}`,
      reuseExistingServer: false,
    },
  };
}

export const compatibilitySite = previewServer(
  ".tmp/compatibility/site",
  4174,
  "/minimum/",
);
export const consumerApp = previewServer(".tmp/consumer/dist", 4173);
export const storybook = previewServer("storybook-static", 6007);

const storybookAxeGlobals = {
  automatic: "",
  manual: "&globals=a11y.manual:!true",
};

type StoryView = {
  viewMode?: "story" | "docs";
  storybookAxe?: keyof typeof storybookAxeGlobals;
};

export function storyUrl(
  id: string,
  { viewMode = "story", storybookAxe = "automatic" }: StoryView = {},
) {
  return `${storybook.origin}/iframe.html?id=${id}&viewMode=${viewMode}${storybookAxeGlobals[storybookAxe]}`;
}
