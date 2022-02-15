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
    //    [EXPLICIT] [IMPASSE] [AXIS]

    //EXPLICIT SCAFFOLD
    //    1 = none (control)
    //    2 = static image
    //    3 = interactive image 

    //IMPASSE SCAFFOLD
    //    1 = none (control)
    //    2 = impasse 
    
    //AXIS 
    //    1 = orthog y(full) x(tri) [control] Orthogonal-XInside-YFull
    //    2 = orthog y(partial) x(tri) [ignore] Orthogonal-XInside-YPartial
    //    3 = tri y(tri) x(tri) [minimal] Triangular-XInside-YInside
    //    4 = orthog y(partial) x(tri) [original] Orthogonal-XInside-YInside
    //    5 = orthog y(full) x(full) [maximal] Orthogonal-XFull-YFull

//--------------------------------------------------------------------

//INITIALIZE GLOBAL VARIABLES 

let control_file = "acme_control.csv";
let treatment_file = "acme_impasse.csv";
let test_file = "acme_main.csv";
let question_file = "questions.csv";

let block, correct, orth_correct ;
let graph = "triangular";  //values: linear,triangular

let explicit = 1; //overriden by codes block
// let impasse = 1; //overriden by codes block
let axis = 1; //overrridden by codes block
let colorClick = true; //define whether values turn green when clicked
// let q = 1 ; //question number, used for data file override
let scenario = "acme" //values "acme" "longmire" "bigset"; //determine the order of scenarios by randomly sorting the array

// let questions = [
//   "starttime",
//   "starts",
//   "meets",
//   "endtime",
//   "midpoint",
//   "duration",
//   "duration+starts",
//   "duration+contained",
//   "starttime+before+endtime+during",
//   "ends",
//   "starttime",
//   "starts",
//   "meets",
//   "endtime",
//   "midpoint",
//   "strategy"
// ];

//LOAD QUESTIONS
var questions= ["NULL"]; //index as null


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
console.log("SID: " +sid);
localStorage.setItem("sid",sid); //store SID in local for access in stimulus

//SET PARAMETERS FROM QUERYSTRING
var urlvar = jsPsych.data.urlVariables();
var study = urlvar.study ?? "SGCX";
var session = urlvar.session ?? "blank";
var condition = urlvar.condition ?? 111 ;
var impasse = condition.charAt(1);

console.log("STUDY: " +study);
console.log("SESSION: " +session);
console.log("CONDITION: " +condition);
console.log("IMPASSE: "+ impasse)

//ADD PARAMETERS TO STUDY DATA
jsPsych.data.addProperties({ 
  subject:sid, 
  study:study, 
  session:session,
  condition:condition
});



//--------------- BUILD TIMELINE -------------------//  

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

var stimulus = {
  type: jsPsychExternalHtml,
  url: '../src/stimulus.html',
  execute_script: true,
  force_refresh:true,
  cont_btn: "testingButton",
  on_finish: function(data) {},
  data:{
    q: jsPsych.timelineVariable('q'),
    scenario:jsPsych.timelineVariable('scenario'),
    datafile: jsPsych.timelineVariable('datafile')
  },
  on_start: function(){
    localStorage.setItem("q",         jsPsych.timelineVariable('q'));
    localStorage.setItem("question",  questions[jsPsych.timelineVariable('q')]);
    localStorage.setItem("graph",     jsPsych.timelineVariable('graph'));
    localStorage.setItem("scenario",  jsPsych.timelineVariable('scenario'));
    localStorage.setItem("impasse",   jsPsych.timelineVariable('impasse'));
    localStorage.setItem("explicit",  jsPsych.timelineVariable('explicit'));
    localStorage.setItem("axis",      jsPsych.timelineVariable('axis'));
    localStorage.setItem("datafile",  jsPsych.timelineVariable('datafile'));
    localStorage.setItem("colorClick",colorClick);
    // localStorage.setItem("clicked",  clicked);
  },
  response_el: 'answer', //name of element where response is stored
} 


 

//BLOCK STRUCTURE
//5 X scaffolded
//10 x not scaffolded
//5 x third order 





//SCAFFOLDING BLOCK
var block_scaffold = {
  timeline: [
    stimulus
  ],
  timeline_variables: [
    { q:1, graph: "triangular", scenario:"acme", impasse: impasse,explicit:explicit, axis:axis, datafile: getDataset(impasse)  },
    { q:2, graph: "triangular", scenario:"acme", impasse: impasse,explicit:explicit, axis:axis, datafile: getDataset(impasse)  },
    { q:3, graph: "triangular", scenario:"acme", impasse: impasse,explicit:explicit, axis:axis, datafile: getDataset(impasse)  },
    { q:4, graph: "triangular", scenario:"acme", impasse: impasse,explicit:explicit, axis:axis, datafile: getDataset(impasse)  },
    { q:5, graph: "triangular", scenario:"acme", impasse: impasse,explicit:explicit, axis:axis, datafile: getDataset(impasse)  }
  ],
  randomize_order: false
}

//TEST BLOCK
var block_test = {
  timeline: [
    stimulus
  ],
  timeline_variables: [
    { q:6,  graph: "triangular", scenario: "bigset", impasse:0, explicit:0, axis:axis, datafile: test_file },
    { q:7,  graph: "triangular", scenario: "bigset", impasse:0, explicit:0, axis:axis, datafile: test_file },
    { q:8,  graph: "triangular", scenario: "bigset", impasse:0, explicit:0, axis:axis, datafile: test_file },
    { q:9,  graph: "triangular", scenario: "bigset", impasse:0, explicit:0, axis:axis, datafile: test_file },
    { q:10, graph: "triangular", scenario: "bigset", impasse:0, explicit:0, axis:axis, datafile: test_file },
    { q:11, graph: "triangular", scenario: "bigset", impasse:0, explicit:0, axis:axis, datafile: test_file },
    { q:12, graph: "triangular", scenario: "bigset", impasse:0, explicit:0, axis:axis, datafile: test_file },
    { q:13, graph: "triangular", scenario: "bigset", impasse:0, explicit:0, axis:axis, datafile: test_file },
    { q:14, graph: "triangular", scenario: "bigset", impasse:0, explicit:0, axis:axis, datafile: test_file },
    { q:15, graph: "triangular", scenario: "bigset", impasse:0, explicit:0, axis:axis, datafile: test_file }   
  ],
  randomize_order: false
}

//ASSEMBLE TIMELINE

// timeline.push(preload);
// timeline.push(welcome);
// timeline.push(devices);
// timeline.push(browserinstructions);
// timeline.push(browsercheck);
// timeline.push(distractions);

// timeline.push(stimulus);

timeline.push(block_scaffold);
// timeline.push(block_test);
// timeline.push(stimulus2);
//   timeline.push(instructions);
//   timeline.push(test_procedure);
// timeline.push(debrief_block);

//START EXPERIMENT
// jsPsych.run(timeline);


// preload
// welcome
// devices
// browserinstructions
// browsercheck
// informed consent 
// instructions
// distractions
// taskintroduction
// taskexample
// scenario
// stimuli X x 
// feedback 
// debrief


// var test = d3.csv(question_file, function(error, data){
//   if (error) throw error;
//   data.forEach(function(d){
//     questions.push(d.TEXT);
//   });
// });

//DETERMINE DATASET BASED ON CONDITION
function getDataset(impasse) {
  if (impasse == 2){ return treatment_file;}
  else if (impasse = 1) {return control_file;}
}

//LOAD QUESTIONS FILE
function loadQuestions() {
  return new Promise(function (resolve, reject) {  
    var filename="../src/data/"+question_file;
    d3.csv(filename, function(error, data){
      console.log('LOADING DATA');
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
}

//RUN THE TIMELINE
async function main() {
  questions = await loadQuestions();
  // console.log("QUESTIONS LOADED : "+questions);
  jsPsych.run(timeline);
  // console.log('AFTER AWAITED'+result);
}

//DO THE THINGS
main();