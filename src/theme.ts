export enum Theme {
  Light = "theme-light",
  Dark = "theme-dark",
}

const root = document.body;
export let current_theme: Theme;

export const themes = ["theme-light", "theme-dark"];

export function set_theme() {
  current_theme = load_theme() ?? Theme.Light;
  const dark_mode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (dark_mode) current_theme = Theme.Dark;
  set_current_theme(current_theme);
}

export function save_theme(theme: Theme) {
  localStorage.setItem("theme", theme);
}

export function load_theme() {
  const theme = localStorage.getItem("theme");
  switch (theme) {
    case Theme.Light:
      return Theme.Light;
    case Theme.Dark:
      return Theme.Dark;
    default:
      return null;
  }
}

export function set_current_theme(theme: Theme) {
  themes.forEach((theme_index) => root.classList.remove(theme_index));
  root.classList.add(theme);
  current_theme = theme;
}
