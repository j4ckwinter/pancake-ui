import { createRoot } from "react-dom/client";
import { Surface, colors, typography } from "pancake-ui";
import "pancake-ui/styles.css";
import "pancake-ui/fonts.css";
import "./styles.css";
createRoot(document.getElementById("root")!).render(
  <main>
    <p className="eyebrow">PANCAKE UI / FOUNDATIONS</p>
    <h1>A familiar starting point.</h1>
    <p>A React and Tailwind library, growing from Padel Potato.</p>
    <Surface aria-label="Foundation preview">
      <h2>Ready for your next project</h2>
      <p>
        The installed package supplies this surface, its tokens, and the Inter
        font.
      </p>
      <div className="swatches">
        {["accent", "canvas", "deep"].map((name) => (
          <div key={name}>
            <span
              style={{ backgroundColor: colors[name as keyof typeof colors] }}
            />
            {name}
          </div>
        ))}
      </div>
    </Surface>
    <p className="note" style={typography.body}>
      Stage 1 · Package, theme, and development foundations.
    </p>
  </main>,
);
