#SGC2 Evaluating learning of unconventional statistical graph

SGC2 is an experimental study conducted as part of my second year project, in the fall/winter of 2016-2017 at UCSD. We brought UCSD students into the COGSCI computer lab, and had them complete a computer-based task, deployed using HEROKU.  Response accuracy and latency were recorded directly to the server. Students also completed a paper-pen drawing task.

SEE FULLBACKUP OF ALL MATERIALS (including stimulus generation and raw pdfs, etc) in RESEARCH BACKUP DRIVE.

## IRB
Study falls under UCSD IRB approval for project 170180SX.

## MATERIALS
Materials are documented in 1_MATERIALS.  Includes:
(1)Computer-based task deployed on HEROKU using mLab as the underlying MongoDB, and
(2) paper-based graph drawing Task

## DATA
Data is documented in 2_DATA, including
(1) ARTIFACTS scanned copies of the paper-based graph drawing Task, subsequently scanned to by RAs to session-level PDF files and condition-participant-level png files for visualization in gallery view
(2) RAW DATA (.bson) files extracted directly from mongo db
XLS files per session output of data wrangling (substantial complicated scripting required to get data out of MongoDB)
JSON files per session output of data wrangling
SEE datawranglingnotebook.txt

## ANALYSIS
Anaylses documented in 3_ANALYSIS
note that 'master' analysis files are in xls-files

## TODO
[ ] MINE collection and analysis notebook txt files for action items
[ ] FIX PUBLIC WEBSITE


## PUBLICATIONS
SGC2 was published in conjuction with SGC2 (together, my second year project) in the 2018 Diagrams conference.

## METHODS

### Design
We employed a 5 (scaffold: none-control, what-text, how-text, static image, interactive image) 􏰁 2 (graph: LM, TM) mixed design, with scaffold as a between-subjects variable and graph as a within-subject variable. To test our hypothesis that exposure to the conventional LM acts as a scaffold for the TM, we counterbalanced the order of graph-reading tasks (order: LM-first, TM-first). For each task, we measured response accuracy and time. For the follow-up graph-drawing task, we coded the type of graph produced by each participant.

### Participants
316 (69% female) STEM undergraduates aged 17 to 33 were recruited from the experimental-subject pool at a large American university (M(age) = 21, SD (age) = 2), yielding approximately 30 participants per cell in the 5 x 2 design.

### Materials & Procedure
(see 2018 Diagrams Publication)
