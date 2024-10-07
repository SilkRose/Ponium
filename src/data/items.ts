import { Item } from "../mane";

export const items = {
	hat: {
		name: "Hat",
		description: "A fancy hat.",
		value: 10,
	},
	cake: {
		name: "Cake",
		description: "A delicious cake.",
		value: 100,
	},
	bit: {
		name: "Bit",
		description: "Currency for Equestria.",
		value: 1,
	},
} satisfies Record<string, Item>;
