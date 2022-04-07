# DATA PROCESSING PIPELINE


The data processing pipeline for the SGC-X studies includes the following steps:

0: Subjects complete computer-based study deployed as web application (via Heroku)  
1: EXPORT SESSION FILES: (terminal, mongod) Manually download data from server (mLab/Atlas) at regular intervals, as raw .json (from MongoDB)  
2: WRANGLING: (js, mongoDB client) Import raw session files to local mongodb for data wrangling (unravelling and restructuring data format for different types of analysis [participant/item/mouse])  
3: EXPORT STUDY FILES: (terminal, mongod) Manually download wrangled data from local as .json  
4: STUDY SEPARATION: (R) Import wrangled files and separate data by condition code for analysis based on particular study version [because multiple studies were conducted at the same time]

_cleaning, exploratory data analysis and analysis are documented in `ANALYSIS` folder_


## TERMINOLOGY

`/raw_data` contains raw exports (json) from each session, downloaded from DB server  
`/db_scripts` scripts to extract (wrangled) data from local mongoDB to files for analysis in R  
`/ready_files` contains wrangled data ready for analysis in R

`.json` files are MongoDB extracts   
`.csv` are wrangled data files   
`_items` files are _question level_ data   
`_participants` files are aggregated _subject level_ data   
`_mouse_blocks` files are item level data _mouse tracking_ data 

`SESSION`: refers to experimental session name (input by subjects to start study); used to track in-person study sessions  
`CONDITION`: input by subject to start study, controls which experimental stimuli are shown.

First Digit    | explicit scaffolding
 ------------- |-------------
 1      | control (no-scaffold)
 2      | statuc image 
 3      | interactive image

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

Fourth Digit    | mark scaffold
------------- |-------------
 1 | point
 2 | triangle
 3 | cross

 Fifth digit  | interaction type
------------- |-------------
 1 | none
 5 | click on data point turns color 



# PIPELINE INSTRUCTIONS

## 1 EXPORT SESSION FILES

During experimental runs, download raw data from the db server to local machine for wrangling.

FOR EACH session (OR as often as desired), export the records into a json file for the session from the server

1. Start MAC terminal
2. Navigate to folder you want to download the files into
3. Run the appropriate cmd (below) to download the server data to a local file
4. Save data files to github
5. Delete data from server [using mLab/Atlas interface ]

>>mongoexport -h [connectionstring] -d [dbname] -c [tablename] -u [username] -p [password] --out [filename]
//SEE [NOTES] for login information


## 2 WRANGLE DATA FOR ANALYSIS

Data wrangling requires importing the raw data files into a local mongoDB, and running custom scripts that restructure the JSON data into a form that is essentially csv, for analysis in R. Three types of final data files are produced: participant level, item (question/block) level, and mouse_block (item level including mouse navigation information)

MongoDB reference sites:
- https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

1. In any directory, start local mongoDB instance

//TERMINAL
brew services start mongodb/brew/mongodb-community

2. Start the local mongoDB GUI (eg. RoboMongo, or Robo3T) and connect to the local server instance

3. Import raw files into a [new/existing] database

//TERMINAL
>>mongoimport -d [DBNAME] -c [SESSIONNAME] --file [filename.json]

//for example : import all session files into a collection called 'ALL_RAW'
>>mongoimport -d XFALL2017 -c ALL_RAW  --file alfa-bravo-charlie.json 
>>mongoimport -d XFALL2017 -c ALL_RAW  --file delta.json


4. OPEN data wrangling script 'flatten.js' in RoboT and run against the desired database in order to generate new 'collections' containing the wrangled data. Wrangling script may need to be updated if the stimulus code changed in a way that changes how the data is saved, and/or due to changes in the mongoDB specifications (deprecated functions, etc). Wrangling is the most challenging part of the pipeline, as it requires converting from the noSQL db to a relational form.

// access relevant data analysis script (ie. flatten.js)
OPEN the relevant JS file in the mongo client (eg robo3T). Run the script, and it will create a number of new collections that unravels (or ravels) the data into the appropriate form. If there are errors in the script (likely due to changes in the mongodb specification), will need to remediate those errors, and for each run of the script, the intermediate and final collections will need to be manually deleted

//occasionally dump/backup local DB
//CAN ALSO dump/backup local DB
//be SURE TO BACKUP DATA TO GITHUB
cd into data dump folder
>> mongodump -h localhost -d [DB NAME]

## 3 EXPORT STUDY FILES 
Export final collections to files. When data is in its final structure ready for data analysis in R, the final step to generate the required data files is exporting the desired collections (marked x_final_ in DB) to file. The --jsonArray parameter is VERY important

//TERMINAL
>>mongoexport --collection = [collection name] --db=[DB NAME] --jsonArray --out=[filename]

//EXAMPLE
>> mongoexport --collection=X_participants --db=XFALL2017 --jsonArray --out=final_participants.json
mongoexport --collection=X_blocks --db=XFALL2017 --jsonArray --out=final_blocks.json
mongoexport --collection=X_blocks_mouse --db=XFALL2017 --jsonArray --out=final_blocks_mouse.json

## 4 SEPARATE CONDITIONS INTO STUDIES

Because data for multiple studies was collected at the same time (fall 2017, spring 2018), it is necessary to separate the data files once again based on condition. It is easier to do this in R.

1. Run separate_studies.R in the same directory as the wrangled data files that need to be divided. Will write dataframes to file for each individual study.


# DEALING WITH MOUSEFLOW DATA
Free and starter (39$) accounts do not include API access, or any way to download the .zip files of the recordings in bulk.
To work around this issue, login to mouseflow and download the csv file of the recordings which includes their unique IDs and metadata.
extract the recording unique IDs and edit in atom, so that you have a URL matching this pattern for each file
https://us.mouseflow.com/websites/e0c9ff05-6fcb-4c4a-8173-e5a0724987b1/recordings/RECORDINGIDHERE/download
Using the chrome extension Open Multiple URLs 1.3.2.1,
have chrome open a tab for each URL on the list, which automatically starts the download.
(recommend "Don't load tabs until selected" option, and only loading 100-500 at a time so that chrome doesn't crash)

## OPTIONAL

REGEX FOR WRANGLING JSON FILES

/* x */ == \/\* .+ \*\/ (replace with comma)
[objectID line]        =="_id" : ([A-Z])\w+\("\w+"\),

