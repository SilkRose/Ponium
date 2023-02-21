# LibrePony

LibrePony is a text adventure game written in TypeScript, about living in Ponyville.


## Notes and Ideas

### Technical
- Each character has there own folder, and in that folder contains ts files for everything related to them.
  - The mane one will be just them, name, race, sex, inv, traits etc.
  - They will have a schedule folder, that details everything they could be doing, with days and chances for each activity, ex: for Rarity, her schedule might say she goes to the spa weekly with Fluttershy, or that on this day she has a 55% chance to be making a dress.
  - The game will keep track of every pony at all times so it knows when you come like to Rarity's shop, if she is busy or not etc.
- Have an events folder, where on specific days, an event happens.
  - Like in episode 1, where the summer sun celebration happens.
  - I also think events are set in stone, like if you don't go into town you might miss an event.
  - But planned events the town sends you mail to let you know.
  - Events would specify location/time/date and all ponies there, it would contain the ponies dialogue and give you certain times where you can talk, and the events would include any changes, like the party moving location etc.
- The map would prob be a ts file too, not entirely sure how to handle the map yet.
- I kinda want to make it so its easy for anything to add too and change anything they want to.
- This feature would help with testing, but i want to add /commands kinda like mc, so it can change stuff for testing.
- Some kind of activity system where NPCs choose what to do.
  - Maybe they should be in a separate folder so different ponies could do the same things. Maybe you could have like "conditions" for ai goals as opposed to just randomness, so one could be random, one could be time, one could check if the player's done something, etc.
  - Maybe one could check emotions so if they're bored they'll go for a walk or that type of thing. That might be a good way to do it.

### Game play
- I also, kinda want to make a friendship system, where you can become friends with anypony.
  - The town ponies also use this system and can become better friends with other ponies.
- I want to implement a kinda fast travel.
  - Where tou can type goto (place) and it does all the steps in between.
- I had an idea of activities in game taking time irl, like lets say you plant 15 tomatoes.
  - Irl it would take half a second each and it would show 2 progress bars, 1 for the individual and one for overall of 7.5 seconds.
- I want there to be like 3 or 4 diff starting locations.
- Idk if it will have any rpg elements, prob worry about that later.
- I haven't decided if time is going to be always moving forward or just moves when you do actions.

### Styling
- Have conversations act like text messaging, where it goes back and forth, showing the picture of the pony beside there speech bubble.
  - These conversations could even have text msg sounds when they pop up at the bottom of the screen.
    - Each character could have there own unique msg sound.
