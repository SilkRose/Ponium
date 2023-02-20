import * as characters from "./game_data/character/characters.js";
import { traits } from "./game_data/traits.js";
import { items } from "./game_data/items.js";

window.onload = mane;

async function mane() {
  const test_data = characters.pinkie_pie;
  append_element(JSON.stringify(test_data));
  let player = await create_character();
  append_element(player.name);
  append_element(player.age.toString());
}

function append_element(element: string) {
  const new_element = document.createElement("p");
  new_element.innerHTML = `${element}`;
  const game_content = document.getElementById("game_content")!;
  game_content.appendChild(new_element);
  window.scrollBy(100, 100);
}

async function read_line(): Promise<string> {
  const new_element = document.createElement("p");
  new_element.innerHTML = `<input type="text" id="input" name="first_name"><button id="submit">Enter</button>`;
  const game_content = document.getElementById("game_content")!;
  game_content.appendChild(new_element);
  window.scrollBy(100, 100);
  const input = document.getElementById("input") as HTMLInputElement;
  const button = document.getElementById("submit") as HTMLButtonElement;
  await Promise.race([
    get_promise_from_input_event(input, "keydown", "Enter"),
    get_promise_from_button_event(button, "click"),
  ]);
  game_content.removeChild(game_content.lastChild!);
  return input.value.trim();
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
    species: "",
    gender: "",
    traits: [],
    inventory: [],
  };
}

async function get_name(): Promise<string> {
  append_element("What is your name?");
  let name = await read_line();
  if (name_validator(name)) {
    return name;
  } else {
    append_element("Please provide a name between 2 and 32 characters.");
    return await get_name();
  }
}

function name_validator(name: string) {
  if (name.length >= 2 && name.length <= 32) {
    return true;
  } else {
    return false;
  }
}

async function get_age(): Promise<number> {
  append_element("How old are you?");
  let age = parseInt(await read_line());
  if (age_validator(age)) {
    return age;
  } else {
    console.log("Please provide an age between 18 and 99.");
    return await get_age();
  }
}

function age_validator(age: number) {
  if (age >= 18 && age <= 100) {
    return true;
  } else {
    return false;
  }
}

/*
async function get_species() {
  let race = await read_line(
    "What species are you? (Pony, Kirin, Dragon, Donkey, Mule, Griffin)"
  );
  race = capitalize_string(race);
  if (race === "Pony") {
    let sub_race = await read_line(
      "What pony race are you? (Unicorn, Alicorn, Pegasus, Earth Pony)"
    );
    sub_race = capitalize_words(sub_race);
    let species = {
      race: race,
      sub_race: sub_race,
    };
    let species_validated = species_validator.safeParse(species);
    if (species_validated.success) {
      return species;
    } else {
      console.log("Please enter a valid race and sub race.");
      await get_species();
    }
  } else {
    let species = { race: race };
    let species_validated = species_validator.safeParse(species);
    if (species_validated.success) {
      return species;
    } else {
      console.log("Please enter a valid race.");
      await get_species();
    }
  }
}

async function get_gender() {
  let gender = await read_line(
    "What is your gender? (Female, Male, Gender Fluid, Non-Binary, Agender, Other)"
  );
  gender = capitalize_words(gender);
  let validated_gender = gender_validator.safeParse(gender);
  if (validated_gender.success) {
    return gender;
  } else {
    console.log("Please provide a gender from the list provided.");
    await get_gender();
  }
}

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
