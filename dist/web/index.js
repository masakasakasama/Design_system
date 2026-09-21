// GENERATED FILE. Edit tokens/design-tokens.json, then run npm run generate.
export const accents = ["ocean","sage","amethyst"];
export const themes = ["light", "dark"];
export const designSystemVersion = "0.1.0";
export function applyTatsuTheme({ accent = "ocean", theme = "dark" } = {}) {
  const root = document.documentElement;
  root.dataset.tatsuAccent = accent;
  root.dataset.tatsuTheme = theme;
}
