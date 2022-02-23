#HOWTO

-query embedded/nested fields in mongodb
https://docs.mongodb.com/manual/tutorial/query-embedded-documents/
db.getCollection('entries').find({"data.subject":'8QMTP'})


@1.27.22 Download data from server database
mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out fall_2021_backup.json


mongoimport -d FALL2021 -c fall_wip --file fall2021-wip.json

mongoexport --collection=X_participants --db=FALL2021 --jsonArray --out=final_participants.json

mongoexport --collection=X_blocks --db=FALL2021 --jsonArray --out=final_blocks.json

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
mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out fall2021-wip.json

//TO DUMP ENTIRE DB
mongodump --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh

mongoexport -h ds259325.mlab.com:59325 -d 2ypdb-s3-beh -c entries -u amyraefox -p amyraefox -o fall2021-wip.json

mongoimport -d FALL2021 -c fall_102a --file fall_102a.json


mongoexport --collection=india-juliet-kilo-lima --db=FALL2017 --jsonArray --out=x_india-juliet-kilo-lima.json


mongoexport --collection=india-juliet-kilo-lima --db=FALL2017 --jsonArray --out=x_india-juliet-kilo-lima.json

mongoexport --collection=november-EXTRA --db=FALL2017 --jsonArray --out=x_november-EXTRA.json

XX 7WCYU DELTA 8
XX B50YA MIKE 16
XX J1880 INDIA 16
XX XYUT7 INDIA 28
XX B45BJ JULIET 32
X H3LT8 ALFA novemberextra 10



20 excluded + 6 = 26 ecluded

current
10 excluded
2940 blocks
196 participants



mongoexport --collection=x_final_participants --db=FALL2017 --jsonArray --out=2017-final_participants.json


mongoexport --collection=delta --db=XFALL2017 --jsonArray --out=x_delta.json
mongoimport -d XFALL2017 -c delta --file delta.json


mongoimport -d shib -c alfa-bravo-charlie --file alfa-bravo-charlie.json
mongoimport -d shib -c delta --file delta.json
mongoimport -d shib -c echo --file echo.json
mongoimport -d shib -c foxtrot --file foxtrot.json
mongoimport -d shib -c golf --file golf.json
mongoimport -d shib -c hotel --file hotel.json
mongoimport -d shib -c india-juliet-kilo-lima --file india-juliet-kilo-lima.json
mongoimport -d shib -c mike --file mike.json
mongoimport -d shib -c november-EXTRA --file november-EXTRA.json



# DATABASE SERVER
db url : 2ypdb-s3-beh.2ugwr.mongodb.net
db name: 2ypdb-s3-beh
username : expadmin
password: thirdyear

# DATABASE HELPERS


## DOWNLOAD DATA FROM DB SERVER TO LOCAL FILES

>> mongoexport -h [connectionstring] -d [dbname] -c [tablename] -u [username] -p [password] --out [filename]

//OLD VERSION
mongoexport -h ds259325.mlab.com:59325 -d 2ypdb-s3-beh -c entries -u expadmin -p thirdyear --out alfa-bravo-charlie.json

//UPDATED VERSION
mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out fall_102a.json

## DUMP ENTIRE DATABASE

//TO DUMP ENTIRE DB
mongodump --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh


## IMPORT DATA TO LOCAL DB

//With a local instance of mongoDB running
mongoimport -d server_2021 -c s_102A  --file fall_102a.json
