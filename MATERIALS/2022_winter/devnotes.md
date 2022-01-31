
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
 