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



calc_sub_score2 <- function(question, cond, response, keyframe){
  
  # print(paste(question, cond, response))
  
  #STEP 1 GET KEY
  if (question < 6) #for q1 - q5 find key for question by condition
  {
    # print(keyframe)
    #GET KEY FOR THIS SCORE TYPE, QUESTION AND CONDITION
    p =  keyframe %>% filter(Q == question) %>% filter(condition == cond) %>% select(set_p) %>% pull(set_p) %>% str_split("") %>% unlist()
    q =  keyframe %>% filter(Q == question) %>% filter(condition == cond) %>% select(set_q) %>% pull(set_q) %>% str_split("") %>% unlist()
    pn = keyframe %>% filter(Q == question) %>% filter(condition == cond) %>% select(n_p)
    qn = keyframe %>% filter(Q == question) %>% filter(condition == cond) %>% select(n_q)
    
    # print(p)
    # print(q)
    # print(paste("pn ",pn))
    # print(paste("qn ",qn))
    
  } else {
    #GET KEY FOR THIS SCORE TYPE, QUESTION
    p =  keyframe %>% filter(Q == question) %>% select(set_p) %>% pull(set_p) %>% str_split("") %>% unlist()
    q =  keyframe %>% filter(Q == question) %>% select(set_q) %>% pull(set_q) %>% str_split("") %>% unlist()
    pn = keyframe %>% filter(Q == question) %>% select(n_p)
    qn = keyframe %>% filter(Q == question) %>% select(n_q)
  }
  
  #STEP 2 CALC INTERSECTIONS BETWEEN RESPONSE AND KEY
  
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

#CALCULATE THE REFERENCE SCORES
calc_ref_score2 <- function(question, cond, response){
  
  #1. GET reference point from REF_POINT column in raw keys
  if (question < 6) {
    ref_p = keys_raw %>% filter(Q == question) %>% filter(condition == cond) %>% select(REF_POINT) %>% pull(REF_POINT) %>% str_split("") %>% unlist()
  } else {
    ref_p = keys_raw %>% filter(Q == question) %>%select(REF_POINT) %>% 
      pull(REF_POINT) %>% str_split("") %>% unlist()
  }
  
  #2. Is the response PRECISELY the REFERENCE POINT?
  x = identical(ref_p,response)
  x = as.numeric(x)  
  
  # paste("ref: ",ref_p)
  # paste("response: ",response)
  # paste("x: ",ref_p == response)
  
  #cleanup
  rm(ref_p, response, question, cond)   
  return(x) #1 = match, 0 = not match
}

#CALCULATE SCORE BASED ON UNION OF ORTH & TRI (SUBJECT SELECTS BOTH ANSWERS )
calc_both_score2 <- function(question, cond, response){
  
  
  #TRAPDOOR 
  #since no orth responses exist for impasse condition q1 - q5, set to 0
  if (question < 6 & cond == 121) {x = NA}
  
  #ELSE 
  #calculate union of ORTH and TRI
  else {
    if (question < 6 & cond == 111) #for q1 - q5 find key for question by condition
    {
      #grab the tri and orth keys for this question as well as N option set
      tri_p =  keys_tri %>%  filter(Q == question) %>% filter(condition == cond) %>% select(set_p) %>% pull(set_p) %>% str_split("") %>% unlist()
      orth_p = keys_orth %>% filter(Q == question) %>% filter(condition == cond) %>% select(set_p) %>% pull(set_p) %>% str_split("") %>% unlist()
      set_n =  keys_tri %>%  filter(Q == question) %>% filter(condition == cond) %>% select(set_n) %>% pull(set_n) %>% str_split("") %>% unlist() 
      #1. calc answer that is both tri and orth and only these --> union of tri_p and orth_p
      both_p = union(tri_p, orth_p) #the selection of tri and p
      #2. calc answers that should't be selected as diffrence between N [same for all keys] and both_p
      both_q = setdiff(set_n,both_p)
      both_pn = length(both_p)
      both_qn = length(both_q)
    } else{
      
      #grab the tri and orth keys for this question as well as N option set
      tri_p =  keys_tri %>%  filter(Q == question) %>% select(set_p) %>% pull(set_p) %>% str_split("") %>% unlist()
      orth_p = keys_orth %>% filter(Q == question) %>% select(set_p) %>% pull(set_p) %>% str_split("") %>% unlist()
      set_n =  keys_tri %>%  filter(Q == question) %>% select(set_n) %>% pull(set_n) %>% str_split("") %>% unlist() 
      #1. calc answer that is both tri and orth and only these --> union of tri_p and orth_p
      both_p = union(tri_p, orth_p) #the selection of tri and p
      #2. calc answers that shouldn't be selected as difference between N [same for all keys] and both_p
      both_q = setdiff(set_n,both_p)
      both_pn = length(both_p)
      both_qn = length(both_q)
    }
    
    #STEP 2 CALC INTERSECTIONS BETWEEN RESPONSE AND KEY
    
    #if response is not empty, split apart response for set comparison
    if(response != "")
    { response = response %>% str_split("") %>% unlist()}
    
    both_ps = length(intersect(response,both_p))
    both_qs = length(intersect(response,both_q))
    
    
    #STEP 3 CALC f_partialP schema SCORE FOR THIS INTERSECTION 
    x = f_partialP(both_ps,both_pn,both_qs,both_qn)%>% unlist() %>% as.numeric()
    
    #cleanup
    rm(both_p,both_q,both_pn,both_qn,both_ps,both_qs, question, cond, response )   
  }
  
  return(x) #true correct, trues, false correct, false
}


#REORDER THE CHARACTERS IN A STRING
reorder_inplace <- function(x)
{
  y =  x %>% str_split("") %>% unlist() %>% sort() %>% str_c(collapse="")
  return (y)
}