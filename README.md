# Tournament Bracket

This is a very simple visual tournament bracket made using javascript, html, and css. It is meant to be used with HTML games. Player info such as name and the image used are stored in localStorage.

## Why Did I make this

I wanted to render a simple tournament bracket tree without using html+css for rendering. And so I made this. It was meant to go with a pong clone I was working on.

## Using this in a game

You will have to change the `playMatch()` function so that it starts your game, updates the tree accordingly upon the match finishing, and starts the next match if it exists. Also the `startTournament()` function will have to be changed so that it starts the first match. Currently it just runs a for loop that simulates matches being played.

## Testing

The code runs a simple simulator to test if the tree will update accordingly. So just make sure there are atleast 8 players and the code will pick all players and add them to the contenders list. All you have to do is click "start".

## Contributing

This code needs to be cleaned up first before anything can be added to it. I had no plans of open sourcing the code, so I made sure that as much code was on global scope, and that I object pooled as much as I could (Still waiting for javascript's single thread to bite me back. For all I know, it already has).

Anyways, if you are willing to work with spagetti code you can:

- clean up the code XD,
- Add JSDOC comments and remove any unneccesary comments all together,
- render a group stage,
- make the tournament tree adapts depending on how many players are added to contenders list.