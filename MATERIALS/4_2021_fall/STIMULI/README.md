# Experimental Stimuli 
AUTHOR: AMY RAE FOX amyraefox@gmail.com  
Experimental Stimuli Codebase for SGC - Scaffolding Unconventional Graphs:
Study 3: The Insight Hypothesis _in remote asynch data collection mode_
Study 4: The Graph Schema _in remote asynch data collection mode_

_deployed at_ https://warm-citadel-75324.herokuapp.com/

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




Installation & Notes
------------------
https://github.com/Tuuleh/jsPsychBackendStart as reference
0 Requires node.js
------------------ RUNNING LOCAL ------------------
1. After download of files from github, run [ npm update ] to install node_modules
2. Check app.js file for proper configuration of local vs. hosted db information and server connections
3. Run local Mongodb    
  OLD: [ mongod in terminal ]
  NEW: brew services start mongodb/brew/mongodb-community
  in mongodB client (eg Robo3T) create/verify there is a database to store the local data (eg. local_SGCX)
  Verify this is the DB referenced in the app.js file

4. START application [node app.js]
5. Navigate to localhost:3000
------------------

Technical Notes
------------------
- jsPsych http://docs.jspsych.org/ library for structuring experiment
- d3 http://d3js.org/ for data visualization stimuli
- node.js
- express node runtime framework
- ejs template engine
- nodemon for reload
- Body-parser is middleware for Node.js that allows you to parse key-value data
- mongoose is a MongoDB driver for the Express framework
> thanks to https://github.com/Tuuleh/jsPsychBackendStart for boilerplate Mongo-Express-Node stack for db connectivity

Dev Notes
-------------------
> configure for local dev (check app.js file and un-comment local dev)
> for heroku deploy... setup new database on mlab
> setup new heroku application
> see https://github.com/Tuuleh/jsPsychBackendStart for reference
> see https://devcenter.heroku.com/articles/git for reference
> set mongo path in heroku with
heroku config:set CONNECTION = [mongolabs uri]
> heroku for deploy
> mlabs for db

## Deployment
(as of Fall 2021)
1. Setup hosted mongoDB using Atlas https://cloud.mongodb.com/
(or use existing cluster if it already exists)
2. Download & Install heroku CLI : https://devcenter.heroku.com/articles/heroku-command-line
3. Get connection URI from Atlas, and enter in heroku CLI

(We want this connection string to be accessible to Heroku, but we want to hide it from our public Git repository. We'll use Heroku's config variables for this purpose. Go to your terminal and type...)

heroku config:set CONNECTION = [MongoLabs_URI]

... where [MongoLabs_URI] is your URI string - replacing and with their respective values. Type heroku config again to verify you got it right (there should now be a CONNECTION variable),

4. Modify app.js connection settings, from local to server configuration lines
(eg  mongoose.connect(process.env.CONNECTION);)
