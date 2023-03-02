export enum Theme {
  Light = "theme-light",
  Dark = "theme-dark",
  None = "theme-none",
}

const root = document.body;
export let current_theme: Theme = Theme.None;

export function set_theme() {
  const local_theme = load_theme();
  set_current_theme(local_theme);
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
      return Theme.None;
  }
}

export function set_current_theme(theme?: Theme) {
  root.classList.remove(current_theme);
  if (theme) root.classList.add(theme);
  current_theme = theme ?? Theme.None;
}
