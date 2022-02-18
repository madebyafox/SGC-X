

//INITIALIZE JSPSYCH & TIMELINE
var jsPsych = initJsPsych({
    on_start: function(){},
    on_finish: function(){  
      jsPsych.data.displayData(); //display all data to screen
    },
    extensions: [
      { type: jsPsychExtensionMouseTracking},
      { type: jsPsychExtensionWebgazer}]
  });
  var timeline = [];


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

   //WEBGAZER EXAMPLE
    //  timeline.push(preload)
     timeline.push(camera_instructions)
     timeline.push(init_camera)
     timeline.push(calibration_instructions)
     timeline.push(calibration)
     timeline.push(validation_instructions)
     timeline.push(validation)
     timeline.push(recalibrate)
     timeline.push(calibration_done)

    
     jsPsych.run(timeline); //START EXPERIMENT  
    