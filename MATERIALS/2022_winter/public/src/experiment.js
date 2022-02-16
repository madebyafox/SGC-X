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
let control_file = "acme_control.csv";
let treatment_file = "acme_impasse.csv";
let test_file = "acme_main.csv";
let question_file = "questions.csv";
let block, correct, orth_correct ;
let graph, explicit, impasse, grid, mark, ixn, colorClick, filename;
let procedure_timeline, scaffold_timeline, test_timeline;

//LOAD QUESTIONS
var questions= ["NULL"]; //index as null
var relations= ["NULL"]; //index as null
var datas= ["NULL"]; //index as null
var answers = ["NULL"]; //index as null

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

//GENERATE SUBJECT ID 
var sid = jsPsych.randomization.randomID(5).toUpperCase();

//SET PARAMETERS FROM QUERYSTRING
var urlvar = jsPsych.data.urlVariables();
var study = urlvar.study ?? "SGCX";       //??use as demo??
var session = urlvar.session ?? "blank";  //default to blank
var condition = urlvar.condition ?? 11111 ; //default to control

//ADD STUDY LEVEL PROPERTIES
jsPsych.data.addProperties({ 
  subject:sid, 
  study:study, 
  session:session,
  condition:condition
});

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
  minimum_width: 1000,
  minimum_height: 700,
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
      //ADD response data to trial record
      data.answer = data.response[0];
      data.clicked = data.response[1];
      data.hovered = data.response[2];
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
      colorClick: jsPsych.timelineVariable('colorClick')
    },
    on_start: function(){},
    response_el: 'answer', //name of element where response is stored
  } 
//-----------------------------------------------------------------//  


//BUILD STUDY-SPECFIC PROCEDURES
function buildProcedure(){
  console.log("BUILDING STUDY....");

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
      
    //STATIC THROUGH PROCEDURE
      filename="../src/data/"+study+"_"+question_file;  
      graph = "triangular";

      //OVERRIDE WITH CONDITION, BUT DEFAULT TO NONE
      explicit = (condition.charAt(0) || 1); //no scaffold (control)
      grid = (condition.charAt(2) || 1); //no scaffold (control)
      mark = (condition.charAt(3) || 1); //no scaffold (control)
      ixn = (condition.charAt(4) || 1); //no scaffold (control)
      colorClick = ((ixn==5) || false); 
      
      //IMPASSE FROM CONDITION
      impasse = condition.charAt(1); 

      //FIRST FIVE QUESTIONS ARE BASED ON IMPASSE CONDITION [determines dataset]
      scaffold_timeline = [
         { q:1, impasse: impasse, question: questions[1], datafile: getDataset(impasse), graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick },
         { q:2, impasse: impasse, question: questions[2], datafile: getDataset(impasse), graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick },
         { q:3, impasse: impasse, question: questions[3], datafile: getDataset(impasse), graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick },
         { q:4, impasse: impasse, question: questions[4], datafile: getDataset(impasse), graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick },
         { q:5, impasse: impasse, question: questions[5], datafile: getDataset(impasse), graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick }
      ];
      
      //NEXT TEN QUESTIONS ARE BASED ON IMPASSE CONDITION
      test_timeline = [
        { q:6,  impasse: 1, question: questions[6],  datafile: test_file, graph: graph,  explicit : explicit, grid : grid },
        { q:7,  impasse: 1, question: questions[7],  datafile: test_file, graph: graph,  explicit : explicit, grid : grid },
        { q:8,  impasse: 1, question: questions[8],  datafile: test_file, graph: graph,  explicit : explicit, grid : grid },
        { q:9,  impasse: 1, question: questions[9],  datafile: test_file, graph: graph,  explicit : explicit, grid : grid },
        { q:10, impasse: 1, question: questions[10], datafile: test_file, graph: graph,  explicit : explicit, grid : grid },
        { q:11, impasse: 1, question: questions[11], datafile: test_file, graph: graph,  explicit : explicit, grid : grid },
        { q:12, impasse: 1, question: questions[12], datafile: test_file, graph: graph,  explicit : explicit, grid : grid },
        { q:13, impasse: 1, question: questions[13], datafile: test_file, graph: graph,  explicit : explicit, grid : grid },
        { q:14, impasse: 1, question: questions[14], datafile: test_file, graph: graph,  explicit : explicit, grid : grid },
        { q:15, impasse: 1, question: questions[15], datafile: test_file, graph: graph,  explicit : explicit, grid : grid }   
      ];

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
      filename="../src/data/"+study+"_"+question_file;  
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
    var filename="../src/data/"+study+"_"+question_file;
    d3.csv(filename, function(error, data){
      console.log('LOADING DATA...');
      if (error) {
        reject(error);
      }
      // var questions= ["NULL"]; //index as null
      data.forEach(function(d){
        questions.push(d.TEXT);
      });
      resolve(questions);
    });
  });
} //end function

//RUN THE TIMELINE
async function main() {
  questions = await loadQuestions();
  console.log("DATA LOADED");
  buildProcedure();
  jsPsych.run(timeline); //START EXPERIMENT
} //end function

//DO THE THINGS
main();