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
db.entries_new.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGC3A'}},
    {$out: "delta_SGC_3A"}
]);
    
db.entries_new.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGC3B'}},
    {$out: "delta_SGC_3B"}
]);    
    
db.entries_new.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGC4A'}},
    {$out: "delta_SGC_4A"}
]);        
    
db.entries_new.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGC4B'}},
    {$out: "delta_SGC_4B"}
]);            

db.entries_new.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGC4B'}},
    {$out: "delta_SGC_4B"}
]);            

db.entries_new.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGC4C'}},
    {$out: "delta_SGC_4C"}
]);            
    
db.entries_new.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGC5A'}},
    {$out: "delta_SGC_5A"}
]);      

db.entries_new.aggregate([
    //select relevant entries for this study
    {$match: {'data.trials.study' : 'SGCX'}},
    {$out: "delta_SGC_X"}
]);    