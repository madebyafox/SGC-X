# Experimental Stimuli 
AUTHOR: AMY RAE FOX amyraefox@gmail.com  
Experimental Stimuli Codebase for SGC - Scaffolding Unconventional Graphs:
Study 3: The Insight Hypothesis _in remote asynch data collection mode_
Study 4: The Graph Schema _in remote asynch data collection mode_

_deployed at_ https://nameless-oasis-92655.herokuapp.com/

## INPUT

session code = "test"  
condition code = [3 digit code see below]

First Digit    | explicit scaffolding
 ------------- |-------------
 1      | control (no-scaffold)
 2      | static image
 3      | interactive image

Second Digit    | implicit scaffolding
 ------------- |-------------
1      | control (no-scaffold)
2      | impasse (no orthogonal answer)

Third Digit    | grid format
------------- |-------------
 1 | cartesian axes, full y, triag x
 2 | cartesian axes, into triag y, triag x
 3 | triangular axes, inside triag y, triag x
 4 | cartesian axes, inside y, triag x
 5 | cartesian axes, full y, full x


##  CONTEXT
- previously deployed 2018 Spring stimuli refactored to accomodate remote data collection (asynch over sona, during pandemic)
- subject completes one experimental block (first five questions are scaffolded based on CONDITION, next 10 are not scaffolded)
- SESSION CODE given by experimenter to track data collection session
- CONDITION CODE given to subject by card (random assignment)

## DATA RECORDING
- Currently configured (in experiment.js) to use on_finish to transfer data stored locally in the browser (per jsPsych) to the server DB at the end of the experiment
- Thus, every entry in the 'entries' collection in the DB corresponds to 1 run (eg 1 participant) in the study
- CAN be reconfigured to store by trial (using on_trial_finish)

## MANUAL MOUSE TRACKING
- Mouse cursor location is tracked (manually) via a script in the stimulus.html
- This script logs data to the mouseLog field
- The screen size (X/Y) is the first entry in the log
- Subsequent entries are made on the onmousemove event, recording the X and Y location of the mouse (e)

## QUALTRICS INTEGRATION

dummy-test survey for testing jsPsych integration
https://ucsd.co1.qualtrics.com/jfe/form/SV_0MrQH8f5ZRzp3am

Dev workflow for integrating jsPsych & Qualtrics
1. [Qualtrics] Configure Qualtrics to assign a random participant ID
https://www.qualtrics.com/support/survey-platform/common-use-cases-rc/assigning-randomized-ids-to-respondents/


https://www.qualtrics.com/support/survey-platform/common-use-cases-rc/assigning-randomized-ids-to-respondents/


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



