//STATUS.JS ———————————————————————————————————————————————————
//run against production (server) database to get counts of 
//participants per condition that have valid data
// —————————————————————————————————————————————————————————————

//CREATE A COLLECTION WITH STATUS BY STUDY, AND CONDITION
db.entries.aggregate([
        //unwind participant 
        {$unwind: "$data"},
        {$replaceRoot: { newRoot: "$data" }},
        //unwind trials
        {$unwind: "$trials"},
        {$replaceRoot: { newRoot: "$trials" }},
        //filter trials 
        {$match: {block: {$in: ["participant"] }}},
        //filter status
        // {$match: {status: {$in: ["success"] }}},
        {$group: {
            _id: {
                study: "$study",
                condition:"$condition",
                status: "$status"
            },
                count: { $count: {} },
                av_discriminant: { $avg: "$discriminant_score" },
                sd_discriminant: { $stdDevSamp: "$discriminant_score" },
                min_discriminant: { $min: "$discriminant_score" },
                max_discriminant: { $max: "$discriminant_score" },
                av_absolute: { $avg: "$absolute_score" },    
                av_tri: { $avg: "$tri_score" },    
                av_orth: { $avg: "$orth_score" },    
                av_other: { $avg: "$other_score" }    
        }},
        {$project: {
            _id : {$concat:["$_id.study","—","$_id.condition","$_id.status"]},
            count: 1,
            av_discriminant: 1,
            sd_discriminant: 1,
            min_discriminant: 1,
            max_discriminant: 1,
            av_absolute: 1,
            av_tri: 1,
            av_orth: 1,
            av_other: 1
        }},
        {$out: "_status"}
    ]);


//CREATE A COLLECTION WITH SONA STUDENTS TO GIVE EXCUSED NO-SHOWS
db.entries.aggregate([
        //unwind participant 
        {$unwind: "$data"},
        {$replaceRoot: { newRoot: "$data" }},
        //unwind trials
        {$unwind: "$trials"},
        {$replaceRoot: { newRoot: "$trials" }},
        //filter trials 
        {$match: {block: {$in: ["participant","interaction"] }}},
        //filter status
        {$match: {status: {$nin: ["success"] }}},
        {$group: {
            _id: { $concat: ["$sona_id","-","$subject"]},
            date : { $first : "$starttime"},
            source: { $first : "$source"},
            }},
        {$out: "_sona_fail"}

]);    