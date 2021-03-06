

//CREATE A COLLECTION OF ALL SESSIONS
//NOTE! The db.copyTo() function is now deprecated, and I can't figure out how to [simply!] join all the separate collections into 1, so instead, I'm changing 
//the import process to import into one collection, which I'll call all_sessions <-- should fix this, eventually, but don't want to futz with JS at the moment

db.createCollection("all_sessions");

//add each session file as they come in, into a single collection
db.getCollection('alfa-bravo-charlie').aggregate([ { $match: {} }, { $merge: { into: "all_sessions" } } ]) 
db.getCollection('delta').aggregate([ { $match: {} }, { $merge: { into: "all_sessions" } } ]) 
db.getCollection('charlie').aggregate([ { $match: {} }, { $merge: { into: "all_sessions" } } ]) 
db.getCollection('echo').aggregate([ { $match: {} }, { $merge: { into: "all_sessions" } } ]) 
db.getCollection('foxtrot').aggregate([ { $match: {} }, { $merge: { into: "all_sessions" } } ]) 
db.getCollection('golf').aggregate([ { $match: {} }, { $merge: { into: "all_sessions" } } ]) 
db.getCollection('hotel').aggregate([ { $match: {} }, { $merge: { into: "all_sessions" } } ]) 
db.getCollection('india-juliet-kilo-lima').aggregate([ { $match: {} }, { $merge: { into: "all_sessions" } } ]) 
db.getCollection('mike').aggregate([ { $match: {} }, { $merge: { into: "all_sessions" } } ]) 
db.getCollection('november-EXTRA').aggregate([ { $match: {} }, { $merge: { into: "all_sessions" } } ]) 

// db.getCollection('W7').aggregate([ { $match: {} }, { $merge: { into: "all_sessions" } } ]) 
// db.getCollection('W8').aggregate([ { $match: {} }, { $merge: { into: "all_sessions" } } ]) 
// db.getCollection('W8M').aggregate([ { $match: {} }, { $merge: { into: "all_sessions" } } ]) 
// db.getCollection('W8T').aggregate([ { $match: {} }, { $merge: { into: "all_sessions" } } ]) 

// db.getCollection('extra').aggregate([ { $match: {} }, { $merge: { into: "all_sessions" } } ]) 

//CREATE A FLAT COLLECTION OF ALL BLOCKS -----------> all_blocks
db.all_sessions.aggregate(
 [
    {$unwind: "$data"},
    {$replaceRoot: { newRoot: "$data" }},
    {$out: "all_blocks"}
]);

//CREATE A FLAT COLLECTION OF ALL QUESTION BLOCKS WITHOUT MOUSE DATA -----------> all_test_blocks
db.all_sessions.aggregate(
 [
    {$unwind: "$data"},
    {$match: { "data.block": {$in: ["triangular_scaffolded","triangular_testing"] }}},
    {$replaceRoot: { newRoot: "$data" }},
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
            "orth_correct":1
        }
    },
    {$out: "all_test_blocks"}
]);

//CREATE A FLAT COLLECTION WITH ALL MOUSE DATA  -----------> all_test_blocks_mouse
db.all_sessions.aggregate(
 [
    {$unwind: "$data"},
    {$match: { "data.block": {$in: ["triangular_scaffolded","triangular_testing"] }}},
    {$replaceRoot: { newRoot: "$data" }},
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
    {$out: "all_test_blocks_mouse"}
]);

//CREATE A SUMMARIZED COLLECTION OF ALL PARTICIPANTS -----------> all_participants
//TODO: remove the attention check fails
db.getCollection('all_blocks').aggregate([
    {$match: {"block": {$in: ["triangular_scaffolded","triangular_testing","demo-1","demo-2","debrief"]} }},
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
       attn_check: { $cond: { if: {$eq: ['$question', 'duration']} , then: "$correct", else: null } },
       demos: "$responses"
      }
    },
    {$group: {
       _id:"$subject",
       session: {$first:"$session"},
       condition: {$first:"$condition"},
       axis: {$first:"$axis"},
       impasse: {$first:"$impasse"},
       explicit: {$first:"$explicit"},
       demos: {$addToSet: "$demos"},
       ts_n: {$sum: "$ts_n"},
       tt_n: {$sum: "$tt_n"},
       ts_t: {$sum: "$ts_t"},
       tt_t: {$sum: "$tt_t"},
       os_n: {$sum: "$os_n"},
       ot_n: {$sum: "$ot_n"},
       totalTime: {$max:"$time_elapsed"},
       attn_check: {$sum:"$attn_check"}
      }},
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
      demo1: {"$arrayElemAt": ["$demos",0]},
      demo2: {"$arrayElemAt": ["$demos",1]},
      attn_check:1
     }},
    {$out: "all_participants"}
]);

//CLEAN UP demographics demographics
db.getCollection('all_participants').aggregate([
    { $project : { demos1 : { $split: ["$demo1", ","] },
                   demos2 : { $split: ["$demo2", ","] },
                   subject : 1,
                   session : 1,
                   condition : 1,
                   axis : 1,
                   impasse : 1,
                   explicit : 1,
                   ts_n : 1,
                   tt_n : 1,
                   os_n : 1,
                   ot_n : 1,
                   orthogonal_score : 1,
                   ts_t : 1,
                   tt_t : 1,
                   totalTime : 1,
                   attn_check : 1,
                   subject : 1,
                   triangular_score : 1,
                   triangular_time : 1,
                   }
    },
    { $project : { native_language: {"$arrayElemAt": ["$demos1",0]},
                   year: {"$arrayElemAt": ["$demos1",1]},
                   major: {"$arrayElemAt": ["$demos1",2]},
                   sex: {"$arrayElemAt": ["$demos1",3]},
                   age: {"$arrayElemAt": ["$demos2",0]},
                   country: {"$arrayElemAt": ["$demos2",1]},
                   subject : 1,
                   session : 1,
                   condition : 1,
                   axis : 1,
                   impasse : 1,
                   explicit : 1,
                   ts_n : 1,
                   tt_n : 1,
                   os_n : 1,
                   ot_n : 1,
                   orthogonal_score : 1,
                   ts_t : 1,
                   tt_t : 1,
                   totalTime : 1,
                   attn_check : 1,
                   subject : 1,
                   triangular_score : 1,
                   triangular_time : 1,
                  }
    },
    { $project : { native_language: { $split: ["$native_language", ":"] },
                   year: { $split: ["$year", ":"] },
                   major: { $split: ["$major", ":"] },
                   sex: { $split: ["$sex", ":"] },
                   age: { $split: ["$age", ":"] },
                   country: { $split: ["$country", ":"] },
                   subject : 1,
                   session : 1,
                   condition : 1,
                   axis : 1,
                   impasse : 1,
                   explicit : 1,
                   ts_n : 1,
                   tt_n : 1,
                   os_n : 1,
                   ot_n : 1,
                   orthogonal_score : 1,
                   ts_t : 1,
                   tt_t : 1,
                   totalTime : 1,
                   attn_check : 1,
                   subject : 1,
                   triangular_score : 1,
                   triangular_time : 1,
                   }
    },
    { $project : { native_language: {"$arrayElemAt": ["$native_language",1]},
                   year: {"$arrayElemAt": ["$year",1]},
                   major: {"$arrayElemAt": ["$major",1]},
                   sex: {"$arrayElemAt": ["$sex",1]},
                   age: {"$arrayElemAt": ["$age",1]},
                   country: {"$arrayElemAt": ["$country",1]},
                   subject : 1,
                   session : 1,
                   condition : 1,
                   axis : 1,
                   impasse : 1,
                   explicit : 1,
                   ts_n : 1,
                   tt_n : 1,
                   os_n : 1,
                   ot_n : 1,
                   orthogonal_score : 1,
                   ts_t : 1,
                   tt_t : 1,
                   totalTime : 1,
                   attn_check : 1,
                   subject : 1,
                   triangular_score : 1,
                   triangular_time : 1,
                  }
    },
    { $project : { native_language: 1,
                   year: 1,
                   major: 1,
                   sex: { $split: ["$sex", "}"] },
                   age: { $split: ["$age", "\""] },
                   country: { $split: ["$country", "}"] },
                   subject : 1,
                   session : 1,
                   condition : 1,
                   axis : 1,
                   impasse : 1,
                   explicit : 1,
                   ts_n : 1,
                   tt_n : 1,
                   os_n : 1,
                   ot_n : 1,
                   orthogonal_score : 1,
                   ts_t : 1,
                   tt_t : 1,
                   totalTime : 1,
                   attn_check : 1,
                   subject : 1,
                   triangular_score : 1,
                   triangular_time : 1,
                   }
    },
      { $project : {
                   native_language: 1,
                   year: 1,
                   major: 1,
                   sex: {"$arrayElemAt": ["$sex",0]},
                   age: {"$arrayElemAt": ["$age",1]},
                   country: {"$arrayElemAt": ["$country",0]},
                   subject : 1,
                   session : 1,
                   condition : 1,
                   axis : 1,
                   impasse : 1,
                   explicit : 1,
                   ts_n : 1,
                   tt_n : 1,
                   os_n : 1,
                   ot_n : 1,
                   orthogonal_score : 1,
                   ts_t : 1,
                   tt_t : 1,
                   totalTime : 1,
                   attn_check : 1,
                   subject : 1,
                   triangular_score : 1,
                   triangular_time : 1,
                  }
    },
    { $project : {
                   native_language: { $split: ["$native_language", "\""] },
                   year: { $split: ["$year", "\""] },
                   major: { $split: ["$major", "\""] },
                   sex: { $split: ["$sex", "\""] },
                   age: { $split: ["$age", "\""] },
                   country: { $split: ["$country", "\""] },
                   subject : 1,
                   session : 1,
                   condition : 1,
                   axis : 1,
                   impasse : 1,
                   explicit : 1,
                   ts_n : 1,
                   tt_n : 1,
                   os_n : 1,
                   ot_n : 1,
                   orthogonal_score : 1,
                   ts_t : 1,
                   tt_t : 1,
                   totalTime : 1,
                   attn_check : 1,
                   subject : 1,
                   triangular_score : 1,
                   triangular_time : 1,
                  }
    },
     { $project : {
                   native_language: {"$arrayElemAt": ["$native_language",1]},
                   year: {"$arrayElemAt": ["$year",1]},
                   major: {"$arrayElemAt": ["$major",1]},
                   sex: {"$arrayElemAt": ["$sex",1]},
                   age: {"$arrayElemAt": ["$age",0]},
                   country: {"$arrayElemAt": ["$country",1]},
                   subject : 1,
                   session : 1,
                   condition : 1,
                   axis : 1,
                   impasse : 1,
                   explicit : 1,
                   ts_n : 1,
                   tt_n : 1,
                   os_n : 1,
                   ot_n : 1,
                   orthogonal_score : 1,
                   ts_t : 1,
                   tt_t : 1,
                   totalTime : 1,
                   attn_check : 1,
                   subject : 1,
                   triangular_score : 1,
                   triangular_time : 1,
                  }
    },
    { $out: "all_participants"}
]);
//CREATE A COLLECTION OF ALL discluded subjects -----------> all_discluded
db.getCollection('all_blocks').aggregate([
    {$match: {"question": "duration",
              "correct":0
        } },
    {$project:
        {"subject":1}},
    {$out: "all_discluded"}
]);


var lazies = db.all_discluded.distinct("subject");
   print(lazies);

//CREATE A COLLECTION OF ALL VALID subjects -----------> x_final_participants FOR ANALYSIS
db.getCollection('all_participants').aggregate([
    {$match: { "subject": {$nin: lazies }}},
    {$out: "x_final_participants"}
]);

//CREATE A COLLECTION OF ALL VALID test blocks -----------> x_final_blocks FOR ANALYSIS
db.getCollection('all_test_blocks').aggregate([
    {$match: { "subject": {$nin: lazies }}},
    {$out: "x_final_blocks"}
]);

//CREATE A COLLECTION OF ALL VALID test blocks with mouse-----------> x_final_blocks_mouse FOR ANALYSIS
db.getCollection('all_test_blocks_mouse').aggregate([
    {$match: { "subject": {$nin: lazies }}},
    {$project: { _id : 0 } },
    {$out: "x_mouse_blocks"}
]);
