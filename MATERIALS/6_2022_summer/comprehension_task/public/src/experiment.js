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
// pool = ? //default "sona" also allow "prolific"
// exp_id = ? //survey code in sona for deciding which study to grant credit to ALSO PROLIFIC CODE
// SONA STUDY 21JH01 = 2218
// sona_id = ? //survey code from SONA for automatically granting credit [only for asynch study types] //ALSO PROLIFIC ID
// q = [1...15] //jump to question
// condition = (min 3 digit, see below)  

//PROFLIFIC SPECFIC 
//PROLIFIC_PID={{%PROLIFIC_PID%}}&STUDY_ID={{%STUDY_ID%}}&SESSION_ID={{%SESSION_ID%}}


    //CONDITION : 8 digit code 
    // [EXPLICIT] [IMPASSE] [GRID] [MARK] [IXN] [AXIS ROTATION][LABEL ROTATION] [SHAPE]

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

    //AXIS ROTATION
    //    1 = normal 0 deg
    //    2 = rotate 45deg 
    //    3 = rotate 90deg 

    //LABEL ROTATION
    //    1 = normal 0 deg
    //    2 = rotate 45deg 
    //    3 = rotate 90deg 

    //SHAPE
    //    1 = isoceles (default)
    //    2 = equilateral (height * 0.5*Math.sqrt(3) //equaliateral?)
    

//--------------------------------------------------------------------

//INITIALIZE JSPSYCH & TIMELINE
var timeline = [];
var jsPsych = initJsPsych({
  extensions: [
    { type: jsPsychExtensionMouseTracking},
    // { type: jsPsychExtensionWebgazer}]
  ],
  on_finish: function(){  

    //get last trial type
    const last = jsPsych.data.get().last(); //get just the last trial
    let last_type = last.select("trial_type").values[0];

    //generate subject summary
    jsPsych.data.get().push(sumSubject(jsPsych)); 
    
    //generate ixn summary  
    jsPsych.data.get().push(sumIxn(jsPsych)); 
    
    //display data to screen
    jsPsych.data.displayData(); //display all data to screen

    //SAVE DATA TO DATABASE
    if (!urlvar.q){
      $.ajax({
        type: "POST",
        url: "/experiment-data",
        data: JSON.stringify(jsPsych.data.get()),
        contentType: "application/json"
      })
      .done(function() {
        console.log("----DATA SAVED TO DATABASE!-----");
        //IF THE SUBJECT DIDN'T BROWSER-FAIL OUT
        if (last_type != "browser-check"){
          //assign sona credit for SGC3A via 21JH01
          // if(exp_id == 2218) {
            if (pool == "sona"){
              console.log("ASSIGNING SONA CREDIT FOR STUDY: "+exp_id)
              window.open(grant_sona[exp_id]+sona_id, '_blank'); //open in new tab
            }

            if (pool == "prolific"){
              console.log("ASSIGNING PROLIFIC CREDIT FOR STUDY: "+exp_id)
              window.open(grant_prolific, '_blank'); //open in new tab
            }
          // }
          window.location.assign('src/debrief.html');
        }
      })
      .fail(function() {
        alert("A problem occurred while writing to the database. Please contact the researcher for more information.")
        // window.location.href = "/";
      })  
    }
   
  }
});

//--------------- INITIALIZE GLOBAL VARIABLES  -------------------//  

//DEFINE CONDITIONS PER STUDY
const studies = {
  //the impasse hypothesis
  SGC3A: ["111","121"],
  //the impasse VS explicit hypothesis
  SGC3B: ["111", "121", "211", "221", "311","321"],
  //the grid hypothesis hypothesis
  SGC4A: ["115","114","113"], //+ 111 (prioritize unique collection first) should be 111,113,114,115
  //SGC4A: ["111"], //fill the n last 
  //the mark hypothesis hypothesis
  SGC4B: ["1112","1113"], //should be 111,113,115, | 1112, 1132, 1152 | 1113, 1133, 1153 
  //SGC4B: ["1111"] fill the n last
  //the rotation hypothesis
  // [isoceles] orthog-45, orthog-90, tri-45, tri-90
  //ISOCELESES SHAPE  ["11111221","11111331","11311221","11311331"]
  //EQUILATERAL SHAPE ["11111222","11111332","11311222","11311332"]
  SGC4C: ["111111","111112","113112"], 
  //the SHAPE hypothesis
  //      orth-isoc   orth-equil  tri-isoc    tri-equil
  // SGC4D: ["1111111", "11111112", "11311111" , "11311112"], //[FULL STUDY]
  SGC4D: ["11111112", "11311112"], //[JUST NEW conditions]
  //the INTERACTION hypothesis
  SGC5A: ["11115","11111"]
};

//SET SONA REDIRECTS
const grant_sona = {
  2218:  "https://ucsd.sona-systems.com/webstudy_credit.aspx?experiment_id=2218&credit_token=9a51e0fbf8c4403bbb31ef602025647b&survey_code=", //running on 21JH01
  2217:  "https://ucsd.sona-systems.com/webstudy_credit.aspx?experiment_id=2217&credit_token=4da88233b56842b7b57bb7a03bdb2311&survey_code="  //running on 21JH02
}

//SET PROLIFIC REDIRECTS
const grant_prolific = "https://app.prolific.co/submissions/complete?cc=63BEB07F";


//DEFINE VALID VALUES PER DIGIT CONDITION
const conditions = {
  1: ["1","2","3"],          //explicit | 1=none, 2=img, 3=ixv hover
  2: ["1","2"],              //impasse | 1=none, 2=impasse
  3: ["1","2","3","4","5"],  //grid | 1=fullorthog, 2=partorthog, 4=sparse orthog, 3=tri, 5=grid
  4: ["1","2","3"],          //mark | point, arrow, cross
  5: ["1","2","3","4","5"],  //ixn | check box ... 5=click point
  6: ["1","2","3"],          //axis orientation | 1= 0, 1= 45degree, 2= 90 degree
  7: ["1","2","3"],          //label orientation | 1= 0, 1= 45degree, 2= 90 degree
  8: ["1","2"]               //triangle shape | 1=isoceles; 2=equilateral
}

//INITIALIZE GLOBAL VARIABLES 
let study, session, condition, mode, pool, sona_id, exp_id, urlvar;
let sid, explicit, impasse, grid, mark, ixn, colorClick, arotation, lrotation, shape, scale, question_file; 
let graph, gwidth, gheight, q;
let block, correct, orth_correct;
let procedure_timeline, scaffold_timeline, test_timeline, free;

//INITIALIZE QUESTIONS ARRAYS [read from file]
var questions = ["NULL"]; //q number
var relations = ["NULL"]; //temporal relation
var datas = ["NULL"]; //data set
var ns = ["NULL"]; //num items in dataset
var tri_answers = ["NULL"]; //items selected for tri 
var also_answers = ["NULL"]; //index as null
var orth_answers = ["NULL"]; //index as null
var tvsky_answers = ["NULL"]; //index as null
var satisf_answers = ["NULL"]; //index as null


//--------------- DEFINE  TIMELINE COMPONENTS -------------------//  

  //PRELOAD MEDIA
  var preload = {
    type: jsPsychPreload,
    data:{block:"preload"},
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
    data: {block:"welcome"},
  };

  //INFORMED CONSENT
  var consent = {
    "type": jsPsychExternalHtml,
    "url": "../src/consent.html",
    "cont_btn": "start",
    "force_refresh": true,
    data:{block:"consent"},
  };

  //DEVICE REQUIREMENTS
  var devices = {
    type: jsPsychImageKeyboardResponse,
    stimulus : '../media/devices.png',
    choices: ['Enter'],
    stimulus_height :  window.innerHeight,
    maintain_aspect_ratio : true,
    data: {block:"devices"},
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
        return '<p>You have indicated that you cannot increase the size of your browser window.</p>'+
        '<p> If you <i>can</i> maximize your window, please do so now, and press the REFRESH button.</p>'+ 
        '<p>Otherwise, you will (unfortunately) be unable to complete this study.</p>'+ 
        '<p style = "color:red"> Your SONA record will be updated to EXCUSED NO SHOW (no penalty to yourself).</p>'+
        '<p style = "color:black"> You can now close this tab.</p>';
      }
    },
    data:{block:"browser_check"},
  };

   //BROWSER CHECK
   var browserrecord = {
    type: jsPsychBrowserCheck,
    data:{block:"browser_record"},
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
    key_forward: 'Enter',
    data:{block:"setup"},
  }

  //SETUP FOR SYNCH
  var setup_synch = {
    //assumes experimenter leads through silencing notifications
    type: jsPsychInstructions,
    pages: [
    '<h2>This study will require [15-30] minutes of your <b>undivided</b> attention.',
    'Once you start the study, we ask that you <b>do not leave this browser window.</b>',
    'Please <b>do not</b> take any breaks, or switch to another tab or application.'+
    '<br>(we collect data on whether you click outside this browser tab ;) ',
    'Please make your best effort to complete the study tasks, <b>without</b> consulting additional resources (aka. the internet)',
    '<p style = "color:red"> To receive credit for your participation, please message the experimenter with the ID CODE you receive on the LAST page of the study</p>',
    '<h2> We understand your time is valuable. <br> Thank you for contributing to our research with your earnest effort! </h2>'
    ],
    show_clickable_nav: true,
    allow_backward: false,
    key_forward: 'Enter',
    data:{block:"setup"},
  }

  //ENTER FULLSCREEN
  var enter_fullscreen = {
    type: jsPsychFullscreen,
    message: '<p>You will now enter fullscreen mode.</p>',
    fullscreen_mode: true,
    data: {block:"fullscreen"}
  }

  //EXIT FULLSCREEN
  var exit_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: false,
    data: {block:"fullscreen"}
  }

  //TASK INSTRUCTIONS
  var instructions = {
    type: jsPsychExternalHtml,
    url: "../src/instructions.html",
    force_refresh: true,
    "cont_btn": "start",
    // on_start: function(){
    //   scenarios=scenarios;
    // },
    data: {
      block:"instructions"
    }
};

  //SCENARIO START
  var scenario_1 = {
    type: jsPsychImageKeyboardResponse,
    stimulus : '../media/acme_1.png',
    choices: ['Enter'],
    stimulus_height :  window.innerHeight,
    maintain_aspect_ratio : true,
    data: {block:"scenario"}
  };

  //SCENARIO CONTINUE
  var scenario_2 = {
    type: jsPsychImageKeyboardResponse,
    stimulus : '../media/acme_2.png',
    choices: ['Enter'],
    stimulus_height :  window.innerHeight,
    maintain_aspect_ratio : true,
    data: {block:"scenario"}
  };

  //ENCOURAGEMENT
  var almost_there = {
    type: jsPsychHtmlButtonResponse,
    data:{block:"almost_there"},
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
  
  //DEMOGRAPHICS SURVEY FOR SONA PARTICIPANTS
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

  //DEMOGRAPHICS SURVEY FOR NON-SONA
  var demographics_general = {
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
          prompt: "What is your highest completed level of education? ", 
          name: 'schoolyear', 
          options: ['Primary School', 'Secondary School/Highschool', 'some college', 'Associates Degree', 'Bachelors Degree','Graduate Degree','X-OTHER'], 
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

  //MANUAL CREDIT GRANT
  var finish_synch = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<p> Your subject code is: <b>'+sid+'</b></p>',
    prompt: "<p style='color:red'>To receive SONA CREDIT, please DM the experimenter with your NAME and subject code now.</p> <br> <i>PRESS ENTER TO FINISH</i>",
    choices: ["Enter"]
  };
  
  //STIMULUS TRIAL
  var stimulus = {
    type: jsPsychExternalHtml,
    url: '../src/stimulus.html',
    execute_script: true,
    force_refresh:true,
    cont_btn: "testingButton",
    on_start: function(){
      if(session != "blank"){ //don't track in mouseflow if session is not set in querystring
        window._mfq.push(["newPageView", "/"+this.data.q]);
      }
    },
    on_finish: function(data) {
      console.log("SAVING ANSWER");
      console.log($(data.response[0]));
      let scoring = score(data.response[0], data.q);

      if (scoring){ //scoring is not null, otherwise bypass
        console.log("scoring is not null");
        data.correct = scoring[0];
        data.discriminant = scoring[1];
        data.tri_score = scoring[2];
        data.orth_score = scoring[3];
        data.other_score = scoring[4];
        data.blank_score = scoring[5];

        //PUSH mouseflow answers  
        if(session != "blank"){ //don't track in mouseflow if session is not set in querystring
          window._mfq.push(["setVariable", "TRI_CORRECT", scoring[2]]);
          window._mfq.push(["setVariable", "ORTH_CORRECT", scoring[3]]);
          window._mfq.push(["setVariable", "BLANK?", scoring[5]]);
          window._mfq.push(["setVariable", "SCORE", scoring[1]]);
          window._mfq.push(["setVariable", "RESPONSE", data.response[0]]);
        }
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

      //ADD MOUSEFLOW VARIABLES
      window._mfq.push(["setVariable", "SID", sid]);
      window._mfq.push(["setVariable", "STUDY", study]);
      window._mfq.push(["setVariable", "CONDITION", condition]);
      window._mfq.push(["setVariable", "SESSION", session]);
      window._mfq.push(["setVariable", "POOL", pool]);
      window._mfq.push(["setVariable", "MODE", mode]);
      window._mfq.push(["setVariable", "Q", q]);

      window._mfq.push(["setVariable", "EXPLICIT", data.explicit]);
      window._mfq.push(["setVariable", "IMPASSE", data.impasse]);
      window._mfq.push(["setVariable", "GRID", data.grid]);
      window._mfq.push(["setVariable", "MARK", data.mark]);
      window._mfq.push(["setVariable", "IXN", data.ixn]);
      window._mfq.push(["setVariable", "AXIS ROTATION", data.arotation]);
      window._mfq.push(["setVariable", "LABEL ROTATION", data.lrotation]);
      window._mfq.push(["setVariable", "SHAPE", data.shape]);
   
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
      arotation:  jsPsych.timelineVariable('arotation'),
      lrotation:  jsPsych.timelineVariable('lrotation'),
      shape:  jsPsych.timelineVariable('shape'),
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
  urlvar = jsPsych.data.urlVariables();
  study = urlvar.study ?? 'SGCX';   //default to demo
  session = urlvar.session ?? "blank"; 
  condition = urlvar.condition ?? 'R'; //default to random assign
  condition = condition.toString();
  mode = urlvar.mode ?? 'asynch'; //asynch or synch delivery
  pool = urlvar.pool ?? 'sona'; //sona or prolific or amt
  exp_id = urlvar.exp_id ?? "" ; //SONA EXPERIMENT ID for deciding which study to grant credit to
  sona_id = urlvar.sona_id ?? ""; //SONA SUBJECT ID  for auto credit grant 
  q = urlvar.q; //demo mode jump straight to q
  graph = urlvar.graph ?? "triangular" //need to handle errors
  gwidth = urlvar.gwidth ?? 600; //graph width 
  gheight = urlvar.gheight ?? 600; //graph height
  
  //ASSIGN SUBJECT ID 
  sid = jsPsych.randomization.randomID(5).toUpperCase();

  //VALIDATE STUDY 
  if (Object.keys(studies).indexOf(study) == -1 && (study != "SGCX")) {
    alert("INVALID STUDY CODE");
  }

  //set condition as default control 
  if (study == 'SGCX' && condition == "R"){
    condition = '11111';
  }
  else {
    //SET CONDITION
  //validate condition from querystring, and random assign
  switch(condition){
    
    //RANDOM ASSIGN
    case "R":   
      condition = randomAssign(study);
      break;
    
    //VALIDATE CONDITION FORM
    default:
      
      //IS CONDITION LONG ENOUGH?
      var temp = condition.split('');
      if(temp.length < 3) {
        alert("INVALID CONDITION CODE (minimum 3 digits");
      }
      
      //IS CONDITION IN VALID FORM?
      if (study == "SGCX"){ //allow any valid condition code  
        temp.forEach(function(value, index, array){
         if (!conditions[index+1].includes(value)){
            alert("INVALID CONDITION CODE: no "+value+" in "+(index+1)+" position");
          };
        });
      }
      
      //temporarily allow study-condition ovverid
      //IS CONDITION VALID FOR GIVEN STUDYSTUDY?
      // else { //allow conditions in study
      //   if(! studies[study].includes(condition)){
      //     alert("INVALID CONDITION FOR STUDY CODE");
      //   }
      // }
      
      //TODO ERROR HANDLING (DON'T CONTINUE STUDY)
      break;
  }
  }
  
  //SET PARAMETERS
  explicit = condition.charAt(0);
  impasse = condition.charAt(1); 
  grid = condition.charAt(2); 
  mark = condition.charAt(3) || 1; //changed from ?? to || 
  ixn =  condition.charAt(4) || 1; 
  arotation =  condition.charAt(5) || 1; 
  lrotation =  condition.charAt(6) || 1; 
  shape =  condition.charAt(7) || 1; 
  colorClick = (ixn == 5 ) ; //only checkbox 
  question_file = "src/data/questions/SGC3A_"+impasse+"_questions.csv";

  console.log("SUBJECT: "+sid);
  console.log("STUDY: "+study);
  console.log("SESSION: "+session);
  console.log("CONDITION: "+condition);
  console.log("POOL: "+pool);
  console.log("MODE: "+mode);
  console.log("Q: "+q);
  console.log("explicit: "+explicit);
  console.log("impasse: "+impasse);
  console.log("grid: "+grid);
  console.log("mark: "+mark);
  console.log("ixn: "+ixn);
  console.log("axis-rotation: "+arotation);
  console.log("label-rotation: "+lrotation);
  console.log("shape: "+ shape);
  console.log("colorClick: "+colorClick);
  console.log("question_file: "+question_file);


  //ADD STUDY LEVEL PROPERTIES
  jsPsych.data.addProperties({ 
    subject:sid, 
    study:study, 
    session:session,
    condition:condition,
    pool: pool, 
    mode: mode,
    exp_id: exp_id,
    sona_id: sona_id,
    source:"limitless-plains"
  });

}//end function

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
      free = "Please describe how to determine what event(s) start at 12pm?";

      //FIRST FIVE QUESTIONS ARE BASED ON IMPASSE CONDITION [determines dataset]
      scaffold_timeline = [
         { q:1, impasse: impasse, question: questions[1], datafile: datas[1], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[1], block: "item_scaffold" },
         { q:2, impasse: impasse, question: questions[2], datafile: datas[2], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[2], block: "item_scaffold" },
         { q:3, impasse: impasse, question: questions[3], datafile: datas[3], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[3], block: "item_scaffold" },
         { q:4, impasse: impasse, question: questions[4], datafile: datas[4], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[4], block: "item_scaffold" },
         { q:5, impasse: impasse, question: questions[5], datafile: datas[5], graph: graph,  explicit : 1, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[5], block: "item_scaffold" }
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
    case "SGC3B":

      //last question q="F" is freeresponse, q="F" to bypass scoring
      free = "Please describe how to determine what event(s) start at 12pm?";

      //FIRST FIVE QUESTIONS ARE BASED ON IMPASSE CONDITION [determines dataset]
      scaffold_timeline = [
         { q:1, impasse: impasse, question: questions[1], datafile: datas[1], graph: graph,  explicit : explicit, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[1], block: "item_scaffold" },
         { q:2, impasse: impasse, question: questions[2], datafile: datas[2], graph: graph,  explicit : explicit, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[2], block: "item_scaffold" },
         { q:3, impasse: impasse, question: questions[3], datafile: datas[3], graph: graph,  explicit : explicit, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[3], block: "item_scaffold" },
         { q:4, impasse: impasse, question: questions[4], datafile: datas[4], graph: graph,  explicit : explicit, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[4], block: "item_scaffold" },
         { q:5, impasse: impasse, question: questions[5], datafile: datas[5], graph: graph,  explicit : explicit, grid : 1, mark: 1, ixn : 1, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[5], block: "item_scaffold" }
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
    //SGC 4A --> 4 GRID [ maximal, control, minimal, triangular ]
    //PROCEDURE SAME across all conditions
    //CONDITION controls stimuli
    //EXPLICIT = 1, IMPASSE = 1, MARK = 1, IXN = 1, 
    //---------------------------------------------------  
    case "SGC4A" || "SGC4B" || "SGC4C" || "SGC4D" :
      //last question q="F" is freeresponse, q="F" to bypass scoring
      free = "Please describe how to determine what event(s) start at 12pm?";

      //FIRST FIVE QUESTIONS ARE BASED ON IMPASSE CONDITION [determines dataset]
      scaffold_timeline = [
        { q:1,  grid : condition.charAt(2), impasse: 1, question: questions[1],  datafile: datas[1],  graph: "triangular",  explicit : 1, mark: mark, ixn : 1, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[1],  block: "item_test" },
        { q:2,  grid : condition.charAt(2), impasse: 1, question: questions[2],  datafile: datas[2],  graph: "triangular",  explicit : 1, mark: mark, ixn : 1, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[2],  block: "item_test" },
        { q:3,  grid : condition.charAt(2), impasse: 1, question: questions[3],  datafile: datas[3],  graph: "triangular",  explicit : 1, mark: mark, ixn : 1, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[3],  block: "item_test" },
        { q:4,  grid : condition.charAt(2), impasse: 1, question: questions[4],  datafile: datas[4],  graph: "triangular",  explicit : 1, mark: mark, ixn : 1, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[4],  block: "item_test" },
        { q:5,  grid : condition.charAt(2), impasse: 1, question: questions[5],  datafile: datas[5],  graph: "triangular",  explicit : 1, mark: mark, ixn : 1, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[5],  block: "item_test" }
      ]
      
      test_timeline = [
         { q:6,  grid : condition.charAt(2), impasse: 1, question: questions[6],  datafile: datas[6],  graph: "triangular",  explicit : 1, mark: mark, ixn : 1, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[6] , block: "item_nondiscriminant"},
         { q:7,  grid : condition.charAt(2), impasse: 1, question: questions[7],  datafile: datas[7],  graph: "triangular",  explicit : 1, mark: mark, ixn : 1, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[7] , block: "item_test" },
         { q:8,  grid : condition.charAt(2), impasse: 1, question: questions[8],  datafile: datas[8],  graph: "triangular",  explicit : 1, mark: mark, ixn : 1, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[8] , block: "item_test" },
         { q:9,  grid : condition.charAt(2), impasse: 1, question: questions[9],  datafile: datas[9],  graph: "triangular",  explicit : 1, mark: mark, ixn : 1, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[9] , block: "item_nondiscriminant"},
         { q:10, grid : condition.charAt(2), impasse: 1, question: questions[10], datafile: datas[10], graph: "triangular",  explicit : 1, mark: mark, ixn : 1, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[10], block: "item_test" },
         { q:11, grid : condition.charAt(2), impasse: 1, question: questions[11], datafile: datas[11], graph: "triangular",  explicit : 1, mark: mark, ixn : 1, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[11], block: "item_test" },
         { q:12, grid : condition.charAt(2), impasse: 1, question: questions[12], datafile: datas[12], graph: "triangular",  explicit : 1, mark: mark, ixn : 1, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[12], block: "item_test" },
         { q:13, grid : condition.charAt(2), impasse: 1, question: questions[13], datafile: datas[13], graph: "triangular",  explicit : 1, mark: mark, ixn : 1, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[13], block: "item_nondiscriminant" },
         { q:14, grid : condition.charAt(2), impasse: 1, question: questions[14], datafile: datas[14], graph: "triangular",  explicit : 1, mark: mark, ixn : 1, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[14], block: "item_test" },
         { q:15, grid : condition.charAt(2), impasse: 1, question: questions[15], datafile: datas[15], graph: "triangular",  explicit : 1, mark: mark, ixn : 1, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: false, gwidth: gwidth, gheight : gheight, relation: relations[15], block: "item_test" },   
         //FREE RESPONSE QUESTION
         { q:"f", grid : condition.charAt(2),impasse: 1, question: free,          datafile: datas[15], graph: "triangular",  explicit : 1, mark: mark, ixn : 1, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: false, gwidth: gwidth, gheight : gheight, relation: "free", block: "item_free" }   
      ];
      break;
    //---------------------------------------------------
    //SGC 5A --> 
    //PROCEDURE SAME across all conditions
    //CONDITION controls stimuli
    //---------------------------------------------------  
    case "SGC5A" :
      //last question q="F" is freeresponse, q="F" to bypass scoring
      free = "Please describe how to determine what event(s) start at 12pm?";

      //FIRST FIVE QUESTIONS ARE BASED ON IMPASSE CONDITION [determines dataset]
      scaffold_timeline = [
        { q:1,  grid : grid, impasse: impasse, question: questions[1],  datafile: datas[1],  graph: "triangular",  explicit : explicit, mark: mark, ixn : ixn, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[1],  block: "item_test" },
        { q:2,  grid : grid, impasse: impasse, question: questions[2],  datafile: datas[2],  graph: "triangular",  explicit : explicit, mark: mark, ixn : ixn, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[2],  block: "item_test" },
        { q:3,  grid : grid, impasse: impasse, question: questions[3],  datafile: datas[3],  graph: "triangular",  explicit : explicit, mark: mark, ixn : ixn, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[3],  block: "item_test" },
        { q:4,  grid : grid, impasse: impasse, question: questions[4],  datafile: datas[4],  graph: "triangular",  explicit : explicit, mark: mark, ixn : ixn, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[4],  block: "item_test" },
        { q:5,  grid : grid, impasse: impasse, question: questions[5],  datafile: datas[5],  graph: "triangular",  explicit : explicit, mark: mark, ixn : ixn, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[5],  block: "item_test" }
      ]
      
      test_timeline = [
         { q:6,  grid : grid, impasse: impasse, question: questions[6],  datafile: datas[6],  graph: "triangular",  explicit : explicit, mark: mark, ixn : ixn, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[6] , block: "item_nondiscriminant"},
         { q:7,  grid : grid, impasse: impasse, question: questions[7],  datafile: datas[7],  graph: "triangular",  explicit : explicit, mark: mark, ixn : ixn, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[7] , block: "item_test" },
         { q:8,  grid : grid, impasse: impasse, question: questions[8],  datafile: datas[8],  graph: "triangular",  explicit : explicit, mark: mark, ixn : ixn, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[8] , block: "item_test" },
         { q:9,  grid : grid, impasse: impasse, question: questions[9],  datafile: datas[9],  graph: "triangular",  explicit : explicit, mark: mark, ixn : ixn, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[9] , block: "item_nondiscriminant"},
         { q:10, grid : grid, impasse: impasse, question: questions[10], datafile: datas[10], graph: "triangular",  explicit : explicit, mark: mark, ixn : ixn, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[10], block: "item_test" },
         { q:11, grid : grid, impasse: impasse, question: questions[11], datafile: datas[11], graph: "triangular",  explicit : explicit, mark: mark, ixn : ixn, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[11], block: "item_test" },
         { q:12, grid : grid, impasse: impasse, question: questions[12], datafile: datas[12], graph: "triangular",  explicit : explicit, mark: mark, ixn : ixn, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[12], block: "item_test" },
         { q:13, grid : grid, impasse: impasse, question: questions[13], datafile: datas[13], graph: "triangular",  explicit : explicit, mark: mark, ixn : ixn, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[13], block: "item_nondiscriminant" },
         { q:14, grid : grid, impasse: impasse, question: questions[14], datafile: datas[14], graph: "triangular",  explicit : explicit, mark: mark, ixn : ixn, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[14], block: "item_test" },
         { q:15, grid : grid, impasse: impasse, question: questions[15], datafile: datas[15], graph: "triangular",  explicit : explicit, mark: mark, ixn : ixn, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[15], block: "item_test" },   
         //FREE RESPONSE QUESTION
         { q:"f", grid : grid,impasse: impasse, question: free,          datafile: datas[15], graph: "triangular",  explicit : explicit, mark: mark, ixn : ixn, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: "free", block: "item_free" }   
      ];
      break;  
      
    //---------------------------------------------------
    //SGCX --> DEFAULT DEMO
    //ALL PARAMETERS SET BY CONDITION
    //[5 condition] + free response
    //---------------------------------------------------
    default:  //SGCX AND ANYTHING ELSE 
      
    //CHECK FOR SHORTCUT —— JUMP TO THIS QUESTION 
    if (q){
      console.log("JUMPING TO QUESTION: "+q);
      console.log("PRINTING GRID: "+grid);
      test_timeline = [
        { q:q, impasse: impasse, question: questions[q], datafile: datas[q], graph: graph,  explicit : explicit, mark: mark, ixn: ixn, grid : grid, arotation:arotation, lrotation: lrotation, shape: shape, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[q], block: "item" }
      ];
    }

    else { //RUN ALL QUESTIONS BASED ON PARAMETERS 
      //FIRST FIVE QUESTIONS ARE BASED ON IMPASSE CONDITION [determines dataset]
      scaffold_timeline = [
        { q:1, impasse: impasse, question: questions[1], datafile: datas[1], graph: graph,  explicit : explicit, mark: mark, ixn: ixn, grid : grid, arotation: arotation, lrotation: lrotation, shape:shape, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[1], block: "item_scaffold" },
        { q:2, impasse: impasse, question: questions[2], datafile: datas[2], graph: graph,  explicit : explicit, mark: mark, ixn: ixn, grid : grid, arotation: arotation, lrotation: lrotation, shape:shape, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[2], block: "item_scaffold" },
        { q:3, impasse: impasse, question: questions[3], datafile: datas[3], graph: graph,  explicit : explicit, mark: mark, ixn: ixn, grid : grid, arotation: arotation, lrotation: lrotation, shape:shape, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[3], block: "item_scaffold" },
        { q:4, impasse: impasse, question: questions[4], datafile: datas[4], graph: graph,  explicit : explicit, mark: mark, ixn: ixn, grid : grid, arotation: arotation, lrotation: lrotation, shape:shape, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[4], block: "item_scaffold" },
        { q:5, impasse: impasse, question: questions[5], datafile: datas[5], graph: graph,  explicit : explicit, mark: mark, ixn: ixn, grid : grid, arotation: arotation, lrotation: lrotation, shape:shape, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[5], block: "item_scaffold" }
     ];
     
     //NEXT TEN QUESTIONS ARE NOT IMPASSSE STRUCTURE
     test_timeline = [
       { q:6,  impasse: 1, question: questions[6],  datafile: datas[6],  graph: graph,  explicit : explicit, mark: mark, ixn: ixn, grid : grid, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[6] , block: "item_nondiscriminant"},
       { q:7,  impasse: 1, question: questions[7],  datafile: datas[7],  graph: graph,  explicit : explicit, mark: mark, ixn: ixn, grid : grid, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[7] , block: "item_test"},
       { q:8,  impasse: 1, question: questions[8],  datafile: datas[8],  graph: graph,  explicit : explicit, mark: mark, ixn: ixn, grid : grid, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[8] , block: "item_test"},
       { q:9,  impasse: 1, question: questions[9],  datafile: datas[9],  graph: graph,  explicit : explicit, mark: mark, ixn: ixn, grid : grid, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[9] , block: "item_nondiscriminant"},
       { q:10, impasse: 1, question: questions[10], datafile: datas[10], graph: graph,  explicit : explicit, mark: mark, ixn: ixn, grid : grid, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[10], block: "item_test" },
       { q:11, impasse: 1, question: questions[11], datafile: datas[11], graph: graph,  explicit : explicit, mark: mark, ixn: ixn, grid : grid, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[11], block: "item_test" },
       { q:12, impasse: 1, question: questions[12], datafile: datas[12], graph: graph,  explicit : explicit, mark: mark, ixn: ixn, grid : grid, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[12], block: "item_test" },
       { q:13, impasse: 1, question: questions[13], datafile: datas[13], graph: graph,  explicit : explicit, mark: mark, ixn: ixn, grid : grid, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[13], block: "item_nondiscriminant" },
       { q:14, impasse: 1, question: questions[14], datafile: datas[14], graph: graph,  explicit : explicit, mark: mark, ixn: ixn, grid : grid, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[14], block: "item_test" },
       { q:15, impasse: 1, question: questions[15], datafile: datas[15], graph: graph,  explicit : explicit, mark: mark, ixn: ixn, grid : grid, arotation: arotation, lrotation: lrotation, shape: shape, colorClick: colorClick, gwidth: gwidth, gheight : gheight, relation: relations[15], block: "item_test" }   
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

  const procedures = {
    SGC3A: {timeline: [scenario_1, block_scaffold, scenario_2, block_test]},
    SGC3B: {timeline: [scenario_1, block_scaffold, scenario_2, block_test]},
    SGC4A: {timeline: [scenario_1, block_scaffold, scenario_2, block_test]},
    SGC4B: {timeline: [scenario_1, block_scaffold, scenario_2, block_test]},
    SGC4C: {timeline: [scenario_1, block_scaffold, scenario_2, block_test]},
    SGC4D: {timeline: [scenario_1, block_scaffold, scenario_2, block_test]},
    SGC5A: {timeline: [scenario_1, block_scaffold, scenario_2, block_test]},
    SGCX:  {timeline: [block_test]},
  };

  //STIMULUS PROCEDURE
  // var procedure = {
  //     timeline: [scenario_1, block_scaffold, scenario_2, block_test]
  // }
  var procedure = procedures[study]

  //--------- TIMELINE ----------/

    //ASSEMBLE TIMELINE
    
    //skip straight to procedure
    if (urlvar.q) {
      timeline.push(procedure);
    }
    else {
      timeline.push(preload);
      timeline.push(welcome);
      timeline.push(devices);
      timeline.push(browsercheck);
      timeline.push(consent);
      if (mode == "synch") {timeline.push(setup_synch);}
      else {timeline.push(setup_asynch);}
      timeline.push(enter_fullscreen);
      timeline.push(browserrecord); //NOW RECORD BROWSER AGAIN FOR SIZE IN FULLSCREEN
      timeline.push(instructions);
      timeline.push(procedure);
      timeline.push(almost_there);
      timeline.push(effort_rating);
      if (pool != "sona"){
        timeline.push(demographics_general); //has highest education question
      } else {
        timeline.push(demographics_sona); //has year in school question
      }    
      if (mode == "synch") {timeline.push(finish_synch);} //prompt user to DM experimenter with SID for manual sona grant
      timeline.push(exit_fullscreen);
    }
}//end function

//RANDOM ASSIGNMENT TO CONDITION
function randomAssign(study){
  console.log("-- randomizing condition from-- "+studies[study]);
  let x = jsPsych.randomization.shuffle(studies[study]);
  condition = x[0].toString(); 
  return condition;
}

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
        ns.push(d.N);
        tri_answers.push(d.TRIANGULAR) //triangular-correct answers
        also_answers.push(d.also_allow) //question-redundant but acceptable answers
        orth_answers.push(d.ORTHOGONAL) //orthogonal-correct
        tvsky_answers.push(d.TVERSKY); //lines-connecting answer
        satisf_answers.push(d.SATISFICE) //satisficing
      });
      // resolve(questions);
      resolve()
    });
  });
} //end function

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
