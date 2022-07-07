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

#———————————————---
#DERIVE INTERPRETATION
# takes dataframe as input and returns dataframe with additional columns
# assigns an interpretation score based on logic contained therein
derive_interpretation <- function(df){
  
  # glimpse(df)
  threshold_range = 0.5 #set required variance in subscores to be discriminant
  threshold_frenzy = 4
  
  for (x in 1:nrow(df)) {
    
    #CALCULATE MAX TVERSKY SUBSCORE
    t = df[x,] %>% dplyr::select(score_TV_max, score_TV_start, score_TV_end, score_TV_duration) #reshape
    t.long = gather(t,score, value, 1:4)
    t.long[t.long == ""] = NA #replace empty scores with NA so we can ignore them
    if(length(unique(t.long$value)) == 1 ){
      if(is.na(unique(t.long$value))){
        df[x,'score_TVERSKY'] = NA
        df[x,'tv_type'] = NA   
      }
    } else {
      df[x,'score_TVERSKY'] = as.numeric(max(t.long$value,na.rm = TRUE))
      df[x,'tv_type'] = t.long[which.max(t.long$value),'score']
    }
    
    #CALCULATE MAX SATISFICING SUBSCORE
    t = df[x,] %>% dplyr::select(score_SAT_left, score_SAT_right)
    t.long = gather(t,score, value, 1:2)
    t.long[t.long == ""] = NA #replace empty scores
    if(length(unique(t.long$value)) == 1 ){
      if(is.na(unique(t.long$value))){
        df[x,'score_SATISFICE'] = NA
        df[x,'sat_type'] = NA   
      }
    } else {
      df[x,'score_SATISFICE'] = as.numeric(max(t.long$value,na.rm = TRUE))
      df[x,'sat_type'] = t.long[which.max(t.long$value),'score']  
    }
    
    #NOW CALCULATE RANGE AMONG SUBSCORES
    #order of this selection matters in breaking ties! 
    t = df[x,] %>% dplyr::select(score_TRI, score_TVERSKY, score_SATISFICE, score_ORTH)
    t.long = gather(t,score, value, 1:4)
    t.long[t.long == ""] = NA
    
    df[x,'top_score'] = as.numeric(max(t.long$value,na.rm = TRUE))
    df[x,'top_type'] = t.long[which.max(t.long$value),'score']
    
    #calculate the range between highest and lowest scores 
    r = as.numeric(range(t.long$value,na.rm = TRUE))
    r = diff(r)
    df[x,'range'] = r
    
    #DISCRIMINANT BETWEEN SUBSCORES TO PREDICT BEST FIT INTERPRETATION
    
    if (r < threshold_range) {
      #then we can't predict the interpretation, leave it as "?"
      df[x,'best'] = "?"
    } else {
      p =  df[x,'top_type']
      if (p == "score_TRI") {df[x,'best'] = "Triangular"
      } else if(p == "score_ORTH") {df[x,'best'] = "Orthogonal"
      } else if(p == "score_TVERSKY") {df[x,'best'] = "Tversky"
      } else if(p == "score_SATISFICE") {df[x,'best'] = "Satisfice"}
    }
    
    #CHECK SPECIAL SITUATIONS
    
    #BOTH TRI AND ORTH?  
    if (!is.na(df[x,'score_BOTH'])) { #only check if both is not null
      if( df[x,'score_BOTH'] == 1) {
        df[x,'best'] = "both tri + orth"}
    }
    
    #IS BLANK?
    if( df[x,'num_o'] == 0) {  
      df[x,'best'] = "blank"
    }
    
    #IS FRENZY?
    if( df[x,'num_o'] > threshold_frenzy) { 
      df[x,'best'] = "frenzy"
    }
    
    #IS REF POINT?
    if (!is.na(df[x,'score_REF'])) { #only check if the score is NOT null
      if( df[x,'score_REF'] == 1) {
        df[x,'best'] = "reference"
      }
    }
    
  }#end loop
  
  #cleanup 
  rm(t, t.long, x, r,p)
  rm(threshold_frenzy, threshold_range)
  
  #set order of levels for response exploration table
  df$int2 <- factor(df$best,
                    levels = c("Triangular", "Tversky",
                               "Satisfice", "Orthogonal", "reference", "both tri + orth", "blank","frenzy","?"))
  
  #set order of levels
  df$interpretation <- factor(df$best,
                              levels = c("Orthogonal","Satisfice", "frenzy","?","reference","blank",
                                         "both tri + orth", "Tversky","Triangular"))
  
  #collapsed representation of scale of interpretations
  df$high_interpretation <- fct_collapse(df$interpretation,
                                         orthogonal = c("Satisfice", "Orthogonal"),
                                         neg.trans = c("frenzy","?"),
                                         neutral = c("reference","blank"),
                                         pos.trans = c("Tversky","both tri + orth"),
                                         triangular = "Triangular"
  ) 
  
  #set as factors
  df$tv_type = as.factor(df$tv_type)
  df$top_type = as.factor(df$top_type)
  
  #reorder levels
  df$high_interpretation = factor(df$high_interpretation, levels= c("orthogonal", "neg.trans","neutral","pos.trans","triangular"))
  
  #cleanup 
  df <- df %>% dplyr::select(-best)
  
  #recode as numeric inase they are char 
  # df$score_TV_duration <- df$score_TV_duration %>% as.numeric()
  # df$score_SATISFICE <- df$score_SATISFICE %>% as.numeric()
  
  return(df) 
  
}


#———————————————---
#CALCULATE SCALED-SCORE
# assigns a numeric value to each interpretation 
# accepts vector of factors
# returns vector of numbers
# indicates a continuum of understanding from -1 (orth) to +1 (tri)
calc_scaled <- function(v){
  
  v <-recode(v,
             "Orthogonal" = -1,
             "Satisfice" = -1,
             "frenzy" = -0.5,
             "?" = -0.5,
             "reference" = 0,
             "blank" = 0, 
             "both tri + orth" = 0.5,
             "Tversky" = 0.5,
             "Triangular" = 1)
  
  return(v) 
}


#———————————————---
#SUMMARIZE BY SUBJECT
# summarize item level scores and put summaries on subject record
# accepts subject and item data frames 
# returns a subject data frame 
summarise_bySubject <- function(subjects, items){
  
  # print("input subjects")
  # glimpse(subjects)
  
  #summarize SCORES and TIME by subject
  subjects_summary <- items %>% filter(q %nin% c(6,9)) %>% group_by(subject) %>% dplyr::summarise (
    subject = as.character(subject),
    s_TRI = sum(score_TRI,na.rm=TRUE),
    s_ORTH = sum(score_ORTH,na.rm=TRUE),
    s_TVERSKY = sum(score_TVERSKY,na.rm=TRUE),
    s_SATISFICE = sum(score_SATISFICE, na.rm=TRUE),
    s_REF = sum(score_REF,na.rm=TRUE),
    s_ABS = sum(score_ABS,na.rm=TRUE),
    s_NABS = sum(score_niceABS,na.rm=TRUE),
    s_SCALED = sum(score_SCALED,na.rm=TRUE),
    DV_percent_NABS = s_NABS/13,
    rt_m = sum(rt_s)/60,
    item_avg_rt = mean(rt_s),
    item_min_rt = min(rt_s),
    item_max_rt = max(rt_s),
    item_n_TRI = sum(interpretation == "Triangular"),
    item_n_ORTH = sum(interpretation == "Orthogonal"),
    item_n_TV = sum(interpretation == "Tversky"),
    item_n_SAT = sum(interpretation == "Satisfice"),
    item_n_OTHER = sum(interpretation %nin% c("Triangular","Orthogonal","Tversky","Satisfice")),
    item_n_POS = sum(high_interpretation == "pos.trans"),
    item_n_NEG = sum(high_interpretation == "neg.trans"),
    item_n_NEUTRAL = sum(high_interpretation == "neutral")
  ) %>% arrange(subject) %>% slice(1L)
  
  #summarize first scaffold item of interest by subject
  subjects_q1 <- items %>% filter(q == 1) %>% mutate(
    item_q1_NABS = score_niceABS,
    item_q1_SCALED = score_SCALED,
    item_q1_interpretation = interpretation,
    item_q1_rt = rt_s,
  ) %>% dplyr::select(subject, item_q1_NABS, item_q1_SCALED, item_q1_interpretation,item_q1_rt) %>% arrange(subject)
  
  #summarize last test item of interest by subject
  subjects_q5 <- items %>% filter(q == 5) %>% mutate(
    item_q5_NABS = score_niceABS,
    item_q5_SCALED = score_SCALED,
    item_q5_interpretation = interpretation,
    item_q5_rt = rt_s,
  ) %>% dplyr::select(subject, item_q5_NABS, item_q5_SCALED, item_q5_interpretation,item_q5_rt) %>% arrange(subject)
  
  #summarize first test item of interest by subject
  subjects_q7 <- items %>% filter(q == 7) %>% mutate(
    item_q7_NABS = score_niceABS,
    item_q7_interpretation = interpretation,
    item_q7_rt = rt_s,
  ) %>% dplyr::select(subject, item_q7_NABS, item_q7_interpretation,item_q7_rt) %>% arrange(subject)
  
  #summarize last test item of interest by subject
  subjects_q15 <- items %>% filter(q == 15) %>% mutate(
    item_q15_NABS = score_niceABS,
    item_q15_interpretation = interpretation,
    item_q15_rt = rt_s,
  ) %>% dplyr::select(subject, item_q15_NABS, item_q15_interpretation,item_q15_rt) %>% arrange(subject)
  
  #summarize scaffold phase performance
  subjects_scaffold <- items %>% filter(q<6)  %>% group_by(subject) %>% dplyr::summarise (
    item_scaffold_NABS = sum(score_niceABS),
    item_scaffold_SCALED = sum(score_SCALED),
    item_scaffold_rt = sum(rt_s)
  )%>% dplyr::select(subject, item_scaffold_NABS, item_scaffold_SCALED, item_scaffold_rt) %>% arrange(subject)
  
  #summarize test phase performance
  subjects_test <- items %>% filter(q %nin% c(1,2,3,4,5,6,9)) %>% group_by(subject) %>% dplyr::summarise (
    item_test_NABS = sum(score_niceABS),
    item_test_SCALED = sum(score_SCALED),
    item_test_rt = sum(rt_s)
  )%>% dplyr::select(subject, item_test_NABS, item_test_SCALED, item_test_rt) %>% arrange(subject)
  
  #SANITY CHECK SUBJECT ORDER BEFORE MERGE; BOTH SHOULD BE TRUE
  print(unique(subjects_summary$subject == subjects$subject))
  print(unique(subjects_summary$subject == subjects_q1$subject))
  print(unique(subjects_summary$subject == subjects_q5$subject))
  print(unique(subjects_summary$subject == subjects_q7$subject))
  print(unique(subjects_summary$subject == subjects_q15$subject))
  print(unique(subjects_summary$subject == subjects_scaffold$subject))
  print(unique(subjects_summary$subject == subjects_test$subject))
  
  #CAREFULLY CHECK THIS — RELIES ON 
  
  
  x = merge(subjects, subjects_summary, by.x = "subject", by.y = "subject")
  x = merge(x, subjects_q1)
  x = merge(x, subjects_q5)
  x = merge(x, subjects_q7)
  x = merge(x, subjects_q15)
  x = merge(x, subjects_scaffold)
  x = merge(x, subjects_test)
  subjects <- x 
  
  #cleanup
  rm(subjects_q1, subjects_q5, subjects_q7, subjects_q15, subjects_scaffold, subjects_test, subjects_summary, x)
  
  # glimpse("FINAL")
  # glimpse(subjects)
  
  return(subjects)
}


#———————————————---
#SUMMARIZE CUMMULATIVE ABSOLUTE PROGRESS
# accept df_items
# return long dataframe that calculates cummulative absolute score AT EACH STEP (question)
# returns long dataframe
progress_Absolute <- function(items){
  
  #filter for valid items
  x <- items %>% filter(q %nin% c(6,9)) %>% dplyr::select(subject,mode, pretty_condition, q,score_niceABS) 
  
  #pivot wider
  wide <- x %>% pivot_wider(names_from=q, names_glue = "q_{q}", values_from = score_niceABS)
  
  #calc stepwise cumulative score
  wide$c1 = wide$q_1
  wide$c2 = wide$c1 + wide$q_2
  wide$c3 = wide$c2 + wide$q_3
  wide$c4 = wide$c3 + wide$q_4
  wide$c5 = wide$c4 + wide$q_5
  wide$c6 = wide$c5 + wide$q_7
  wide$c7 = wide$c6 + wide$q_8
  wide$c8 = wide$c7 + wide$q_10
  wide$c9 = wide$c8 + wide$q_11
  wide$c10 = wide$c9 + wide$q_12
  wide$c11 = wide$c10 + wide$q_13
  wide$c12 = wide$c11 + wide$q_14
  wide$c13 = wide$c12 + wide$q_15
  wide <- wide %>% dplyr::select(subject,mode, pretty_condition,c1,c2,c3,c4,c5,c6, c7,c8,c9, c10,c11,c12,c13)
  
  #lengthen 
  df_absolute_progress <- wide %>% pivot_longer(cols= c1:c13, names_to = "question", names_pattern = "c(.*)", values_to = "score")
  df_absolute_progress$question <- as.integer(df_absolute_progress$question)
  
  
  #cleanup 
  rm(x,wide)
  
  return(df_absolute_progress)
}


#———————————————---
#SUMMARIZE CUMMULATIVE SCALED PROGRESS
# accept df_items
# return long dataframe that calculates cummulative absolute score AT EACH STEP (question)
# returns long dataframe
progress_Scaled <- function(items){
  
#filter for valid items
x <- items %>% filter(q %nin% c(6,9)) %>% select(subject,mode, pretty_condition, q,score_SCALED)

#pivot wider
wide <- x %>% pivot_wider(names_from=q, names_glue = "q_{q}", values_from = score_SCALED)

#calc stepwise cumulative score
wide$c1 = wide$q_1
wide$c2 = wide$c1 + wide$q_2
wide$c3 = wide$c2 + wide$q_3
wide$c4 = wide$c3 + wide$q_4
wide$c5 = wide$c4 + wide$q_5
wide$c6 = wide$c5 + wide$q_7
wide$c7 = wide$c6 + wide$q_8
wide$c8 = wide$c7 + wide$q_10
wide$c9 = wide$c8 + wide$q_11
wide$c10 = wide$c9 + wide$q_12
wide$c11 = wide$c10 + wide$q_13
wide$c12 = wide$c11 + wide$q_14
wide$c13 = wide$c12 + wide$q_15
wide <- wide %>% select(subject,mode, pretty_condition,c1,c2,c3,c4,c5,c6, c7,c8,c9, c10,c11,c12,c13)

#lengthen 
df_scaled_progress <- wide %>% pivot_longer(cols= c1:c13, names_to = "question", names_pattern = "c(.*)", values_to = "score")
df_scaled_progress$question <- as.integer(df_scaled_progress$question)

#cleanup 
rm(x,wide)

return (df_scaled_progress)
}