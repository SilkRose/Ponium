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
const pony = "Pony";
const nonpony_species = [
    "Kirin",
    "Dragon",
    "Donkey",
    "Mule",
    "Griffin",
];
const pony_sub_races = ["Alicorn", "Unicorn", "Pegasus", "Earth Pony"];
const genders = [
    "Female",
    "Male",
    "Gender Fluid",
    "Non-Binary",
    "Agender",
    "Other",
];
window.onload = mane;
function mane() {
    return __awaiter(this, void 0, void 0, function* () {
        const test_data = characters.pinkie_pie;
        append_element(JSON.stringify(test_data));
        let player = yield create_character();
        append_element(player.name);
        append_element(player.age.toString());
        append_element(player.species.race.toString());
        if (player.species.race === "Pony") {
            append_element(player.species.sub_race.toString());
        }
        append_element(player.gender);
        yield get_best_pony();
    });
}
function append_element(element) {
    const new_element = document.createElement("p");
    new_element.innerHTML = `${element}`;
    const game_content = document.getElementById("game_content");
    game_content.appendChild(new_element);
    new_element.scrollIntoView();
}
function read_line_text() {
    return __awaiter(this, void 0, void 0, function* () {
        const new_element = document.createElement("p");
        new_element.innerHTML = `
  <div id="input_field">
    <input type="text" id="input" placeholder="Enter response...">
    <button id="submit">Enter</button>
  </div>`;
        const game_content = document.getElementById("game_content");
        game_content.appendChild(new_element);
        new_element.scrollIntoView();
        const input = document.getElementById("input");
        const button = document.getElementById("submit");
        input.focus();
        yield Promise.race([
            get_promise_from_input_event(input, "keydown", "Enter"),
            get_promise_from_button_event(button, "click"),
        ]);
        game_content.removeChild(game_content.lastChild);
        return input.value.trim();
    });
}
function read_line_radial(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const new_element = document.createElement("p");
        let radials = [];
        for (let i = 0; i < options.length; i++) {
            if (i === 0) {
                radials.push(`
      <input type="radio" id="${options[i]}" name="radial" value="${options[i]}" checked />
      <label for="${options[i]}">${options[i]}</label>`);
            }
            else {
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
        const game_content = document.getElementById("game_content");
        game_content.appendChild(new_element);
        new_element.scrollIntoView();
        const input = document.getElementsByName("radial");
        const button = document.getElementById("submit");
        input[0].focus();
        yield Promise.race([
            get_promise_from_radial_event(input, "keydown", "Enter"),
            get_promise_from_button_event(button, "click"),
        ]);
        const checked = Array.from(input).filter((radial) => radial.checked)[0].value;
        game_content.removeChild(game_content.lastChild);
        if (options.indexOf(checked) != -1) {
            return checked;
        }
        else {
            return yield read_line_radial(options);
        }
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
function get_promise_from_radial_event(items, event, required_key) {
    return new Promise((resolve) => {
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
            species: yield get_species(),
            gender: yield get_gender(),
            traits: [],
            inventory: [],
        };
    });
}
function get_name() {
    return __awaiter(this, void 0, void 0, function* () {
        append_element("What is your name?");
        let name = yield read_line_text();
        if (name.length >= 2 && name.length <= 32) {
            return name;
        }
        else {
            append_element("Please provide a name between 2 and 32 characters.");
            return yield get_name();
        }
    });
}
function get_age() {
    return __awaiter(this, void 0, void 0, function* () {
        append_element("How old are you?");
        let age = parseInt(yield read_line_text());
        if (age >= 18 && age <= 100) {
            return age;
        }
        else {
            append_element("Please provide an age between 18 and 99.");
            return yield get_age();
        }
    });
}
function get_species() {
    return __awaiter(this, void 0, void 0, function* () {
        append_element(`What species are you?)`);
        let race = yield read_line_radial([
            pony,
            ...nonpony_species,
        ]);
        if (race === pony) {
            append_element(`What pony race are you?`);
            return {
                race: race,
                sub_race: yield read_line_radial(pony_sub_races),
            };
        }
        else {
            return { race: race };
        }
    });
}
function get_gender() {
    return __awaiter(this, void 0, void 0, function* () {
        append_element("What is your gender?");
        let gender = yield read_line_radial(genders);
        return gender;
    });
}
function get_best_pony() {
    return __awaiter(this, void 0, void 0, function* () {
        const question = "Who is best Pony?";
        const answer = "Pinkie Pie";
        append_element(question);
        let i = 0;
        while (i < answer.length) {
            i = yield assert_best_pony(answer, i);
        }
        const game_content = document.getElementById("game_content");
        game_content.removeChild(game_content.lastChild);
        const question2 = `Please confirm that ${answer} is indeed best pony.`;
        const answer2 = "Yes!";
        append_element(question2);
        i = 0;
        while (i < answer2.length) {
            i = yield assert_best_pony(answer2, i);
        }
        game_content.removeChild(game_content.lastChild);
    });
}
function assert_best_pony(answer, i) {
    return __awaiter(this, void 0, void 0, function* () {
        read_line_text_override(answer.slice(0, i), "best_pony");
        return new Promise((res) => {
            var _a;
            (_a = document.getElementById("input")) === null || _a === void 0 ? void 0 : _a.addEventListener("keydown", (key) => {
                let rv;
                if (key.key === "backspace" || key.key === "delete")
                    rv = i - 1;
                else
                    rv = i + 1;
                if (rv < 0)
                    rv = 0;
                res(rv);
            });
        });
    });
}
function read_line_text_override(value, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const new_element = document.createElement("p");
        new_element.innerHTML = `
  <div id="input_field">
    <input type="text" id="input" name="${name}" placeholder="Enter response..." value="${value}">
    <button id="submit">Enter</button>
  </div>`;
        const game_content = document.getElementById("game_content");
        if (document.getElementById("input_field") === null) {
            game_content.appendChild(new_element);
        }
        else {
            document.getElementById("input_field").outerHTML = new_element.innerHTML;
        }
        new_element.scrollIntoView();
        const input = document.getElementById("input");
        input.focus();
        input.value = value;
        input.setSelectionRange(value.length, value.length);
    });
}
// TODO:
// finish/fix best pony.
// make best pony enter button only appear when the input value matches the answer.
// make enter button go away if they press backspace and the value matches the answer.
