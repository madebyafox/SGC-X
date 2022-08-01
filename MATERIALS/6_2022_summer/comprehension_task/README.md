**CHANGELOG**

- July 2022
  - added more support for sGC4C
    - split 6th condition position into 6,7,8
    - 6 is axis rotation
    - 7 is label rotation
    - 8 is shape-scale (isoceles or equilateral)

  //CONDITION : 8 digit code 
    // [EXPLICIT] [IMPASSE] [GRID] [MARK] [IXN] [AXIS ROTATION][LABEL ROTATION] [SHAPE]

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

    //AXIS ROTATION
    //    1 = normal 0 deg
    //    2 = rotate 45deg 
    //    3 = rotate 90deg 

    //LABEL ROTATION
    //    1 = normal 0 deg
    //    2 = rotate 45deg 
    //    3 = rotate 90deg 

    //SHAPE
    //    1 = isoceles (default)
    //    2 = equilateral (height * 0.5*Math.sqrt(3) //equaliateral?)

- summer 2022:
  - added support for prolific via a prolific redirect 
  - added additional browser_check trial AFTER going to fullscreen to record screensize on fullscreen
  - added support for SGC4C ; a 6th position in the condition string that encodes 'ROTATION'
    - 1 == no rotation, 2 == 45 degree rotation
    - automatically downscales graph to 0.75 and does a very rough rotation
    - configured using same pattern as SGC4A and SGC4B



# Experimental Stimuli 
AUTHOR: AMY RAE FOX amyraefox@gmail.com  
Experimental Stimuli Codebase for SGC - Scaffolding Unconventional Graphs:  
Study 3: The Insight Hypothesis _in remote asynch data collection mode_  
Study 4: The Graph Schema _in remote asynch data collection mode_  
Study 5: Interaction _in remote asynch data collection mode_  

_deployed at_ https://limitless-plains-85018.herokuapp.com/

## INPUT
[all input as URL vars]

study = [SGC3A, SGC4A, SGC4B, SGC5A]  
session= [freetext] //default blank  
mode = "synch" || "asynch" //default asynch  
pool = ? //default sona  
exp_id = ? //survey code in sona for deciding which study to grant credit to  
sona_id = ? //survey code from SONA for automatically granting credit [only for asynch study types]  
q = [1...15] //jump to question  
condition = (minimum 3 digit) [EXPLICIT] [IMPASSE] [GRID] [MARK] [IXN]

First Digit    | explicit scaffolding
 ------------- |-------------
 1      | control (no-scaffold)
 2      | statuc image 
 3      | interactive image

Second Digit    | implicit scaffolding
 ------------- |-------------
1      | control (no-scaffold)
2      | impasse (no orthogonal answer)

Third Digit    | grid format
------------- |-------------
 1 | cartesian axes, full y, triag x
 2 | cartesian axes, into triag y, triag x
 3 | triangular axes, inside triag y, triag x
 4 | cartesian axes, inside y, triag x
 5 | cartesian axes, full y, full x

Fourth Digit    | mark scaffold
------------- |-------------
 1 | point
 2 | triangle
 3 | cross

 Fifth digit  | interaction type
------------- |-------------
 1 | none
 5 | click on data point turns color 


##  CONTEXT
- asynchronous, remote, web-based collection with SONA integration
- subject completes X experimental blocks contingent on STUDY variable
- STUDY, SESSION, POOL, CONDITION codes determined via querystring
- integration with mouseflow
- manual mouse tracking 

## Tech — Notes
**Important Changes from SGC3A/B prior to winter 2022**
- upgraded to new version of jsPsych (v7) with multiple API changes 
- moved most condition-contingent logic out of stimulus and graphs.js into experiment.js
- pass data to stimulus.html via a hidden <data> element that populates based on data: in trial, based on customized version of external-html plugin (customized by me:)
- numerous URV vars added for customization 
- auto assign credit to sona if configured via exp_id

**DATA CHANGES**
- previously, IMPASSE, EXPLICIT were recorded at the condition level, not the item level. So a non-scaffolded question 6 still had an impasse == 2 if the person was in condition 121. Now, the impasse attribute on each item reflects whether that iTEM had an impasse structure 
- STRUCTURE of the stimulus is always determined by the condition, unless condition is not defined 

