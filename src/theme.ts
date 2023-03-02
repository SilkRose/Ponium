enum Theme {
  Light = "theme-light",
  Dark = "theme-dark",
  None = "theme-none",
}

const root = document.body;
let current: Theme = Theme.None;

set_theme();

function set_theme() {
  const local_theme = load_theme();
  set_current_theme(local_theme);
}

function save_theme(theme: Theme) {
  localStorage.setItem("theme", theme);
}

function load_theme() {
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

function set_current_theme(theme?: Theme) {
  root.classList.remove(current);
  if (theme) root.classList.add(theme);
  current = theme ?? Theme.None;
}
