# Don't let Google know im lonely!

http://arxiv.org/abs/1504.08043

Code for the Firefox addon demonstrating the concept.

Continuing to develop the code started by: [Cristiano](https://github.com/guimarac)

## TODO

- [x] Make probe queries function in the background
- [ ] Provide the data to the user in a sensible manner
- [ ] Make the sensetive/non sensitive bits work

## Timeline


- 16/08/16 - Moved back to WebExtensions, ad retrieval in the background working. Changing of ads based on prior google searches does not seem to be working.
- 23/08/16 -  Retrieval of adapted ads now working, cookie issues solved.
- 23/08/16 - Investigated browser actions (the button on the top chrome bar) have ability to display any html there. HAve had success with Chart.js
- 24/08/16 -  Brainstorming how to display the data to the user, with some sort of graph
- 31/08/16 - Crude history graph is in place however, I have some difficulty ensuring that the graph stays up to date when the user closes the browser action and re-opens it.
