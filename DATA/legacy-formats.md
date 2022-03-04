# ITEMS 
## JSON

LEGACY ITEM
{
    "_id" : ObjectId("622023214e895c3605cb40fe"),
    "answer" : "be",
    "block" : "triangular_testing",
    "condition" : "321",
    "experiment" : "2YP3",
    "graph" : "triangular",
    "internal_node_id" : "0.0-9.0-0.0",
    "q" : 16,
    "rt" : 12946,
    "session" : "a15839275",
    "subject" : "9PELV",
    "time_elapsed" : 3607558,
    "trial_index" : 22,
    "trial_type" : "html",
    "url" : "../views/src/external/stimulus.html"
}

## DATAFRAME

Columns: 15

<provenance>
$ term         <chr> "fall17", "fall17", "fall17", "fall17", "fall17", "fall17", "fall17", "fall1…
$ mode         <chr> "lab", "lab", "lab", "lab", "lab", "lab", "lab", "lab", "lab", "lab", "lab",…
$ format       <chr> "legacy", "legacy", "legacy", "legacy", "legacy", "legacy", "legacy", "legac…

<identifiers>
$ subject      <chr> "3QO3J", "3QO3J", "3QO3J", "3QO3J", "3QO3J", "3QO3J", "3QO3J", "3QO3J", "3QO…
$ session      <chr> "bravo", "bravo", "bravo", "bravo", "bravo", "bravo", "bravo", "bravo", "bra…
$ condition    <int> 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 1…

$ explicit     <int> 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1…
$ impasse      <int> 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2…
$ axis         <chr> "full", "full", "full", "full", "full", "full", "full", "full", "full", "ful…

$ q            <int> 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1, 2, 3, 4, 5, 6, 7, 8, 9…
$ question     <chr> "starttime", "starts", "meets", "endtime", "midpoint", "duration", "duration

<responses>

$ answer       <chr> "F", "E", "K", "B", "J", "EG", "FB", "O", "I", "B", "FB", "B", "LH", "PLH", …
$ rt           <int> 17607, 16269, 17232, 22597, 10350, 6458, 27558, 15799, 13808, 9391, 7053, 54…

<scoring>
$ correct      <int> 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1…
$ orth_correct <int> 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0…













# PARTICIPANTS
## IN R 

Columns: 26

<provenance :: things added in R>
$ format           <chr> "legacy", "legacy", "legacy", "legacy", "legacy", "legacy", "legacy", "l…
$ mode             <chr> "lab", "lab", "lab", "lab", "lab", "lab", "lab", "lab", "lab", "lab", "l…
$ term             <chr> "fall17", "fall17", "fall17", "fall17", "fall17", "fall17", "fall17", "f…

<identifiers>
$ subject          <chr> "N53LC", "LJTDL", "5WPCV", "KBQPW", "KUHF1", "R8PM2", "OQB9V", "MABX4", …
$ session          <chr> "india", "foxtrot", "mike", "echo", "mike", "charlie", "kilo", "kilo", "…
$ condition        <int> 111, 121, 121, 121, 121, 111, 111, 121, 111, 111, 121, 111, 121, 121, 12…

#drop redundant subject-level fields, should be on item
$ explicit         <int> 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, …
$ impasse          <int> 1, 2, 2, 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 1, 1, …
$ axis             <chr> "full", "full", "full", "full", "full", "full", "full", "full", "full", …

#cast attn_check 1/0 to true/false
$ attn_check       <int> 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, …

<scoring>
#drop summary scoring by phase, should be done manually on items
$ ts_n             <int> 0, 4, 0, 1, 4, 0, 5, 3, 0, 5, 5, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 5, 1, 4, …
$ tt_n             <int> 2, 9, 2, 2, 10, 2, 10, 8, 2, 10, 8, 2, 8, 3, 1, 2, 2, 2, 2, 1, 2, 9, 6, …
$ os_n             <int> 4, 0, 0, 0, 0, 4, 0, 0, 5, 0, 0, 4, 0, 0, 0, 0, 0, 5, 5, 2, 0, 0, 2, 0, …
$ ot_n             <int> 10, 1, 10, 9, 2, 10, 2, 1, 8, 2, 1, 9, 1, 5, 7, 8, 10, 10, 10, 8, 7, 1, …

//save with new names and drop
$ triangular_score <int> 2, 13, 2, 3, 14, 2, 15, 11, 2, 15, 13, 2, 11, 4, 1, 2, 2, 2, 2, 1, 2, 14…
$ orthogonal_score <int> 14, 1, 10, 9, 2, 14, 2, 1, 13, 2, 1, 13, 1, 5, 7, 8, 10, 15, 15, 10, 7, …

<timing>
$ ts_t             <int> 248723, 349495, 597908, 200108, 159499, 169373, 94723, 152938, 253224, 1…
$ tt_t             <int> 330179, 286097, 321982, 472471, 186007, 192905, 176816, 270644, 257997, …

$ totalTime        <int> 736426, 930809, 1069788, 783246, 543814, 505184, 433045, 583213, 629994,…
$ triangular_time  <int> 578902, 635592, 919890, 672579, 345506, 362278, 271539, 423582, 511221, …


<demographics>
$ country          <chr> "US", "USA", "United States of America", "United States", "United States…
$ native_language  <chr> "English", "English", "English", "English", "English", "English", "Engli…
$ sex              <chr> "Female", "Male", "Male", "Male", "Male", "Female", "Female", "Male", "M…
$ year             <chr> "Fourth", "First", "First", "Fifth", "First", "Third", "Second", "Third"…
$ age              <int> 21, 18, 18, 27, 19, 20, 19, 20, 20, 22, 18, 22, 19, 19, 33, 25, 20, 19, …
$ major            <chr> "Social Sciences (incl. CogSci)", "Engineering", "Social Sciences (incl






$ absolute_score
$ discriminant_score
$ tri_score
$ orth_score
$ other_score
$ blank_score
$ start_time
$ totaltime


$ starttime          
$ totaltime          
$ absolute_score     
$ discriminant_score 
$ tri_score          
$ orth_score         
$ other_score        
$ blank_score        
            







