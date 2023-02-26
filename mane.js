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
const best_pony = "Pinkie Pie";
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
const game_content = document.getElementById("game_content");
const root = document.documentElement;
window.onload = mane;
function mane() {
    return __awaiter(this, void 0, void 0, function* () {
        yield create_timer(3000);
        yield create_timer(1000);
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
    const new_element = document.createElement("div");
    new_element.className = "content";
    new_element.innerHTML = `${element}`;
    game_content.appendChild(new_element);
    new_element.scrollIntoView();
}
function read_line_text() {
    return __awaiter(this, void 0, void 0, function* () {
        const input_field = create_text_input_field(true);
        game_content.appendChild(input_field);
        input_field.scrollIntoView();
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
        const radio_element = create_radial_input_field(options);
        game_content.appendChild(radio_element);
        radio_element.scrollIntoView();
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
        append_element(question);
        yield assert_best_pony(best_pony);
        game_content.removeChild(game_content.lastChild);
        const question2 = `Please confirm that ${best_pony} is indeed best pony.`;
        append_element(question2);
        yield assert_best_pony("Yes!");
        game_content.removeChild(game_content.lastChild);
    });
}
function assert_best_pony(answer) {
    return __awaiter(this, void 0, void 0, function* () {
        const input_field = create_text_input_field(false);
        const button = create_button_element("submit", "Enter");
        game_content.appendChild(input_field);
        input_field.scrollIntoView();
        const input = document.getElementById("input");
        input.focus();
        on_paste_event_override(input, answer);
        yield Promise.resolve(get_promise_from_input_event_override(input, "keydown", answer, button));
    });
}
function get_promise_from_input_event_override(item, event, answer, button) {
    return new Promise((resolve) => {
        const listener = () => {
            item.onkeyup = function (key) {
                if (item.value.length !== 0) {
                    switch (key.key) {
                        case "Enter":
                            if (item.value === answer) {
                                item.removeEventListener(event, listener);
                                resolve();
                            }
                            else {
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
                                item.parentElement.appendChild(button);
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
function on_paste_event_override(input, answer) {
    input.addEventListener("paste", (event) => {
        event.preventDefault();
        let text = event.clipboardData.getData("text");
        if (input.value.length > answer.length) {
            input.value = answer;
        }
        else {
            input.value = answer.slice(0, text.length);
        }
    });
}
function create_text_input_field(button) {
    const new_element = create_div_element(["content"], "input_field");
    new_element.appendChild(create_text_input_element("input", "Enter response..."));
    if (button) {
        new_element.appendChild(create_button_element("submit", "Enter"));
    }
    return new_element;
}
function create_text_input_element(id, placeholder, value) {
    const input = document.createElement("input");
    input.type = "text";
    input.id = id;
    input.placeholder = placeholder;
    if (value)
        input.value = value;
    return input;
}
function create_button_element(id, text) {
    const button = document.createElement("button");
    button.id = id;
    button.innerText = text;
    return button;
}
function create_radial_input_field(options) {
    const new_element = create_div_element(["content"], "input_radial");
    new_element.appendChild(create_label_with_radial_element(options[0], true));
    for (let i = 1; i < options.length; i++) {
        new_element.appendChild(create_label_with_radial_element(options[i]));
    }
    new_element.appendChild(create_button_element("submit", "Enter"));
    return new_element;
}
function create_label_with_radial_element(text, checked) {
    const label = create_label_element(text);
    label.prepend(create_radio_element(text, checked));
    return label;
}
function create_label_element(text) {
    const label = document.createElement("label");
    label.innerText = text;
    return label;
}
function create_radio_element(value, checked) {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "radial";
    radio.value = value;
    if (checked)
        radio.checked = true;
    return radio;
}
function create_timer(time) {
    return __awaiter(this, void 0, void 0, function* () {
        root.style.setProperty("--large_timer_delay", time + "ms");
        const timer = create_div_element(["single_timer_large", "content"]);
        const timer_filled = create_image_element(["pixelated", "timer_filled"], "./game_assets/images/timer_filled.png");
        const timer_unfilled = create_image_element(["pixelated", "timer_unfilled"], "./game_assets/images/timer_unfilled.png");
        timer.appendChild(timer_filled);
        timer.appendChild(timer_unfilled);
        game_content.appendChild(timer);
        yield get_promise_from_animation_event(timer_unfilled, "animationend");
        sleep(200);
        remove_div_element(timer);
    });
}
function get_promise_from_animation_event(item, event) {
    return new Promise((resolve) => {
        const listener = () => {
            item.removeEventListener(event, listener);
            resolve();
        };
        item.addEventListener(event, listener);
    });
}
function sleep(milliseconds) {
    const date = Date.now();
    let current_date = null;
    do {
        current_date = Date.now();
    } while (current_date - date < milliseconds);
}
function create_div_element(classes, id) {
    const div = document.createElement("div");
    div.className = classes.join(" ");
    if (id)
        div.id = id;
    return div;
}
function remove_div_element(div) {
    game_content.removeChild(div);
}
function create_image_element(classes, src, id) {
    const img = document.createElement("img");
    img.className = classes.join(" ");
    if (id)
        img.id = id;
    img.src = src;
    return img;
}
