//--------------------------------------------------------------------
//Scaffolding Graph Comprehension (for Unconventional Graphs)
//SGCX | Experimental Stimuli
//Amy Rae Fox   amyraefox@gmail.com
//
// +-+-+-+-+ +-+-+ +-+ +-+-+-+ 
// |m|a|d|e| |b|y| |a| |f|o|x| 
// +-+-+-+-+ +-+-+ +-+ +-+-+-+ 
//
//Experimental Design: x conditions (by scaffold) between subjects measure
//of problem solving performance using first triangular model graph
//first 5 questions of each graph are scaffolded, remainder are
//not. Concludes with demographic survey and preferences before debrief
//SCAFFOLD, GRAPH and RESPONSETYPE determined by condition code 

//REFERENCE-----------------------------------------------------------
    

    //CONDITION
    //    [EXPLICIT] [IMPASSE] [GRID] [MARK] [IXN]

    //EXPLICIT SCAFFOLD
    //    1 = none (control)
    //    2 = static image
    //    3 = interactive image 

    //IMPASSE SCAFFOLD
    //    1 = none (control)
    //    2 = impasse 
    
    //GRID SCAFFOLD
    //    1 = orthog y(full) x(tri) [control] Orthogonal-XInside-YFull
    //    2 = orthog y(partial) x(tri) [ignore] Orthogonal-XInside-YPartial
    //    3 = tri y(tri) x(tri) [minimal] Triangular-XInside-YInside
    //    4 = orthog y(partial) x(tri) [original] Orthogonal-XInside-YInside
    //    5 = orthog y(full) x(full) [maximal] Orthogonal-XFull-YFull

    //MARK SCAFFOLD
    //    1 = point
    //    2 = triangle
    //    3 = cross

    //IXN TYPE
    //    1 = none
    //    2 = //
    //    3 = //
    //    4 = //
    //    5 = // on click data point turns color

//--------------------------------------------------------------------

//INITIALIZE GLOBAL VARIABLES 
let block, correct, orth_correct ;
let graph, gwidth, gheight, explicit, impasse, grid, mark, ixn, colorClick;
let procedure_timeline, scaffold_timeline, test_timeline;
var question_file, sid, study, session, condition;

//INITIALIZE QUESTIONS ARRAYS
var questions = ["NULL"]; //index as null
var relations = ["NULL"]; //index as null
var datas = ["NULL"]; //index as null
var tri_answers = ["NULL"]; //index as null
var also_answers = ["NULL"]; //index as null
var orth_answers = ["NULL"]; //index as null
var tvsky_answers = ["NULL"]; //index as null
var satisf_answers = ["NULL"]; //index as null

//JSON OF STUDIES AND CONDITIONS
let studies = {
  SGC3A: [111,121],
  SGC3B: [111, 121, 211, 221, 311,321]
};
 
//INITIALIZE JSPSYCH & TIMELINE
var jsPsych = initJsPsych({
  on_start: function(){},
  on_finish: function() {  
  //push summary objects 
  jsPsych.data.get().push(sumSubject(jsPsych));
  jsPsych.data.get().push(sumIxn(jsPsych));
  //display all data to screen
  jsPsych.data.displayData();
  }
});
var timeline = [];

//ASSIGN SUBJECT ID 
sid = jsPsych.randomization.randomID(5).toUpperCase();

//PARSE PARAMETERS FROM QUERYSTRING
var urlvar = jsPsych.data.urlVariables();
study = urlvar.study;     

//IF STUDY IS NOT IN QUERYSTRING, DEFAULT TO SGCX
if (!study){
  console.log("NO STUDY PROVIDED --> DEFAULT SGCX");
  study = "SGCX";
} 
//IF STUDY STRING INVALID ... ALERT
else if (Object.keys(studies).indexOf(study) == -1) {
  //alert so correct code can be entered
  alert("INVALID STUDY CODE");
}

//--------------- DEFINE  TIMELINE COMPONENETS -------------------//  

  //PRELOAD MEDIA
  var preload = {
    type: jsPsychPreload,
    images: ['../media/welcome.png',
             '../media/devices.png',
             '../media/distractions.png']
  };

  //WELCOME SCREEN
  var welcome = {
    type: jsPsychImageKeyboardResponse,
    stimulus : '../media/welcome.png',
    choices: ['Enter'],
    stimulus_height :  window.innerHeight,
    maintain_aspect_ratio : true,
    data: {
      block:"welcome"
    },
    on_start: function(data){}  
  };

  //DEVICE REQUIREMENTS
  var devices = {
  type: jsPsychImageKeyboardResponse,
  stimulus : '../media/devices.png',
  choices: ['Enter'],
  stimulus_height :  window.innerHeight,
  maintain_aspect_ratio : true,
  data: {
    block:"devices"
  },
  on_start: function(data){}  
  };

  //BROWSER REQUIREMENTS
  var browserinstructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<p>To participate in this study you must: </p>
  <ol style="text-align:left">
  <li>Use a laptop or desktop computer (no tablets or phones).</li>
  <li>Use the Chrome web browser.</li>
  <li>Have a minimum screen size of 1000 x 600 px.</li>
  </ol>`,
  choices: ['Continue'],
  
  };

  //BROWSER CHECK
  var browsercheck = {
  type: jsPsychBrowserCheck,
  minimum_width: 1125,
  minimum_height: 680,
  inclusion_function: (data) => {
    return data.browser == 'chrome' && data.mobile === false
  },
  exclusion_message: (data) => {
    if(data.mobile){
      return '<p>You must use a desktop/laptop computer to participate in this experiment.</p>';
    } else if(data.browser !== 'chrome'){
      return '<p>You must use Chrome as your browser to complete this experiment.</p>'
    }
  }
  };

  //NO DISTRACTIONS
  var distractions = {
  type: jsPsychImageKeyboardResponse,
  stimulus : '../media/distractions.png',
  choices: ['Enter'],
  stimulus_height :  window.innerHeight,
  maintain_aspect_ratio : true,
  data: {
    block:"distractions"
  },
  on_start: function(data){}  
  };

  //STIMULUS TRIAL
  var stimulus = {
    type: jsPsychExternalHtml,
    url: '../src/stimulus.html',
    execute_script: true,
    force_refresh:true,
    cont_btn: "testingButton",
    on_finish: function(data) {
      let scoring = score(data.response[0], data.q);
      data.correct = scoring[0];
      data.discriminant = scoring[1];
      data.strict = scoring[2];
      data.tri_score = scoring[3];
      data.orth_score = scoring[4];
      data.other_score = scoring[5];
      data.answer = data.response[0];
      data.hovered = data.response[1];
      
    },
    data:{
      sid: sid,
      q: jsPsych.timelineVariable('q'),
      condition: condition,
      explicit: jsPsych.timelineVariable('explicit'),
      impasse: jsPsych.timelineVariable('impasse'),
      grid: jsPsych.timelineVariable('grid'),
      question: jsPsych.timelineVariable('question'),
      graph:jsPsych.timelineVariable('graph'),
      datafile: jsPsych.timelineVariable('datafile'),
      colorClick: jsPsych.timelineVariable('colorClick'),
      gwidth: jsPsych.timelineVariable('gwidth'),
      gheight: jsPsych.timelineVariable('gheight'),
      datafile: jsPsych.timelineVariable('datafile'),
      relation:  jsPsych.timelineVariable('relation'),
      block: jsPsych.timelineVariable('block')
    },
    on_start: function(){},
    response_el: 'answer', //name of element where response is stored
  } 
//-----------------------------------------------------------------//  



//SET STUDY-SPECFIC PARAMETERS
function initializeStudy() {

  console.log("INITIALIZING : "+study);
  session = urlvar.session ?? "blank";
  graph = "triangular";
  gwidth = 600;
  gheight = 600;

  switch (study){

    case "SGC3A": 
      
      //SET CONDITION
      if(!urlvar.condition){ //RANDOMIZE CONDITION if not in querystring
        console.log("-- randomizing condition from-- "+studies.SGC3A);
        let x = jsPsych.randomization.shuffle(studies.SGC3A);
        condition = x[0].toString();
      } else{ //convert url condition to string
        condition = urlvar.condition.toString();
        if(condition.length <2){alert("INVALID CONDITION CODE [3 digit min]");}
      }

      //FROM CONDITION
      impasse = condition.charAt(1); 
      question_file = "src/data/questions/SGC3A_"+condition.charAt(1)+"_questions.csv";
      
      explicit = (condition.charAt(0) || 1); //no scaffold (control)
      grid = (condition.charAt(2) || 1); //no scaffold (control)
      mark = (condition.charAt(3) || 1); //no scaffold (control)
      ixn = (condition.charAt(4) || 1); //no scaffold (control)
      colorClick = ((ixn==5) || false); 
      
      console.log("CONDITION: "+condition);
      console.log("SESSION: "+session);
      break;

    case "SGC3B":
      break;
      
    case "SGCX":
      //read querystring OR DEFAULT
      session = urlvar.session ?? "blank";  
      condition = urlvar.condition.toString() ??  "11111"; 
      question_file = "src/data/questions/SGC3A_"+condition.charAt(1)+"_questions.csv";
      graph = "triangular";
      break; 
  }

  //ADD STUDY LEVEL PROPERTIES
  jsPsych.data.addProperties({ 
    subject:sid, 
    study:study, 
    session:session,
    condition:condition
  });
} 

//BUILD STUDY-SPECFIC PROCEDURES
function buildProcedure(){
  console.log("BUILDING PROCEDURE....");

  switch (study){
    //---------------------------------------------------
    //SGC 3A --> 2[IMPASSE | none, impasse]- BS design
    //PROCEDURE BY CONDITION
    //impasse == 1 :: [5 none] + [10 none] + free response 
    //impasse == 2 :: [5 impasse] + [10 none] + free response
    //if no condition given, random assign on IMPASSE
    //EXPLICIT = 1, GRID = 1, MARK = 1, IXN = 1
    //---------------------------------------------------
    case "SGC3A":
    
      //FIRST FIVE QUESTIONS ARE BASED ON IMPASSE CONDITION [determines dataset]
      scaffold_timeline = [
         { q:1, impasse: impasse, question: questions[1], datafile: datas[1], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[1], block: "item_scaffold" },
         { q:2, impasse: impasse, question: questions[2], datafile: datas[2], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[2], block: "item_scaffold" },
         { q:3, impasse: impasse, question: questions[3], datafile: datas[3], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[3], block: "item_scaffold" },
         { q:4, impasse: impasse, question: questions[4], datafile: datas[4], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[4], block: "item_scaffold" },
         { q:5, impasse: impasse, question: questions[5], datafile: datas[5], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[5], block: "item_scaffold" }
      ];
      
      //NEXT TEN QUESTIONS ARE NOT IMPASSSE STRUCTURE
      test_timeline = [
        { q:6,  impasse: 1, question: questions[6],  datafile: datas[6],  graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[6] , block: "item_nondiscriminant"},
        { q:7,  impasse: 1, question: questions[7],  datafile: datas[7],  graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[7] , block: "item_test"},
        { q:8,  impasse: 1, question: questions[8],  datafile: datas[8],  graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[8] , block: "item_test"},
        { q:9,  impasse: 1, question: questions[9],  datafile: datas[9],  graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[9] , block: "item_nondiscriminant"},
        { q:10, impasse: 1, question: questions[10], datafile: datas[10], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[10], block: "item_test" },
        { q:11, impasse: 1, question: questions[11], datafile: datas[11], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[11], block: "item_test" },
        { q:12, impasse: 1, question: questions[12], datafile: datas[12], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[12], block: "item_test" },
        { q:13, impasse: 1, question: questions[13], datafile: datas[13], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[13], block: "item_nondiscriminant" },
        { q:14, impasse: 1, question: questions[14], datafile: datas[14], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[14], block: "item_test" },
        { q:15, impasse: 1, question: questions[15], datafile: datas[15], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[15], block: "item_test" }   
      ];
      break;

    //---------------------------------------------------
    //SGC 3B --> 2[IMPASSE | none, impasse] X 3[EXPL | none, img, ixn]
    //PROCEDURE BY CONDITION
    //impasse == 1 :: [5 none] + [10 none] + free response 
    //impasse == 2 :: [5 impasse] + [10 none] + free response
    //explicit == 1 :: [5 none] + [10 none] + free response 
    //explicit == 2 :: [5 img] + [10 none] + free response 
    //explicit == 3 :: [5 ixn] + [10 none] + free response 
    //GRID = 1, MARK = 1, IXN = 1, 
    //---------------------------------------------------
    
    default: 
    //---------------------------------------------------
    //SGCX --> DEFAULT DEMO
    //ALL PARAMETERS SET BY CONDITION
    //[5 condition] + free response
    //---------------------------------------------------
    
  }
 

  //SCAFFOLDING BLOCK
  var block_scaffold = {
    timeline: [stimulus],
    timeline_variables: scaffold_timeline,
    randomize_order: false
  }

  //TEST BLOCK
  var block_test = {
    timeline: [stimulus],
    timeline_variables: test_timeline, 
    randomize_order: false
  }

  //PROCEDURE
  var procedure = {
    timeline: [block_scaffold, block_test]
  }

  // console.log("STUDY: " +study);
  // console.log("SESSION: " +session);
  // console.log("CONDITION: " +condition);
  // console.log("IMPASSE: "+ impasse)
  // console.log("GRID: "+ grid)
  // console.log("MARKS: "+ mark)
  // console.log("IXN: "+ ixn)
  // console.log("CLICK-INPUT: "+ colorClick)
  // console.log("sid" + sid);

//ASSEMBLE TIMELINE
// timeline.push(preload);
// timeline.push(welcome);
// timeline.push(devices);
// timeline.push(browserinstructions);
// timeline.push(browsercheck);
// timeline.push(distractions);
// timeline.push(stimulus);
// timeline.push(block_test);
// timeline.push(block_scaffold);
timeline.push(procedure);
// timeline.push(debrief_block);

}//end function

//DETERMINE DATASET BASED ON CONDITION
function getDataset(impasse) {
  if (impasse == 2){ return treatment_file;}
  else if (impasse = 1) {return control_file;}
} //end function

//LOAD QUESTIONS FILE
function loadQuestions() {
  return new Promise(function (resolve, reject) {  
    
    d3.csv(question_file, function(error, data){
      console.log('LOADING DATA...');
      console.log(question_file);
      if (error) {
        alert("Unable to load data file");
        reject(error);
      }
      // var questions= ["NULL"]; //index as null
      data.forEach(function(d){
        questions.push(d.TEXT);
        datas.push(d.DATAFILE)
        relations.push(d.RELATION);
        tri_answers.push(d.TRIANGULAR) //triangular-correct answers
        also_answers.push(d.also) //question-redundant but acceptable answers
        orth_answers.push(d.ORTHOGONAL) //orthogonal-correct
        tvsky_answers.push(d.TVERSKY); //lines-connecting answer
        satisf_answers.push(d.SATISFICE) //satisficing
      });
      // resolve(questions);
      resolve()
    });
  });
} //end function

//RUN THE TIMELINE
async function main() {
  initializeStudy();
  await loadQuestions();
  console.log("DATA LOADED");
  buildProcedure();
  jsPsych.run(timeline); //START EXPERIMENT
} //end function

//DO THE THINGS
main();




var score = function (input, q){
  const response = input.split(',');
  const tri = tri_answers[q].split('');
  const orth = orth_answers[q].split('') ?? [];
  const also = also_answers[q].split('') ?? [];
  var tri_score, orth_score, other_score;
  
  console.log("SCORING RESPONSE...");
  console.log("response: "+response) ;
  console.log("tri: "+ tri);
  console.log("orth: "+ orth);
  
  //uses underscore.js _.intersection, etc.

  //TRIANGULAR SCORE
  //+1/x pts for each triangular item
  var tintersect = _.intersection(response,tri);
  tri_score = (1/tri.length)*tintersect.length;
  
  //ORTHOGONAL SCORE
  //+1/x pts for each orthogonal item
  var ointersect = _.intersection(response,orth);
  orth_score = (1/orth.length)*ointersect.length
  
  //OTHER SCORE
  if (response[0].length == 0){other_score = 0} //if response was empty set
  else {
  let instrategy = _.union(tri,orth); 
  let difference = _.difference(response,instrategy);
  other_score = (difference.length);
  }
  
  //CALCULATE SCORING
  let correct = equalsIgnoreOrder(response,tri); //strict score requires exact match 
  let discriminant_score = tri_score -orth_score;
  let strict_score = tri_score - orth_score - (1/15*other_score);
  console.log("PERFECT? "+correct);
  console.log("DISCRIMINANT "+discriminant_score);
  console.log("STRICT "+strict_score);

  return [correct, discriminant_score, strict_score, tri_score, orth_score, other_score];
  


  // let orth_score;
  // let tvsky_score;
  // let satisf_score;
  



} 