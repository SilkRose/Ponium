import * as characters from "./game_data/character/characters.js";
import { traits } from "./game_data/traits.js";
import { items } from "./game_data/items.js";

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

type Character = {
  name: string;
  age: number;
  species: Species;
  gender: Gender;
  traits: "";
  inventory: "";
};

const game_content = document.getElementById("game_content")!;

window.onload = mane;

async function mane() {
  const test_data = characters.pinkie_pie;
  append_element(JSON.stringify(test_data));
  let player = await create_character();
  append_element(player.name);
  append_element(player.age.toString());
  append_element(player.species.race.toString());
  if (player.species.race === "Pony") {
    append_element(player.species.sub_race.toString());
  }
  append_element(player.gender);
  await get_best_pony();
}

function append_element(element: string) {
  const new_element = document.createElement("div");
  new_element.className = "content";
  new_element.innerHTML = `${element}`;
  game_content.appendChild(new_element);
  new_element.scrollIntoView();
}

async function read_line_text(): Promise<string> {
  const input_field = create_text_input_field(true);
  game_content.appendChild(input_field);
  input_field.scrollIntoView();
  const input = document.getElementById("input") as HTMLInputElement;
  const button = document.getElementById("submit") as HTMLButtonElement;
  input.focus();
  await Promise.race([
    get_promise_from_input_event(input, "keydown", "Enter"),
    get_promise_from_button_event(button, "click"),
  ]);
  game_content.removeChild(game_content.lastChild!);
  return input.value.trim();
}

async function read_line_radial<T>(options: readonly string[]): Promise<T> {
  const radio_element = create_radial_input_field(options);
  game_content.appendChild(radio_element);
  radio_element.scrollIntoView();
  const input = document.getElementsByName(
    "radial"
  ) as NodeListOf<HTMLInputElement>;
  const button = document.getElementById("submit") as HTMLButtonElement;
  input[0].focus();
  await Promise.race([
    get_promise_from_radial_event(input, "keydown", "Enter"),
    get_promise_from_button_event(button, "click"),
  ]);
  const checked = Array.from(input).filter((radial) => radial.checked)[0].value;
  game_content.removeChild(game_content.lastChild!);
  if (options.indexOf(checked) != -1) {
    return checked as T;
  } else {
    return await read_line_radial<T>(options);
  }
}

function get_promise_from_input_event(
  item: HTMLInputElement,
  event: string,
  required_key: string
) {
  return new Promise<void>((resolve) => {
    const listener = () => {
      item.onkeydown = function (key) {
        if (key.key === required_key) {
          item.removeEventListener(event, listener);
          resolve();
        }
      };
    };
    item.addEventListener(event, listener);
  });
}

function get_promise_from_button_event(item: HTMLButtonElement, event: string) {
  return new Promise<void>((resolve) => {
    const listener = () => {
      item.removeEventListener(event, listener);
      resolve();
    };
    item.addEventListener(event, listener);
  });
}

function get_promise_from_radial_event(
  items: NodeListOf<HTMLInputElement>,
  event: string,
  required_key: string
) {
  return new Promise<void>((resolve) => {
    const listener = () => {
      self.onkeydown = function (key) {
        if (key.key === required_key) {
          self.removeEventListener(event, listener);
          resolve();
        }
      };
    };
    for (let item of items) {
      item.addEventListener(event, listener);
    }
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
  let name = await read_line_text();
  if (name.length >= 2 && name.length <= 32) {
    return name;
  } else {
    append_element("Please provide a name between 2 and 32 characters.");
    return await get_name();
  }
}

async function get_age(): Promise<number> {
  append_element("How old are you?");
  let age = parseInt(await read_line_text());
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
  const input_field = create_text_input_field(false);
  const button = create_button_element("submit", "Enter");
  game_content.appendChild(input_field);
  input_field.scrollIntoView();
  const input = document.getElementById("input") as HTMLInputElement;
  input.focus();
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
        if (item.value.length !== 0) {
          switch (key.key) {
            case "Enter":
              if (item.value === answer) {
                item.removeEventListener(event, listener);
                resolve();
              } else {
                item.value = answer.slice(0, item.value.length + 1);
              }
            case "Delete":
              if (item.value === answer) {
                button.remove();
              }
              item.value = answer.slice(0, item.value.length - 1);
            case "Backspace":
              if (document.contains(button)) {
                button.remove();
              }
            default:
              item.value = answer.slice(0, item.value.length);
              if (item.value === answer) {
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

function create_text_input_field(button: boolean) {
  const new_element = document.createElement("div");
  new_element.id = "input_field";
  new_element.className = "content";
  new_element.appendChild(
    create_text_input_element("input", "Enter response...")
  );
  if (button) {
    new_element.appendChild(create_button_element("submit", "Enter"));
  }
  return new_element;
}

function create_text_input_element(
  id: string,
  placeholder: string,
  value?: string
) {
  const input = document.createElement("input");
  input.type = "text";
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
  const new_element = document.createElement("div");
  new_element.id = "input_radial";
  new_element.className = "content";
  new_element.appendChild(create_radio_element(options[0], true));
  new_element.appendChild(create_label_element(options[0]));
  for (let i = 1; i < options.length; i++) {
    new_element.appendChild(create_radio_element(options[i]));
    new_element.appendChild(create_label_element(options[i]));
  }
  new_element.appendChild(create_button_element("submit", "Enter"));
  return new_element;
}

function create_radio_element(value: string, checked?: boolean) {
  const radio = document.createElement("input");
  radio.type = "radio";
  radio.id = value;
  radio.name = "radial";
  radio.value = value;
  if (checked) radio.checked = true;
  return radio;
}

function create_label_element(text: string) {
  const label = document.createElement("label");
  label.setAttribute("for", text);
  label.innerText = text;
  return label;
}
