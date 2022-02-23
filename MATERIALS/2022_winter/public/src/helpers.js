
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
  const scorable = jsp.data.get().filter([{block:"item_scaffold"}, {block:"item_test"}]);
  var subject_data = {
     block:"participant",
     subject:data.select("subject").values[0],
     study:data.select("study").values[0],
     session:data.select("session").values[0],
     condition:data.select("condition").values[0],
     
     pool: data.select("pool").values[0], 
     mode: data.select("mode").values[0], 
     exp_id: data.select("exp_id").values[0], 
     sona_id: data.select("sona_id").values[0], 

     browser: brwsr.select("browser").values[0],
     width : brwsr.select("width").values[0],
     height : brwsr.select("height").values[0],
     os : brwsr.select("os").values[0],
     refresh_rate: brwsr.select("refresh_rate").values[0],
     starttime:jsp.getStartTime(),
     totaltime:jsp.getTotalTime(),
     violations: (Object.keys(ixn["trials"]).length)/2,
     absolute_score : scorable.select('correct').sum(),
     discriminant_score : scorable.select('discriminant').sum(),
     tri_score : scorable.select('tri_score').sum(),
     orth_score : scorable.select('orth_score').sum(),
     other_score : scorable.select('other_score').sum(),
     blank_score : scorable.select('blank_score').sum()
    //  strict_score : scorable.select('strict').sum()
  };
  return subject_data;

  //don't include scores for 6, 9, 13 [nondiscriminant answers]

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

//check value of drawing check checkboxes
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


//RECORD TRANSFORM RESPONSES TO DATA
var recordAnswer = function(){
  console.log("TRANSFORMING ANSWER...");
  var selected = [];
  var free="";
  //FREE RESPONSE MODE
  if(isNaN(data.q)){
    free = $('#freeResponse').val().toString();
    $('#answer').val(free);
    
  }

  //CLICK ON GRAPH RESPONSE MODE
  if(colorClick == true){
    $('circle[selected=true]').each(function(){
      selected.push($(this).attr("value"))
    });
  }
  //REGULAR RESPONSE MODE 
  else (colorClick == false)
  {
    $ (':checked').not('.onoffswitch-checkbox').each(function() { //check each checkbox except help toggle
      // selected.push(""+$(this).attr('value')+"");
      selected.push($(this).attr('value'));
    });
  }  
  //store response values to designated answer element
  $('#answer').val([selected, hovered, mouseLog,free]);
  return;
  // console.log("answer is: "+$('#answer').val());
}

//COMPARE TWO ARRAYS ANY ORDER
// iterate over unique values and check if 
//each one appears the same amount of times in each array
//VANILLA JS
const equalsIgnoreOrder = (a, b) => {
  if (a.length !== b.length) return false;
  const uniqueValues = new Set([...a, ...b]);
  for (const v of uniqueValues) {
    const aCount = a.filter(e => e === v).length;
    const bCount = b.filter(e => e === v).length;
    if (aCount !== bCount) return false;
  }
  return true;
}

