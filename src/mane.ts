import z from "zod";
import fs from "fs";
import path from "path";
import * as rl from "readline";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

type Character = z.infer<typeof character_validator>;
type Name = z.infer<typeof name_validator>;
type Age = z.infer<typeof age_validator>;
type Species = z.infer<typeof species_validator>;
type Gender = z.infer<typeof gender_validator>;
type NPC = Record<string, Character>;

const name_validator = z.string().min(2).max(32);
const age_validator = z.number().min(18).max(99);

const pony_validator = z.object({
  race: z.literal("Pony"),
  sub_race: z.union([
    z.literal("Alicorn"),
    z.literal("Unicorn"),
    z.literal("Pegasus"),
    z.literal("Earth Pony"),
  ]),
});
const kirin_validator = z.object({
  race: z.literal("Kirin"),
});
const donkey_validator = z.object({
  race: z.literal("Donkey"),
});
const mule_validator = z.object({
  race: z.literal("Mule"),
});
const griffon_validator = z.object({
  race: z.literal("Griffon"),
});
const dragon_validator = z.object({
  race: z.literal("Dragon"),
});

const species_validator = z.union([
  pony_validator,
  kirin_validator,
  donkey_validator,
  mule_validator,
  griffon_validator,
  dragon_validator,
]);

const gender_validator = z.union([
  z.literal("Female"),
  z.literal("Male"),
  z.literal("Other"),
]);

const traits = load_json_file("traits.json");
const trait_validator = z.array(z.enum(traits));

const items = load_json_file("items.json");
const item_validator = z.array(
  z.object({
    name: z.enum(items.map((i: { name: string }) => i.name)),
    value: z.number(),
  })
);

const character_validator = z.object({
  name: name_validator,
  species: species_validator,
  gender: gender_validator,
  age: age_validator,
  traits: trait_validator,
  inventory: item_validator,
});

async function mane() {
  await get_best_pony();
  let player: Character = await create_character();
  console.log(player);
  let characters = load_characters();
  console.log(characters);
}

async function create_character() {
  return {
    name: (await get_name()) as Name,
    age: (await get_age()) as Age,
    species: (await get_species()) as Species,
    gender: (await get_gender()) as Gender,
    traits: [],
    inventory: [],
  };
}

async function get_name() {
  let name: Name = await read_line("What is your name?");
  let validated_name = name_validator.safeParse(name);
  if (validated_name.success) {
    return name;
  } else {
    console.log("Please provide a name between 2 and 32 characters.");
    await get_name();
  }
}

async function get_age() {
  let age: Age = parseInt(await read_line("How old are you?"));
  let validated_age = age_validator.safeParse(age);
  if (validated_age.success) {
    return age;
  } else {
    console.log("Please provide an age between 18 and 99.");
    await get_age();
  }
}

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
  let gender = await read_line("What is your gender? (Female, Male, Other)");
  gender = capitalize_words(gender);
  let validated_gender = gender_validator.safeParse(gender);
  if (validated_gender.success) {
    return gender;
  } else {
    console.log("Please provide a gender from the list provided.");
    await get_gender();
  }
}

async function read_line(text: string) {
  const response = readline.createInterface({ input, output });
  const answer = await response.question(`${text}: `);
  response.close();
  return answer.trim();
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

function load_characters() {
  let character_files = find_files_in_dir(
    path.resolve("./game_data/character/"),
    ".json"
  );
  let characters_: NPC = {};
  for (let file of character_files) {
    let name = file.split("/").pop()?.split(".")[0];
    let read_file = fs.readFileSync(file, { encoding: "utf-8" });
    let json = JSON.parse(read_file);
    let validated_json = character_validator.parse(json);
    characters_[`${name}`] = validated_json;
  }
  return characters_;
}

function find_files_in_dir(startPath: string, filter: string) {
  let results: string[] = [];
  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    throw Error;
  }
  let files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    let filename = path.join(startPath, files[i]);
    let stat = fs.lstatSync(filename);
    if (stat.isFile() && filename.indexOf(filter) >= 0) {
      results.push(filename);
    }
  }
  return results;
}

function load_json_file(file: string) {
  let filepath = path.resolve(`./game_data/${file}`);
  let read_file = fs.readFileSync(filepath, { encoding: "utf-8" });
  let json = JSON.parse(read_file);
  return json;
}

mane();

async function get_best_pony() {
  const question = "Who is best Pony? :";
  const answer = "Pinkie Pie";
  rl.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.write(question);
  const forloop_end = answer.length + 1;
  for (let i = 1; i < forloop_end; i++) {
    await assert_best_pony(question, answer, i);
  }
  const question2 = `Please confirm that ${answer} is indeed best pony. :`;
  const answer2 = "Yes!";
  process.stdin.write("\n" + question2);
  const forloop_end2 = answer2.length + 1;
  for (let i = 1; i < forloop_end2; i++) {
    await assert_best_pony(question2, answer2, i);
  }
  console.log();
  process.stdin.setRawMode(false);
}

function assert_best_pony(question: string, answer: string, i: number) {
  return new Promise<void>((res) => {
    process.stdin.once("keypress", (chunk, key) => {
      let text = question + answer.slice(0, i);
      process.stdin.write("\r");
      process.stdin.write("ESC[2K");
      process.stdin.write("\r");
      process.stdin.write(text);
      res();
    });
  });
}
