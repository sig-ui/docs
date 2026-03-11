import { compile, compileModule } from "svelte/compiler";
import * as path from "node:path";
import {
  generatePalette,
  apcaContrast,
  wcag2Contrast,
  generateTypeScale,
  themeToDTCG,
  generateFullPalette,
} from "../packages/core/src/index.js";
import { buildCSS, buildJSON, buildTypeScript, validateDTCG } from "../packages/cli/src/tokens/index.js";
type HarmonyMode = "analogous" | "complementary" | "triadic" | "tetradic" | "split-complementary";

// Build the Svelte frontend
console.log("Building frontend...");

const tsTranspiler = new Bun.Transpiler({ loader: "ts" });

// Resolve @sig-ui/* workspace packages for Bun.build() (browser target).
// Bun.build() can't follow workspace:* symlinks in per-package node_modules,
// so we resolve them manually using each package.json "bun" export condition.
const PACKAGES_DIR = path.resolve(import.meta.dir, "../packages");
const exportCache = new Map<string, Record<string, any>>();

function loadExports(pkgName: string): Record<string, any> {
  if (exportCache.has(pkgName)) return exportCache.get(pkgName)!;
  const pkgPath = path.join(PACKAGES_DIR, pkgName, "package.json");
  const pkg = require(pkgPath);
  const exports = pkg.exports ?? {};
  exportCache.set(pkgName, exports);
  return exports;
}

function resolveWorkspaceImport(specifier: string): string | null {
  // Parse @sig-ui/<pkg>/<subpath>
  const match = specifier.match(/^@sig-ui\/([^/]+)(\/.*)?$/);
  if (!match) return null;
  const [, pkgName, subpath] = match;
  const exportKey = subpath ? `.${subpath}` : ".";
  const exports = loadExports(pkgName!);
  const entry = exports[exportKey];
  if (!entry) return null;
  // Use "bun" condition (source .ts files), fallback to "default"
  const resolved = typeof entry === "string" ? entry : (entry.bun ?? entry.default);
  if (!resolved) return null;
  return path.join(PACKAGES_DIR, pkgName!, resolved);
}

const buildResult = await Bun.build({
  entrypoints: ["./website/src/main.ts"],
  outdir: "./website/dist",
  target: "browser",
  splitting: false,
  minify: false,
  plugins: [
    {
      name: "sigui",
      setup(build) {
        // Resolve @sig-ui/* workspace packages
        build.onResolve({ filter: /^@sig-ui\// }, (args) => {
          const resolved = resolveWorkspaceImport(args.path);
          if (resolved) return { path: resolved };
          return undefined;
        });

        // Handle .svelte component files
        build.onLoad({ filter: /\.svelte$/ }, async (args) => {
          const source = await Bun.file(args.path).text();
          const compiled = compile(source, {
            filename: args.path,
            generate: "client",
            css: "injected",
          });
          return {
            contents: compiled.js.code,
            loader: "js",
          };
        });

        // Handle .svelte.ts/.svelte.js rune-aware modules
        build.onLoad({ filter: /\.svelte\.[jt]s$/ }, async (args) => {
          const source = await Bun.file(args.path).text();
          // Strip TypeScript types before compileModule (it only accepts JS)
          const jsSource = args.path.endsWith(".ts")
            ? tsTranspiler.transformSync(source)
            : source;
          const result = compileModule(jsSource, {
            filename: args.path,
            generate: "client",
          });
          return {
            contents: result.js.code,
            loader: "js",
          };
        });
      },
    },
  ],
});

if (!buildResult.success) {
  console.error("Build failed:");
  for (const log of buildResult.logs) console.error(log);
  process.exit(1);
}

console.log("Frontend built");

// Serve
const port = Number(process.env.PORT) || 3000;

Bun.serve({
  port,

  routes: {
    // API routes - demonstrate server-side SigUI
    "/api/palette/:hex": (req) => {
      try {
        const hex = "#" + req.params.hex;
        const result = generatePalette(hex, {
          background: "#ffffff",
          format: "hex",
        });
        return Response.json(result.formatted);
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 });
      }
    },

    "/api/contrast": {
      POST: async (req) => {
        try {
          const { text, bg } = await req.json();
          return Response.json({
            apca: apcaContrast(text, bg),
            wcag2: wcag2Contrast(text, bg),
          });
        } catch (e: any) {
          return Response.json({ error: e.message }, { status: 400 });
        }
      },
    },

    "/api/type-scale": {
      POST: async (req) => {
        try {
          const { ratio, base } = await req.json();
          const scale = generateTypeScale({ ratio, base });
          return Response.json(scale);
        } catch (e: any) {
          return Response.json({ error: e.message }, { status: 400 });
        }
      },
    },

    "/api/theme/:hex": (req) => {
      try {
        const hex = "#" + req.params.hex;
        const url = new URL(req.url);
        const harmony = (url.searchParams.get("harmony") ?? "triadic") as HarmonyMode;
        const mode = (url.searchParams.get("mode") ?? "light") as "light" | "dark";
        const result = generateFullPalette(hex, { harmony, mode });
        const formatted: Record<string, Record<string, string>> = {};
        const palettes = result.palettes as Record<string, { formatted: Record<string, string> }>;
        for (const [name, palette] of Object.entries(palettes)) {
          formatted[name] = palette.formatted;
        }
        return Response.json({
          palettes: formatted,
          roles: result.roles,
          harmony: result.harmony,
          background: result.background,
          mode: result.mode,
        });
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 });
      }
    },

    "/api/tokens/generate": {
      POST: async (req) => {
        try {
          const { primaryHex, format = "json" } = await req.json();
          const palette = generatePalette(primaryHex, { background: "#ffffff" });
          const tree = themeToDTCG({ palette: { primary: palette.ramp } });
          const validation = validateDTCG(tree);

          let output: string;
          if (format === "css") output = buildCSS(tree);
          else if (format === "ts") output = buildTypeScript(tree);
          else output = buildJSON(tree);

          return Response.json({ output, valid: validation.valid, errors: validation.errors });
        } catch (e: any) {
          return Response.json({ error: e.message }, { status: 400 });
        }
      },
    },
  },

  async fetch(req) {
    const url = new URL(req.url);

    // Serve built JS
    if (url.pathname === "/main.js") {
      return new Response(Bun.file("./website/dist/main.js"), {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    // Serve CSS
    if (url.pathname === "/styles.css") {
      return new Response(Bun.file("./website/styles.css"), {
        headers: { "Content-Type": "text/css" },
      });
    }

    // Serve component CSS (generated bundle: tokens + base + variants + states)
    if (url.pathname === "/sigui.css") {
      return new Response(Bun.file("./website/sigui/sigui.css"), {
        headers: { "Content-Type": "text/css" },
      });
    }

    // Serve favicon
    if (url.pathname === "/favicon.ico") {
      return new Response(Bun.file("./website/favicon.ico"), {
        headers: { "Content-Type": "image/x-icon" },
      });
    }

    // Serve logo
    if (url.pathname === "/logo.svg") {
      return new Response(Bun.file("./website/logo.svg"), {
        headers: { "Content-Type": "image/svg+xml" },
      });
    }

    // Everything else → index.html
    return new Response(Bun.file("./website/index.html"), {
      headers: { "Content-Type": "text/html" },
    });
  },
});

console.log(`SigUI website running at http://localhost:${port}`);
