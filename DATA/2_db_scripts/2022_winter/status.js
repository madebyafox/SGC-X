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
        {$match: {status: {$in: ["success"] }}},
        //filter status
        // {$match: {status: {$in: ["success"] }}},
        {$group: {
            _id: {
                study: "$study",
                condition:"$condition",
                },
//              n: { $count: {} } //stopped working?
                n: { $sum: 1 },
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
             _id : {$concat:["$_id.study","—","$_id.condition","-",{$toString:"$n"}]},
            n: 1,
            av_discriminant: 1,
            sd_discriminant: 1,
            min_discriminant: 1,
            max_discriminant: 1,
            av_absolute: 1,
            av_tri: 1,
            av_orth: 1,
            av_other: 1
       }},
        {$sort:{ _id: 1}},
        {$out: "_success"}

    ]);
        
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
        {$match: {status: {$nin: ["success"] }}},
        {$group: {
            _id: {
                study: "$study",
                condition:"$condition",
                status: "$status"
                },
//              n: { $count: {} } //stopped working?
                n: { $sum: 1 },
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
             _id : {$concat:["$_id.study","—","$_id.condition","-","$_id.status","-",{$toString:"$n"}]},
            n: 1,
            av_discriminant: 1,
            sd_discriminant: 1,
            min_discriminant: 1,
            max_discriminant: 1,
            av_absolute: 1,
            av_tri: 1,
            av_orth: 1,
            av_other: 1
       }},
        {$sort: {_id:1}} ,
        {$out: "_fail"}
    ]);
       







//CREATE A COLLECTION WITH SONA STUDENTS TO GIVE EXCUSED NO-SHOWS
db.entries.aggregate([
    //filter on status
    {$match: {"data.trials.status": {$nin: ["success"] }}},
    //unwind participant 
    {$unwind: "$data"},
    {$replaceRoot: { newRoot: "$data" }},
    //unwind trials
    {$unwind: "$trials"},
    {$replaceRoot: { newRoot: "$trials" }},
    //filter trials 
    {$match: {block: {$in: ["participant","browser_check"] }}},    
    {$project: {
        _id: { $concat: ["SONA ID: ","$sona_id"]},
        response: { $switch: {
            branches: [
                {case: {$eq: ['$block','browser_check']}, then: {
                    "browser"  : "$browser",
                    "mobile"  : "$mobile",
                    "width"  : "$width",
                    "height"  : "$height",
                    "os"  : "$os"
                }},
                {case: {$eq: ['$block','participant']}, then: {
                    "status"  : "$status",
                    "study"  : "$study",
                    "condition"  : "$condition",
                    "source"  : "$source",
                    "starttime"  : "$starttime"
                }},
            ],
            default: null}}
    }},
    //merge all response objects
    {$group: { _id: "$_id", response: { $mergeObjects: "$response" } } },
    //flatten response object
    {$project: {
        _id: "$_id",
        status:  "$response.status",
        study: "$response.study",
        condition:  "$response.condition",
        subject:  "$response.subject",
        starttime:  "$response.starttime",
        os:  "$response.os",
        browser: "$response.browser",
        mobile:  "$response.mobile",
        width: "$response.width",
        height:  "$response.height"
    }},
    {$out: "_sona_fail"}

]);    
