import z from "zod";
import fs from "fs";
import path from "path";

type Character = z.infer<typeof character_validator>;

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

let rarity = fs.readFileSync(path.resolve("./game_data/character/rarity.json"));
console.log(character_validator.parse(JSON.parse(rarity.toString())));