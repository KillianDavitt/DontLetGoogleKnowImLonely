# Don't let Google know im lonely!

http://arxiv.org/abs/1504.08043

Code for the Firefox addon demonstrating the concept.

Continuing to develop the code started by: [Cristiano](https://github.com/guimarac)

## TODO

- [x] Make probe queries function in the background
- [x] Provide the data to the user in a sensible manner
- [x] Allow export of results data
- [x] Allow new categories
- [x] Create multiple lines on the graph, one for each category
- [-] Show suggested labels on ads
- [ ] Fix training issues with extra categories

## Timeline


- 16/08/16 - Moved back to WebExtensions, ad retrieval in the background working. Changing of ads based on prior google searches does not seem to be working.
- 23/08/16 -  Retrieval of adapted ads now working, cookie issues solved.
- 23/08/16 - Investigated browser actions (the button on the top chrome bar) have ability to display any html there. HAve had success with Chart.js
- 24/08/16 -  Brainstorming how to display the data to the user, with some sort of graph
- 31/08/16 - Crude history graph is in place however, I have some difficulty ensuring that the graph stays up to date when the user closes the browser action and re-opens it.
- 31/08/16 - In addition I am unsure of how the y axis of the graph should scale, is there a minimum and maximum pri? I don't think so.
- 05/09/16 - Next task: Allow export of the data easily
- 05/09/16 - Next task: Allow user to add categories of detection easily, by name, and then by clicking ads to add to the data
- 08/09/16 - Reasonably effective exporting is now functioning properly
- 09/09/16 - Trying to improve the graph display slightly by adding lines between points
- 12/09/16 - Lots of work done. Categories can be added, and, ads can be clicked to be added to a users chosen category. The ad text is then added to the training data
- 13/09/16 - Much difficulty trying to get the ad options to consistently show up. It's totally sporadic, So far I have no solutions to this. window.onload is proving not useful and in fact seems to be making the problem worse
- 15/09/16 - Still have bug with ads not being detected when dev console is not open. New task to add the suggested label also.
- 19/09/16 - Did a lot of tidying of the code today, general cleaning up. Trying to get the graph working properly, i'm a bit closer but not there yet.
