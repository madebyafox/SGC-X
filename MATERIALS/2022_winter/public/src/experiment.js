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
// @URL VARS   
// study= [SGC3A, SGC3B ..]
// session= [freetext] //default blank
// mode = "synch" || "asynch" //default asynch
// pool = ? //default sona
// exp_id = ? //survey code in sona for deciding which study to grant credit to 
// SONA STUDY 21JH01 = 2218
// sona_id = ? //survey code from SONA for automatically granting credit [only for asynch study types]
// q = [1...15] //jump to question
// condition = (min 3 digit, see below)  

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
    //assign sona credit for SGC3A via 21JH01
    if(exp_id == 2218) {
      console.log("ASSIGNING CREDIT FOR STUDY 21JHO1 EXP 2218")
      // window.open(grant_sona_sgc3a+sona_id, '_blank'); //open in new tab
    }
    // window.location.assign('src/debrief.html');
  },
  extensions: [
    { type: jsPsychExtensionMouseTracking},
    // { type: jsPsychExtensionWebgazer}]
  ]});
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

//SET SONA redirect urls 
const grant_sona_sgc3a = "https://ucsd.sona-systems.com/webstudy_credit.aspx?experiment_id=2218&credit_token=9a51e0fbf8c4403bbb31ef602025647b&survey_code=";

//INITIALIZE GLOBAL VARIABLES 
let study, session, condition, mode, pool, sona_id, exp_id;
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
             '../media/acme_1.png',
             '../media/acme_2.png',
            //  '../media/almost_there_puppy.jpeg',
            ]
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

  //INFORMED CONSENT
  var consent = {
    "type": jsPsychExternalHtml,
    "url": "../src/consent.html",
    "cont_btn": "start",
    "force_refresh": true,
    data: {
      block:"consent"
    }
  };

  //DEVICE REQUIREMENTS
  var devices_asynch = {
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
        return '<p>You must use a desktop or laptop computer to participate in this experiment.</p>';
      } 
      if(data.browser !== 'chrome'){
        return '<p>This study must be completed in the <b style="color:red">Chrome</b> web browser. To continue, please open Chrome, and copy/paste the URL from the address bar.</p>'
      }
      else { //size violation
        return '<p>You have indicated that you cannot increase the size of your browser window.</p> <p> If you <i>can</i> maximize your window, please do so now, and press the REFRESH button.</p> <p>Otherwise, you can close this tab.</p>';
      }
    }
  };

  //SETUP FOR ASYNCH
  var setup_asynch = {
    type: jsPsychInstructions,
    pages: [
    '<h2>This study will require [15-30] minutes of your <b>undivided</b> attention.',
    'Once you start the study, we ask that you <b>do not leave this browser window.</b>',
    'Please <b>do not</b> take any breaks, or switch to another tab or application.'+
    '<br>(we collect data on whether you click outside this browser tab ;) ',
    'Please take a moment (now) to <b> silence your phone.</b>',
    'Please take a moment (now) to <b> turn off notifications</b> on your computer. <br>(MAC: Do Not Disturb, WINDOWS: Focus Assist)',
    'Please make your best effort to complete the study tasks, <b>without</b> consulting additional resources (aka. the internet)',
    '<h2> We understand your time is valuable. <br> Thank you for contributing to our research with your earnest effort! </h2>'
    ],
    show_clickable_nav: true,
    allow_backward: false,
    key_forward: 'Enter'
  }

  //SETUP FOR SYNCH
  //assumes experimenter leads through 
  //silencing notifications
  var setup_synch = {
    type: jsPsychInstructions,
    pages: [
    '<h2>This study will require [15-30] minutes of your <b>undivided</b> attention.',
    'Once you start the study, we ask that you <b>do not leave this browser window.</b>',
    'Please <b>do not</b> take any breaks, or switch to another tab or application.'+
    '<br>(we collect data on whether you click outside this browser tab ;) ',
    'Please make your best effort to complete the study tasks, <b>without</b> consulting additional resources (aka. the internet)',
    'To receive credit for your participation, please DM the experimenter with the ID CODE you receive on the LAST page of the study',
    '<h2> We understand your time is valuable. <br> Thank you for contributing to our research with your earnest effort! </h2>'
    ],
    show_clickable_nav: true,
    allow_backward: false,
    key_forward: 'Enter'
  }

  //ENTER FULLSCREEN
  var enter_fullscreen = {
    type: jsPsychFullscreen,
    message: '<p>You will now enter fullscreen mode.</p>',
    fullscreen_mode: true
  }

  //EXIT FULLSCREEN
  var exit_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: false
  }

  //TASK INSTRUCTIONS
  var task_instructions = {
    type: jsPsychExternalHtml,
    url: "../src/instructions.html",
    force_refresh: true,
    "cont_btn": "start",
    // on_start: function(){
    //   scenarios=scenarios;
    // },
    data: {
      block:"task_instructions"
    }
};

  //SCENARIO START
  var scenario_1 = {
    type: jsPsychImageKeyboardResponse,
    stimulus : '../media/acme_1.png',
    choices: ['Enter'],
    stimulus_height :  window.innerHeight,
    maintain_aspect_ratio : true,
    data: {
      block:"scenario"
    },
    on_start: function(data){}  
  };

  //SCENARIO CONTINUE
  var scenario_2 = {
    type: jsPsychImageKeyboardResponse,
    stimulus : '../media/acme_2.png',
    choices: ['Enter'],
    stimulus_height :  window.innerHeight,
    maintain_aspect_ratio : true,
    data: {
      block:"scenario"
    },
    on_start: function(data){}  
  };

  //ENCOURAGEMENT
  var almost_there = {
    type: jsPsychHtmlButtonResponse,
    data:{
      block:"almost_there"
    },
    stimulus: '<img src="../media/almost_done_puppy.jpeg"</img>',
    choices: ['Continue',],
    // prompt: "<p>Thank you for your effort! You're almost done!</p>"
  };

  //EFFORT RATINGS
  var effort_rating = {
    type: jsPsychSurvey,
    data:{ block:"effort" },
    pages: [
      [ 
        {
          type: 'html',
          prompt: '<h2>Please answer the following questions about your approach to completing the previous task.</h2>',
        },
        {
          type: 'html',
          prompt: '<i>Your honest responses will help us correctly interpret our data.</i>',
        },
        {
          type: 'drop-down',
          prompt: "Which of the following best describes the amount of effort you put into the task?", 
          name: 'effort', 
          options: ['I tried my best on each question', 'I tried my best on most questions', 'I started out trying hard, but gave up at some point', "I didn't try very hard, or rushed through the questions"], 
          required: true,
        }, 
        {
          type: 'likert',
          prompt: 'How difficult was the task?',
          name:'difficulty',
          likert_scale_min_label: 'Very Easy',
          likert_scale_max_label: 'Very Hard',
          required: true,
          likert_scale_values: [
            {value: 1},
            {value: 2},
            {value: 3},
            {value: 4},
            {value: 5}
          ]
        },
        {
          type: 'likert',
          prompt: 'How well (how correctly) do you think you performed the task?',
          name:'confidence',
          likert_scale_min_label: 'Very Poorly',
          likert_scale_max_label: 'Very Well',
          required: true,
          likert_scale_values: [
            {value: 1},
            {value: 2},
            {value: 3},
            {value: 4},
            {value: 5}
          ]
        },
        {
          type: 'likert',
          prompt: 'How enjoyable was the task?',
          name:'enjoyment',
          likert_scale_min_label: 'Boring',
          likert_scale_max_label: 'Interesting',
          required: true,
          likert_scale_values: [
            {value: 1},
            {value: 2},
            {value: 3},
            {value: 4},
            {value: 5}
          ]
        },
        {
          type:'text',
          prompt:"What else do you think would be useful for us to know about your experience?",
          name:"other",
          textbox_rows: 2
        } 
      ]
    ],
    button_label_finish: 'Continue'
  };
  
  //DEMOGRAPHICS SURVEY
  var demographics_sona = {
    type: jsPsychSurvey,
    data:{ block:"demographics" },
    pages: [
      [ 
        {
          type: 'html',
          prompt: '<h2>Please answer the following questions about yourself.</h2>',
        },
        {
          type: 'text',
          prompt: "How old are you?", 
          name: 'age', 
          textbox_columns: 5,
          required: true,
        },
        {
          type: 'text',
          prompt: "In what country have you lived most of your life?", 
          name: 'country', 
          textbox_columns: 15,
          required: true,
        },
        {
          type: 'drop-down',
          prompt: "What is your first language?", 
          name: 'language', 
          options: ['English', 'Mandarin', 'Cantonese', 'Korean', 'German','Arabic','French','Spanish','X-Other'], 
          required: true,
          option_reorder: "asc"
        }, 
        {
          type: 'drop-down',
          prompt: "What is your year in school?", 
          name: 'schoolyear', 
          options: ['First', 'Second', 'Third', 'Fourth', 'Fifth','Grad Student','X-OTHER'], 
          required: true
        }, 
        {
          type: 'drop-down',
          prompt: "What is your major area of study?", 
          name: 'major', 
          options: ["Math or Computer Sciences","Social Sciences (incl. CogSci)", "Biomedical & Health Sciences",
                                "Natural Sciences","Engineering","Humanities","Fine Arts"],
          required: true
        }, 
        {
          type: 'drop-down',
          prompt: "What is your gender identity?", 
          name: 'gender', 
          options: ['Other-Not Listed','Male','Female'], 
          required: true
        },
        {
          type:'text',
          prompt:"Do you have any impairments or disabilities you believe may have influenced your performance on this task?",
          name:"disability",
          textbox_rows: 2
        } 
      ]
    ],
    button_label_finish: 'Continue'
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

    if (scoring){ //scoring is not null, otherwise bypass
      data.correct = scoring[0];
      data.discriminant = scoring[1];
      data.strict = scoring[2];
      data.tri_score = scoring[3];
      data.orth_score = scoring[4];
      data.other_score = scoring[5];
    }

    if(isNaN(data.q)) {//save free response
      data.freeresponse = data.response[3]
    }

    data.answer = data.response[0];
    data.hovered = data.response[1];  
    data.mouselog = data.response[2];
    data.response = [];//remove for redundancy

    //suppress mouse data on SGCX demo
    if (study == "SGCX"){
      data.mouselog = "";
      data.mouse_tracking_data = "";
      data.mouse_tracking_targets = "";
    }
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
    // {type: jsPsychExtensionWebgazer, params: { 
    //   targets:['#testingButton','#leftDiv','#rightDiv','#theGraph']
    // }}
  ],
  response_el: 'answer', //name of element where response is stored
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
  mode = urlvar.mode ?? 'asynch';
  pool = urlvar.pool ?? 'sona';
  exp_id = urlvar.exp_id ?? "" ; //SONA EXPERIMENT ID for deciding which study to grant credit to
  sona_id = urlvar.sona_id ?? ""; //SONA SUBJECT ID  for auto credit grant 

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
    condition:condition,
    pool: pool, 
    mode: mode,
    exp_id: exp_id,
    sona_id: sona_id
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

      //last question q="F" is freeresponse, q="F" to bypass scoring
      let free = "Please describe how to determine what event(s) start at 12pm?";

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
        { q:7,  impasse: 1, question: questions[7],  datafile: datas[7],  graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[7] , block: "item_test" },
        { q:8,  impasse: 1, question: questions[8],  datafile: datas[8],  graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[8] , block: "item_test" },
        { q:9,  impasse: 1, question: questions[9],  datafile: datas[9],  graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[9] , block: "item_nondiscriminant"},
        { q:10, impasse: 1, question: questions[10], datafile: datas[10], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[10], block: "item_test" },
        { q:11, impasse: 1, question: questions[11], datafile: datas[11], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[11], block: "item_test" },
        { q:12, impasse: 1, question: questions[12], datafile: datas[12], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[12], block: "item_test" },
        { q:13, impasse: 1, question: questions[13], datafile: datas[13], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[13], block: "item_nondiscriminant" },
        { q:14, impasse: 1, question: questions[14], datafile: datas[14], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[14], block: "item_test" },
        { q:15, impasse: 1, question: questions[15], datafile: datas[15], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[15], block: "item_test" },   
        //FREE RESPONSE QUESTION
        { q:"f", impasse: 1, question: free,          datafile: datas[15], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: "free", block: "item_free" }   
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
      
    //CHECK FOR SHORTCUT —— JUMP TO THIS QUESTION (repeats q x 2)
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
 
  //--------- ASSEMBLE PROCEDURE BLOCKS ----------/    
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

  // PLACEHOLDER KEEP GOING! 

  //STIMULUS PROCEDURE
  var procedure = {
      timeline: [scenario_1, block_scaffold, scenario_2, block_test]
  }

  //MANUAL CREDIT GRANT
  var finish_synch = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<p> Your subject code is: <b>'+sid+'</b></p>',
    prompt: "<p style='color:red'>To receive SONA CREDIT, please DM the experimenter with your NAME and subject code now.</p> <br> <i>PRESS ENTER TO FINISH</i>",
    choices: ["Enter"]
  };


  //NOTES ON AUTO ASSIGNMENT OF SONA CREDIT 
  
  //see https://www.sona-systems.com/help/jspsych.aspx
  //also https://www.sona-systems.com/help/integration_test.aspx
  
  // 1 | change the Study URL so it includes ?sona_id=%SURVEY_CODE% in the URL
  // 2 | Having completed Step 1 ... the Study Information on your Sona Systems site now displays two URLs labeled "Completion URLs". T
  //    similar to: https://yourschool.sona-systems.com/webstudy_credit.aspx?experiment_id=123&credit_token=4e48f9b638a&survey_code=XXX" 

  //EG FOR 21JH01
  //client side https://ucsd.sona-systems.com/webstudy_credit.aspx?experiment_id=2218&credit_token=9a51e0fbf8c4403bbb31ef602025647b&survey_code=XXXX
  //server side https://ucsd.sona-systems.com/services/SonaAPI.svc/WebstudyCredit?experiment_id=2218&credit_token=9a51e0fbf8c4403bbb31ef602025647b&survey_code=XXXX

  //In jsPsych, go to the source code of the task for the experiment 
  //Add lines similar to the following block for both on_finish line 
  //and the line beginning with let sona_id. 
  //Use the Completion URL (client-side) from the Study Information Page in Sona. 
  //Add lines similar to the following on_finish line to your experiment 
  //(the URL you saved from the prior step with +sona_id after it as shown in example below) 
  //and the line defining sona_id at the top.
  
  
  //SONA ASYNCH CREDIT GRANT 
  var grant_sona = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<p> Your subject code is: <b>'+sid+'</b></p>',
    prompt: "<p style='color:red'>To receive SONA CREDIT, please press ENTER now.</p>",
    choices: ["Enter"]
  };

  //--------- TIMELINE ----------/

    //ASSEMBLE TIMELINE
    timeline.push(preload);
    timeline.push(welcome);
    // timeline.push(consent);
    // timeline.push(browsercheck);
    // if (mode == "synch") {
    //   timeline.push(setup_synch);
    // }
    // else {
    //   timeline.push(devices_asynch);
    //   timeline.push(setup_asynch);
    // }
    // timeline.push(enter_fullscreen);
    // timeline.push(task_instructions);
    // timeline.push(procedure);
    timeline.push(almost_there);
    // timeline.push(effort_rating);
    // if (pool != "sona"){
    //   //TODO MAKE GENERAL DEMOGRAPHICS
    // } else {
    //   timeline.push(demographics_sona);
    // }
        
    if (mode == "synch") {timeline.push(finish_synch);} //prompt user to DM experimenter with SID for manual sona grant
    timeline.push(exit_fullscreen);

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
  // alert("TODO! FOR SCORING, COMPARE # RESPONSES! see r")

  if (isNaN(q)){
    return null;
  }

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

