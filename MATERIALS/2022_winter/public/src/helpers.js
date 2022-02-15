
//SUMMARIZE INTERACTION DATA 
let sumIxn = function (jsp){
  const data = jsp.data.getInteractionData();
  var interaction_data = {
    block:"interaction",
    interaction: data,
    //get number of entries in the 'trials' [number of disruptive events fired]
    //divide by 2 bc 2 events fired for every departure
    violations: (Object.keys(data["trials"]).length)/2
  };
  return interaction_data;
}

//SUMMARIZE SUBJECT LEVEL DATA 
let sumSubject = function (jsp){
  const data = jsp.data.get().first(); //get just the last trial
  const brwsr = jsp.data.get().filter([{trial_type: "browser-check"}]);
  const ixn = jsp.data.getInteractionData();
  var subject_data = {
     block:"participant",
     subject:data.select("subject").values[0],
     study:data.select("study").values[0],
     session:data.select("session").values[0],
     condition:data.select("condition").values[0],
     browser: brwsr.select("browser").values[0],
     width : brwsr.select("width").values[0],
     height : brwsr.select("height").values[0],
     os : brwsr.select("os").values[0],
     refresh_rate: brwsr.select("refresh_rate").values[0],
     starttime:jsp.getStartTime(),
     totaltime:jsp.getTotalTime(),
     violations: (Object.keys(ixn["trials"]).length)/2
  };
  return subject_data;
}





//check value of consent checkbox
var check_consent = function(elem) {
  if ($('#consent_checkbox').is(':checked')) {
    return true;
  } else {
    alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
    return false;
  }
  return false;
};

//check value of consent checkbox
var check_consent = function(elem) {
  if ($('#consent_checkbox').is(':checked')) {
    return true;
  } else {
    alert("If you wish to participate, you must check the box next to the statement 'I confirm I am using a LAPTOP or DESKTOP computer with a KEYBOARD and MOUSE or TRACKPAD.' If you ARE NOT using an approved device you cannot complete the study, and can close your browser window. ");
    return false;
  }
  return false;
};

var check_draw = function(elem) {
  var validated = true;
  if($('#check-name').is(':not(:checked)')){validated = false;}
  if($('#check-sess').is(':not(:checked)')){validated = false;}
  if($('#check-title').is(':not(:checked)')){validated = false;}
  if($('#check-axes').is(':not(:checked)')){validated = false;}
  if($('#check-tick').is(':not(:checked)')){validated = false;}
  if($('#check-data').is(':not(:checked)')){validated = false;}
  if (!validated) {
    alert ("Make sure you've checked every item on the checklist!");
  }
  return validated;
};


//evaluate correctness of answer onSubmit
// function checkTriangularAnswer() {
//   console.log("end clicked: "+clicked);
//   console.log("end hovered: "+hovered);
//   var selected = [];
//     $ (':checked').not('.onoffswitch-checkbox').each(function() { //check each checkbox except help toggle
//     selected.push(""+$(this).attr('value')+"");
//   });
//   var index = scenario+"."+question+"."+impasse;
//   if ( _.isEqual(selected, triangular_answers[index])) {
//      correct = 1; }
//   else {
//     correct = 0;
//   }
//   console.log("selected: "+selected);
//   answer = selected;
//   // console.log("triangle_correct"+correct);
//   checkOrthogonalAnswer();
  
//   // //add response element
//   $('#answer').val(selected.toString());
//   // d.setAttribute("id","ANSWER");
//   // d.setAttribute('value', "testanswer");
  
// }

// function checkOrthogonalAnswer(){
//   console.log("end clicked: "+clicked);
//   console.log("end hovered: "+hovered);
//   var selected = [];
//     $ (':checked').not('.onoffswitch-checkbox').each(function() { //check each checkbox except help toggle
//     selected.push(""+$(this).attr('value')+"");
//   });
//   var index = scenario+"."+question+"."+impasse;
//   if ( _.isEqual(selected, orthogonal_answers[index])) {
//     orth_correct = 1; }
//   else {
//     orth_correct = 0;
//   }
//   console.log("selected: "+selected);
//   answer = selected;
//   // console.log("orthogonal_correct"+orth_correct);
// }

// function submitStrategy(){
//     console.log("submitting strategy");
//     answer = $("textarea").val();
//     console.log(answer);
// }
