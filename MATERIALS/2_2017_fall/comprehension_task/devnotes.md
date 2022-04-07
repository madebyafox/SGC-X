Installation & Notes
------------------
https://github.com/Tuuleh/jsPsychBackendStart as reference
0 Requires node.js
------------------ RUNNING LOCAL ------------------
1. After download of files from github, run [ npm update ] to install node_modules
2. Check app.js file for proper configuration of local vs. hosted db information and server connections
3. Run local Mongodb    [ mongod in terminal ]
4. Start application [node app.js]
5. Navigate to localhost:3000
6. View database by running viewer (like RoboMongo)
------------------

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

