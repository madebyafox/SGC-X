//FLATTEN.JS ———————————————————————————————————————————————————
//refactor to fit new data format for SGCX
// —————————————————————————————————————————————————————————————

//STEP 0: Import all session files into the ALL_RAW collection
//(ie. using mongoimport)
//mongoimport --collection=ALL_RAW --db=XSPRING2018 --file=Wextra.json


//CREATE A COLLECTION OF ALL SUBJECTS
db.entries.aggregate(
 [
     //select only successful participants 
    {$match: {"data.trials.status": {$in: ["success"] }}},  
    {$unwind: "$data"},
    {$replaceRoot: { newRoot: "$data" }},
    {$out: "BY_SUBJECT"}
]);

//CREATE A COLLECTION OF ALL TRIALS
db.BY_SUBJECT.aggregate([
       {$unwind: "$trials"},
       {$replaceRoot: { newRoot: "$trials" }},
       {$out: "BY_TRIAL"}
]);
       
// //COLLECTION OF PARTICIPANT-LEVEL DATA 
// //limited by subjects who finished the study
// db.BY_TRIAL.aggregate([  
//   //select relevant trials
//   {$match: {block: {$in: ["item_free", "effort", "demographics", "participant"] }}},
//   {$project: {
//       //every trial has subjectID
//       subject:1,
//       //store relevant trial level data in response object
//       response: { $switch: {
//         branches: [
//             { case: {$eq: ['$block', 'participant']} , then: {
//                 "subject" : "$subject",
//                 "study" : "$study",
//                 "condition" : "$condition",
//                 "session" : "$session",
//                 "browser" : "$browser" ,
//                 "width" : "$width" ,
//                 "height" : "$height" ,
//                 "os" : "$os" ,
//                 "starttime" : "$starttime" ,
//                 "totaltime" : "$totaltime" ,
//                 "violations" : "$violations" ,
//                 "absolute_score" : "$absolute_score" ,
//                 "discriminant_score" : "$discriminant_score" ,
//                 "tri_score" : "$tri_score" ,
//                 "orth_score" : "$orth_score" ,
//                 "other_score" : "$other_score" ,
//                 "blank_score" : "$blank_score",
//                 "exp_id" : "$exp_id",
//                 "sona_id" : "$sona_id",
//                 "pool" : "$pool",
//                 "mode" : "$mode",
//                 "status" : "$status" }},
//             { case: {$eq: ['$block', 'demographics']} , then: "$response" },
//             { case: {$eq: ['$block', 'effort']} , then: "$response" },
//             { case: {$eq: ['$block', 'item_free']} , then: {
//                 "explanation": "$freeresponse",
//                 //DELETE AFTER FIX PROD
//                 "exp_id" : "$exp_id",
//                 "sona_id" : "$sona_id",
//                 "pool" : "$pool",
//                 "mode" : "$mode" }}
//          ],
//          default: null
//       }},     
//   }},
//   //merge all response objects
//   {$group: { _id: "$subject", response: { $mergeObjects: "$response" } } },
//   //make response root
//   {$replaceRoot: { newRoot: "$response" }},
//   //get rid of dummy fields
//   {$project: {"P0_Q0":0, "P0_Q1":0, }},
//   //set id to subject
//   {$set: {_id : "$subject"}},
//   {$out: "final_participants"}
// ]);      


// //COLLECTION OF PARTICIPANT-LEVEL DATA 
// //limited by subjects who finished the study AND attention check
db.winter_22.aggregate([  
    //select relevant trials
    {$match: {"data.trials.status": {$in: ["success"] }}},  
    {$unwind: "$data"},
    {$replaceRoot: { newRoot: "$data" }},
    {$unwind: "$trials"},
    {$replaceRoot: { newRoot: "$trials" }},
    {$match: {block: {$in: ["item_free", "effort", "demographics", "participant","item_nondiscriminant"] }}},
    {$project: {
        //every trial has subjectID
        subject:1,
        //store relevant trial level data in response object
        response: { $switch: {
          branches: [
              { case: {$eq: ['$block', 'participant']} , then: {
                  "subject" : "$subject",
                  "study" : "$study",
                  "condition" : "$condition",
                  "session" : "$session",
                  "browser" : "$browser" ,
                  "width" : "$width" ,
                  "height" : "$height" ,
                  "os" : "$os" ,
                  "starttime" : "$starttime" ,
                  "totaltime" : "$totaltime" ,
                  "violations" : "$violations" ,
                  "absolute_score" : "$absolute_score" ,
                  "discriminant_score" : "$discriminant_score" ,
                  "tri_score" : "$tri_score" ,
                  "orth_score" : "$orth_score" ,
                  "other_score" : "$other_score" ,
                  "blank_score" : "$blank_score",
                  "exp_id" : "$exp_id",
                  "sona_id" : "$sona_id",
                  "pool" : "$pool",
                  "mode" : "$mode",
                  "status" : "$status" }},
              { case: {$eq: ['$block', 'demographics']} , then: "$response" },
              { case: {$eq: ['$block', 'effort']} , then: "$response" },
              { case: {$eq: ['$block', 'item_nondiscriminant']} , then: {
                  
                  $switch: {
                      branches: [
                          { case: {$eq: ['$q', 6]} , then: {
                                  "attn_check": "$correct" }}
                                  ], default: null}
                  }},
              { case: {$eq: ['$block', 'item_free']} , then: {
                  "explanation": "$freeresponse",
                  //DELETE AFTER FIX PROD
                  "exp_id" : "$exp_id",
                  "sona_id" : "$sona_id",
                  "pool" : "$pool",
                  "mode" : "$mode" }}
           ],
           default: null
        }},     
    }},
    //merge all response objects
    {$group: { _id: "$subject", response: { $mergeObjects: "$response" } } },
    //make response root
    {$replaceRoot: { newRoot: "$response" }},
    //get rid of dummy fields
    {$project: {"P0_Q0":0, "P0_Q1":0, }},
    //set id to subject
    {$set: {_id : "$subject"}},
    {$out: "final_participants"}
  ]);   

//SONA RECONCILIATION LIST
db.final_participants.aggregate([
    {$project:{
        _id:"$subject",
        subject:1,
        exp_id:1,
        sona_id:1,
        starttime:1,
        absolute_score:1,
        discriminant_score:1,
        status: 1
    }},
    {$out:"final_sona_data"}
]);

//CREATE A COLLECTION OF TEST ITEMS [with mouse data]
db.BY_TRIAL.aggregate([
    {$match: {block: {$in: ["item_scaffold","item_nondiscriminant","item_test"] }}},
    //supress unecessary fields
    {$project: {
        url: 0,
        trial_type: 0,
        trial_index:0,
        internal_node_id: 0
    }},
    {$out: "final_items_mouse"}
]);

//CREATE A COLLECTION OF TEST ITEMS [no mouse data]
db.final_items_mouse.aggregate([
    //suppress mouse-related data
    {$project: {
        response : 0,
        mouse_tracking_data:0,
        mouse_tracking_targets:0,
        mouselog:0
    }},
    {$out: "final_items"}
]);
 


