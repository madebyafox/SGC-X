

##desired output
##json array
##subject,condition,question,study,
##mouseevents

library(tidyjson)
library(jsonlite)

input <- fromJSON("../MOUSE/input/su22_sgc4a_final_items_mouse.json")
subjects <- read_csv("../MOUSE/input/su22_sgc4a_participants.csv")
items <- read_csv("../MOUSE/input/su22_sgc4a_items.csv")

#mouselog is manual recording
#mouse_tracking_data is via jsPsych extension

#fa21 onwards --> 
#MOUSE_TRACKING_DATA VERSION
df <- input %>% dplyr::select(study, subject, condition, q, correct, gwidth, gheight, mouse_tracking_data)
d <- input %>% tail(15)
d %>% write_json("../MOUSE/out/test.json")



r <- read_csv("../MOUSE/input/acme_control.csv")
r %>% write_json("../MOUSE/out/acme_control.json")

