# SGC X 

# DEPLOY LOG
02.22.22 : deploy SGCX working for SGC3 (synch, asynch, pool = sona )


Important Changes from SGC3A/B prior to winter 2022
- upgraded to new version of jsPsych (v7) with multiple API changes 
- moved most condition-contingent logic out of stimulus and graphs.js into experiment.js
- pass data to stimulus.html via a hidden <data> element that populates based on data: in trial, based on customized version of external-html plugin (customized by me:)
- numerous URV vars added for customization 
- auto assign credit to sona if configured via exp_id

DATA CHANGES
- previously, IMPASSE, EXPLICIT were recorded at the condition level, not the item level. So a non-scaffolded question 6 still had an impasse == 2 if the person was in condition 121. Now, the impasse attribute on each item reflects whether that iTEM had an impasse structure 
- STRUCTURE of the stimulus is always determined by the condition, unless condition is not defined 


//REFERENCE-----------------------------------------------------------
// @URL VARS   
// study= [SGC3A, SGC3B ..]
// session= [freetext] //default blank
// mode = "synch" || "asynch" //default asynch
// pool = ? //default sona
// exp_id = ? //survey code in sona for deciding which study to grant credit to 
// SONA STUDY 21JH01 = 2218
// sona_id = ? //survey code from SONA for automatically granting credit [only for asynch study types]
// q = [1...15] //jump to question
// condition = (min 3 digit, see below)  

    //CONDITION
    //    [EXPLICIT] [IMPASSE] [GRID] [MARK] [IXN]

    //EXPLICIT SCAFFOLD
    //    1 = none (control)
    //    2 = static image
    //    3 = interactive image 

    //IMPASSE SCAFFOLD
    //    1 = none (control)
    //    2 = impasse 
    
    //GRID SCAFFOLD
    //    1 = orthog y(full) x(tri) [control] Orthogonal-XInside-YFull
    //    2 = orthog y(partial) x(tri) [ignore] Orthogonal-XInside-YPartial
    //    3 = tri y(tri) x(tri) [minimal] Triangular-XInside-YInside
    //    4 = orthog y(partial) x(tri) [original] Orthogonal-XInside-YInside
    //    5 = orthog y(full) x(full) [maximal] Orthogonal-XFull-YFull

    //MARK SCAFFOLD
    //    1 = point
    //    2 = triangle
    //    3 = cross

    //IXN TYPE
    //    1 = none
    //    2 = //
    //    3 = //
    //    4 = //
    //    5 = // on click data point turns color

//--------------------------------------------------------------------