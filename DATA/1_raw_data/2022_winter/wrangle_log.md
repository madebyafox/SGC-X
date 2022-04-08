
## Download complete WI22 

### 4/7/2022
- download from server 
>> mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out wi22.json

- file to big for github, have to split using python script, download JSON ARRAY version
>> mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --jsonArray --out wi22_jsonArray.json

- IMPORT into local DB 
- note: WIP-DUMP is data from the first part of datacollection, needed to be dumped to file and db cleared because ran out of space on free mongoDB
>> mongoimport -d XWINTER2022 -c entries --file wi22.json
>> mongoimport -d XWINTER2022 -c entries --file wi22_WIP-DUMP.json

- EXPORT from local DB into one file to split for upload raw to github (1380 subjects)
>> mongoexport -d XWINTER2022 -c entries --jsonArray --out wi22_all_raw.json

>> mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out wi22.json

- WRANGLE customized flatten.js files per study, due to size
- ran flatten.js against entries (see reconcilliation below for totals)

- DOWNLOAD study specific files (split here rather than in Rmd for size restrictions)
- store files in 3_ready_files

[3A]
mongoexport -d XWINTER2022 -c SGC3A_final_participants --jsonArray --out winter22_sgc3a_final_participants.json
mongoexport -d XWINTER2022 -c SGC3A_final_items --jsonArray --out winter22_sgc3a_final_items.json
mongoexport -d XWINTER2022 -c SGC3A_final_items_mouse --jsonArray --out winter22_sgc3a_final_items_mouse.json

[4A]
mongoexport -d XWINTER2022 -c SGC4A_final_participants --jsonArray --out winter22_sgc4a_final_participants.json
mongoexport -d XWINTER2022 -c SGC4A_final_items --jsonArray --out winter22_sgc4a_final_items.json
mongoexport -d XWINTER2022 -c SGC4A_final_items_mouse --jsonArray --out winter22_sgc4a_final_items_mouse.json

[4B]
mongoexport -d XWINTER2022 -c SGC4B_final_participants --jsonArray --out winter22_sgc4b_final_participants.json
mongoexport -d XWINTER2022 -c SGC4B_final_items --jsonArray --out winter22_sgc4b_final_items.json
mongoexport -d XWINTER2022 -c SGC4B_final_items_mouse --jsonArray --out winter22_sgc4b_final_items_mouse.json

[5A]
mongoexport -d XWINTER2022 -c SGC5A_final_participants --jsonArray --out winter22_sgc5a_final_participants.json
mongoexport -d XWINTER2022 -c SGC5A_final_items --jsonArray --out winter22_sgc5a_final_items.json
mongoexport -d XWINTER2022 -c SGC5A_final_items_mouse --jsonArray --out winter22_sgc5a_final_items_mouse.json

### reconcilliation
- 1380 total records `entries`
- minus 330 failures (sum in `_fail`)
- equals 1050 `final_participants`
- SGC5A : 137
- SGC4B : 249
- SGC4A : 582
- SGC3A : 82


## mid-collection DB dump
- note: WIP-DUMP is data from the first part of datacollection, needed to be dumped to file and db cleared because ran out of space on free mongoDB

>> mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out wi22_WIP-DUMP.json

### REFACTOR data wrangling scripts for consistent format 

- import fall21 into analyze_SGC3 db
mongoimport -d analyze_SGC3A -c fall_21 --file fall_2021_all.json

### WRANGLE WI22 SGC_3A_R data 
- same database is being used for SGC_4A, though SGC_3A collection is complete
- need to download current entries, and filter for only SGC_3A data 

- @3.02.22 EXPORT wip data from server [includes both complete SGC_3A_R and in progress SGC_4A]
mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out wi22_SGC3A.json

- @3.02.22 IMPORT wip data to local for analysis
mongoimport -d analyze_SGC3A -c entries --file wi22_SGC3A.json

- @3.02.22 FILTER data by study to isolate **just** SGC_3A entries
run filter.js against entries collection

- @3.02.22 EXPORT resulting collection as SGC_3A_R raw data 
mongoexport -d analyze_SGC3A -c SGC_3A --type JSON --out wi22_SGC3A.json

- @3.02.22 IMPORT into local DB as SGC_3A_R raw data (after removing all local entries)
mongoimport -d analyze_SGC3A -c entries --file wi22_SGC3A.json

- @3.02.22 WRANGLE STATUS
run status.js against entries
summary shows that 
condition 111 (control) has 38 successful subjects and 16 browser failures
condition 121 (impasse) has 44 successful subjects and 9 browser failures
 
- @3.02.22 WRANGLE prepare participant, item and mouse data files
run flatten.js against entries

- @3.02.22 WRANGLE export cleaning-ready files
mongoexport -d analyze_SGC3A -c final_participants --jsonArray --out winter22_sgc3a_final_participants.json
mongoexport -d analyze_SGC3A -c final_items --jsonArray --out winter22_sgc3a_final_items.json
mongoexport -d analyze_SGC3A -c final_items_mouse --jsonArray --out winter22_sgc3a_final_items_mouse.json



### WIP VERIFICATION OF BROWSER FAILURES 


- @2.25.22 EXPORT wip data from server 
mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out wi22_wip.json

- @2.25.22 IMPORT pilot data to local
mongoimport -d local_SGCX -c ALL_RAW --file wi22_wip.json


- @2.25.22 EXPORT flattened data for validation
mongoexport -d local_SGCX -c final_participants --jsonArray --out winter22_sgc3a_WIP_final_participants.json
mongoexport -d local_SGCX -c final_items --jsonArray --out winter22_sgc3a_WIP_final_items.json

### PILOT 

- @2.23.22 EXPORT pilot data from server 
mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out wi22_pilot.json

- @2.23.22 IMPORT pilot data to local
mongoimport -d local_SGCX -c entries --file wi22_pilot.json

- @2.23.22 EXPORT flattened data for validation
mongoexport -d local_SGCX -c final_participants --jsonArray --out winter22_sgc3a_pilot_final_participants.json
mongoexport -d local_SGCX -c final_items --jsonArray --out winter22_sgc3a_pilot_final_items.json

- @1.27.22 Download data from server database
mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out fall_2021_backup.json


-query embedded/nested fields in mongodb
https://docs.mongodb.com/manual/tutorial/query-embedded-documents/
db.getCollection('entries').find({"data.subject":'8QMTP'})


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
>> mongoexport -h ds259325.mlab.com:59325 -d 2ypdb-s3-beh -c entries -u expadmin -p thirdyear --out alfa-bravo-charlie.json

//UPDATED VERSION  
>> mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out fall2021-wip.json

//TO DUMP ENTIRE DB  
>> mongodump --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh

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
password : thirdyear
_for limitless plains_
 --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh

## DOWNLOAD DATA FROM DB SERVER TO LOCAL FILES

>> mongoexport -h [connectionstring] -d [dbname] -c [tablename] -u [username] -p [password] --out [filename]

//OLD VERSION  
>> mongoexport -h ds259325.mlab.com:59325 -d 2ypdb-s3-beh -c entries -u expadmin -p thirdyear --out alfa-bravo-charlie.json

//UPDATED VERSION  
>> mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out fall_102a.json

## DUMP ENTIRE DATABASE

//TO DUMP ENTIRE DB  
>> mongodump --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh


## IMPORT DATA TO LOCAL DB

//With a local instance of mongoDB running  
>> mongoimport -d server_2021 -c s_102A  --file fall_102a.json


