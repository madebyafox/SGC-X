//@MADEBYAFOX @THOUGHTAFOX
//SGCX — TM stimuli with newest jsPsych

//INITIALIZE JSPSYCH & TIMELINE
var jsPsych = initJsPsych({
  on_finish: function() {
    jsPsych.data.displayData();
  }
});

var timeline = [];
//INITIALIZE GLOBAL VARIABLES 
var scenario, question, scaffold, block, correct, orth_correct ;
var graph = "triangular";
var experiment = "SGCX"; //overriden by URL
var session = "default"; //overriden by codes block
var condition = 0;  //overriden by codes block
var explicit = 1; //overriden by codes block
var impasse = 1; //overriden by codes block
var axis = 1; //overrridden by codes block
var colorClick = true; //define whether values turn green when clicked

var scaffolds = [
  "none",
  "text-image",
  "interactive"
];
var questions = [
  "starttime",
  "starts",
  "meets",
  "endtime",
  "midpoint",
  "duration",
  "duration+starts",
  "duration+contained",
  "starttime+before+endtime+during",
  "ends",
  "starttime",
  "starts",
  "meets",
  "endtime",
  "midpoint",
  "strategy"
];

var q = 0 ; //question number, used for data file override
var scenarios = ["acme","bigset"]; //determine the order of scenarios by randomly sorting the array
var sid = jsPsych.randomization.randomID(5);
sid = sid.toUpperCase();
console.log(sid);

//PRELOAD MEDIA
  var preload = {
    type: jsPsychPreload,
    images: ['../media/welcome.png',
             '../media/devices.png',
             '../media/distractions.png']
  };

// //DEFINE TRIALS 

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


// var relationship = {
//   type: jsPsychSurvey,
//   pages: [
//     [
//       {
//         type: 'html',
//         prompt: 'Please answer the following questions:',
//       },
//       {
//         type: 'multi-choice',
//         prompt: "Which of the following do you like the most?", 
//         name: 'VegetablesLike', 
//         options: ['Tomato', 'Cucumber', 'Eggplant', 'Corn', 'Peas'], 
//         required: true
//       }, 
//       {
//         type: 'multi-select',
//         prompt: "Which of the following do you like?", 
//         name: 'FruitLike', 
//         options: ['Apple', 'Banana', 'Orange', 'Grape', 'Strawberry'], 
//         required: false,
//       }
//     ]
//   ],
// };

// var stimulus = {
//     type: jsPsychExternalHtml,
//     url: '../src/stimulus.html',
//     execute_script: true,
//     force_refresh:true,
//     cont_btn: "submit",
//     on_start: function(){
//       localStorage.setItem("sid",sid);
//       localStorage.setItem("scenario",scenario);
//       localStorage.setItem("question",question);
//     }
// };

var stimulus = {
  type: jsPsychExternalHtml,
  url: '../src/stimulus.html',
  execute_script: true,
  force_refresh:true,
  cont_btn: "testingButton",
  on_finish: function(data) {
    console.log("finished: "+data.internal_node_id);
  },
  on_start: function(){
        localStorage.setItem("graph", "triangular");
        localStorage.setItem("scenario",  scenarios[0]);
        localStorage.setItem("question",  questions[0]);
        localStorage.setItem("q",  1);
        localStorage.setItem("explicit",  explicit);
        localStorage.setItem("impasse",  impasse);
        localStorage.setItem("axis",  axis);
        localStorage.setItem("sid",  sid);
        localStorage.setItem("scaffold",  scaffolds[0]);
        localStorage.setItem("colorClick",colorClick);
        // localStorage.setItem("clicked",  clicked);
          // window._mfq.push(["newPageView", "/1"]);
  }
};
  

  

// //   /* define trial stimuli array for timeline variables */
// //   var test_stimuli = [
// //     { stimulus: "img/blue.png",  correct_response: 'f'},
// //     { stimulus: "img/orange.png",  correct_response: 'j'}
// //   ];

//   /* define fixation and test trials */
// //   var fixation = {
// //     type: jsPsychHtmlKeyboardResponse,
// //     stimulus: '<div style="font-size:60px;">+</div>',
// //     choices: "NO_KEYS",
// //     trial_duration: function(){
// //       return jsPsych.randomization.sampleWithoutReplacement([250, 500, 750, 1000, 1250, 1500, 1750, 2000], 1)[0];
// //     },
// //     data: {
// //       task: 'fixation'
// //     }
// //   };

// //   var test = {
// //     type: jsPsychImageKeyboardResponse,
// //     stimulus: jsPsych.timelineVariable('stimulus'),
// //     choices: ['f', 'j'],
// //     data: {
// //       task: 'response',
// //       correct_response: jsPsych.timelineVariable('correct_response')
// //     },
// //     on_finish: function(data){
// //       data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
// //     }
// //   };

//   /* define test procedure */
// //   var test_procedure = {
// //     timeline: [fixation, test],
// //     timeline_variables: test_stimuli,
// //     repetitions: 5,
// //     randomize_order: true
// //   };
  

//   /* define debrief */
//   var debrief_block = {
//     type: jsPsychHtmlKeyboardResponse,
//     stimulus: function() {

//       var trials = jsPsych.data.get().filter({task: 'response'});
//       var correct_trials = trials.filter({correct: true});
//       var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
//       var rt = Math.round(correct_trials.select('rt').mean());

//       return `<p>You responded correctly on ${accuracy}% of the trials.</p>
//         <p>Your average response time was ${rt}ms.</p>
//         <p>Press any key to complete the experiment. Thank you!</p>`;

//     }
//   };
  

//ASSEMBLE TIMELINE
timeline.push(stimulus);
// timeline.push(preload);
timeline.push(welcome);
// timeline.push(devices);
// timeline.push(browserinstructions);
// timeline.push(browsercheck);
// timeline.push(distractions);

// timeline.push(stimulus2);
//   timeline.push(instructions);
//   timeline.push(test_procedure);
// timeline.push(debrief_block);

//START EXPERIMENT
jsPsych.run(timeline);