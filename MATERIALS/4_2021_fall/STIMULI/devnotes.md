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
