

# Data Collection Notes

## Sessions

1. Collected data from COGS 102A to fill missing cells in SGC3B (factorial)
Data collected from COGS 102A class in exchange for guest lecture
remote-collection, pre-assigned conditions (Randomized over email) + OSPAN task on qualtrics
39 records total = 37 from COGS 102A + 2 test (Emilia, Hui Xin)

Sessions == PID so these folks can be manually excluded from future SONA studies.

mongoexport --collection=X_participants --db=server_2021 --jsonArray --out=final_participants.json
mongoexport --collection=X_blocks --db=server_2021 --jsonArray --out=final_blocks.json
mongoexport --collection=X_blocks_mouse --db=server_2021 --jsonArray --out=final_blocks_mouse.json
