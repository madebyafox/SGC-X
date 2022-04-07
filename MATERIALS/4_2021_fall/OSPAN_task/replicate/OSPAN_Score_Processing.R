dfclean <- read_csv(file = "fulldata.csv")


#This dataframe has the Math scores

wmscore <- dfclean  %>% #Clean dataframe
  select(subid, vis =source,matches('^[0-9].A.*|^4aQ8_F$')) %>% #Get subject ID and match all of the math problem columns
  pivot_longer(cols = colnames(.)[-1:-2]) %>% #Pivot columns to long format and exclude subid and source
  separate(name, into = c("Q","A"), sep = "_") %>% #Separate Question and Answer into their own columns
  separate(Q, into = c("type","order"), sep = 2) %>% #Seperate Question into type (i.e., 4-, 5-, or 6-SPAN with A and B types) and order of the math problems within-SPAN
  mutate(value = ifelse(value == TRUE, "T", "F"), score = ifelse(A == value,1,0)) %>% #Change boolean to numeric for math (i.e., proportion correct)
  group_by(subid,vis) %>% #Keep these columns and get scores for each participant
  summarise(acc = mean(score)) %>% #Average their math score within participant (0-1) 
  ungroup()




#Correct Item Recall for the OSPAN
#[1] "hauf"   "srbk"   "lpcsu"  "frpsb"  "lshcka" "ucsbsk"
`4A` <- c("house", "apple", "umbrella", "frog") #Vector of correct responses for OSPAN 4A
`4B` <- c("scissors", "rabbit", "boat", "key") #Vector of correct responses for OSPAN 4B
`5A` <- c("lock", "plane", "cup", "star", "umbrella")  #Vector of correct responses for OSPAN 5A
`5B` <- c("frog", "rabbit", "plane", "scissors", "boat") #Vector of correct responses for OSPAN 5B
`6A` <- c("lock", "star", "house", "cup", "key", "apple") #Vector of correct responses for OSPAN 6A
`6B` <- c("umbrella", "cup", "star", "boat", "scissors", "key") #Vector of correct responses for OSPAN 6B


#This Scores the Order of Items
dfOrder <- dfclean %>%
  select("subid", matches('^[0-9].Re_[a-z]+_[0-9]_x|^[0-9].Re_[a-z]+_[0-9]_y')) %>%
  pivot_longer(cols = colnames(.)[-1]) %>%
  separate(name,into = c("group","items", "order","name"),sep = "_") %>%
  pivot_wider(names_from = name, values_from = value) %>%
  mutate(score = ifelse(items == "hauf" & order == 1 & between(x,370,520) & between(y,0,130), 1,       #4A house grid coordinate intervals
                  ifelse(items == "hauf" & order == 2 & between(x,180,330) & between(y,155,285), 1,    #4A apple grid coordinate intervals
                  ifelse(items == "hauf" & order == 3 & between(x,0,150) & between(y,320,450), 1,      #4A umbrella grid coordinate intervals
                  ifelse(items == "hauf" & order == 4 & between(x,0,150) & between(y,0,130), 1,        #4A frog grid coordinate intervals
                  ifelse(items == "srbk" & order == 1 & between(x,180,330) & between(y,0,130), 1,      #4B scissors grid coordinate intervals
                  ifelse(items == "srbk" & order == 2 & between(x,180,330) & between(y,155, 285), 1,   #4B rabbit grid coordinate intervals
                  ifelse(items == "srbk" & order == 3 & between(x,370,520) & between(y,0,130), 1,      #4B boat grid coordinate intervals
                  ifelse(items == "srbk" & order == 4 & between(x,0,150) & between(y,0,130), 1,        #4B key grid coordinate intervals
                  ifelse(items == "lpcsu" & order == 1 & between(x,550,700) & between(y,320, 450), 1,  #5A lock grid coordinate intervals
                  ifelse(items == "lpcsu" & order == 2 & between(x,180,330) & between(y,320, 450), 1,  #5A plane grid coordinate intervals
                  ifelse(items == "lpcsu" & order == 3 & between(x,370, 520) & between(y,0,130), 1,    #5A cup grid coordinate intervals
                  ifelse(items == "lpcsu" & order == 4 & between(x,180,330) & between(y,0,130), 1,     #5A star grid coordinate intervals
                  ifelse(items == "lpcsu" & order == 5 & between(x,370, 520) & between(y,320,450), 1,  #5A umbrella grid coordinate intervals
                  ifelse(items == "frpsb" & order == 1 & between(x,180,330) & between(y,155, 285), 1,  #5B frog grid coordinate intervals
                  ifelse(items == "frpsb" & order == 2 & between(x,0, 150) & between(y,320, 450), 1,   #5B rabbit grid coordinate intervals
                  ifelse(items == "frpsb" & order == 3 & between(x,0,150) & between(y,0,130), 1,       #5B plane grid coordinate intervals
                  ifelse(items == "frpsb" & order == 4 & between(x,370, 520) & between(y,155, 285), 1, #5B scissors grid coordinate intervals
                  ifelse(items == "frpsb" & order == 5 & between(x,180,330) & between(y,0, 130), 1,    #5B boat grid coordinate intervals
                  ifelse(items == "lshcka" & order == 1 & between(x,0,150) & between(y,155, 285), 1,   #6A lock grid coordinate intervals
                  ifelse(items == "lshcka" & order == 2 & between(x,550,700) & between(y,320, 450), 1, #6A star grid coordinate intervals
                  ifelse(items == "lshcka" & order == 3 & between(x,370, 520) & between(y,320, 450), 1,#6A house grid coordinate intervals
                  ifelse(items == "lshcka" & order == 4 & between(x,550,700) & between(y,155, 285), 1, #6A cup grid coordinate intervals
                  ifelse(items == "lshcka" & order == 5 & between(x,370, 520) & between(y,0, 130), 1,  #6A key grid coordinate intervals
                  ifelse(items == "lshcka" & order == 6 & between(x,550,700) & between(y,0, 130), 1,   #6A apple grid coordinate intervals
                  ifelse(items == "ucsbsk" & order == 1 & between(x,180,330) & between(y,320, 450), 1, #6B umbrella grid coordinate intervals
                  ifelse(items == "ucsbsk" & order == 2 & between(x,0, 150) & between(y,155, 285), 1,  #6B cup grid coordinate intervals
                  ifelse(items == "ucsbsk" & order == 3 & between(x,0, 150) & between(y,320, 450), 1,  #6B star grid coordinate intervals
                  ifelse(items == "ucsbsk" & order == 4 & between(x,180,330) & between(y,0, 130), 1,   #6B boat grid coordinate intervals
                  ifelse(items == "ucsbsk" & order == 5 & between(x,370, 520) & between(y,155, 285), 1,#6B scissors grid coordinate intervals
                  ifelse(items == "ucsbsk" & order == 6 & between(x,370, 520) & between(y,0, 130), 1,0 #6B key grid coordinate intervals
            ))))))))))))))))))))))))))))))) %>%
  filter( !(grepl("^4.*|^5.*", group) & order == 6), !(grepl("^4.*", group) & order == 5)) %>% #Remove Na's from 4-SPAN and 5-SPAN so that only 4 or 5 answers were possible
  mutate(score = ifelse(is.na(score), 0, score)) %>% #The rest of the NA's were now failures to identify an object in the correct order and is scored as 0
  select(subid,orderscore = score) %>%#These are the only columns needed to join with the math score
  group_by(subid) %>% #Get score by subject ID
  summarise(orderscore = sum(orderscore)) #Summarise the orderscore as a raw sum out of 30

dfordjoin1 <- left_join(wmscore,dfOrder) %>% #Join the OSPAN ordered score and the math accuracy
  select(subid,vis,mathacc = acc,orderscore) %>%
  mutate(mathweightscore = mathacc*orderscore) # Multiply the proportion correct for math by the summed order score out of 30


head(dfordjoin1)

