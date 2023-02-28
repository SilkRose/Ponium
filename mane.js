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
var InputType;
(function (InputType) {
    InputType["text"] = "text";
    InputType["number"] = "number";
    InputType["radio"] = "radio";
})(InputType || (InputType = {}));
const game_content = document.getElementById("game_content");
const root = document.documentElement;
window.onload = mane;
function mane() {
    return __awaiter(this, void 0, void 0, function* () {
        yield create_dual_timers(5000, "Baking pie: ", 4);
        yield create_skip_timer(2000);
        yield create_timer(1000);
        const test_data = characters.pinkie_pie;
        append_element(JSON.stringify(test_data));
        let player = yield create_character();
        yield create_skip_timer(3000);
        append_element(player.name);
        yield create_dual_timers(2500, "Eating pie: ", 4);
        append_element(player.age.toString());
        yield create_skip_timer(3000);
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
function read_line_text(type) {
    return __awaiter(this, void 0, void 0, function* () {
        const input_field = create_text_input_field(type, true);
        game_content.appendChild(input_field);
        const input = document.getElementById("input");
        const button = document.getElementById("submit");
        input.focus();
        input.scrollIntoView();
        yield race_events([
            {
                elem: button,
                event: "click",
            },
            get_event_from_input_element(input, "keydown", "Enter"),
        ]);
        game_content.removeChild(game_content.lastChild);
        return input.value.trim();
    });
}
function read_line_radial(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const radio_element = create_radial_input_field(options);
        game_content.appendChild(radio_element);
        const input = document.getElementsByName("radial");
        const button = document.getElementById("submit");
        input[0].focus();
        input[0].scrollIntoView();
        yield race_events([
            {
                elem: button,
                event: "click",
            },
            ...get_event_from_radio_list(input, "keydown", "Enter"),
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
function get_event_from_input_element(item, event, required_key) {
    return {
        elem: item,
        event: event,
        condition: (event) => event.key === required_key,
    };
}
function get_event_from_radio_list(items, event, required_key) {
    return Array.from(items).map((item) => {
        return {
            elem: item,
            event: event,
            condition: (event) => event.key === required_key,
        };
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
        let name = yield read_line_text(InputType.text);
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
        let age = parseInt(yield read_line_text(InputType.number));
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
        const input_field = create_text_input_field(InputType.text, false);
        const button = create_button_element("submit", "Enter");
        game_content.appendChild(input_field);
        const input = document.getElementById("input");
        input.focus();
        input.scrollIntoView();
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
function create_text_input_field(type, button) {
    const new_element = create_div_element(["content"], "input_field");
    new_element.appendChild(create_text_input_element("input", type, "Enter response..."));
    if (button) {
        new_element.appendChild(create_button_element("submit", "Enter"));
    }
    return new_element;
}
function create_text_input_element(id, type, placeholder, value) {
    const input = document.createElement("input");
    input.type = type;
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
    radio.type = InputType.radio;
    radio.name = "radial";
    radio.value = value;
    if (checked)
        radio.checked = true;
    return radio;
}
function create_timer(time) {
    return __awaiter(this, void 0, void 0, function* () {
        root.style.setProperty("--timer_delay", time + "ms");
        const timer = create_div_element(["timer"]);
        const timer_filled = create_image_element(["pixelated", "timer_background"], "./game_assets/images/timer_filled.png");
        const timer_unfilled = create_image_element(["pixelated", "timer_foreground", "timer_left_to_right"], "./game_assets/images/timer_unfilled.png");
        timer.appendChild(timer_filled);
        timer.appendChild(timer_unfilled);
        game_content.appendChild(timer);
        timer.scrollIntoView();
        yield race_events([
            {
                elem: timer_unfilled,
                event: "animationend",
            },
        ]);
        sleep(200);
        remove_div_element(timer);
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
    if (classes)
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
function create_skip_timer(time) {
    return __awaiter(this, void 0, void 0, function* () {
        root.style.setProperty("--timer_delay", time + "ms");
        const timer = create_div_element(["timer"]);
        const timer_filled = create_image_element(["pixelated", "timer_background", "skip_timer"], "./game_assets/images/skip_timer_unfilled.png");
        const timer_unfilled = create_image_element(["pixelated", "timer_foreground", "timer_sides_to_center", "skip_timer"], "./game_assets/images/skip_timer_filled.png");
        const text = create_paragraph_element("Press any key, click or tap anywhere to continue.", ["content", "skip_timer_text"]);
        game_content.appendChild(text);
        timer.appendChild(timer_filled);
        timer.appendChild(timer_unfilled);
        game_content.appendChild(timer);
        timer.scrollIntoView();
        yield race_events([
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
    });
}
function create_paragraph_element(text, classes, id) {
    const p = document.createElement("p");
    p.innerText = text;
    if (classes)
        p.className = classes.join(" ");
    if (id)
        p.id = id;
    return p;
}
function create_dual_timers(time, text, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        root.style.setProperty("--timer_duration", time + "ms");
        root.style.setProperty("--sub_timer_duration", time / amount + "ms");
        root.style.setProperty("--sub_timer_count", amount.toString());
        const timers = create_div_element(["content"]);
        const small_timer = create_div_element(["timer"]);
        const small_timer_text = create_paragraph_element(text + "1/" + amount);
        const sub_timer_filled = create_image_element(["pixelated", "timer_background", "sub_timer"], "./game_assets/images/small_timer_filled.png");
        const sub_timer_unfilled = create_image_element(["pixelated", "timer_foreground", "sub_timer", "sub_timer_left_to_right"], "./game_assets/images/small_timer_unfilled.png");
        small_timer.appendChild(sub_timer_filled);
        small_timer.appendChild(sub_timer_unfilled);
        const sub_timer = create_div_element(["sub_timer_div"]);
        sub_timer.appendChild(small_timer_text);
        sub_timer.appendChild(small_timer);
        const timer = create_div_element(["timer"]);
        const timer_filled = create_image_element(["pixelated", "timer_background"], "./game_assets/images/timer_filled.png");
        const timer_unfilled = create_image_element(["pixelated", "timer_foreground", "timer_left_to_right"], "./game_assets/images/timer_unfilled.png");
        timer.appendChild(timer_filled);
        timer.appendChild(timer_unfilled);
        timers.appendChild(sub_timer);
        const spacer = create_div_element(["dual_timer_spacing"]);
        timers.appendChild(spacer);
        timers.appendChild(timer);
        game_content.appendChild(timers);
        timers.scrollIntoView();
        update_sub_timer_paragraph(sub_timer_unfilled, "animationiteration", text, amount, small_timer_text);
        yield race_events([
            {
                elem: timer_unfilled,
                event: "animationend",
            },
        ]);
        sleep(200);
        remove_div_element(timers);
    });
}
function update_sub_timer_paragraph(item, event, text, count, paragraph_element) {
    return new Promise(() => {
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
function race_events(events) {
    return new Promise((res) => {
        let done = false;
        let events_and_listeners = events.map((e) => {
            let listener = (event) => global_listener(e, event);
            e.elem.addEventListener(e.event, listener);
            return [e, listener];
        });
        function global_listener(race_event, event) {
            if (done)
                return;
            if (race_event.condition && !race_event.condition(event))
                return;
            done = true;
            events_and_listeners.forEach(([e, listener]) => e.elem.removeEventListener(e.event, listener));
            res();
        }
    });
}
