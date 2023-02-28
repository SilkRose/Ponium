"use strict";
var Theme;
(function (Theme) {
    Theme["Light"] = "light";
    Theme["Dark"] = "dark";
    Theme["None"] = "none";
})(Theme || (Theme = {}));
const light_theme = {
    text: "#000",
    background: "#f2f2f2",
    foreground: "#fff",
    shadow: "#ccc",
    border: "#a5a5a5",
    placeholder: "#555",
    input_background: "#f2f2f2",
    button_background: "#e9e9ed",
    button_hover_background: "#d0d0d7",
    mane_accent_inactive: "#a5a5a5",
    mane_accent_active: "#eb458b",
};
const dark_theme = {
    text: "#fff",
    background: "#000",
    foreground: "#0d0d0d",
    shadow: "#444",
    border: "#5a5a5a",
    placeholder: "#aaaaaa",
    input_background: "#0d0d0d",
    button_background: "#161612",
    button_hover_background: "#2f2f28",
    mane_accent_inactive: "#5a5a5a",
    mane_accent_active: "#14ba74",
};
const root = document.documentElement;
set_theme();
function set_theme() {
    const local_theme = load_theme();
    const dark_mode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (local_theme === Theme.None) {
        if (dark_mode) {
            set_current_theme(dark_theme);
        }
        else {
            set_current_theme(light_theme);
        }
    }
    else if (local_theme === Theme.Light) {
        set_current_theme(light_theme);
    }
    else if (local_theme === Theme.Dark) {
        set_current_theme(dark_theme);
    }
}
function save_theme(theme) {
    localStorage.setItem("theme", theme);
}
function load_theme() {
    const theme = localStorage.getItem("theme");
    switch (theme) {
        case "light":
            return Theme.Light;
        case "dark":
            return Theme.Dark;
        default:
            return Theme.None;
    }
}
function set_current_theme(theme) {
    root.style.setProperty("--text", theme.text);
    root.style.setProperty("--background", theme.background);
    root.style.setProperty("--foreground", theme.foreground);
    root.style.setProperty("--shadow", theme.shadow);
    root.style.setProperty("--border", theme.border);
    root.style.setProperty("--placeholder", theme.placeholder);
    root.style.setProperty("--input_background", theme.input_background);
    root.style.setProperty("--button_background", theme.button_background);
    root.style.setProperty("--button_hover_background", theme.button_hover_background);
    root.style.setProperty("--mane_accent_inactive", theme.mane_accent_inactive);
    root.style.setProperty("--mane_accent_active", theme.mane_accent_active);
}
