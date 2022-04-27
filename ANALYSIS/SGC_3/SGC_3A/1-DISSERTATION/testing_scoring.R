#testing scoring 

#DISCRIMINANT SCORING ALGORITHM TESTING
#############################################
# FIRST is correct triangular 1option response
# SECOND is correct triangular 2option response
# THIRD is correct orthogonal 1option response
# FOURTH is correct orthogonal 2option response
# FIFTH is partial credit 2option triangular (split with other)
# SIXTH is partial credit 2option orthogonal (split with other)
# SEVENTH is partial credit 2option tri-orth split
# EIGHTH is blank 1correct
# NINTH is blank 2correct
predict = c(1, 1, -1, -1, 0.5, -0.5, 0, 0, 0)

#test key options
t = c(1, 2, 1, 2, 2, 2, 2, 1)
r = c(1, 2, 1, 2, 2, 2, 2, 1)
d = c(13,11,13,11,11,11,11, 13)
n = t + r + d
n == 15
t > 0


#test selected options
t_s = c(1,2,0,0,1,0,1,0,0)
r_s = c(0,0,1,2,0,1,1,0,0)
d_s = c(0,0,0,0,1,1,0,0,0)
s = t_s + r_s + d_s 

#score
S = (t_s / t) - (r_s / r)

#score as predicted?
unique(predict == S)

predict
S

#DISCRIMINANT SCORING FUNCTION
#############################################
f_discrim <- function(t_s,t,r_s,r){
  return((t_s / t) - (r_s / r))
}




## testing the discriminant scoring function
#############################################

x <- c("B","","")
# x <- unlist(str_split(x,""))

y <- c("FB","XK")
# y <- unlist(str_split(y,""))

d <- data.frame(x,y)

d$match <- Vectorize(count_match)(d$x,d$y)
d$match