import { Command } from "../types";
import  fetchUrl  from "../lib/fetch"
const command: Command = {
  name: "random_joke",
  description: "Replies with A Joke!",
  execute: async (interaction) => {
 
    // working on improving this
    // let joke: string = await fetchUrl('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,racist&format=txt')
    // joke = joke.replace("\n\n", " ||") + "||"
    // joke = joke.replace("|| ||", "")

    // make this save the joke, and if it is a 2 liner than one line add || before and after the last line. ignore empty blank lines.
    let joke: string = await fetchUrl('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw&format=txt');
    const jokeLines = joke.split('\n').filter(line => line.trim() !== '');
    if (jokeLines.length === 2) {jokeLines[jokeLines.length - 1] = `||${jokeLines[jokeLines.length - 1]}||`;}
    
    let processedJoke = jokeLines.join('\n');    

    await interaction.reply(processedJoke);
  },
};

export default command;