# Experimental Stimuli 
AUTHOR: AMY RAE FOX amyraefox@gmail.com  
Experimental Stimuli Codebase for SGC - Scaffolding Unconventional Graphs:
Study 3: The Insight Hypothesis
Study 4: The Graph Schema

_was deployed at_ https://warm-citadel-75324.herokuapp.com/

## INPUT

session code = "test"  
condition code = [3 digit code see below]

First Digit    | explicit scaffolding
 ------------- |-------------
 1      | control (no-scaffold)
 2      | text/image (static)
 3      | interactive

Second Digit    | implicit scaffolding
 ------------- |-------------
1      | control (no-scaffold)
2      | impasse (no orthogonal answer)

Third Digit    | grid format
------------- |-------------
1 | full orthogonal
2 | partial orthogonal
3 | diagonal

##  CONTEXT

- in person, computer-based study (~30 minutes)
- web-based graph reading task 
- subject completes one experimental block (first five questions are scaffolded based on CONDITION, next 10 are not scaffolded)
- SESSION CODE given by experimenter to track data collection session
- CONDITION CODE given to subject by card (random assignment)

## TECH - NOTES 

- deployed on heroku + atlas/mongodb database
- jsPsych http://docs.jspsych.org/ version 5.0.3 [+customization for external html plugin]
- d3 http://d3js.org/ for data visualization stimuli
- node.js
- express node runtime framework
- ejs template engine
- nodemon for reload
- Body-parser is middleware for Node.js that allows you to parse key-value data
- mongoose is a MongoDB driver for the Express framework
- manually SET MIN, MAX AND RANGE IN GRAPHS.JS

> thanks to https://github.com/Tuuleh/jsPsychBackendStart for boilerplate Mongo-Express-Node stack for db connectivity

