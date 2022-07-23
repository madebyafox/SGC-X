


## DATA COLLECTION

- 7/19/22 deploy SGC 4C rotation conditions to limitless plains
- run ~5 Ss on Prolific as pilot

- 7/11/22 deploy SGCC 5A control condition on SONA 	
21JH02 https://limitless-plains-85018.herokuapp.com/?study=SGC5A&condition=11111&session=su22sona&mode=asynch&pool=sona&exp_id=2217 


- 7/11/22 preparing to deploy updates to limitless plains in order to run participants on SONA
- https://limitless-plains-85018.herokuapp.com/?study=SGC4A&condition=113&sona_id={{%PROLIFIC_PID%}}&exp_id={{%STUDY_ID%}}&session={{%SESSION_ID%}}


## WRANGLE


### 07/20/22 WRANGLE ON IMAC
- DOWNLOAD from server to local file [DIDN'T DELETE data from server; meant to be WIP test of wrangling only]
>> mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out su22_test.json

- IMPORT from local file to local dB
>> mongoimport -d analyze_SGCX -c entries_new --file su22_test.json

- FILTER from entries_new collection to new delta collections [so to keep incoming data separate from existing]
>> [run filter.js in 2022_summer 2_db_scripts]

- FLATTEN from entries_new
  - retrofit all flatten_[studyname] files in 2022_summer to read from entries_new and write to delta_ collections, to keep these separate from existing data 

- DOWNLOAD study specific files (split here rather than in Rmd for size restrictions)
- store files in 3_ready_files

[4A]
mongoexport -d analyze_SGCX -c delta_SGC4A_final_participants --jsonArray --out WIP_su22_sgc4a_final_participants.json
mongoexport -d analyze_SGCX -c delta_SGC4A_final_items --jsonArray --out WIP_su22_sgc4a_final_items.json
mongoexport -d analyze_SGCX -c delta_SGC4A_final_items_mouse --jsonArray --out WIP_su22_sgc4a_final_items_mouse.json

[4C]
mongoexport -d analyze_SGCX -c delta_SGC4C_final_participants --jsonArray --out WIP_su22_sgc4c_final_participants.json
mongoexport -d analyze_SGCX -c delta_SGC4C_final_items --jsonArray --out WIP_su22_sgc4c_final_items.json
mongoexport -d analyze_SGCX -c delta_SGC4C_final_items_mouse --jsonArray --out WIP_su22_sgc4c_final_items_mouse.json

[X]
mongoexport -d analyze_SGCX -c delta_SGCX_final_participants --jsonArray --out WIP_su22_sgcx_final_participants.json
mongoexport -d analyze_SGCX -c delta_SGCX_final_items --jsonArray --out WIP_su22_sgcx_final_items.json
mongoexport -d analyze_SGCX -c delta_SGCX_final_items_mouse --jsonArray --out WIP_su22_sgcx_final_items_mouse.json

[5A]
mongoexport -d analyze_SGCX -c delta_SGC5A_final_participants --jsonArray --out WIP_su22_sgc5a_final_participants.json
mongoexport -d analyze_SGCX -c delta_SGC5A_final_items --jsonArray --out WIP_su22_sgc5a_final_items.json
mongoexport -d analyze_SGCX -c delta_SGC5A_final_items_mouse --jsonArray --out WIP_su22_sgc5a_final_items_mouse.json

### TODO
[when all summer2022 data is collected, and wrangled separately... import all the files into entries and re-wrangle so that all study specific entries are in a single place]



## DATABASE SERVER
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


