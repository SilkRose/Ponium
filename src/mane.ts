import * as characters from "./game_data/character/characters.js";
import { traits } from "./game_data/traits.js";
import { items } from "./game_data/items.js";

const pony = "Pony" as const;

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
}

function append_element(element: string) {
  const new_element = document.createElement("p");
  new_element.innerHTML = `${element}`;
  const game_content = document.getElementById("game_content")!;
  game_content.appendChild(new_element);
  new_element.scrollIntoView();
}

async function read_line_text(): Promise<string> {
  const new_element = document.createElement("p");
  new_element.innerHTML = `
  <div id="input_field">
    <input type="text" id="input" placeholder="Enter response...">
    <button id="submit">Enter</button>
  </div>`;
  const game_content = document.getElementById("game_content")!;
  game_content.appendChild(new_element);
  new_element.scrollIntoView();
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

async function read_line_radial<T>(
  options: readonly string[]
): Promise<T> {
  const new_element = document.createElement("p");
  let radials: string[] = [];
  for (let i = 0; i < options.length; i++) {
    if (i === 0) {
      radials.push(`
      <input type="radio" id="${options[i]}" name="radial" value="${options[i]}" checked />
      <label for="${options[i]}">${options[i]}</label>`);
    } else {
      radials.push(`
      <input type="radio" id="${options[i]}" name="radial" value="${options[i]}" />
      <label for="${options[i]}">${options[i]}</label>`);
    }
  }
  new_element.innerHTML = `
  <div id="input_radial">
    ${radials.join()}
    <button id="submit">Enter</button>
  </div>`;
  const game_content = document.getElementById("game_content")!;
  game_content.appendChild(new_element);
  new_element.scrollIntoView();
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
  let race = await read_line_radial<Species["race"]>([pony, ...nonpony_species]);
  if (race === pony) {
    append_element(`What pony race are you?`);
    return {
      race: race,
      sub_race: await read_line_radial<typeof pony_sub_races[number]>(pony_sub_races),
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

/*
async function get_best_pony() {
  const question = "Who is best Pony? :";
  const answer = "Pinkie Pie";
  rl.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.write(question);
  let i = 0;
  while (i < answer.length) {
    i = await assert_best_pony(question, answer, i);
  }
  const question2 = `Please confirm that ${answer} is indeed best pony. :`;
  const answer2 = "Yes!";
  process.stdin.write("\n" + question2);
  i = 0;
  while (i < answer2.length) {
    i = await assert_best_pony(question2, answer2, i);
  }
  console.log();
  process.stdin.setRawMode(false);
}

function assert_best_pony(question: string, answer: string, i: number) {
  return new Promise<number>((res) => {
    process.stdin.once("keypress", (_, key) => {
      //if (key && key.name == "q") process.exit();
      let rv;
      if (key.name === "backspace" || key.name === "delete") rv = i - 1;
      else rv = i + 1;
      if (rv < 0) rv = 0;
      let text = question + answer.slice(0, rv);
      process.stdout.write("\r");
      process.stdout.write(" ".repeat(process.stdout.columns));
      process.stdout.write("\r");
      process.stdout.write(text);
      res(rv);
    });
  });
}
 */
