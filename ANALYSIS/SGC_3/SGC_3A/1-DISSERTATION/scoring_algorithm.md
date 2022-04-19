

## Scoring Approach

_For each question_
> For Q1 - Q5 there are 12 possible options (data points in graph), yielding $2^{15} =  32,768$ unique responses  

> For Q6 - Q15 there are 18 possible options
yielding $2^{18} =  262,144$


> In both cases, orthogonal and triangular strategies consist of either 1 or two data points

### OPEN QUESTIONS
- Which single score (or algorithm across them) can be used as a (categorical)  a proxy for _interpretation_? 
- Is it OK to analyze the MAMC (multiple answer multiple choice) as MTF (multiple true false), where the presence or absence of each item is coded as T/F? 
  - Note that the number of unique responses is the same in both coding schemes, 
  - unique responses $ = 2^n$, where $n = $ number of available options to select
  - for an item with 4 options $2^n = 2^3 = 8$ possible responses
  - seems mathematically identical, but underlying assumptions perhaps not the same, as selecting a T/F radio button per item is (psychologically, decision-making) different than selecting a checkbox to include an item. (close enough?) 

|MCMA response | MTF coding    |
|--------------|---------------|
|A             |  TFF          |
|B             |  FTF          |
|C             |  FFT          |
|AB            |  TTF          |
|BC            |  FTT          |
|AC            |  TFT          |
|ABC           |  TTT          |
|(blank)       |  FFF          |



### Expected Chance Score
> $\sum_{i = 0}^{n} \binom{n}{i} * (0.5)^i * (1-0.5)^{n-i} * f_i$  
> = $\sum_{i = 0}^{n} \binom{n}{i} * (0.5)^n * f_i$

> $n = $ number of options in MTF item (data points that can be selected)  
> $i = $ number of options marked correctly  
> $f_i = $ score for $i$ options marked correctly

_important, $i$ is _not_ the number of selected options, but rather the number of _correctly indicated_ items, where [T = correctly selected || correctly not selected] and [F = incorrectly selected || incorrectly not selected]_

The exepected _chance score_ of Multiple True-False (MTF) items is calculated by the sum of the product of the binomial ($p = 0.5$) probabilities of each statement marked _correctly_ with the corresponding score for that number of correctly marked statements. [Cite Schmidt et. al. 2021, Albanese \& Sabers (1988)]

| Scheme 	                  |$f_i$ for |  	    |   	    |   	  |   	  | Expected Chance Score 	|
|--------	                  |-----     |-----	  |---	    |---	  |---	  |-----------------------	|
| _for_ $n=4, i=$           |$0$       | $1$    | $2$     | $3$   | $4$   |                       	|
|Dichotomous [1]            |$0$     	 | $0$    | $0$     | $0$   | $1$   | $0.063$                 |
|Partial $[1/n]$ [10]       |$0$     	 | $0.25$ | $0.5$   | $0.75$| $1$   | $0.50$                  |
|Partial $[-1/n, 1/n]$ [17] |$-1$      | $-0.5$ | $0$     | $0.5$ | $1$   | $0$                     |

_For example_ for question with $n = 15$ options and $i = 1$ correct selections under a **dichotomous scoring** scheme (all-or-nothing)
> $\sum_{i = 0}^{n} \binom{n}{i} * (0.5)^n * f_i$  
  $\sum_{i = 0}^{15} \binom{n}{i} * (0.5)^{15} * f_{1}$  
  $\sum_{i = 0}^{15} \binom{n}{i} * (0.5)^{15} * 1 = 0.000030517578125$   

**TODO calculate chance under $PS_{[-1/n, +1/n]}$ for n = 15** 




### Scoring Methods 

- f = resulting score 
- n = number of options in item
- t = number of true statements in Multiple-True-False item
- i = number of correct responses by examinee $(0 ≤ i ≤ n)$, 
- tm = number of true statements marked as true by examinee $(tm ≤ t)$ 
- mt = overall number of statements marked as true by examinee  
- o = number of statements omitted by examinee (if possible  otherwise $o = 0$) 
- Scoring formulas have been modified to allow for items with $mt =t=0$ and $n=t$

**Dichotomous Scoring**

> $ f= i/n $ , where   
> $f =$ resulting score,  
> $n =$ number of options in item,  
> $i =$ number of correct responses by examinee $(0 ≤ i ≤ n)$,  

- most restrictive rating
- full credit is only given if all responses are correct; otherwise; no credit is given 
- all-or-nothing method that _ignores partial knowledge_. 
- with increasing number of statements per item, this scoring method becomes stricter as every statement must be marked correctly. 

**Partial Scoring $[-1/n, +1/n]$**

> $ f = (1/n * i) - (1/n * (n-i))$,  
> $ f = (1/n) * (2i - n)) = (2i - n)/{n}$   
**todo:: check against Schmidt et al $f = (2i - n + o)/{n}$
- Full credit is awarded if all responses are correct; One credit point is subtracted in case of all responses being incorrect. 
- At chance performance (i.e. half of the given statements marked correctly), 0 points are awarded. 
- Intermediate results are credited as fractions accordingly (+1/n for each correct, -1/n for each incorrect)


**TODO PICK UP HERE**
- consider calculation of tri and orthogonal using 
$PS_{[-1/n, +1/n]}$ 

The following scores are calculated for each question-response:

- **ABSOLUTE SCORE**:  [TRUE, FALSE]: response exactly match the true (triangular) correct response, with no missing or added data points?



- **DISCRIMINANT SCORE:** [-1, 1]
  - TRIANGULAR responses are +1 
  - ORTHOGONAL responses are -1
  - TVERSKY responses are +0.5
  - SATISFICING responses are -0.5
  - BLANK responses are 0, 
  - OTHER response are 0

 `discriminant = 0 + 1*(triangular) + 0.5*(tversky) - 0.5*(satisficing) - 1*(orthogonal)`
 

 //CALCULATE DISCRIMINATING SCORE
    //interestingly seems to be same as the [1/n,-1/n] score?
    // = triscore - orthscore - not_tri_orth
    discriminant_score = ((1/tri.length)*tintersect.length) - ((1/orth.length)*ointersect.length) - (1/n * not_tri_orth);


**TODO** should triangular/orthogonal scores be scaled for [0,1]?

- **TRIANGULAR SCORE** [0, 1], where n = number of triangular data points
  - consistency with triangular response
  - gives 1 pts for each triangular data point
  - does not penalize for extra data points

> $tri\_score = [(1/c) * a] - [1/i * b]$ ,  where 
>  - $n =$ number of possible selections, 
>  - $n = c + i = 15$
>  - $c =$ number of required correct responses
>  - $a =$ number of actual correct responses
>  - $i =$ number of possible incorrect selections
>  - $b =$ number of actual answer selections,  






>
>   `//+1/x pts for each triangular item`
    var tintersect = _.intersection(response,tri);
    // tri_score = (1/tri.length)*tintersect.length;
    tri_score = tintersect.length;
`

- ORTHOGONAL SCORE [0, N], where n = number of triangular data points
  - consistency with orthogonal response
  - gives 1 pts for each orthogonally-consistent data point
  - does not penalize for extra data points



- **TODO** TVERSKY SCORE 
- **TODO** SATISFICE SCORE 
- **OTHER** SATISFICE SCORE 

//number of responses not in any strategy
    let not_tri_orth = 0;
    if (response[0].length == 0){ //first element of array, bc empty array returns 1 
      other_score = 0} //if response was empty set
    else {
      let instrategy = _.union(tri,orth,also,tversky,satisfice); 
      let difference1 = _.difference(response,instrategy); //
      other_score = difference1.length;
  
      let notmain = _.union(tri,orth);
      let difference2 = _.difference(response,notmain);
      not_tri_orth = difference2.length;
    }



    

## From Stimulus Javascript
//this is the score recorded in the winter 2022 --> files

//SCORE RESPONSE
var score = function (input, q){

    console.log("IN SCORING FUNCTION")
    console.log(input)
    console.log(q)
    //dont score if not a numeric question 
    if (isNaN(q)){
      return null;
    }
  
    //GET ANSWERS
    const response = input.split(','); //user's response 
    const tri = tri_answers[q].split(''); //tri answer
    const orth = orth_answers[q].split('') ?? []; //orth answer
    const also = also_answers[q].split('') ?? []; //also answer
    const tversky = tvsky_answers[q].split('') ?? []; //tversky answer
    const satisfice = satisf_answers[q].split('') ?? []; //satisfice answer
  
    //INITIALIZE SCORES
    let discriminant_score = 0;   
    let tri_score = 0;  
    let orth_score = 0;  
    let other_score = 0;  
    let blank_score = 0;
  
    console.log("SCORING RESPONSE...");
    console.log("response: "+response) ;
    console.log("actual-tri: "+ tri);
    console.log("actual-orth: "+ orth);  
  
    //TRIANGULAR SCORE
    //+1/x pts for each triangular item
    var tintersect = _.intersection(response,tri);
    // tri_score = (1/tri.length)*tintersect.length;
    tri_score = tintersect.length;
    
    //ORTHOGONAL SCORE
    //+1/x pts for each orthogonal item
    var ointersect = _.intersection(response,orth);
    // orth_score = (1/orth.length)*ointersect.length
    orth_score = ointersect.length;
  
    //TVERSKY SCORE
    var tvintersect = _.intersection(response,tversky)
    // tversky_score =tvintersect.length;
    // tversky_score = (1/tversky.length)*tvintersect.length;
    tversky_score = "rescore"
  
    //SATISFICE SCORE
    var stintersect = _.intersection(response,satisfice)
    // satisfice_score = stintersect.length;
    // satisfice_score = (1/satisfice.length)*stintersect.length;
    satisfice_score = "rescore"

  
    console.log("tversky answer: "+tversky)
    //BLANK SCORE 
    if (response[0].length == 0){blank_score = 1;}
  
    //OTHER SCORE 
    //number of responses not in any strategy
    let not_tri_orth = 0;
    if (response[0].length == 0){ //first element of array, bc empty array returns 1 
      other_score = 0} //if response was empty set
    else {
      let instrategy = _.union(tri,orth,also,tversky,satisfice); 
      let difference1 = _.difference(response,instrategy); //
      other_score = difference1.length;
  
      let notmain = _.union(tri,orth);
      let difference2 = _.difference(response,notmain);
      not_tri_orth = difference2.length;
    }
    
    //CALCULATE ALL-OR-NOTHING
    let correct = equalsIgnoreOrder(response,tri); //strict score requires exact match 
  
    //CALCULATE DISCRIMINATING SCORE
    //interestingly seems to be same as the [1/n,-1/n] score?
    // = triscore - orthscore - not_tri_orth
    discriminant_score = ((1/tri.length)*tintersect.length) - ((1/orth.length)*ointersect.length) - (1/n * not_tri_orth);
  
    console.log("response length "+response.length);
    console.log("PRECISELY TRUE? "+correct);
    console.log("TRI SCORE "+tri_score);
    console.log("ORTH SCORE "+orth_score);
    console.log("TVERSKY SCORE "+tversky_score);
    console.log("SATISFICE SCORE "+satisfice_score);
    // console.log("OTHER SCORE "+other_score);
    console.log("OTHER SCORE "+not_tri_orth);
    console.log("BLANK SCORE "+blank_score);
    console.log("DISCRIMINANT SCORE " + discriminant_score);
  
    return [correct, discriminant_score, tri_score, orth_score, other_score, blank_score]; 
  }
  