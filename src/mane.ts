import * as characters from "./data/character/characters";
import { virtues } from "./data/virtues";
import { items } from "./data/items";
import * as image from "./assets";
import { Theme, save_theme, set_theme, set_theme_onload } from "./theme";
import "@total-typescript/ts-reset";

const name = "Libre Pony" as const;

const pony = "Pony" as const;

const best_pony = "Pinkie Pie" as const;

const nonpony_species = [
  "Kirin",
  "Dragon",
  "Donkey",
  "Mule",
  "Griffin",
] as const;

const pony_sub_races = ["Alicorn", "Unicorn", "Pegasus", "Earth Pony"] as const;

type Species =
  | {
      race: typeof pony;
      sub_race: typeof pony_sub_races[number];
    }
  | {
      race: typeof nonpony_species[number];
    };

const genders = [
  "Female",
  "Male",
  "Gender Fluid",
  "Non-Binary",
  "Agender",
  "Other",
] as const;

type Gender = typeof genders[number];

type Virtue = keyof typeof virtues;

export type Item = {
  name: string;
  description: string;
  value: number;
};

type Items = { [k in keyof typeof items]?: number };

export type Character = {
  name: string;
  age: number;
  species: Species;
  gender: Gender;
  virtue: Virtue;
  inventory: Items;
};

type Event = HTMLElementEventMap[keyof HTMLElementEventMap];

type KeyEvent = {
  key: string;
};

type RaceEvent = {
  elem: HTMLElement;
  event: keyof HTMLElementEventMap;
  prevent_default?: boolean;
  condition?: (event: KeyEvent) => boolean;
};

type heading_size = 1 | 2 | 3 | 4 | 5 | 6;

enum InputType {
  text = "text",
  number = "number",
  radio = "radio",
}

const timer_classes = {
  timer: "timer",
  background: "timer-background",
  foreground: "timer-foreground",
  skip: "timer-skip",
  skip_text: "timer-skip-text",
  left_to_right: "timer-left-to-right",
  sides_to_center: "timer-sides-to-center",
  dual_spacing: "timer-dual-spacing",
  sub: "timer-sub",
  sub_div: "timer-sub-div",
  sub_left_to_right: "timer-sub-left-to-right",
};

const game_content = document.getElementById("game-content")!;
const root = document.documentElement;

window.onload = mane;

async function mane() {
  set_theme_onload();
  await mane_menu();
  await create_dual_timers(5000, "Eating pie ", 5);
  await create_timer(2000);
  await create_skip_timer(2000);
}

function append_element(element: string) {
  const new_element = document.createElement("div");
  new_element.className = "content";
  new_element.innerHTML = `${element}`;
  game_content.appendChild(new_element);
  new_element.scrollIntoView();
}

async function read_line_text(type: InputType): Promise<string> {
  const input_field = create_text_input_field(type, true);
  game_content.appendChild(input_field);
  const input = document.getElementById("input") as HTMLInputElement;
  const button = document.getElementById("submit") as HTMLButtonElement;
  input.focus();
  input.scrollIntoView();
  await race_events([
    {
      elem: button,
      event: "click",
    },
    ...get_event_from_input_elements([input], "keydown", "Enter"),
  ]);
  game_content.removeChild(game_content.lastChild!);
  return input.value.trim();
}

async function read_line_radial<T>(options: readonly string[]): Promise<T> {
  const radio_element = create_radial_input_field(options);
  game_content.appendChild(radio_element);
  const input = document.getElementsByName(
    "radial"
  ) as NodeListOf<HTMLInputElement>;
  const button = document.getElementById("submit") as HTMLButtonElement;
  input[0].focus();
  input[0].scrollIntoView();
  await race_events([
    {
      elem: button,
      event: "click",
    },
    ...get_event_from_input_elements(Array.from(input), "keydown", "Enter"),
  ]);
  const checked = Array.from(input).filter((radial) => radial.checked)[0].value;
  game_content.removeChild(game_content.lastChild!);
  if (options.indexOf(checked) != -1) {
    return checked as T;
  } else {
    return await read_line_radial<T>(options);
  }
}

function get_event_from_input_elements(
  items: HTMLInputElement[],
  event: keyof HTMLElementEventMap,
  required_key: string
) {
  return items.map((item) => {
    return {
      elem: item,
      event: event,
      condition: (event: KeyEvent) => event.key === required_key,
    };
  });
}

function capitalize_string(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function capitalize_words(string: string) {
  const arr = string.toLowerCase().split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(" ");
}

async function create_character() {
  return {
    name: await get_name(),
    age: await get_age(),
    species: await get_species(),
    gender: await get_gender(),
    traits: [],
    inventory: [],
  };
}

async function get_name(): Promise<string> {
  append_element("What is your name?");
  let name = await read_line_text(InputType.text);
  if (name.length >= 2 && name.length <= 32) {
    return name;
  } else {
    append_element("Please provide a name between 2 and 32 characters.");
    return await get_name();
  }
}

async function get_age(): Promise<number> {
  append_element("How old are you?");
  let age = parseInt(await read_line_text(InputType.number));
  if (age >= 18 && age <= 100) {
    return age;
  } else {
    append_element("Please provide an age between 18 and 99.");
    return await get_age();
  }
}

async function get_species(): Promise<Species> {
  append_element(`What species are you?)`);
  let race = await read_line_radial<Species["race"]>([
    pony,
    ...nonpony_species,
  ]);
  if (race === pony) {
    append_element(`What pony race are you?`);
    return {
      race: race,
      sub_race: await read_line_radial<typeof pony_sub_races[number]>(
        pony_sub_races
      ),
    } as Species;
  } else {
    return { race: race } as Species;
  }
}

async function get_gender(): Promise<Gender> {
  append_element("What is your gender?");
  let gender = await read_line_radial<Gender>(genders);
  return gender as Gender;
}

async function get_best_pony() {
  const question = "Who is best Pony?";
  append_element(question);
  await assert_best_pony(best_pony);
  game_content.removeChild(game_content.lastChild!);
  const question2 = `Please confirm that ${best_pony} is indeed best pony.`;
  append_element(question2);
  await assert_best_pony("Yes!");
  game_content.removeChild(game_content.lastChild!);
}

async function assert_best_pony(answer: string) {
  const input_field = create_text_input_field(InputType.text, false);
  const button = create_button_element("submit", "Enter");
  game_content.appendChild(input_field);
  const input = document.getElementById("input") as HTMLInputElement;
  input.focus();
  input.scrollIntoView();
  on_paste_event_override(input, answer);
  await Promise.resolve(
    get_promise_from_input_event_override(input, "keydown", answer, button)
  );
}

function get_promise_from_input_event_override(
  item: HTMLInputElement,
  event: string,
  answer: string,
  button: HTMLButtonElement
) {
  return new Promise<void>((resolve) => {
    const listener = () => {
      item.onkeyup = function (key) {
        const cursor_position = item.selectionStart;
        item.value = answer.slice(0, item.value.length);
        item.setSelectionRange(cursor_position, cursor_position);
        if (item.value !== answer && document.contains(button)) {
          button.remove();
        }
        if (item.value.length > 0) {
          if (item.value === answer) {
            if (key.key === "Enter") {
              item.removeEventListener(event, listener);
              resolve();
            } else {
              item.parentElement!.appendChild(button);
              button.onclick = function () {
                item.removeEventListener(event, listener);
                resolve();
              };
            }
          }
        }
      };
    };
    item.addEventListener(event, listener);
  });
}

function on_paste_event_override(input: HTMLInputElement, answer: string) {
  input.addEventListener("paste", (event) => {
    event.preventDefault();
    let text = event.clipboardData!.getData("text");
    if (input.value.length > answer.length) {
      input.value = answer;
    } else {
      input.value = answer.slice(0, text.length);
    }
  });
}

function create_text_input_field(type: InputType, button: boolean) {
  const new_element = create_div_element(["content"], "input_field");
  new_element.appendChild(
    create_text_input_element("input", type, "Enter response...")
  );
  if (button) {
    new_element.appendChild(create_button_element("submit", "Enter"));
  }
  return new_element;
}

function create_text_input_element(
  id: string,
  type: InputType,
  placeholder: string,
  value?: string
) {
  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.placeholder = placeholder;
  if (value) input.value = value;
  return input;
}

function create_button_element(id: string, text: string) {
  const button = document.createElement("button");
  button.id = id;
  button.innerText = text;
  return button;
}

function create_radial_input_field(options: readonly string[]) {
  const new_element = create_div_element(["content"], "input_radial");
  new_element.appendChild(create_label_with_radial_element(options[0], true));
  for (let i = 1; i < options.length; i++) {
    new_element.appendChild(create_label_with_radial_element(options[i]));
  }
  new_element.appendChild(create_button_element("submit", "Enter"));
  return new_element;
}

function create_label_with_radial_element(text: string, checked?: boolean) {
  const label = create_label_element(text);
  label.prepend(create_radio_element(text, checked));
  return label;
}

function create_label_element(text: string) {
  const label = document.createElement("label");
  label.innerText = text;
  return label;
}

function create_radio_element(value: string, checked?: boolean) {
  const radio = document.createElement("input");
  radio.type = InputType.radio;
  radio.name = "radial";
  radio.value = value;
  if (checked) radio.checked = true;
  return radio;
}

async function create_timer(time: number) {
  root.style.setProperty("--timer_delay", time + "ms");
  const timer = create_div_element([timer_classes.timer]);
  const timer_filled = create_image_element(
    ["pixelated", timer_classes.background],
    image.timer_filled
  );
  const timer_unfilled = create_image_element(
    ["pixelated", timer_classes.foreground, timer_classes.left_to_right],
    image.timer_unfilled
  );
  timer.appendChild(timer_filled);
  timer.appendChild(timer_unfilled);
  game_content.appendChild(timer);
  timer.scrollIntoView();
  await race_events([
    {
      elem: timer_unfilled,
      event: "animationend",
    },
  ]);
  sleep(200);
  remove_div_element(timer);
}

function sleep(milliseconds: number) {
  const date = Date.now();
  let current_date = null;
  do {
    current_date = Date.now();
  } while (current_date - date < milliseconds);
}

function create_div_element(classes?: string[], id?: string) {
  const div = document.createElement("div");
  if (classes) div.className = classes.join(" ");
  if (id) div.id = id;
  return div;
}

function remove_div_element(div: HTMLDivElement) {
  game_content.removeChild(div);
}

function create_image_element(classes: string[], src: string, id?: string) {
  const img = document.createElement("img");
  img.className = classes.join(" ");
  if (id) img.id = id;
  img.src = src;
  return img;
}

async function create_skip_timer(time: number) {
  root.style.setProperty("--timer_delay", time + "ms");
  const timer = create_div_element([timer_classes.timer]);
  const timer_filled = create_image_element(
    ["pixelated", timer_classes.background, timer_classes.skip],
    image.skip_timer_unfilled
  );
  const timer_unfilled = create_image_element(
    [
      "pixelated",
      timer_classes.foreground,
      timer_classes.sides_to_center,
      timer_classes.skip,
    ],
    image.skip_timer_filled
  );
  const text = create_paragraph_element(
    "Press any key, click or tap anywhere to continue.",
    ["content", timer_classes.skip_text]
  );
  game_content.appendChild(text);
  timer.appendChild(timer_filled);
  timer.appendChild(timer_unfilled);
  game_content.appendChild(timer);
  timer.scrollIntoView();
  await race_events([
    {
      elem: timer_unfilled,
      event: "animationend",
    },
    {
      elem: document.body,
      event: "keydown",
      prevent_default: true,
    },
    {
      elem: document.body,
      event: "click",
      prevent_default: true,
    },
  ]);
  sleep(200);
  remove_div_element(text);
  remove_div_element(timer);
}

function create_paragraph_element(
  text: string,
  classes?: string[],
  id?: string
) {
  const p = document.createElement("p");
  p.innerText = text;
  if (classes) p.className = classes.join(" ");
  if (id) p.id = id;
  return p;
}

async function create_dual_timers(time: number, text: string, amount: number) {
  root.style.setProperty("--timer_duration", time + "ms");
  root.style.setProperty("--sub_timer_duration", time / amount + "ms");
  root.style.setProperty("--sub_timer_count", amount.toString());
  const timers = create_div_element(["content"]);
  const small_timer = create_div_element([timer_classes.timer]);
  const small_timer_text = create_paragraph_element(text + "1/" + amount);
  const sub_timer_filled = create_image_element(
    ["pixelated", timer_classes.background, timer_classes.sub],
    image.small_timer_filled
  );
  const sub_timer_unfilled = create_image_element(
    [
      "pixelated",
      timer_classes.foreground,
      timer_classes.sub,
      timer_classes.sub_left_to_right,
    ],
    image.small_timer_unfilled
  );
  small_timer.appendChild(sub_timer_filled);
  small_timer.appendChild(sub_timer_unfilled);
  const sub_timer = create_div_element([timer_classes.sub_div]);
  sub_timer.appendChild(small_timer_text);
  sub_timer.appendChild(small_timer);
  const timer = create_div_element([timer_classes.timer]);
  const timer_filled = create_image_element(
    ["pixelated", timer_classes.background],
    image.timer_filled
  );
  const timer_unfilled = create_image_element(
    ["pixelated", timer_classes.foreground, timer_classes.left_to_right],
    image.timer_unfilled
  );
  timer.appendChild(timer_filled);
  timer.appendChild(timer_unfilled);
  timers.appendChild(sub_timer);
  const spacer = create_div_element([timer_classes.dual_spacing]);
  timers.appendChild(spacer);
  timers.appendChild(timer);
  game_content.appendChild(timers);
  timers.scrollIntoView();
  update_sub_timer_paragraph(
    sub_timer_unfilled,
    "animationiteration",
    text,
    amount,
    small_timer_text
  );
  await race_events([
    {
      elem: timer_unfilled,
      event: "animationend",
    },
  ]);
  sleep(200);
  remove_div_element(timers);
}

function update_sub_timer_paragraph(
  item: Element,
  event: string,
  text: string,
  count: number,
  paragraph_element: HTMLParagraphElement
) {
  return new Promise<void>(() => {
    let current_count = 1;
    item.addEventListener(event, function anim_count() {
      current_count++;
      paragraph_element.innerText = text + current_count + "/" + count;
      if (current_count === count) {
        item.removeEventListener(event, anim_count);
      }
    });
  });
}

function race_events(events: Array<RaceEvent>) {
  return new Promise<void>((res) => {
    let done = false;

    let events_and_listeners = events.map((e) => {
      let listener = (event: Event) => global_listener(e, event);
      e.elem.addEventListener(e.event, listener);
      return [e, listener] as const;
    });

    function global_listener(race_event: RaceEvent, event: Event) {
      if (done) return;
      if (race_event.condition && !race_event.condition(event as KeyEvent))
        return;

      done = true;
      events_and_listeners.forEach(([e, listener]) =>
        e.elem.removeEventListener(e.event, listener)
      );
      res();
    }
  });
}

const commands = ["set", "unset"];
const set_commands = ["theme"];

async function command_parser(command: string) {
  if (command.startsWith("/")) {
    append_element(command);
    const cmd = command.split(" ")[0].slice(1);
    const object = command.split(" ")[1];
    const value = command.split(" ")[2];
    if (commands.includes(cmd)) {
      if (cmd === "set") {
        set_cmd(object, value);
      }
    }
  } else {
    append_element("To enter a command, start with / before the command.");
  }
}

function set_cmd(thing: string, value: string) {
  if (set_commands.includes(thing)) {
    if (thing === "theme") {
      switch (value) {
        case "light":
          set_theme(Theme.Light);
          break;
        case "dark":
          set_theme(Theme.Dark);
          break;
      }
    }
  }
}

async function mane_menu() {
  const menu = create_div_element(["mane-menu", "content"]);
  const logo = create_heading_element(name, 1, ["logo"]);
  const splash_text = await get_splash();
  const splash = create_paragraph_element(splash_text, ["splash"]);
  menu.appendChild(logo);
  menu.appendChild(splash);
  game_content.appendChild(menu);
  await race_events([
    {
      elem: splash,
      event: "animationend",
    },
  ]);
  sleep(250);
}

function create_heading_element(
  text: string,
  size: heading_size,
  classes?: string[],
  id?: string
) {
  const h = document.createElement(`h${size}`);
  h.innerText = text;
  if (classes) h.className = classes.join(" ");
  if (id) h.id = id;
  return h;
}

async function get_splash() {
  let splashes;
  const default_splash = "Get your free pony today!";
  const gh = "https://raw.githubusercontent.com";
  const org = "Love-and-Tolerance";
  const repo = "Love-and-Tolerance";
  const location = "mane/assets/minecraft/texts/splashes.txt";
  const splash_url = `${gh}/${org}/${repo}/${location}`;
  try {
    splashes = await fetch(splash_url);
    splashes = (await splashes.text()).valueOf().split("\n");
    const splash = splashes[Math.floor(Math.random() * splashes.length)];
    return splash.includes("§") ? clean_splash(splash) : splash;
  } catch (_) {
    return default_splash;
  }
}

function clean_splash(splash: string) {
  return splash.replaceAll(/§[A-Za-z0-9]/g, "");
}
