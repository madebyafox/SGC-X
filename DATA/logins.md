
# DATABASE SERVER
db url : 2ypdb-s3-beh.2ugwr.mongodb.net
db name: 2ypdb-s3-beh
username : expadmin
password: thirdyear



DOWNLOAD DATA FROM DB SERVER TO LOCAL FILES

>> mongoexport -h [connectionstring] -d [dbname] -c [tablename] -u [username] -p [password] --out [filename]

//OLD VERSION
mongoexport -h ds259325.mlab.com:59325 -d 2ypdb-s3-beh -c entries -u expadmin -p thirdyear --out alfa-bravo-charlie.json

//UPDATED VERSION
mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out extra.json

//TO DUMP ENTIRE DB
mongodump --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh
