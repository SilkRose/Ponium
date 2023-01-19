import z from "zod";
import fs from "fs";
import path from "path";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

type Character = z.infer<typeof character_validator>;
type Name = z.infer<typeof name_validator>;
type Age = z.infer<typeof age_validator>;
type Species = z.infer<typeof species_validator>;
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

const character_validator = z.object({
  name: name_validator,
  species: species_validator,
  gender: z.string(),
  age: age_validator,
  traits: z.string().array(),
  inventory: z.array(z.tuple([z.string(), z.number()])),
});

async function mane() {
  await create_character();
  let characters = load_characters();
  console.log(characters["pinkie_pie"]);
}

async function create_character() {
  let name = await get_name();
  let age = await get_age();
  let species = await get_species();
  console.log(name, age, species);
}

async function get_name() {
  let name: Name = await read_line("What is you're name?");
  let validated_name = name_validator.safeParse(name);
  if (validated_name.success) {
    return name;
  } else {
    console.log("Please provilde a name between 2 and 32 characters.");
    await get_name();
  }
}

async function get_age() {
  let age: Age = parseInt(await read_line("How old are you?"));
  let validated_age = age_validator.safeParse(age);
  if (validated_age.success) {
    return age;
  } else {
    console.log("Please provilde an age between 18 and 99.");
    await get_age();
  }
}

async function get_species() {
  let race = await read_line(
    "What species are you? (Pony, Kirin, Dragon, Donkey, Mule, Griffin) "
  );
  race = capitalize_string(race);
  console.log(race);
  if (race === "Pony") {
    let sub_race = await read_line(
      "What pony race are you? (Unicorn, Alicorn, Pegasus, Earth Pony) "
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

async function read_line(text: string) {
  const response = readline.createInterface({ input, output });
  const answer = await response.question(`${text} `);
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

mane();
