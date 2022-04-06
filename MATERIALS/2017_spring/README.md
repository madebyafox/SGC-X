# 2YP-Experiment

Experimental Stimuli for 2nd Year Project: 'Evaluating Scaffolds for Triangle Model'

_deployed at_ https://morning-gorge-17056.herokuapp.com/

session code = "test", condition code = [0,1,2,3,4]
supports study: SGC-2


##  CONTEXT
- in person, computer-based study (~45 minutes)
- web-based graph reading task + paper-based graph drawing task
- instructions delivered in person
- SESSION CODE given by experimenter to track data collection session
- CONDITION CODE given to subject by card (random assignment)
- subject completes two experimental blocks (one linear model, one triangular model) order counterbalanced

CONDITION CODE | scaffold condition
 ------------- |-------------
 0             | control (no-scaffold)
 1             | what-text
 2             | how-text
 3             | static image
 4             | interactive image
 

##  TECH - NOTES
- jsPsych http://docs.jspsych.org/ version 5.0.3 [+customization for external html plugin]
- d3 http://d3js.org/ for data visualization stimuli
- node.js
- express node runtime framework
- ejs template engine
- nodemon for reload
- Body-parser is middleware for Node.js that allows you to parse key-value data
- mongoose is a MongoDB driver for the Express framework

> thanks to https://github.com/Tuuleh/jsPsychBackendStart for boilerplate Mongo-Express-Node stack for db connectivity
