
## 8/24/22 WRANGLING
- DOWNLOAD SGC4D equilateral 
  - run filter on server to get SGC4D in its own file

- DOWNLOAD from server to local server (190 records)
- >> mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection SGC_4D --type JSON --out su22_session_4D.json

- IMPORT to local server (iMac) for wrangling (327 before... 517 )
- >> mongoimport -d analyze_SGCXSU22 -c entries --file su22_session_4D.json

-- WRANGLE SGC 4D 
- RUN filter.js to create study specific db collections (eg SGC_4D) on local
- RUN flatten_sgc4d to flatten and create SGC 4D specific files  (from 122 subjects to 1830 items)

mongoexport -d analyze_SGCXSU22 -c SGC4D_final_participants --jsonArray --out su22_sgc4d_final_participants.json
mongoexport -d analyze_SGCXSU22 -c SGC4D_final_items --jsonArray --out su22_sgc4d_final_items.json
mongoexport -d analyze_SGCXSU22 -c SGC4D_final_items_mouse --jsonArray --out su22_sgc4d_final_items_mouse.json

## 8/23/22 WRANGLING
- following PROLIFIC run to fill cells for SGC 3B, I ran filter on the live server db to separate SGC3B entries.
  
- DOWNLOAD from server to local server (74 records)
- >> mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection SGC_3B --type JSON --out su22_session3.json

- IMPORT to local server (iMac) for wrangling (253 before... 327 after)
- >> mongoimport -d analyze_SGCXSU22 -c entries --file su22_session3.json

-- WRANGLE SGC 3B 
- RUN filter.js to create study specific db collections (eg SGC_3B)
- RUN flatten_sgc3b to flatten and create SGC 3B specific files  (from 54 subjects to 810 items)

mongoexport -d analyze_SGCXSU22 -c SGC3B_final_participants --jsonArray --out su22_sgc3b_final_participants.json
mongoexport -d analyze_SGCXSU22 -c SGC3B_final_items --jsonArray --out su22_sgc3b_final_items.json
mongoexport -d analyze_SGCXSU22 -c SGC3B_final_items_mouse --jsonArray --out su22_sgc3b_final_items_mouse.json

DO NOT DELETE FROM DATABASE
(but not running more SGC3B... so no need to re-wrangle)

## 8/23/22 WRANGLING

- DOWNLOAD from server to local server (74 records)
- >> mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out su22_session2.json

- IMPORT to local server (iMac) for wrangling (179 before... 253 after)
- >> mongoimport -d analyze_SGCXSU22 -c entries --file su22_session2.json

-- WRANGLE SGC 4A 
- RUN filter.js to create study specific db collections (eg SGC_3A)
- RUN flatten_sgc4a to flatten and create SGC 4A specific files  (from 76 subjects to 130 (1950 items))
(all subjects from prior run in first summer session are included in this run, so overwrite existing file)

mongoexport -d analyze_SGCXSU22 -c SGC4A_final_participants --jsonArray --out su22_sgc4a_final_participants.json
mongoexport -d analyze_SGCXSU22 -c SGC4A_final_items --jsonArray --out su22_sgc4a_final_items.json
mongoexport -d analyze_SGCXSU22 -c SGC4A_final_items_mouse --jsonArray --out su22_sgc4a_final_items_mouse.json
- successfully exported 130 participants, 1950 items 

- RUN summer2022_clean_sgc4a.Rmd
- generate new su22_sgc4a files, and copy to analysis folder 

NOTE:: after integrating with prior data (in analysis folder... found that we're still 15 subjects under for 114 and 7 subjects under for 115)

-- DELETED (dropped) records from server database


## DATA COLLECTION

- 7/19/22 deploy SGC 4C rotation conditions to limitless plains
- run ~5 Ss on Prolific as pilot

- 7/11/22 deploy SGCC 5A control condition on SONA 	
21JH02 https://limitless-plains-85018.herokuapp.com/?study=SGC5A&condition=11111&session=su22sona&mode=asynch&pool=sona&exp_id=2217 


- 7/11/22 preparing to deploy updates to limitless plains in order to run participants on SONA
- https://limitless-plains-85018.herokuapp.com/?study=SGC4A&condition=113&sona_id={{%PROLIFIC_PID%}}&exp_id={{%STUDY_ID%}}&session={{%SESSION_ID%}}


## WRANGLE

### recreate lab data workflow 

mongoimport -d analyze_SGCX_lab -c entries --file alfa-bravo-charlie.json



### 08/02/22 WRANGLE DOWN FROM SERVER
- DOWNLOAD from server to local file (179 entries in server side collection)
- LOCAL file is 80MB nearing github file size limit; so delete server data and run ss2 separantely

>> mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out su22_session1.json

- now that this file is checked on (and previously loaded on IMAC to analyze_SGCXSU22 db), I drop all entries from server 


### 08/02/22 WRANGLE 4A on IMAC
- leave all data on server
- download complete file from server
- upload to summer-specific dB on iMAC
- run filter just for 4A
- wrangle 4A


- DOWNLOAD from server to local file [DIDN'T DELETE data from server; meant to be WIP test of wrangling only]
>> mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out su22_test.json

- IMPORT from local file to local dB
>> mongoimport -d analyze_SGCXSU22 -c entries_new --file su22_test.json

- FILTER from entries collection to new delta collections [so to keep incoming data separate from existing]
>> [run filter.js in 2022_summer 2_db_scripts]

- FLATTEN SGC4A
  - [run flatten_SGC4C]

- DOWNLOAD study specific files 
- store files in 3_ready_files

[4C]
mongoexport -d analyze_SGCXSU22 -c SGC4A_final_participants --jsonArray --out su22_sgc4a_final_participants.json
mongoexport -d analyze_SGCXSU22 -c SGC4A_final_items --jsonArray --out su22_sgc4a_final_items.json
mongoexport -d analyze_SGCXSU22 -c SGC4A_final_items_mouse --jsonArray --out su22_sgc4a_final_items_mouse.json


### 07/22/22 WRANGLE WIP 4C on MBP
(replace existing WIP files without delete from server )

- DOWNLOAD from server to local file [DIDN'T DELETE data from server; meant to be WIP test of wrangling only]
>> mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out su22_test.json

- IMPORT from local file to local dB
>> mongoimport -d XSUMMER2022 -c entries_new --file su22_test.json

- FILTER from entries collection to new delta collections [so to keep incoming data separate from existing]
>> [run filter.js in 2022_summer 2_db_scripts]

- FLATTEN SGC4C
  - [run flatten_SGC4C]

- DOWNLOAD study specific files (split here rather than in Rmd for size restrictions)
- store files in 3_ready_files

[4C]
mongoexport -d XSUMMER2022 -c delta_SGC4C_final_participants --jsonArray --out WIP_su22_sgc4c_final_participants.json
mongoexport -d XSUMMER2022 -c delta_SGC4C_final_items --jsonArray --out WIP_su22_sgc4c_final_items.json
mongoexport -d XSUMMER2022 -c delta_SGC4C_final_items_mouse --jsonArray --out WIP_su22_sgc4c_final_items_mouse.json


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


