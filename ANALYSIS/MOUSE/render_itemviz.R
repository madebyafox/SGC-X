

#READ IN STUDY AND ITEM FILES FROM ANALYISIS FOLDERS (SCORED)
#JOIN
#extract condition details
#write to final_items.json for itemviz

library(Hmisc) # %nin% operator
library(tidyverse)

##:::::::: IMPORT SUBJECT DATA 

in_sgc3a <- read_rds("analysis/SGC3A/data/2-scored-data/sgc3a_scored_participants.rds") %>% mutate(
  study = "SGC3A"
) #%>% dplyr::select(-absolute_score)

in_sgc3b <- read_rds("analysis/SGC3B/data/2-scored-data/sgc3b_scored_participants.rds") %>% mutate(
  study = "SGC3B"
) #%>% dplyr::select(-absolute_score)

in_sgc4a <- read_rds("analysis/SGC4A/data/2-scored-data/sgc4a_scored_participants.rds") %>% mutate(
  study = "SGC4A",
  pretty_mode = "online-replication"
)
in_sgc4b <- read_rds("analysis/SGC4B/data/2-scored-data/sgc4b_scored_participants.rds") %>% mutate(
  study = "SGC4B",
  pretty_mode = "online-replication"
)

# TODO TEMPORARY ONLY REPLACE WITH SCORED DATA 
in_sgc4c <- read_rds("analysis/SGC4C/data/0-session-level/sgc4c_participants.rds") %>% mutate(
  pretty_mode = "online-replication"
)

in_sgc5 <- read_rds("analysis/SGC5A/data/2-scored-data/sgc5_scored_participants.rds") %>% mutate(
  study = "SGC5A",
  pretty_mode = "online-replication"
) %>% dplyr::select(-absolute_score)

#COMPARE DF COLUMNS
# janitor::compare_df_cols(sgc3a, sgc4c)
#SGC5 HAS ABSOLUTE SCORE BUT THEY SHOULDN'T 

# MERGE #TODO ADD IN SGC4C
df_subjects <- rbind(in_sgc3a, in_sgc3b, in_sgc4a, in_sgc4b, in_sgc5) %>%  dplyr::select(subject,term,mode, study,condition,s_NABS,s_SCALED)
rm(in_sgc3a, in_sgc3b, in_sgc4a, in_sgc4b, in_sgc4c, in_sgc5)

##:::::::: IMPORT ITEM DATA 

in_sgc3a_items <- read_rds("analysis/SGC3A/data/2-scored-data/sgc3a_scored_items.rds") %>% mutate(study = "SGC3A")

in_sgc3b_items <- read_rds("analysis/SGC3B/data/2-scored-data/sgc3b_scored_items.rds") %>% mutate(study = "SGC3B")

in_sgc4a_items <- read_rds("analysis/SGC4A/data/2-scored-data/sgc4a_scored_items.rds") %>% mutate(study = "SGC4A")

in_sgc4b_items <- read_rds("analysis/SGC4B/data/2-scored-data/sgc4b_scored_items.rds") %>% mutate(study = "SGC4B")

# TODO TEMPORARY ONLY REPLACE WITH SCORED DATA 
# in_sgc4c_items <- read_rds("analysis/SGC4C/data/0-session-level/sgc4c_items.rds") %>% mutate(study = "SGC4C")

in_sgc5_items <- read_rds("analysis/SGC5A/data/2-scored-data/sgc5a_scored_items.rds") %>% mutate(study = "SGC5")


# MERGE #TODO ADD IN SGC4C
df_items <- rbind(in_sgc3a_items, in_sgc3b_items, in_sgc4a_items) %>%  dplyr::select(
  subject,term,mode, study,condition, score_niceABS, score_SCALED,score_STATE, q, response, rt_s)

df <- rbind(in_sgc4b_items, in_sgc5_items) %>%  dplyr::select(
  subject,term,mode, study,condition, score_niceABS, score_SCALED,score_STATE, q, response, rt_s)

df_items <- rbind(df_items, df) 


#EXPLODE CONDITION
df_items <- df_items %>% mutate(
  explicit = str_sub(condition, 1,1),
  impasse = str_sub(condition, 2,2),
  grid = str_sub(condition,3,3),
  mark = str_sub(condition,4,4) %>% str_replace("^$","1"),
  ixn = str_sub(condition,5,5) %>% str_replace("^$","1"),
  rotation = str_sub(condition,6,6) %>% str_replace("^$","1"),
  labels = str_sub(condition,7,7) %>% str_replace("^$","1"),
  shape = str_sub(condition,8,8) %>% str_replace("^$","1"),
) 

#for spot checking
x <- df_items %>% dplyr::select(condition, explicit, impasse, grid, mark, ixn, rotation, labels, shape)
  
df_items %>% write_json("../MOUSE/out/final_items.json")



