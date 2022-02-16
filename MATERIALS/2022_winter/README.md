# SGC X 

Important Changes from SGC3A/B prior to winter 2022
- upgraded to new version of jsPsych (v7) with multiple API changes 
- moved most condition-contingent logic out of stimulus and graphs.js into experiment.js
- pass data to stimulus.html via a hidden <data> element that populates based on data: in trial, based on customized version of external-html plugin (customized by me:)

DATA CHANGES
- previously, IMPASSE, EXPLICIT were recorded at the condition level, not the item level. So a non-scaffolded question 6 still had an impasse == 2 if the person was in condition 121. Now, the impasse attribute on each item reflects whether that iTEM had an impasse structure 


STRUCTURE of the stimulus is always determined by the condition, unless condition is not defined 
