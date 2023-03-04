export enum Theme {
  Light = "theme-light",
  Dark = "theme-dark",
}

const root = document.body;
export const themes = Object.values(Theme);

export function set_theme_onload() {
  const dark_mode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let theme = dark_mode ? Theme.Dark : Theme.Light;
  theme = load_theme() ?? theme;
  set_theme(theme);
}

export function save_theme(theme: Theme) {
  localStorage.setItem("theme", theme);
}

export function load_theme() {
  const theme = localStorage.getItem("theme");
  if (theme && themes.includes(theme)) return theme as Theme;
  return null;
}

export function set_theme(theme: Theme) {
  root.classList.remove(...themes);
  root.classList.add(theme);
}
