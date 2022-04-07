# DATA COLLECTION

## SGC3B
- Collected data from COGS 102A
- data collected from COGS 102A class in exchange for guest lecture
- remote-collection, pre-assigned conditions (Randomized over email) + OSPAN task on qualtrics
- 39 participants - 2 test = 37 total

## SGC3A-R
- Collected via SONA 21JH01 (CONDITION = 111)
- Collected via SONA 21JH02 (CONDITION = 121)
- remote-collection, pre-assigned conditions + OSPAN task
=======

## NOTES

Collected data from COGS 102A to fill missing cells in SGC3B (factorial)
Data collected from COGS 102A class in exchange for guest lecture
remote-collection, pre-assigned conditions (Randomized over email) + OSPAN task on qualtrics
39 records total = 37 from COGS 102A + 2 test (Emilia, Hui Xin)

Sessions == PID so these folks can be manually excluded from future SONA studies.

1. EXPORT FROM SERVER
- EXPORT data from server [230 entries exported]
mongoexport --uri mongodb+srv://expadmin:thirdyear@2ypdb-s3-beh.2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out fall_2021_all.json

2. IMPORT to local server for wrangling
mongoimport -d XFALL2021 -c entries --file fall_2021_all.json

3. WRANGLE data using flatten.js
230 subjects - 40 excluded (attention check)

4. EXPORT to local for analysis
mongoexport --collection=X_participants --db=XFALL2021 --jsonArray --out=final_participants.json
mongoexport --collection=X_blocks --db=XFALL2021 --jsonArray --out=final_blocks.json
mongoexport --collection=X_blocks_mouse --db=XFALL2021 --jsonArray --out=final_blocks_mouse.json


