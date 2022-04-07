
//after having imported all session.json files into the x_all_documents collection, first flatten and create the x_all_blocks collection
//this aggregation flattens the structure and creates a collection of x_all_blocks with the block as the root. 

//CREATE A FLAT COLLECTION OF ALL BLOCKS
// db.x_all_documents.aggregate(
//  [ 
//     {$unwind: "$data"},
//     {$replaceRoot: { newRoot: "$data" }},
//     {$out: "_all_blocks"}
// ]);  

//CREATE A SUMMARIZED COLLECTION OF ALL PARTICIPANTS
db.getCollection('_all_blocks').aggregate([
    {$match: {"block": {$in: ["demo-1","demo-2","linear_scaffolded","linear_testing","triangular_scaffolded","triangular_testing","drawingTest","instructions_drawing"]} }},
    {$project: {
       subject:1, 
       block:1,
       experiment:1,
       condition:1,
       session:1,
       time_elapsed :1,
       ls_n: { $cond: { if: {$eq: ['$block', 'linear_scaffolded']} , then: "$correct", else: null } },
       ls_t: { $cond: { if: {$eq: ['$block', 'linear_scaffolded']} , then: "$rt", else: null } },
       lt_n: { $cond: { if: {$eq: ['$block', 'linear_testing']} , then: "$correct", else: null } },
       lt_t: { $cond: { if: {$eq: ['$block', 'linear_testing']} , then: "$rt", else: null } },
       ts_n: { $cond: { if: {$eq: ['$block', 'triangular_scaffolded']} , then: "$correct", else: null } },
       ts_t: { $cond: { if: {$eq: ['$block', 'triangular_scaffolded']} , then: "$rt", else: null } },
       tt_t: { $cond: { if: {$eq: ['$block', 'triangular_testing']} , then: "$rt", else: null } },
       tt_n: { $cond: { if: {$eq: ['$block', 'triangular_testing']} , then: "$correct", else: null } },
       d_n: { $cond: { if: {$eq: ['$block', 'drawingTest']} , then: "$correct", else: null } },
       d_t: { $cond: { if: {$eq: ['$block', 'drawingTest']} , then: "$rt", else: null } },
       draw_t: { $cond: { if: {$eq: ['$block', 'instructions_drawing']} , then: "$rt", else: null } },
       demos: "$responses"
      }
    },
    {$group: {
       _id:"$subject",
       experiment: {$first:"$experiment"},
       session: {$first:"$session"},
       condition: {$first:"$condition"},
       demos: {$addToSet: "$demos"},
       ls_n: {$sum: "$ls_n"},
       lt_n: {$sum: "$lt_n"},
       ts_n: {$sum: "$ts_n"},
       tt_n: {$sum: "$tt_n"},
       d_n: {$sum: "$d_n"},
       ls_t: {$sum: "$ls_t"},
       lt_t: {$sum: "$lt_t"},
       ts_t: {$sum: "$ts_t"},
       tt_t: {$sum: "$tt_t"},
       d_t: {$sum: "$d_t"},
       totalTime: {$max:"$time_elapsed"}
      }},
    {$project: {
      _id:"$subject",
      subject:"$_id",
      experiment: 1,
      session: 1,
      condition: 1,
      demo1: {"$arrayElemAt": ["$demos",0]},
      demo2: {"$arrayElemAt": ["$demos",1]},  
      totalScore:{ $sum: { $add: ["$ls_n","$lt_n","$ts_n","$tt_n","$d_n"]}}, 
      ls_n: 1,
      lt_n: 1,
      ts_n: 1,
      tt_n: 1,
      d_n: 1,
      ls_t: 1,
      lt_t: 1,
      ts_t: 1,
      tt_t: 1,
      d_t: 1,  
      totalTime: 1
     }},
     {$out: "_all_participants"}
]);

