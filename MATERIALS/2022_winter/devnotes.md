
# To Build Application from scratch [not use existing code]

1. Establish blank repository
git clone [repo]

2. Initialize node app
npm init

3. Install pre-requisite modules
(don't install jspsych, because we need to make modifications, we'll work with a local copy of the files)
- express (server)
- ejs (template engine)
- body-parser (middleware for parsing key-value data in request body)
- mongoose (mongodb driver)
npm install --save express
npm install --save ejs
npm install --save body-parser
npm install --save mongoose

3. Create 'app.js' file in root folder, and make sure 'app.js' is referenced as "main" in package.json

4. Build exp dir structure
root
/ public
    index.html
    /media
    /styles
    /src
    /jspsych7

4. Write experiment
//import plugins as necessary. Link them in index.html, move js file to /plugins folder

5. Run experiment (locally) run in CLI
to run with auto refresh on code change
nodemon app.js
to run without auto refresh
node app.js


# TODO
- minimize jspsych7 (remove files not needed for runtime)


# To Use Application code

1. Clone github repo
git clone [repo address]

2. Build
//installs node_modules based on package.json contents
npm install


3. Run
//uses nodemon fo automatic code refresh
nodemon app.js

# TO DEPLOY
1. Login to heroku, login to atlas DB, make sure DB state is as desired

# NOTES ON AUTO ASSIGNMENT OF SONA CREDIT 
  //see https://www.sona-systems.com/help/jspsych.aspx
  //also https://www.sona-systems.com/help/integration_test.aspx
  
  // 1 | change the Study URL so it includes ?sona_id=%SURVEY_CODE% in the URL
  // 2 | Having completed Step 1 ... the Study Information on your Sona Systems site now displays two URLs labeled "Completion URLs". T
  //    similar to: https://yourschool.sona-systems.com/webstudy_credit.aspx?experiment_id=123&credit_token=4e48f9b638a&survey_code=XXX" 

  //EG FOR 21JH01
  //client side https://ucsd.sona-systems.com/webstudy_credit.aspx?experiment_id=2218&credit_token=9a51e0fbf8c4403bbb31ef602025647b&survey_code=XXXX
  //server side https://ucsd.sona-systems.com/services/SonaAPI.svc/WebstudyCredit?experiment_id=2218&credit_token=9a51e0fbf8c4403bbb31ef602025647b&survey_code=XXXX

  //In jsPsych, go to the source code of the task for the experiment 
  //Add lines similar to the following block for both on_finish line 
  //and the line beginning with let sona_id. 
  //Use the Completion URL (client-side) from the Study Information Page in Sona. 
  //Add lines similar to the following on_finish line to your experiment 
  //(the URL you saved from the prior step with +sona_id after it as shown in example below) 
  //and the line defining sona_id at the top.

  # d3-v4 documentation
  https://devdocs.io/d3~4/