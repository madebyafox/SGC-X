# CUSTOM
# Function to calculate first-order Markov transition matrix.
# Each *row* corresponds to a single run of the Markov chain
trans.matrix <- function(X, prob=T)
{
  tt <- table( c(X[,-ncol(X)]), c(X[,-1]) )
  if(prob) tt <- tt / rowSums(tt)
  tt
}


#https://spedygiorgio.github.io/markovchain/index.html

##MARKOV TEST 
weatherStates <- c("sunny", "cloudy", "rain") 
byRow <- TRUE
weatherMatrix <- matrix(data = c(0.70, 0.2, 0.1, + 0.3, 0.4, 0.3, 0.2, 0.45, 0.35), 
                        byrow = byRow, nrow = 3, dimnames = list(weatherStates, weatherStates))
mcWeather <- new("markovchain", states = weatherStates, byrow = byRow, 
                 transitionMatrix = weatherMatrix, name = "Weather")



##PREDICT STATE after time T
initialState <- c(0,1,0) #cloudy
after1day <- initialState * mcWeather
after2day <- initialState * mcWeather^2
after7day <- initialState * mcWeather^7


##CONDITIONAL DISTRIBUTION GIVEN STATE
conditionalDistribution(mcWeather, "sunny")

#this is the same as giving an initial stae and asking for prediction after T1
initialState <- c(1,0,0) #sunny
after1day <- initialState * mcWeather
after1day

#STEADY STATES
#A common question arising in Markov-chain models is, what is the long-term probability that the system will be in each state?
steadyStates(mcWeather)

library(Hmisc)
library(tidyverse)


df_items <- read_rds("data/2-scored-data/sgc3a_scored_items.rds")
df_subjects <- read_rds("data/2-scored-data/sgc3a_scored_participants.rds")

#:: CALC TRANSITION MATRIX [MARKOV]
library(markovchain)

#:: simplify dataframe
df_all <- df_items %>% filter(q%nin% c(6,9)) %>% dplyr::select(subject, q,interpretation) %>% 
  mutate(q = as.factor(q),
         state = recode(interpretation, 
                        "Orthogonal" = "ORTH",
                        "Triangular" = "TRI",
                        "both tri + orth" = "uncertain",
                        "reference" = "uncertain",
                        "Satisfice" = "ORTH",
                        "blank" = "uncertain",
                        "frenzy" = "?"
         )) %>% dplyr::select(-interpretation)

df_111 <- df_items %>% filter(condition == "111") %>% filter(q%nin% c(6,9)) %>% dplyr::select(subject, q,interpretation) %>% 
  mutate(q = as.factor(q),
         state = recode(interpretation, 
                        "Orthogonal" = "ORTH",
                        "Triangular" = "TRI",
                        "both tri + orth" = "uncertain",
                        "reference" = "uncertain",
                        "Satisfice" = "ORTH",
                        "blank" = "uncertain",
                        "frenzy" = "?"
         )) %>% dplyr::select(-interpretation)

df_121 <- df_items %>% filter(condition == "121") %>% filter(q%nin% c(6,9)) %>% dplyr::select(subject, q,interpretation) %>% 
  mutate(q = as.factor(q),
         state = recode(interpretation, "Orthogonal" = "ORTH",
                        "Triangular" = "TRI",
                        "both tri + orth" = "uncertain",
                        "reference" = "uncertain",
                        "Satisfice" = "ORTH",
                        "blank" = "uncertain",
                        "frenzy" = "?"
         )) %>% dplyr::select(-interpretation)


#:: pivot_wider
s_all <-  df_all %>% pivot_wider(names_from = q, values_from = state) %>% dplyr::select(-subject) %>% as.matrix()
s_111 <-  df_111 %>% pivot_wider(names_from = q, values_from = state) %>% dplyr::select(-subject) %>% as.matrix()
s_121 <-  df_121 %>% pivot_wider(names_from = q, values_from = state) %>% dplyr::select(-subject) %>% as.matrix()

#:: manual calc transition matrix
Ts.all <- trans.matrix(s_all, prob=T)
Ts.111 <- trans.matrix(s_111, prob=T)
Ts.121 <- trans.matrix(s_121, prob=T)

#show just the matrix of transition counts
# createSequenceMatrix(seq_all)

#:: FIT HOMOGENEOUS DISCRETE MARKOV CHAIN
#:: state transitions are independent of time
mc.all<- markovchainFit(data = s_all)
mc.111<- markovchainFit(data = s_111)
mc.121<- markovchainFit(data = s_121)

#:: INSTEAD FIT NON HOMOGENEOUS DISCRETE MARKOV CHAIN
#:: state transitions are independent of time
mc.nh.all<- markovchainListFit(data = s_all)
mc.nh.111<- markovchainFit(data = s_111)
mc.nh.121<- markovchainFit(data = s_121)

#:: get Transition Probs from markovchain object
Ts.all <- mc.all$estimate@transitionMatrix
Ts.111 <- mc.111$estimate@transitionMatrix
Ts.121 <- mc.121$estimate@transitionMatrix

#:: plot Transition probabilities [BASE?]
plot(mc.all$estimate) 
plot(mc.111$estimate) 
plot(mc.121$estimate) 

#:: diagram Transition probabilities [DIAGRAM]
library(diagram)
plotmat(Ts.111,
        box.size = 0.05,
        box.type = "rect",
        box.prop = 0.5,
        arr.length = 0.25,
        arr.width = 0.25,
        self.cex = 0.75,
        self.shifty = c(.05,-.05,-.05,.05,.05,.05),
        self.shiftx = c(.05,.0,.0,-.05, 0,0))

plotmat(Ts.121,
        box.size = 0.05,
        box.type = "rect",
        box.prop = 0.5,
        arr.length = 0.25,
        arr.width = 0.25,
        self.cex = 0.75,
        self.shifty = c(.05,-.05,-.05,.05,.05,.05),
        self.shiftx = c(.05,.0,.0,-.05, 0,0))

#:: diagram Transition probabilities [DIAGRAM]
plotweb(Ts.111, val=T)
plotweb(Ts.121, val=T)


##TODO | Is this Markov chain homogoeneous, or non homogeneous?
##ie. do the transition probabilities change at each time?


#STEADY STATE
# ?? probability of eventually reaching the TRIANGULAR state based on
# the condition factor
steadyStates(mc.all$estimate)
steadyStates(mc.111$estimate)
steadyStates(mc.121$estimate)

#ABSORBING STATES
#no absorbing states, though we predict that TRI should be absorbing :/
absorbingStates(mc.all$estimate)
absorbingStates(mc.111$estimate)
absorbingStates(mc.121$estimate)

#SUMMARY
summary(mc.all$estimate)
summary(mc.121$estimate)
summary(mc.111$estimate)

#ACCESSIBILITY
#is one state accessible from another?
#TODO investigate the states that don't seem like they should be 
#possible, and double check the response classification
is.accessible(object = mc.121$estimate, from = "TRI", to = "uncertain")

#PERIODICITY
period(mc.all$estimate)
period(mc.111$estimate)
period(mc.121$estimate)

##FIRST AND MEAN PASSAGE TIMES
meanFirstPassageTime(mc.all$estimate)
meanFirstPassageTime(mc.111$estimate)
meanFirstPassageTime(mc.121$estimate)

#mean first passage time to get to triangular
#from each given state
meanFirstPassageTime(mc.111$estimate, "TRI")
meanFirstPassageTime(mc.121$estimate, "TRI")

#absorption probabilities
#only works if there are absorbing states
# meanAbsorptionTime(mc.all$estimate) 

#Committor probability
# Committorprobability The committor probability tell sustheprobability
#to reach a given state before another given. Suppose that we startina cloudy day,
#the probabilities of experiencing a rainy day before a sunny one is 0.5: 
committorAB(mcWeather,3,1)

##SEQUENCE AS TODO ALLUVIAL PLOT
#https://matthewdharris.com/2017/11/11/a-brief-diversion-into-static-alluvial-sankey-diagrams-in-r/

##evaluate fit by calling loglikelihood on the mode
library(RcppParallel)
mc.all$logLikelihood


#DIVERGENCE TEST
# data(kullback)
# verifyHomogeneity(inputList=kullback,verbose=TRUE)

#create list of the transition counts
x.111 <- createSequenceMatrix(seq_111)
x.121 <- createSequenceMatrix(seq_121)
x <- list(x.111, x.121)

verifyHomogeneity(inputList=x,verbose=TRUE)


#assessStationarity
# library(seqHMM)
# ssplot(df)


##CONSIDER ADDING RT_S AND MODELLING AS A CONTINUOUS TIME MARKOV CHAIN


####TRAMINER PACKAGE — SEQUENCE ANALYSIS
#https://cran.r-project.org/web/packages/TraMineR/index.html

library(TraMineR)

#FILTER LONG RAW DATA
df_all <- df_items %>% filter(q%nin% c(6,9)) %>% dplyr::select(
  subject, condition, q,interpretation) %>% 
  mutate(q = as.factor(q),
         state = recode(interpretation, 
                        "Orthogonal" = "ORTH",
                        "Triangular" = "TRI",
                        "both tri + orth" = "uncertain",
                        "reference" = "uncertain",
                        "Satisfice" = "ORTH",
                        "blank" = "uncertain",
                        "frenzy" = "?"
         )) %>% dplyr::select(-interpretation)

#PIVOT DATA TO WIDE MATRIX
s_all <-  df_all %>% pivot_wider(names_from = q, values_from = state) 
questions <- unique(df_all$q)
states <- unique(df_all$state)
subjects <- s_all$subject
conditions <- s_all$condition
s_all <- s_all %>% select(-subject,-condition)

#CREATE TRACMINER STATE SEQUENCE
seq_all <- seqdef(s_all, id = subjects, cnames=questions, weighted=FALSE)
seq_111 <- seqdef(s_111, weighted=FALSE)
seq_121 <- seqdef(s_121, weighted=FALSE)

#PLOT SEQUENCES
seqiplot(seq_all, group = conditions, idx=0)
# seqiplot(seq_111, idx = 0) #idx=(10:50)
# seqiplot(seq_121, idx = 0)

#FIND SEQUENCE FREQUENCIES
seqtab(seq_all, idxs = 1:10)
seqtab(seq_111, idxs = 1:10)
seqtab(seq_121, idxs = 1:10)

#PLOT MOST FREQUENT SEQUENCES
seqplot(seq_all, type = "f", group = conditions)
# seqplot(seq_111, type="f")
# seqplot(seq_121, type="f")

#PAIRWISE OPTIMAT MATCHING DISTANCES
# Compute pairwise optimal matching (OM) distances between 
# sequences with an insertion/deletion cost of 1 and a 
# substitution cost matrix based on observed transition rates: 

all_om <- seqdist(seq_all, method = "OM", indel = 1, sm = "TRATE")

# Proceed to an agglomerative hierarchical clustering using the
# obtained distance matrix, select the four-clusters solution 
# and express it as a factor: R> library("cluster") 
library(cluster)
clusterward <- agnes(all_om, diss = TRUE, method = "ward") 
nclusters = 5
all.clusters <- cutree(clusterward, k = nclusters) 
cluster.labels <- factor(all.clusters, labels = paste("Cluster", 1:nclusters))
plot(clusterward, which.plots = 2, labels = FALSE)
seqdplot(seq_all,group=cluster.labels,border=NA)   

#JOIN CLUSTERS TO SUBJECTS
clusters <- all.clusters %>% as.data.frame() %>% mutate(
  SEQ_cluster = recode_factor(`.`,"1"="stuck-orth", 
                          "2" = "got-tri", 
                          "3"="inconsistent",
                          "4"="learned-tri",
                          "5"="backfall")) %>% select(-`.`)
gclusters <- cbind(subject = subjects,clusters)
df_subjects <- merge(df_subjects, gclusters)

#DOES CONDITION PREDICT SEQUENCE
chisq.test(df_subjects$SEQ_cluster, df_subjects$condition)

library(vcd)
mosaic(df_subjects$condition ~ df_subjects$SEQ_cluster)


#see representative sequences in each cluster
seqrplot(seq_all, group = cluster.labels, diss = all_om, coverage = 0.20)
##TODO PLAY AROUND WITH 4 VS 5 CLUSTERS
##see about adding cluster label as outcome DV to dfsubjects
##TODO what is happening about Q1-3 uncertain, then ORTH then UNCERTAIN then ORTH
##why isn't Q4 also uncertain?

#Longitudinal entropy regressed on covariates
#shannon entropy of each sequence in seq data 
#The entropy of a sequence measures the diversity of the
#elements in the sequence. It is computed from the frequencies
#of each element of the alphabet in the sequence.
entropies<-seqient(seq_all, norm=T) %>% 
  as.data.frame() %>% rownames_to_column("subject") %>% 
  mutate(SEQ_entropy = Entropy) %>% select(-Entropy)

#join it to subjects record and see if entropy is a predictor of score
df_subjects <- merge(df_subjects, entropies)

#IS CONDITION A SIGNIFICANT PREDICTOR OF ENTROPY? 
summary(lm(SEQ_entropy~condition,df_subjects))

#IS ENTROPY A SIGNIFICANT PREDICTOR OF SCORE? 
summary(lm(s_NABS ~ SEQ_entropy, data = df_subjects))

## OVERALL AND TRANSVERSAL STATISTICS

#:: mean time in each state
seqmtplot(seq_all, group = conditions, ylim = c(0, 13),
          main = "Mean RUNS in interpretation")

#:: traversal rates [AKA TRANSITION PROBABILITIES]
#assuming independence of sequence position
trate.ind <- seqtrate(seq_all, time.varying = T)
trate.ind
#calculated for each position
trate.dep <- seqtrate(seq_all, time.varying = T)
trate.dep

#:: transversal state distributions
# distribution of states at each time
seqstatd(seq_all[,1:13])
seqdplot(seq_all, group = conditions)

#:: Sequence of modal states
# most frequent interpretation at each time
seqmsplot(seq_all, group=conditions)

#:: Transversal entropy of state distributions
#Plotting the transversal entropies can be useful to Ąnd out how the diversity 
#of states evolves along the time axis.
seqHtplot(seq_all, group=conditions)

# UNIDIMENSIONAL INDICATORS

#:: number of transitions
n.trans = seqtransn(seq_all) %>% as.data.frame() %>% 
  rownames_to_column("subject") %>% 
  mutate(SEQ_n_trans = `Trans.`) %>% select(-`Trans.`) 

#join it to subjects record and see if its a predictor of score
df_subjects<- merge(df_subjects, n.trans)

#IS CONDITION A SIGNIFICANT PREDICTOR OF #TRANSITIONS? 
summary(lm(SEQ_n_trans~condition,df_subjects))

#IS ENTROPY A SIGNIFICANT PREDICTOR OF SCORE? 
summary(lm(s_NABS ~ SEQ_n_trans, data = df_subjects))


#TODO LOOK AT RESPONSE SCORING FOR SUBJECT WBJ2T
# ARE THOSE INTERPRETATIONS CORRECT?

#FIND REPRESENTATIVE SEQUENCES
# medoid :The medoid is the most central object; i.e., the one with minimal sum of distances to all other objects in the set
medoid <- seqrep(seq_all,  criterion = "dist", diss = all_om, nrep = 1)
#define how many medoids to find
medoid <- seqrep(seq_all,  criterion = "dist", diss = all_om, nrep = 2)
##todo look at Q5, why is its TRI response to common in control?

#ANOTHER VIEW OF MOST REPRESENTATIVE SEQUENCES PER GROUP... THIS IS GOOD! 
seqrplot(seq_all, group = conditions, diss = all_om, border = NA)

#:: representative set with neighborhood density criterion
seqrplot(seq_all, group = conditions, diss = all_om, border = NA)


#SEQDPLOT
seqdplot(seq_all, group=conditions)
seqdHplot(seq_all, group=conditions)
seqfplot(seq_all, group=conditions)
seqIplot(seq_all, group=conditions)


seqmtplot(seq_all, group=conditions)
seqrplot(seq_all, group=conditions)
seqpcplot(seq_all, group=conditions)
