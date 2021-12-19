//STEP 0: Import all session files into the ALL_RAW collection
//(ie. using mongoimport)
//mongoimport --collection=ALL_RAW --db=XSPRING2018 --file=Wextra.json

//STEP 0: UNRAVEL BLOCKS ////////////////////////////////////////////////////////
//Create a FLAT collection of ALL BLOCKS ----------> wip_1_ALL_Blocks
db.fall_wip.aggregate(
 [
    {$unwind: "$data"},
    {$replaceRoot: { newRoot: "$data" }},
    {$out: "ALL_BLOCKS"}
]);

//STEP 1: DISCLUDE SUBJECTS BASED ON ATTENTION CHECK     
// Create a collection of all disclused subjects ---------> wip_1_ALL_discluded
// Check the value of the duration question. If that question is wrong, subject is discluded 
db.ALL_BLOCKS.aggregate([
    { $match:{
        "$and":[ 
            { "question": "duration" },
            { "correct": 0} ] 
        }},
     { $project :
        {
            "subject":1,
            "answer": {
                $reduce: {
                    input: "$answer",
                    initialValue: "",
                    in: { $concat: [ "$$value","$$this" ] }
                }
              },
            "correct":1,
            "orth_correct":1
        }},
         {$out: "wip_1_Subjects_discluded"}  
    ])            
         
// SUBJECTS TO EXCLUDE FROM FURTHER FILES 
var lazies = db.wip_1_Subjects_discluded.distinct("subject");
   print(lazies);


// STEP 2: CREATE COLLECTION OF BLOCKS WITH ANSWERS UNRAVELLED [X_blocks, X_mouse_blocks]

// 2.1 Unravel free response blocks (no mouse data)       
db.ALL_BLOCKS.aggregate(
 [
    {$match: {"$and":[ 
           { "subject": {$nin: lazies }},
           { "q":16}]}
     },   
    {$out: "wip_2_Blocks_free"}
]);

// 2.2 Unravel multiple choice blocks (no mouse data) 
db.ALL_BLOCKS.aggregate([
    { $match:{
        "$and":[ 
            { "subject": {$nin: lazies }},
            { "q": {$nin:[16] }},
            { "block": {$in: ["triangular_scaffolded","triangular_testing"] }}
        ]}},
     { $project :
        {
            "subject":1,
            "answer": {
                $reduce: {
                    input: "$answer",
                    initialValue: "",
                    in: { $concat: [ "$$value","$$this" ] }
                }
              },
            "condition":1,
            "session":1,
            "clicks":1,
            "rt":1,
            "question":1,
            "q":1,
            "axis":1,
            "impasse":1,
            "explicit":1,
            "correct":1,
            "orth_correct":1
        }},
         {$out: "wip_2_Blocks_mc"}  
    ])    

// 2.3 Unravel multiple choice blocks (WITH mouse data) 
db.ALL_BLOCKS.aggregate([
    { $match:{
        "$and":[ 
           { "subject": {$nin: lazies }},
           { "q": {$nin:[16] }},
            { "block": {$in: ["triangular_scaffolded","triangular_testing"] }}
        ]}},
     { $project :
        {
            "subject":1,
            "answer": {
                $reduce: {
                    input: "$answer",
                    initialValue: "",
                    in: { $concat: [ "$$value","$$this" ] }
                }
              },
                "condition":1,
            "session":1,
            "rt":1,
            "question":1,
            "q":1,
            "axis":1,
            "impasse":1,
            "explicit":1,
            "correct":1,
            "orth_correct":1,
            "mouseLog":1,
            "hovered":1
        }
    },
     {$out: "wip_2_Blocks_mc_mouse"}
 ]);

// 2.4 Create final block level ouptput (NO mouse data) 
//merge both free response and MC blocks into single file 
db.X_blocks.drop()
db.wip_2_Blocks_free.aggregate([ {$match: { "subject": {$nin: lazies }}},{ $merge: { into: "X_blocks" } } ]) ;
db.wip_2_Blocks_mc.aggregate([ {$match: { "subject": {$nin: lazies }}},{ $merge: { into: "X_blocks" } } ]) ;

// 2.5 Create final block level ouptput (WITH MOUSE data) 
db.wip_2_Blocks_mc_mouse.aggregate([ {$match: { "subject": {$nin: lazies }}},{ $merge: { into: "X_blocks_mouse" } } ]) ;


// STEP 3: CREATE COLLECTION OF PARTICIPANTS WITH DEMOGRAPHICS UNVRAVELLED  [X_participants]

// 3.1 Filter just testing blocks, and count triangular vs orthogonal corrects to summarize scores
// ts_n [triangular scaffolded number] 
// tt_n [triangular testing number] 

db.ALL_BLOCKS.aggregate([
     { $match:{
        "$and":[ 
           { "subject": {$nin: lazies }},
           { "block": {$in: ["triangular_scaffolded","triangular_testing"] }}
        ]}},
   
    {$project: {
       subject:1,
       block:1,
       condition:1,
       axis : 1,
       impasse: 1,
       explicit: 1,
       session:1,
       time_elapsed :1,
       ts_n: { $cond: { if: {$eq: ['$block', 'triangular_scaffolded']} , then: "$correct", else: null } },
       ts_t: { $cond: { if: {$eq: ['$block', 'triangular_scaffolded']} , then: "$rt", else: null } },
       tt_t: { $cond: { if: {$eq: ['$block', 'triangular_testing']} , then: "$rt", else: null } },
       tt_n: { $cond: { if: {$eq: ['$block', 'triangular_testing']} , then: "$correct", else: null } },
       os_n:  { $cond: { if: {$eq: ['$block', 'triangular_scaffolded']} , then: "$orth_correct", else: null } },
       ot_n:  { $cond: { if: {$eq: ['$block', 'triangular_testing']} , then: "$orth_correct", else: null } },
       attn_check: { $cond: { if: {$eq: ['$question', 'duration']} , then: "$correct", else: null } }
       }}
       ,
    {$group: {
       _id:"$subject",
       session: {$first:"$session"},
       condition: {$first:"$condition"},
       axis: {$first:"$axis"},
       impasse: {$first:"$impasse"},
       explicit: {$first:"$explicit"},
       ts_n: {$sum: "$ts_n"},
       tt_n: {$sum: "$tt_n"},
       ts_t: {$sum: "$ts_t"},
       tt_t: {$sum: "$tt_t"},
       os_n: {$sum: "$os_n"},
       ot_n: {$sum: "$ot_n"},
       totalTime: {$max:"$time_elapsed"},
       attn_check: {$sum:"$attn_check"}
      }}
      ,
    {$project: {
      _id:"$subject",
      subject:"$_id",
      session: 1,
      condition: 1,
      axis : 1,
      impasse: 1,
      explicit: 1,
      ts_n: 1,
      tt_n: 1,
      ts_t: 1,
      tt_t: 1,
      os_n: 1,
      ot_n: 1,
      orthogonal_score: {$add: ["$os_n","$ot_n"]},
      triangular_score: {$add: ["$ts_n","$tt_n"]},
      triangular_time: {$add: ["$ts_t","$tt_t"]},
      totalTime: 1,
      attn_check:1
     }}    ,
    {$out: "wip_3_Subjects_scores"}
]);

// 3.2 Unravel demographics for demo question #1 
db.ALL_BLOCKS.aggregate([
    
     { $match:{
        "$and":[ 
           { "subject": {$nin: lazies }},
           { "block": {$in: ["demo-1"] }}
        ]}},
    {$project: {
       subject:1,
       block:1,
       condition:1,
       axis : 1,
       impasse: 1,
       explicit: 1,
       session:1,
       time_elapsed :1,
       "demo1": "$responses"
       }},
    {$out: "wip_3_Subjects_demo1"}
])

// 3.3 Unravel demographics for demo question #2 
db.ALL_BLOCKS.aggregate([
    { $match:{
        "$and":[ 
           { "subject": {$nin: lazies }},
           { "block": {$in: ["demo-2"] }}
        ]}},
    {$project: {
       subject:1,
       block:1,
       condition:1,
       axis : 1,
       impasse: 1,
       explicit: 1,
       session:1,
       time_elapsed :1,
       "demo2": "$responses"
       }},
    {$out: "wip_3_Subjects_demo2"}
])

// 3.4 Combine demographics questions into single collection by subjects 
db.wip_3_Subjects_demo1.aggregate([ { $match: {} }, { $merge: { into: "wip_3_Subjects_demoDouble" } } ]) 
db.wip_3_Subjects_demo2.aggregate([ { $match: {} }, { $merge: { into: "wip_3_Subjects_demoDouble" } } ])     

// 3.5 Group up demographics collection by subject, and separate demo questions 
db.wip_3_Subjects_demoDouble.aggregate([
   {$group: {
       _id:"$subject",
       subject:{$first:"$subject"},
       demo1:{$first:"$demo1"},
       demo2:{$last:"$demo2"}
      }},
    
      { $project : {
         _id:"$subject", 
          subject:1,
          demo1 : { $split: ["$demo1", ","] },
          demo2 : { $split: ["$demo2", ","] }
      }},     
      
     { $project : { 
         _id:"$subject", 
         subject:1,
            age: {"$arrayElemAt": ["$demo1",0]},
            country: {"$arrayElemAt": ["$demo1",1]},
            native_language: {"$arrayElemAt": ["$demo2",0]},
            year: {"$arrayElemAt": ["$demo2",1]},
            major: {"$arrayElemAt": ["$demo2",2]},
            sex: {"$arrayElemAt": ["$demo2",3]}
       }},
   
     { $project : { 
         _id:"$subject", 
         subject:1,
            age: { $split: ["$age", ":"] },
            country: { $split: ["$country", ":"] },
            native_language: { $split: ["$native_language", ":"] },
            year: { $split: ["$year", ":"] },
            major: { $split: ["$major", ":"] },
            sex: { $split: ["$sex", ":"] }
       }},
       
      { $project : { 
         _id:"$subject", 
          subject:1,
           age: {"$arrayElemAt": ["$age",1]},
           native_language: {"$arrayElemAt": ["$native_language",1]},
                   year: {"$arrayElemAt": ["$year",1]},
                   major: {"$arrayElemAt": ["$major",1]},   
                   sex: {"$arrayElemAt": ["$sex",1]},
                   country: {"$arrayElemAt": ["$country",1] }
      }}, 
      
      { $project : {
           _id:"$subject", 
            subject:1,
                native_language: 1,
                year: 1,
                major: 1,
                age:1,
                sex: { $split: ["$sex", "}"] },
                country: { $split: ["$country", "}"] }}
       },
        
       { $project : {
          _id:"$subject", 
          subject:1,
          native_language: 1,
          year: 1,
          major: 1,
          age:1,
          sex: {"$arrayElemAt": ["$sex",0]},
          country: {"$arrayElemAt": ["$country",0] }
      }},
           
    {$out: "wip_3_Subjects_demoAll"}
])
 
// 3.6 MERGE subject demographics and scores 
// if (db.wip_3_Subjects_demoAll.count() == db.wip_3_Subjects_scores.count()) {
    db.X_participants.drop()
    db.wip_3_Subjects_scores.aggregate([ { $match: {} }, { $merge: { into: "X_participants" } } ])     
    db.wip_3_Subjects_demoAll.aggregate([ { $match: {} }, { $merge: { into: "X_participants" } } ]) 
//  } else {print( "ERROR STEP 3.6")}

//3.7 REDUCE duplicates 
db.X_participants.aggregate([
   {$group: {
       _id:"$subject",
       subject:{$first:"$subject"},
        session:{$first:"$session"},
        attn_check:{$first:"$attn_check"},
        axis:{$first:"$axis"},
        condition:{$first:"$condition"},
        explicit:{$first:"$explicit"},
        impasse:{$first:"$impasse"},
        orthogonal_score:{$first:"$orthogonal_score"},
        os_n:{$first:"$os_n"},
        ot_n:{$first:"$ot_n"},
        totalTime:{$first:"$totalTime"},
        triangular_score:{$first:"$triangular_score"},
        triangular_time:{$first:"$triangular_time"},
        ts_n:{$first:"$ts_n"},
        ts_t:{$first:"$ts_t"},
        tt_n:{$first:"$tt_n"},
        tt_t:{$first:"$tt_t"},
        native_language: {$last:"$native_language"},
        year: {$last:"$year"},
        major: {$last:"$major"},
        age:{$last:"$age"},
        sex: {$last:"$sex"},
        country:{$last:"$country"}}},
    {$out: "X_participants"}
]);

//TEST DISCLUSION LOGIC 
db.X_participants.count() + db.wip_1_Subjects_discluded.count() == db.ALL_RAW.count()