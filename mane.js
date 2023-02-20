var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as characters from "./game_data/character/characters.js";
window.onload = mane;
function mane() {
    return __awaiter(this, void 0, void 0, function* () {
        const test_data = characters.pinkie_pie;
        append_element(JSON.stringify(test_data));
        let player = yield create_character();
        append_element(player.name);
        append_element(player.age.toString());
    });
}
function append_element(element) {
    const new_element = document.createElement("p");
    new_element.innerHTML = `${element}`;
    const game_content = document.getElementById("game_content");
    game_content.appendChild(new_element);
    window.scrollBy(100, 100);
}
function read_line() {
    return __awaiter(this, void 0, void 0, function* () {
        const new_element = document.createElement("p");
        new_element.innerHTML = `<input type="text" id="input" name="first_name"><button id="submit">Enter</button>`;
        const game_content = document.getElementById("game_content");
        game_content.appendChild(new_element);
        window.scrollBy(100, 100);
        const input = document.getElementById("input");
        const button = document.getElementById("submit");
        yield Promise.race([
            get_promise_from_input_event(input, "keydown", "Enter"),
            get_promise_from_button_event(button, "click"),
        ]);
        game_content.removeChild(game_content.lastChild);
        return input.value.trim();
    });
}
function get_promise_from_input_event(item, event, required_key) {
    return new Promise((resolve) => {
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
function get_promise_from_button_event(item, event) {
    return new Promise((resolve) => {
        const listener = () => {
            item.removeEventListener(event, listener);
            resolve();
        };
        item.addEventListener(event, listener);
    });
}
function capitalize_string(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
function capitalize_words(string) {
    const arr = string.toLowerCase().split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr.join(" ");
}
function create_character() {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            name: yield get_name(),
            age: yield get_age(),
            species: "",
            gender: "",
            traits: [],
            inventory: [],
        };
    });
}
function get_name() {
    return __awaiter(this, void 0, void 0, function* () {
        append_element("What is your name?");
        let name = yield read_line();
        if (name_validator(name)) {
            return name;
        }
        else {
            append_element("Please provide a name between 2 and 32 characters.");
            return yield get_name();
        }
    });
}
function name_validator(name) {
    if (name.length >= 2 && name.length <= 32) {
        return true;
    }
    else {
        return false;
    }
}
function get_age() {
    return __awaiter(this, void 0, void 0, function* () {
        append_element("How old are you?");
        let age = parseInt(yield read_line());
        if (age_validator(age)) {
            return age;
        }
        else {
            console.log("Please provide an age between 18 and 99.");
            return yield get_age();
        }
    });
}
function age_validator(age) {
    if (age >= 18 && age <= 100) {
        return true;
    }
    else {
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
