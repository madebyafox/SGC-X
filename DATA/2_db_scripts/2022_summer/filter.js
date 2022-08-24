//FILTER.JS ———————————————————————————————————————————————————
//filter WIP dataset to include items only for specified study
// —————————————————————————————————————————————————————————————

//STEP 0: Import raw db files from server to local 
//(ie. using mongoimport)
//`mongoexport --uri mongodb+srv://[username]:[password]@[dbname].2ugwr.mongodb.net/2ypdb-s3-beh --collection entries --type JSON --out wi22_SGC3A.json`
//import to local
//mongoimport -d analyze_SGC3A -c entries --file wi22_SGC3A.json

//STEP 1: CREATE COLLECTION FILTERED BY STUDY NAME

//CREATE A COLLECTION OF entries FOR GIVEN STUDY
//EG change string match for title of desired study
db.entries.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGC3A'}},
    {$out: "SGC_3A"}
]);
    
db.entries.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGC3B'}},
    {$out: "SGC_3B"}
]);    
    
db.entries.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGC4A'}},
    {$out: "SGC_4A"}
]); 

db.entries.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGC4C'}},
    {$out: "SGC_4C"}
]); 
    
db.entries.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGC4B'}},
    {$out: "SGC_4B"}
]);    

db.entries.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGC4D'}},
    {$out: "SGC_4D"}
]);        
    
db.entries.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGC5A'}},
    {$out: "SGC_5A"}
]); 

db.entries.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGC5X'}},
    {$out: "SGC_X"}
]); 
    
    db.entries.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGCX'}},
    {$out: "SGC_X"}
]); 