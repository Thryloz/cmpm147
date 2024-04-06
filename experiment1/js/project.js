// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
    // create an instance of the class
  const fillers = {
    modifier: ["Worthless", "Pathetic", "Broken", "Damaged", "Common", "Rare", "Epic", "Legendary", "Mythical"],
    weapon: ["Sword", "Mace", "Bow", "Spear", "Shield", "Dagger", "Orb", "Tome", "Stick", "Rock", "Arrow", "Hammer", "Halberd", "Axe"],
    description: ["Destruction", "Cringe", "Annihilation", "Tripping", "Doom", "Magic", "Flight", "Lightning", "Storms", "???", "Defenestration", "Homework"],
    location: ["Fra", "Tro", "Gre", "Pan", "Ast", "Ara"],
    price:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] // yea there's a better way to do this but braincells < 0
  };

  const template = `At last, the item we've all been waiting and the star of today's auction, found in the depths of $location, I present to you...

  The $modifier $weapon of $description!!!!

  Starting bid at $price,000,000 gold.`
  // i spent a very sad amount of time trying to figure out how to bold the weapon name and failed

  // STUDENTS: You don't need to edit code below this line.

  const slotPattern = /\$(\w+)/;

  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }

  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }

    /* global box */
    box.innerText = story;
  }

  /* global clicker */
  clicker.onclick = generate;

  generate();
}

// let's get this party started - uncomment me
main();