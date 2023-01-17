import z from "zod";
import fs from "fs";
import path from "path";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

type Character = z.infer<typeof character_validator>;
type Name = z.infer<typeof name_validator>;
type Age = z.infer<typeof age_validator>;
type NPC = Record<string, Character>;

const name_validator = z.string().min(2).max(32);
const age_validator = z.number().min(18).max(99);

const character_validator = z.object({
  name: z.string(),
  race: z.string(),
  sub_race: z.string().optional(),
  gender: z.string(),
  sexuality: z.string().optional(),
  age: z.number().int().nonnegative(),
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
  console.log(name, age);
}

async function get_name() {
  let name: Name = await read_line("What is you're name?");
  let validated_name = name_validator.safeParse(name);
  if (validated_name.success) {
    return name.trim()
 } else {
    console.log("Please provilde a name between 2 and 32 characters.");
    await get_name();
 }
}

async function get_age() {
  let age: Age = parseInt(await read_line("How old are you?"));
  let validated_age = age_validator.safeParse(age);
  if (validated_age.success) {
    return age
 } else {
    console.log("Please provilde an age between 18 and 99.");
    await get_age();
 }
}

async function read_line(text: string) {
  const response = readline.createInterface({ input, output });
  const answer = await response.question(`${text} `);
  response.close();
  return answer;
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
