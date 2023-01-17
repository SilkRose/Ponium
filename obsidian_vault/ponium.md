
Ponium is a text adventure game written in TypeScript, about living in Ponyville.

Here are some general notes:

each character has there own folder, and in that folder contains json files for everything related to them

the mane one will be just them, name, race, sex, inv, traits etc

they will have a schedule folder, that details everything they could be doing, with days and chances for each activity.

like for Rarity, her schedule might say she goes to the spa weekly with Fluttershy.

or that on this day she has a 55% chance to be making a dress

so that there is some element of randomness

the game will keep track of every pony at all times so it knows when you come like to Rarity's shop, if she is busy or not etc

i also, kinda want to make a friendship system, where you can become friends with anypony

but the town ponies also use this system and can become better friends with other ponies.

also, i had the idea to have an events folder, where on specfic days, an event happens

like in episode 1, where the summer sun celebration happens

i also think events are set in stone, like if you dont go into town you might miss an event

but planned events the town sends you mail to let you know

from what i just said, i dont think i need the json files to tell it what fn to run.

events would specify location/time/date and all ponies there, it would contain the ponies dialogue and give you certain times where you can talk, and the events would include any changes, like the party moving location etc

the map would prob be a json file too

not entirely sure how to handle the map

i want to implement a kindov fast travel

where tou can type goto (place) and it does all the steps in between

also, i had an idea of activities in game taking time irl, like lets say you plant 15 tomatoes

irl it would take half a second each and it would show 2 progress bars, 1 for the individual and one for overall of 7.5 seconds

i want there to be like 3 or 4 diff starting locations

idk if it will have any rpg elements, prob worry about that later

i kinda want to make it so its easy for anything to add too and change anything they want to

i havent decided if time is going to be always moving forward or just moves when you do actions

this feature would help with testing, but i want to add /commands kinda like mc, so it can change stuff for testing

Feedback from others:

Yeah that sounds good. Maybe they should be in a separate folder so different ponies could do the same things. Maybe you could have like "conditions" for ai goals as opposed to just randomness, so one could be random, one could be time, one could check if the player's done something, etc

Maybe one could check emotions so if they're bored they'll go for a walk or that type of thing. That might be a good way to do it? Ive never done ai before really lol
