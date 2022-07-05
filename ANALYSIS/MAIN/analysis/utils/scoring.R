# SCORING FUNCTIONS FOR SGC DISSERTATION PROJECT

#CALCULATE PARTIAL PQ SCORE 
f_partialP <- function(t,p,f,q) {
  
  #t = number of correct-selected options
  #p = number of true options
  #f = number of incorrect-selected options
  #q = number of false options
  #n = number of options + p + q
  
  ifelse( (p == 0), return(NA), "") #handle empty response set gracefully by returning nothing rather than 0
  ifelse( (p != 0), return( (t / p) - (f/q)), "")
}


#REORDER THE CHARACTERS IN A STRING
reorder_inplace <- function(x)
{
  y =  x %>% str_split("") %>% unlist() %>% sort() %>% str_c(collapse="")
  return (y)
}

#———————————————---
#CALCULATE SUBSCORE
# calculates subscore by accepting a question number, condition number, response set and key dataframe
# finds appropriate answer set in keyframe based on question and condition 
# performs set comparison to calc p,q,pn,qn,ps,qs
# uses these values to calculate partial_p
# returns score
calc_subscore <- function(question, cond, response, keyframe){
  
  #print(paste(question, cond, response))
  
  #STEP 1 GET KEY
  #—————————————————————————————————
  
  ## | only SGC3A impasse condition (121) Q1->5 have different answers (based on different dataset graphed)
  if (cond == 121 & question < 6 )
  {
    #GET KEY FOR Q1-Q6 COND 121
    p =  keyframe %>% filter(Q == question) %>% filter(condition == "121") %>% select(set_p) %>% pull(set_p) %>% str_split("") %>% unlist()
    q =  keyframe %>% filter(Q == question) %>% filter(condition == "121") %>% select(set_q) %>% pull(set_q) %>% str_split("") %>% unlist()
    pn = keyframe %>% filter(Q == question) %>% filter(condition == "121") %>% select(n_p)
    qn = keyframe %>% filter(Q == question) %>% filter(condition == "121") %>% select(n_q)
    
    # print(p)
    # print(q)
    # print(paste("pn ",pn))
    # print(paste("qn ",qn))
  } else {
    #GET KEY FOR THIS SCORE TYPE, QUESTION
    p =  keyframe %>% filter(Q == question) %>% filter(condition == "DEFAULT") %>% select(set_p) %>% pull(set_p) %>% str_split("") %>% unlist()
    q =  keyframe %>% filter(Q == question) %>% filter(condition == "DEFAULT") %>% select(set_q) %>% pull(set_q) %>% str_split("") %>% unlist()
    pn = keyframe %>% filter(Q == question) %>% filter(condition == "DEFAULT") %>% select(n_p)
    qn = keyframe %>% filter(Q == question) %>% filter(condition == "DEFAULT") %>% select(n_q)
  }
  
  #STEP 2 CALC INTERSECTIONS BETWEEN RESPONSE AND KEY
  #—————————————————————————————————
  
  #if response is not empty, split apart response for set comparison
  if(response != "")
  { response = response %>% str_split("") %>% unlist()}
  
  #set comparisons 
  ps = length(intersect(response,p))
  # print(paste("correct selected" ,ps))
  qs = length(intersect(response,q))
  # print(paste("incorrect selected", qs))
  # df_items[x,'tri_ps'] = tri_ps
  # df_items[x,'tri_qs'] = tri_qs
  
  #STEP 3 CALC f_partialP schema SCORE FOR THIS INTERSECTION
  x = f_partialP(ps,pn,qs,qn) %>% unlist() %>% as.numeric()
  # print(x)
  #cleanup
  rm(p,q,pn,qn,ps,qs)
  
  return(x)
}

#———————————————---
#CALCULATE REF-SCORE
# calculates exact match to reference point by accepting a question number, condition number, and response set
# finds appropriate answer set in keyframe based on question and condition 
# looks for exact set 
# returns score 0 or 1 
calc_refscore <- function(question, response){
  
  #1. GET reference point from REF_POINT column in raw keys [condition doesn't matter, ref point is in Q which is always the same]
  ref_p = keys_raw %>% filter(Q == question) %>% filter(condition == "DEFAULT") %>% select(REF_POINT) %>% 
    pull(REF_POINT) %>% str_split("") %>% unlist()
  
  #2. Is the response PRECISELY the REFERENCE POINT?
  x = identical(ref_p,response)
  x = as.numeric(x)  
  
  # paste("ref: ",ref_p)
  # paste("response: ",response)
  # paste("x: ",ref_p == response)
  
  #cleanup
  rm(ref_p, response, question)   
  return(x) #1 = match, 0 = not match
}
