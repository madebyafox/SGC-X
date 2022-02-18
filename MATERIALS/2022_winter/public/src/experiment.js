//--------------------------------------------------------------------
//Scaffolding Graph Comprehension (for Unconventional Graphs)
//OMNIBUS CODE BASE FOR STUDIES SGC3 --> SGC6
//SGCX | Experimental Stimuli
//
// +-+-+-+-+ +-+-+ +-+ +-+-+-+ 
// |m|a|d|e| |b|y| |a| |f|o|x| 
// +-+-+-+-+ +-+-+ +-+ +-+-+-+ 
//
//Amy Rae Fox   amyraefox@gmail.com
//--------------------------------------------------------------------

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

//INITIALIZE JSPSYCH & TIMELINE
var jsPsych = initJsPsych({
  on_start: function(){},
  on_finish: function(){  
    jsPsych.data.get().push(sumSubject(jsPsych)); //summary subject
    jsPsych.data.get().push(sumIxn(jsPsych)); //summary ixns 
    jsPsych.data.displayData(); //display all data to screen
  },
  extensions: [
    { type: jsPsychExtensionMouseTracking},
    { type: jsPsychExtensionWebgazer}]
});
var timeline = [];


//--------------- INITIALIZE GLOBAL VARIABLES  -------------------//  

//DEFINE CONDITIONS PER STUDY
const studies = {
  SGC3A: ["111","121"],
  SGC3B: ["111", "121", "211", "221", "311","321"]
};

//DEFINE CONDITION VALUES PER DIGIT 
const conditions = {
  1: ["1","2","3"],          //explicit
  2: ["1","2"],              //impasse
  3: ["1","2","3","4","5"],  //grid
  4: ["1","2","3"],          //mark
  5: ["1","2","3","4","5"]   //ixn
}

//INITIALIZE GLOBAL VARIABLES 
let study, session, condition;
let sid, explicit, impasse, grid, mark, ixn, colorClick, question_file; 
let graph, gwidth, gheight, q;
let block, correct, orth_correct;
let procedure_timeline, scaffold_timeline, test_timeline;

//INITIALIZE QUESTIONS ARRAYS
var questions = ["NULL"]; //index as null
var relations = ["NULL"]; //index as null
var datas = ["NULL"]; //index as null
var tri_answers = ["NULL"]; //index as null
var also_answers = ["NULL"]; //index as null
var orth_answers = ["NULL"]; //index as null
var tvsky_answers = ["NULL"]; //index as null
var satisf_answers = ["NULL"]; //index as null
 


//--------------- DEFINE  TIMELINE COMPONENTS -------------------//  

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
    choices: ['Continue']
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
      data.mouselog = data.response[2];
      data.response = [];//remove for redundancy with answer,hovered,mouselog
    },
    data:{
      sid: sid,
      condition: condition,
      q: jsPsych.timelineVariable('q'),
      explicit: jsPsych.timelineVariable('explicit'),
      impasse: jsPsych.timelineVariable('impasse'),
      grid: jsPsych.timelineVariable('grid'),
      mark: jsPsych.timelineVariable('mark'),
      ixn:  jsPsych.timelineVariable('ixn'),
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
    extensions: [
      {type: jsPsychExtensionMouseTracking, params: {
        targets:['#testingButton','#leftDiv','#rightDiv','#theGraph'],
        events: ['mousemove','mousedown']
      }},
      {type: jsPsychExtensionWebgazer, params: { 
        targets:['#testingButton','#leftDiv','#rightDiv','#theGraph']
      }}
    ],
    response_el: 'answer', //name of element where response is stored
  } 

  var camera_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>In order to participate you must allow the experiment to use your camera.</p>
      <p>You will be prompted to do this on the next screen.</p>
      <p>If you do not wish to allow use of your camera, you cannot participate in this experiment.<p>
      <p>It may take up to 30 seconds for the camera to initialize after you give permission.</p>
    `,
    choices: ['Got it'],
  }

  var init_camera = {
    type: jsPsychWebgazerInitCamera
  }

  var calibration_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>Now you'll calibrate the eye tracking, so that the software can use the image of your eyes to predict where you are looking.</p>
      <p>You'll see a series of dots appear on the screen. Look at each dot and click on it.</p>
    `,
    choices: ['Got it'],
  }

  var calibration = {
    type: jsPsychWebgazerCalibrate,
    calibration_points: [
      [25,25],[75,25],[50,50],[25,75],[75,75]
    ],
    repetitions_per_point: 2,
    randomize_calibration_order: true
  }

  var validation_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>Now we'll measure the accuracy of the calibration.</p>
      <p>Look at each dot as it appears on the screen.</p>
      <p style="font-weight: bold;">You do not need to click on the dots this time.</p>
    `,
    choices: ['Got it'],
    post_trial_gap: 1000
  }

  var validation = {
    type: jsPsychWebgazerValidate,
    validation_points: [
      [25,25],[75,25],[50,50],[25,75],[75,75]
    ],
    roi_radius: 200,
    time_to_saccade: 1000,
    validation_duration: 2000,
    data: {
      task: 'validate'
    }
  }

  var recalibrate_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>The accuracy of the calibration is a little lower than we'd like.</p>
      <p>Let's try calibrating one more time.</p>
      <p>On the next screen, look at the dots and click on them.<p>
    `,
    choices: ['OK'],
  }

  var recalibrate = {
    timeline: [recalibrate_instructions, calibration, validation_instructions, validation],
    conditional_function: function(){
      var validation_data = jsPsych.data.get().filter({task: 'validate'}).values()[0];
      return validation_data.percent_in_roi.some(function(x){
        var minimum_percent_acceptable = 50;
        return x < minimum_percent_acceptable;
      });
    },
    data: {
      phase: 'recalibration'
    }
  }

  var calibration_done = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>Great, we're done with calibration!</p>
    `,
    choices: ['OK']
  }

//NOTE:: BLOCKS AND PROCEDURE DEFINED IN buildProcedure() 
//-----------------------------------------------------------------//  

//--------------- HELPER FUNCTIONS --------------------------------//  
//SET STUDY-SPECFIC PARAMETERS
function initializeStudy() {
  
  console.log("INITIALIZING STUDY ...");
  
  //PARSE PARAMETERS FROM QUERYSTRING
  var urlvar = jsPsych.data.urlVariables();
  study = urlvar.study ?? 'SGCX';   //default to demo
  session = urlvar.session ?? "blank"; 
  condition = urlvar.condition ?? 'R'; //default to random assign
  condition = condition.toString();
  q = urlvar.q;
  graph = urlvar.graph ?? "triangular" //need to handle errors
  gwidth = urlvar.gwidth ?? 600;
  gheight = urlvar.gheight ?? 600;
  

  //VALIDATE STUDY 
  if (Object.keys(studies).indexOf(study) == -1 && (study != "SGCX")) {
    alert("INVALID STUDY CODE");
  }

  //VALIDATE CONDITION 
  if (condition != "R"){
    
    //IS CONDITION IN VALID FORM?
    var temp = condition.split('');
    if(temp.length < 3) {
      alert("INVALID CONDITION CODE (minimum 3 digits");
    }

    //VALIDATE CONDITION AGAINST ALL POSSIBLE
    if (study == "SGCX"){ //allow any valid condition code  
      temp.forEach(function(value, index, array){
        if (!conditions[index+1].includes(value)){
          alert("INVALID CONDITION CODE: no "+value+" in "+(index+1)+" position");
        };
      });
    }

    //VALIDATE CONDITION AGAINST STUDY
    else { //allow conditions in study
      if(! studies[study].includes(condition)){
        alert("INVALID CONDITION FOR STUDY CODE");
      }
    }
    //TODO ERROR HANDLING (DON'T CONTINUE STUDY)
  }

  //ASSIGN SUBJECT ID 
  sid = jsPsych.randomization.randomID(5).toUpperCase();

  //CONFIGURE CONDITION-DEPENDENT PARAMETERS
  console.log("SETUP : "+study);
  switch (study){
   
    case "SGC3A":   
      //RANDOMIZE CONDITION if not in querystring
      if(condition == 'R'){  
        console.log("-- randomizing condition from-- "+studies.SGC3A);
        let x = jsPsych.randomization.shuffle(studies.SGC3A);
        condition = x[0].toString();
      } 
      question_file = "src/data/questions/SGC3A_"+condition.charAt(1)+"_questions.csv";
      break;

    case "SGC3B":
      break;
      
    default: //SGCX
      //read querystring OR DEFAULT
      if (condition == 'R') {condition = "11111"}; //control default
      explicit = condition.charAt(0);
      impasse = condition.charAt(1); 
      grid = condition.charAt(2); 
      mark = condition.charAt(3) ?? 1; 
      ixn =  condition.charAt(4) ?? 1; 
      colorClick = (ixn == 5 ) ; //only checkbox 
      question_file = "src/data/questions/SGC3A_"+impasse+"_questions.csv";
      break; 

    console.log("CONDITION: "+condition);
    console.log("SESSION: "+session);
  }

  //ADD STUDY LEVEL PROPERTIES
  jsPsych.data.addProperties({ 
    subject:sid, 
    study:study, 
    session:session,
    condition:condition
  });


} 

//BUILD STUDY-SPECFIC PROCEDURE
function buildProcedure(){
  
  console.log("BUILDING PROCEDURE...."+study);

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
         { q:1, impasse: condition.charAt(1), question: questions[1], datafile: datas[1], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[1], block: "item_scaffold" },
         { q:2, impasse: condition.charAt(1), question: questions[2], datafile: datas[2], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[2], block: "item_scaffold" },
         { q:3, impasse: condition.charAt(1), question: questions[3], datafile: datas[3], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[3], block: "item_scaffold" },
         { q:4, impasse: condition.charAt(1), question: questions[4], datafile: datas[4], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[4], block: "item_scaffold" },
         { q:5, impasse: condition.charAt(1), question: questions[5], datafile: datas[5], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[5], block: "item_scaffold" }
      ];
      //NEXT TEN QUESTIONS ARE NOT IMPASSSE STRUCTURE [main dataset]
      test_timeline = [
        { q:6,  impasse: 1, question: questions[6],  datafile: datas[6],  graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[6] , block: "item_nondiscriminant"},
        { q:7,  impasse: 1, question: questions[7],  datafile: datas[7],  graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[7] , block: "item_test"},
        { q:8,  impasse: 1, question: questions[8],  datafile: datas[8],  graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[8] , block: "item_test"},
        { q:9,  impasse: 1, question: questions[9],  datafile: datas[9],  graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[9] , block: "item_nondiscriminant"},
        { q:10, impasse: 1, question: questions[10], datafile: datas[10], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[10], block: "item_test" },
        { q:11, impasse: 1, question: questions[11], datafile: datas[11], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[11], block: "item_test" },
        { q:12, impasse: 1, question: questions[12], datafile: datas[12], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[12], block: "item_test" },
        { q:13, impasse: 1, question: questions[13], datafile: datas[13], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[13], block: "item_nondiscriminant" },
        { q:14, impasse: 1, question: questions[14], datafile: datas[14], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[14], block: "item_test" },
        { q:15, impasse: 1, question: questions[15], datafile: datas[15], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[15], block: "item_test" }   
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
    case "SGC3B"  :
      break;
    
    //---------------------------------------------------
    //SGCX --> DEFAULT DEMO
    //ALL PARAMETERS SET BY CONDITION
    //[5 condition] + free response
    //---------------------------------------------------
    default: 
      
    //CHECK FOR SHORTCUT —— JUMP TO THIS QUESTION
    if (q){
      console.log("JUMPING TO QUESTION: "+q);
      scaffold_timeline = [
        { q:q, impasse: impasse, question: questions[q], datafile: datas[q], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[q], block: "item" }
      ];
      test_timeline=[
        { q:q, impasse: impasse, question: questions[q], datafile: datas[q], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[q], block: "item" }
      ];
    }

    else { //RUN ALL QUESTIONS BASED ON PARAMETERS 
      //FIRST FIVE QUESTIONS ARE BASED ON IMPASSE CONDITION [determines dataset]
      //TODO CHECK THESE
      scaffold_timeline = [
        { q:1, impasse: impasse, question: questions[1], datafile: datas[1], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[1], block: "item_scaffold" },
        { q:2, impasse: impasse, question: questions[2], datafile: datas[2], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[2], block: "item_scaffold" },
        { q:3, impasse: impasse, question: questions[3], datafile: datas[3], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[3], block: "item_scaffold" },
        { q:4, impasse: impasse, question: questions[4], datafile: datas[4], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[4], block: "item_scaffold" },
        { q:5, impasse: impasse, question: questions[5], datafile: datas[5], graph: graph,  explicit : explicit, grid : grid, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[5], block: "item_scaffold" }
     ];
     
     //TODO CHECK THESE
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
    }   
  }
 

    //SCAFFOLDING BLOCK
    var block_scaffold = {
    timeline: [stimulus],
    timeline_variables: scaffold_timeline,
    randomize_order: false
    }

    console.log(test_timeline);

    //TEST BLOCK
    var block_test = {
    timeline: [stimulus],
    timeline_variables: test_timeline, 
    randomize_order: false
    }

    //STIMULUS PROCEDURE
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

 
    


    
    //  timeline.push(preload)
    //  timeline.push(camera_instructions)
     timeline.push(init_camera)
     timeline.push(calibration_instructions)
     timeline.push(calibration)
     timeline.push(validation_instructions)
     timeline.push(validation)
    //  timeline.push(recalibrate)
    //  timeline.push(calibration_done)
      // begin, 
      // trial, 
      // show_data
    
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

//SCORE USER RESPONSE
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
  
} //end function

//RUN THE TIMELINE
async function main() {
  initializeStudy();
  await loadQuestions();
  console.log("DATA LOADED");
  buildProcedure();
  jsPsych.run(timeline); //START EXPERIMENT
} //end function

//ALLONS-Y!
main();