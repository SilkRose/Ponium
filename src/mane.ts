import z from "zod";
import fs from "fs";
import path from "path";

type Character = z.infer<typeof character_validator>;
type NPC = Record<string, Character>;

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

function mane() {
  let characters = load_characters();
  console.log(characters["pinkie_pie"]);
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
