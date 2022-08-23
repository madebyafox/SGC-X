// shape parameter defines ratio beween width and height
// these global variables are set in the stimulus .html file BASED on condition code 
// var shape = 0.5*Math.sqrt(3) //equaliateral?
// var shape = 1 ; //icoseles?

console.log("GRAPH.JS LOADED");

function drawTitle(){
  var title = svg.append("g")
            .attr("class","graphTitle")
            .append("text")
            .text("SCHEDULE OF WORK SHIFTS")
            .attr("y",margin.top/-2 -10)
            .attr("x",width/4 +5)
}

//-----------AXIS HELPER FUNCTIONS ---------------------------//
function drawXAxis(xAxis,title,x,y,min,max,range) {
  console.log("DRAWING X AXIS");

  //DRAW THE X AXIS
  let xaxis = svg.append("g")
    .attr("class","xaxis")
    .attr("transform", "translate(0," + (height*scale) + ")")
    .call(xAxis);
    // .call(d3.axisBottom(x));

    //draw x axis title
    d3.select(".xaxis")
      .append("g")
      .attr("class","axisTitle")
      .append("text")
      .attr("x", width/1.5 -100 )
      .attr("y", margin.bottom -5 )
      .style("text-anchor", "center")
      .text(title);
}
function drawYAxis_Orthogonal (y,title){
  console.log("DRAWING Y AXIS ORTHOGONAL");
  var yaxis = svg.append("g")
    .attr("class","yaxis")
    .call(d3.axisLeft(y).tickSize(15))

    //draw y axis title 
    d3.select(".yaxis")
      .append("g")
      .attr("class","axisTitle")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height*scale)/2 +75)
      .attr("y", -margin.left/2 -10 )
      .style("text-anchor", "center")
      .text(title);

  var yGrid = svg.append("g")
    .attr("class","ygrid");
}
function drawYAxis_Triangular (x,y,title,min,max,range){
  console.log("DRAWING Y AXIS TRIANGULAR");
  
  console.log("fitting range="+range);
  console.log("fitting w="+width+" h= "+height);
  console.log("fitting scale="+scale);
  // var pyth = Math.sqrt(height**2 + width**2);
  // console.log("pyth: "+pyth);


   t0 = min;
   t1 = max;
   r = range;  // the range of the data values
   g = r;      //number of gradiations in the grid system (number of tickmarks)
   i = r/g;    //size of each interval in the grid system
  
    x1 = moment(t0);
    diff  = (t1.diff(x1,'minutes')/60)/2; //difference in fraction of hours
    x2 = moment(x1);
    x2 = x2.add(diff,'hours');
    y2 = x2.diff(x1,"minutes")*2/60;

    
  //DRAW TRIANGULAR Y AXIS   
  var yAxis = svg.append("g")
    .attr("class","yaxis")
    //this worked before allowed dynamic height/width
    // .append("line")
    // .attr("x1",y(range/2))
    // .attr("x2",0)
    // .attr("y1",y(range))
    // .attr("y2",y(0));
    .append("line")
    .attr("x1", x(x1))
    .attr("y1", y(0))
    .attr("x2",x(x2))
    .attr("y2", y(y2))

    d3.select(".yaxis")
      .append("g")
      .attr("class","axisTitle")
      .append("text")
      // .attr("transform","rotate(-65) translate(-180,220)") @600
      // .attr("transform","rotate(-"+(height*scale)/8.75+") translate(-180,220)")//arbitrary but it works
      .style("text-anchor", "middle")
      .attr("transform","rotate(-"+(height*scale)/9.25+") translate(-220,220)")//arbitrary but it works
      .text(title);

  var yGrid = svg.append("g")
      .attr("class","ygrid");

  // console.log(range);
  for (i=1; i<range+1; i++){
    min.add(30,"minutes");
    max.subtract(30,"minutes");

    d3.select(".yaxis")
      .append("g")
      .attr("class","tick")
      .append("text")
      .attr("x",x(min)-35)
      .attr("y",y(i)+5)
      .text(i);

    d3.select(".yaxis")
      .append("g")
      .attr("class","tick")
      .append("line")
      .attr("x1",x(min)-20)
      .attr("x2",x(min))
      .attr("y1",y(i))
      .attr("y2",y(i));
  }
}

//-----------HORIZONTAL GRID HELPER FUNCTIONS ---------------------------//
function drawYGrid_Full (x,y,dmin,dmax,range){
    console.log("DRAWING FULL Y GRID");
    for (i=1; i<=range; i++){
      d3.select(".ygrid").append("g")
          .attr("class", "ygrid")
          .append("line")
          .attr("x1",x(dmin))
          .attr("x2",x(dmax))
          .attr("y1",y(i))
          .attr("y2",y(i));
    }
    // function make_y_gridlines(y) {
    //     return d3.axisLeft(y).ticks(graphLabel.length);}
    //
    // svg.append("g")
    //   .attr("class", "grid")
    //   .call(make_y_gridlines(y)
    //   .tickSize(-width)
    //   .tickFormat("");
}
function drawYGrid_Partial (x,y,min,max,range){
    for (i=1; i<=range; i++){
      // console.log(i+" "+range);
      max.subtract(30,"minutes");
      d3.select(".ygrid").append("g")
          .attr("class", "ygrid")
          .append("line")
          .attr("x1",x(min))
          .attr("x2",x(max))
          .attr("y1",y(i))
          .attr("y2",y(i));
    }
}
function drawYGrid_Inside (x,y,min,max,range){
  console.log("DRAWING INSIDE Y GRID: ");
  for (i=1; i<=range; i++)  {
    min.add(30,"minutes");
    max.subtract(30,"minutes");
    d3.select(".ygrid")
        .append("g")
        .attr("class", "grid")
        .append("line")
        .attr("x1",x(min)-20) //how far out of the triangle do the horizontal lines go in 114
        .attr("x2",x(max))
        .attr("y1",y(i))
        .attr("y2",y(i));

    // d3.select(".yaxis")
    //   .append("g")
    //   .attr("class","tick")
    //   .append("text")
    //   .attr("x",x(tempdmin)-35)
    //   .attr("y",y(i)+5)
    //   .text(i);
    //
    // d3.select(".yaxis")
    //   .append("g")
    //   .attr("class","tick")
    //   .append("line")
    //   .attr("x1",x(tempdmin)-20)
    //   .attr("x2",x(tempdmin))
    //   .attr("y1",y(i))
    //   .attr("y2",y(i));
  }

}

//-----------VERTICAL GRID HELPER FUNCTIONS ---------------------------//
function drawXGrid_Full (x,y,min,max,range){

  console.log("DRAWING FULL X GRID");
  var t0 = min.clone();
  var t1 = max.clone();
  var r = range;  // the range of the data values
  var g = r;      //number of gradiations in the grid system (number of tickmarks)
  var i = r/g;    //size of each interval in the grid system
  // console.log("t0: "+ t0.format("HH:mm")+" t1: "+t1.format("HH:mm")+" r: "+r+" g: "+g+" i: "+i);
  // console.log ("r is: "+r+" and i is "+i);
  svg.append("g")
     .attr("class", "xgrid");

  //BUILD DIAGONAL GRID    
  for (n = 0; n < g; n++) {
      // console.log("n: "+n+"-------------------");
      // console.log("n*i"+ (n*i));

      //define x start time 
      var x1 = t0.clone();
          x1 = x1.add(n*i,'hours');

      //define x end time      
      var x2 = x1.clone();
          x2 = x2.add(6,'hours');

      //don't extend beyond end of graph    
      if (x2 > t1){
        x2 = t1;
      }

      //find duration
      y2 = x2.diff(x1,'minutes')/60*2;

      //build right leaning line 
      svg.selectAll(".xgrid")
        .append("line")
        .attr("class","rgrid")
        .attr("x1",x(x1))
        .attr("y1",y(0))
        .attr("x2",x(x2))
        .attr("y2",y(y2))

      x1 = t1.clone();
      x1 = x1.add(-n*i,'hours');

      x2 = x1.clone();
      x2 = x2.add(-6,'hours');
      
      //don't extend beyond end of graph    
      if (x2 < t0){
        x2 = t0;
      }
      y2 = x1.diff(x2,'minutes')/60*2;

      //build left leaning lines
      svg.selectAll(".xgrid")
        .append("line")
        .attr("class","lgrid")
        .attr("x1",x(x1))
        .attr("y1",y(0))
        .attr("x2",x(x2))
        .attr("y2",y(y2))
  }

  //FILL IN ENDS    
  let e = r / 2; //number of lines to fill in
  let iy = i*2 ; //size of interval in y grid 
  // console.log("e is: "+e);
  var a1, a2 ; //start time end time x  
  var b1, b2 ; //star end duration  
  
  //build right leading fill ins
  for ( z = 1; z < e ; z++) {
    
    //x start time 
    a1 = t0.clone();

    //x end time      
    a2 = a1.clone();
    a2 = a2.add(6-z,'hours');

    //start duration 
    b1 = z*iy;
    //end  duration
    b2 = r;
    // console.log("b1: "+b1+" b2 "+b2);

    //build right leaning line 
    svg.selectAll(".xgrid")
      .append("line")
      .attr("class","rgrid")
      .attr("style","stroke:black")
      .attr("x1",x(a1))
      .attr("y1",y(b1))
      .attr("x2",x(a2))
      .attr("y2",y(b2))
  }//end second for 

  //build left leading fill ins
  for ( z = 1; z < e ; z++) {
    
    //x start time 
    a1 = t1.clone();

    //x end time      
    a2 = a1.clone();
    a2 = a2.add(-6+z,'hours');

    //start duration 
    b1 = z*iy;
    //end  duration
    b2 = r;
    // console.log("b1: "+b1+" b2 "+b2);

    //build right leaning line 
    svg.selectAll(".xgrid")
      .append("line")
      .attr("class","rgrid")
      .attr("style","stroke:black")
      .attr("x1",x(a1))
      .attr("y1",y(b1))
      .attr("x2",x(a2))
      .attr("y2",y(b2))
  }//end second for 

}//end drawFullX

function drawXGrid_Triangular (x,y,min,max,range){

  var t0 = min;
  var t1 = max;
  var r = range;  // the range of the data values
  var g = r;      //number of gradiations in the grid system (number of tickmarks)
  var i = r/g;    //size of each interval in the grid system
  // console.log("t0: "+ t0.format("HH:mm")+" t1: "+t1.format("HH:mm")+" r: "+r+" g: "+g+" i: "+i);

  svg.append("g")
     .attr("class", "xgrid");

  for (n = 0; n < g; n++) {
      // console.log("n: "+n+"-------------------");
      // console.log(n*i);
      // console.log("t0 is: "+t0.format("HH:mm"));
      var x1 = moment(t0);
          x1 = x1.add(n*i,'hours');
      // console.log("x1: "+x1.format("HH:mm"));
      var diff  = (t1.diff(x1,'minutes')/60)/2; //difference in fraction of hours
      // console.log("difference : "+diff);
      var x2 = moment(x1);
          x2 = x2.add(diff,'hours');
      // console.log("x2: "+x2.format("HH:mm"));
      var y2 = x2.diff(x1,"minutes")*2/60;

      svg.selectAll(".xgrid")
        .append("line")
        .attr("class","rgrid")
        .attr("x1", x(x1))
        .attr("y1", y(0))
        .attr("x2", x(x2))
        .attr("y2", y(y2))

      x1 = moment(t1);
      x1 = x1.subtract(n*i,'hours');
      diff  = (x1.diff(t0,'minutes')/60)/2; //difference in fraction of hours
      x2 = moment(t0);
      x2 = x2.add(diff,'hours');
      var x3 = moment(t0);
          x3 = x3.add(n*i,'hours');
      y2 = t1.diff(x3,"minutes")/60;

      svg.selectAll(".xgrid")
        .append("line")
        .attr("class","lgrid")
        .attr("x1", x(x1))
        .attr("y1", y(0))
        .attr("x2",x(x2))
        .attr("y2",y(y2))
      }
}

//-----------DRAW THE INTERACTIVE SCAFFOLD LINES -------------//
function drawTriangleLeaders(x,y,start,mid,end,dur,min,leaders){

    /*NOTE: NEED TO MANUALLY SET MINIMUM HERE TOO -- FIX THIS*/
    var actualMin = moment("8:00","HH:mm");
    var actual = actualMin.add(dur/2,"hours");

    leaders.append ("line")
    .attr("class","starttime")
    .attr("x1",x(start))
    .attr("y1",y(0))
    .attr("x2",x(mid))
    .attr("y2",y(dur))

    leaders.append("circle")
    .attr("class","circle")
    .attr("cx", x(start))
    .attr("cy", y(0)+22);

    leaders.append("line")
    .attr("class", "endtime")
    .attr("x1",x(end))
    .attr("y1",y(0))
    .attr("x2",x(mid))
    .attr("y2",y(dur))

    leaders.append("circle")
    .attr("class","circle")
    .attr("cx", x(end))
    .attr("cy", y(0)+22);

    // axis == 3 Triangular-XInside-YInside"  
    if (axis == 3){
    // if (axis == "Triangular-XInside-YInside"){
      leaders.append("line")
      .attr("class","duration")
      .attr("x1",x(actual))
      .attr("y1",y(dur))
      .attr("x2",x(mid))
      .attr("y2",y(dur));

      leaders.append("circle")
      .attr("class","circle")
      .attr("cx", x(actual)-22)
      .attr("cy", y(dur));
    }
    else{
      leaders.append("line")
      .attr("class","duration")
      .attr("x1",x(min))
      .attr("y1",y(dur))
      .attr("x2",x(mid))
      .attr("y2",y(dur));

      leaders.append("circle")
      .attr("class","circle")
      .attr("cx", x(min)-10)
      .attr("cy", y(dur));
    }
}
function drawStaticLeaders(axis,staticLeaders,x,y){
  /*NOTE: NEED TO MANUALLY SET MINIMUM HERE TOO -- FIX THIS*/
  /*NOTE: COMMENTED OUT TEXT LABELS */
  var exampleMin = moment("12:00","HH:mm");
  var exampleMax = moment("17:00","HH:mm");
  var exampleMid = moment("14:30","HH:mm");
  var diagMid = moment("10:30","HH:mm");
  var min = moment("8:00","HH:mm");
  var dur = 5;

  staticLeaders.append ("line")
  .attr("class","scaffStarttime")
  .attr("x1",x(exampleMin))
  .attr("y1",y(0))
  .attr("x2",x(exampleMid))
  .attr("y2",y(dur));

  staticLeaders.append("circle")
  .attr("class","scaffCircle")
  .attr("cx", x(exampleMin))
  .attr("cy", y(0)+22);

  // staticLeaders.append("text")
  // .attr("class","scaffText")
  // .attr("x",x(exampleMin)-50)
  // .attr("y",y(0)+50)
  // .text("start");

  staticLeaders.append("line")
  .attr("class", "scaffEndtime")
  .attr("x1",x(exampleMax))
  .attr("y1",y(0))
  .attr("x2",x(exampleMid))
  .attr("y2",y(dur))

  staticLeaders.append("circle")
  .attr("class","scaffCircle")
  .attr("cx", x(exampleMax))
  .attr("cy", y(0)+22);

  // staticLeaders.append("text")
  // .attr("class","scaffText")
  // .attr("x",x(exampleMax)+15)
  // .attr("y",y(0)+50)
  // .text("end");

  // axis == 3 Triangular-XInside-YInside"  
  if (axis == 3){
  // if (axis == "Triangular-XInside-YInside"){
    staticLeaders.append("line")
    .attr("class","scaffDuration")
    .attr("x1",x(diagMid))
    .attr("y1",y(dur))
    .attr("x2",x(exampleMid))
    .attr("y2",y(dur))

    staticLeaders.append("circle")
    .attr("class","scaffCircle")
    .attr("cx", x(diagMid)-22)
    .attr("cy", y(dur));
  }
  else {
    staticLeaders.append("line")
    .attr("class","scaffDuration")
    .attr("x1",x(exampleMid))
    .attr("y1",y(dur))
    .attr("x2",x(min))
    .attr("y2",y(dur));

    staticLeaders.append("circle")
    .attr("class","scaffCircle")
    .attr("cx", x(min)-10)
    .attr("cy", y(dur));
  }
}


//-----------ANSWER HELPER FUNCTIONS ------------------------//
function displayAnswer(action, item) {
  if (action == "add"){
    graphClicked.push(item);
    $('#graph-response').text("Your answer: "+graphClicked.join("  "));
  }
  else if (action == "remove"){
    var filteredArray = graphClicked.filter(e => e !== item)
    graphClicked = filteredArray;
    $('#graph-response').text("Your answer: "+graphClicked.join("  "));
  }

}

//-----------GRAPH DRAWING FUNCTIONS ------------------------//


//TRIANGULAR MODEL —————————————————————————————————————————————————————————
function drawTriangleModel(datafile, axis, explicit, mark, rotation) {

  // console.log("ROTATION? : "+rotation);
  // console.log("axis: "+axis);
  // console.log("explicit: "+explicit);

  //---------CREATE LEADERS ELEMENT SO ITS ON THE BOTTOM------//
  var leaders = svg.append("g")
  .attr("class","leaders");

  var staticLeaders = svg.append("g")
    .attr("class","static-scaffold");

  //---------CREATE & DRAW DATA  ----------//
  d3.csv(datafile, function(error, data) {
      // console.log("data:" +data);
      if (error) throw error;
      // format the data
      var count = data.length;
      var backup = [];
      var graphLabel=[[]];
      var dmin = "";
      var dmax = "";
      var range = "";
    

      //--PROCES RAW DATA  ---------------------
      data.forEach(function(d) {
        
        //STORE AS TIME OBJECTS 
        d.startt = moment(d.starttime, "HH:mm");
        d.endt = moment(d.endtime, "HH:mm");
        d.duration =  d.endt.diff(d.startt,"minutes")/60;//duration in hours
        d.midpoint = moment(d.endt.clone().subtract(d.duration/2,'hours'));


        //INITIALIZE RANGE
        if (dmin == "") {dmin = d.startt.clone();}
        if (dmax == "") {dmax = d.endt.clone();}
        dmin = moment.min(dmin, d.startt)
        dmax = moment.max(dmax, d.endt)
        range = dmax.diff(dmin,'hours');

        //setup arrays for labels and clicked answers
        // clicked.push([d.events,"false"]) //add the datapoint to an clicked array as default not clicked
        // graphLabel.push([d.events]);

        //DRAW the answer box for each datapoint
        var myDiv = document.getElementById("answer-grid");
        var listItem = document.createElement("li");
        listItem.setAttribute("class", "control");
        var checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.value = d.events.trim();
        checkBox.innerHTML = d.events+"</input>";
        var label = document.createElement("label");
        label.setAttribute("class","control control-checkbox");
        var display = document.createElement("a");
        display.innerHTML = d.events;
        var indicator = document.createElement("div");
        indicator.setAttribute("class", "control_indicator");
        myDiv.appendChild(listItem);
        listItem.appendChild(label);
        label.appendChild(checkBox);
        label.appendChild(display);
        label.appendChild(indicator);
      }); //END process raw data 

      // square root of (half of range)squared + range squared
      // var halfbottom = height/2 * height/2;
      // var tall = height * height;
      // var pyth = Math.sqrt(halfbottom + tall);

      
      //--DRAW THE AXES & GRID ---------------------

      // set X AXIS graph scales, domains and ranges
      var x = d3.scaleTime()
        .range([0, width])
        .domain([dmin, dmax])

      //set the  number of ticks
      var xAxis = d3.axisBottom(x)
        .ticks(range*2);

     
      // set Y AXIS graph scales, domains and ranges      
      var y = d3.scaleLinear()
        .domain([0, range])  //(the data)
        .range([height*scale, 0]); //(the position) //SETS SHAPE
        // .range([width, 0]); //(the position) 
        //   .domain([0, range*2]); //equilateral
        //   .domain([0, range]); //isoceles

      //draw title
      //drawTitle();
      
        //draw x axis
      drawXAxis(xAxis,xAxisTitle,x,y,dmin,dmax,range);

      //draw y axis and grid
      // axis == 1 Orthogonal-XInside-YFull
      if (axis == 1){
      // if (axis == "Orthogonal-XInside-YFull"){ //condition 1
        drawYAxis_Orthogonal(y,yAxisTitle);
        drawYGrid_Full(x,y,dmin.clone(),dmax.clone(),range);
        drawXGrid_Triangular (x,y,dmin.clone(),dmax.clone(),range);
      }
      // axis == 2 Orthogonal-XInside-YPartial
      else if (axis == 2){
      // else if (axis == "Orthogonal-XInside-YPartial"){ //condition 2
        drawYAxis_Orthogonal(y,yAxisTitle);
        drawYGrid_Partial(x,y,dmin.clone(),dmax.clone(),range);
        drawXGrid_Triangular (x,y,dmin.clone(),dmax.clone(),range);
      }
      // axis == 3 Triangular-XInside-YInside
      else if (axis == 3){
      // else if (axis == "Triangular-XInside-YInside") { //condition 3
        
      //  CREATE NEW Y SCALE
        y = d3.scaleLinear()
        .domain([0, range])  //(the data)
        .range([height*scale, 0]); //(the position) 
        // .range([width, 0]); //(the position) 
        //   .domain([0, range*2]); //equilateral
        //   .domain([0, range]); //isoceles
      
        drawYAxis_Triangular(x,y,yAxisTitle,dmin.clone(),dmax.clone(),range)
        drawYGrid_Inside(x,y,dmin.clone(),dmax.clone(),range);
        drawXGrid_Triangular (x,y,dmin.clone(),dmax.clone(),range);
      }
      // axis == 4 Orthogonal-XInside-YInside
      else if (axis == 4){
      // else if (axis == "Orthogonal-XInside-YInside") { //condition 4
        drawYAxis_Orthogonal(y,yAxisTitle);
        drawYGrid_Inside(x,y,dmin.clone(),dmax.clone(),range);
        drawXGrid_Triangular (x,y,dmin.clone(),dmax.clone(),range);
      }
      // axis == 5 Orthogonal-XFull-YFull
      else if (axis == 5){
      // else if (axis == "Orthogonal-XFull-YFull") { //condition 5
        drawYAxis_Orthogonal(y,yAxisTitle);
        drawYGrid_Full(x,y,dmin.clone(),dmax.clone(),range);
        drawXGrid_Full (x,y,dmin.clone(),dmax.clone(),range);
      };

    //draw the data
    var node = svg.append("g")
                  .attr("class","data")
                  .selectAll(".dot")
                  .data(data)
                  .enter()
                  .append("g");
  
    //unfilled triangle
    var tri = {
      draw: function(context, size) {      
        context.moveTo(0,0)
        context.lineTo((0-size/4), size/2);
        context.closePath();
        context.moveTo(0,0)
        context.lineTo(size/4, size/2);
        context.closePath();
      }
    }

    //unfilled cross
    var cross = {
      draw: function(context, size) {      
        context.moveTo(size/2,0)
        context.lineTo((size/2), size);
        context.closePath();
        context.moveTo(0,size/2)
        context.lineTo(size, size/2);
        context.closePath();
      }
    }

    var dot = node.append("path")
      .attr("class", "dot")
  
    //DRAW THE DATA POINTS
    if (mark == 2 ) //DRAW TRIANGLE MARK
    {
      //working unfilled triangle
      dot
      .attr("d", d3.symbol().type(tri).size(20))
      .attr("transform", function(d) {  return "translate(" + x(d.midpoint) + "," + (y(d.duration)) + ")"; })
      .attr("style","fill:white; stroke:black; stroke-width:2.5px")
     
      //working filled triangle
      //dot
      // .attr("d", d3.symbol().type(d3.symbolTriangle).size(80))
      // .attr("transform", function(d) {  return "translate(" + x(d.midpoint) + "," + (y(d.duration)+8) + ")"; })

    }
    else if (mark == 3 ) //DRAW CROSS
    {
      //working cross 
      dot
      .attr("d", d3.symbol().type(cross).size(13))
      .attr("transform", function(d) {  return "translate(" + (x(d.midpoint)-6) + "," + (y(d.duration)-6) + ")"; })
      .attr("style","fill:white; stroke:black; stroke-width:2.5px")
     
    }
     
  
    let dotSize = function(){
      switch(mark){
        case "1":
          return 5;
          break;
        case "2":
          return 4;
          break;
        case "3":
          return 2;
          break;    
        default:
          return 5;  
      }
    }
       
    var dot = node.append("circle")
      .attr("cx", function(d) { return x(d.midpoint);})
      .attr("cy", function(d) { return y(d.duration);})
      .attr("r", function(d){return dotSize()})  
      .attr("value", function(d){return d.events;})
      .attr("selected",false)
      .on("mouseover", function(d) {
        d3.select(this).transition()
           .duration(0);
          //  console.log(d);
          //  console.log("MIDPOINT: "+d.midpoint.format("HH:mm"));
          //  console.log("ENDTIME: "+d.endt.format("HH:mm"));
           if (explicit == 3){drawTriangleLeaders(x,y,d.startt,d.midpoint,d.endt,d.duration,dmin,leaders);}
          //  console.log("MIDPOINT: "+d.midpoint.format("HH:mm"));
          //  console.log("ENDTIME: "+d.endt.format("HH:mm"));
        })
      .on("mouseout", function(d) {
        d3.selectAll(".starttime").remove();
        d3.selectAll(".endtime").remove();
        d3.selectAll(".duration").remove();
        d3.selectAll(".circle").remove();
        var sibling = d3.select(this.nextElementSibling).text();
        // hovered = hovered+"-"+sibling;
        hovered = hovered+sibling;
        // console.log("hovered: "+hovered);
       })
      .on("click", function(d) {
        if(colorClick) {
          var status =  d3.select(this).attr("selected");
          // console.log(status);
          if (status == 'true')
          {
            d3.select(this).transition()
                 .duration(0)
                 .style("fill", "black")
                 .attr("selected",false);
                 displayAnswer("remove",d.events);
          }
          else {
            d3.select(this).transition()
              .duration(0)
              .style("fill", selectColor)
              .attr("selected",true);
            displayAnswer("add",d.events);
          }
        }
      });

    //draw the data labels
    node.append("text")
      .attr("class","tmlabel")
      .attr("transform-origin",  function(d) { return ( (x(d.midpoint) - 5) + " "+ (y(d.duration) - 8) )})
      .attr("x", function(d) { return x(d.midpoint) - 5; })
      .attr("y", function(d) { return y(d.duration) - 8; })
      .text(function(d) { return d.events; })
      .on("mouseout", function(d){
        var sibling = d3.select(this).text();
        // hovered = hovered+"-"+sibling;
         hovered = hovered+sibling;
        // console.log("hovered: "+hovered);
      });

      // drawTriangleLeaders(x,y,backup[8][1],backup[8][2],backup[8][3],backup[8][4],dmin);
      // $(".leaders").css("visibility","hidden");
    //record hover on labels
    d3.selectAll(".tick").select("text")
      .on("mouseout", function(d) {
        var sibling = d3.select(this).text();
        // hovered = hovered+"-"+sibling;
         hovered = hovered+sibling;
        // console.log("hovered: "+hovered);
     });

     //remove every other tick label on x axis
     d3.selectAll(".xaxis").selectAll(".tick text").style("display", function (d, i)
     { return i % 2 ? "none" : "initial" });

     if (explicit == 2){ //explicit text-image scaffold
       drawStaticLeaders(axis,staticLeaders,x,y);
     }
    
  
    //-------------------  HANDLE SHAPE AND ROTATION  ------------------------//  
    // HANDLE LABELS ROTATION AND AXIS MOVEMENT
    // NOTE:: actual rotation of the graph happens in stimulus.html by simply rotating the entire SVG
    // the label rotation needs to happen in this file, bc the elements haven't been rendered yet. 
    // damn asynch stuffs 

    console.log("HANDLING ROTATION FOR AXIS = "+arotation+" LABEL="+lrotation+" and SHAPE ="+shape)
    //note: ROTATION 1 = 0, 2 = 45degrees, 3 = 90 degrees
    //note: SHAPE 1 = isoceles, 2 = equilateral


    //-------------------  AXIS ROTTATION  ------------------------//  
    
    //ROTATE AXES 45 DEGREES 
    if(arotation == 2){ //POINTY ARROW    
      console.log("ROTATE THE GRAPH! to pointy arrow");
      
      //////// ROTATE TRIANGULAR 45 DEGREES 
      if (grid==3){ 
      //ROTATE the stimulus DIV ~ 45 degrees and shift upwards  

        //FOR EQUILATERAL  
        if (shape == 2){
          console.log("ROTATING triangular equilateral by 30 degrees")
          //ROTATE AXIS
          d3.select(".stimulus") 
            .style("transform", "rotate(30deg) translate(-50px,-20px) scale(0.85,0.85)")   //scale(0.85, 0.85)")    
          //ROTATE DATA LABELS
          d3.selectAll(".tmlabel")
            .style("transform", "rotate(-30deg) translate(-10px,-2px)")      
        }
        //FOR ISOCELES
        else {
        console.log("ROTATING triangular isoceles by 45 degrees")
        //ROTATE AXES  
        d3.select(".stimulus") 
          .style("transform", "rotate(45deg) translate(-50px,-20px) scale(0.85,0.85)")   //scale(0.85, 0.85)")   
        //ROTATE DATA LABELS
        d3.selectAll(".tmlabel")
          .style("transform", "rotate(-45deg) translate(-8px,-3px)")      
        }
      }//END ROTATE TRIANGULAR
      
      ////////// ROTATE ORTHOGONAL 45 DEGREES  
      else { //otherwise orthog; need more vertical space
       
       //FOR EQUILATERAL
       if (shape == 2){
        console.log("ROTATING orthogonal equilateral by 30 degrees")
        //ROTATE AXIS
        d3.select(".stimulus") 
          // .style("transform", "rotate(30deg) translate(-50px,20px) scale(0.85,0.85)")   //scale(0.85, 0.85)")    
          .style("transform", "rotate(30deg) translate(-50px,50px) scale(0.85,0.85)")   //scale(0.85, 0.85)")    //further down
       //ROTATE DATA LABELS
       d3.selectAll(".tmlabel")
          .style("transform", "rotate(-30deg) translate(-10px,-2px)")      
       
        }
       //FOR ISOCELES
       else {
        console.log("ROTATING orthogonal isoceles by 45 degrees")
        //ROTATE the stimulus DIV 45 DEGREES AND shift dowwnwards
        d3.select(".stimulus") 
          .style("transform", "rotate(45deg) translate(0px,20px) scale(0.85,0.85)")
        //ROTATE DATA LABELS
        d3.selectAll(".tmlabel")
          .style("transform", "rotate(-45deg) translate(-8px,-3px)")        
        }
      }//END ROTATE ORTHOGONAL

      // // //NOW REGARDLESS OF SHAPE, ROTATE THE DATA LABELS 
      // // //FOR ANY GRID ROTATE THE DATA LABELS
      //  d3.selectAll(".tmlabel")
      //  //ORIGINAL
      //     // .style("transform", "rotate(-45deg) translate(-8px,0px)")   
      //  //EQUILIATERAL
      //  .style("transform", "rotate(-30deg) translate(-10px,-3px)")      

    }

    //ROTATE AXES 90 DEGREES 
    if(arotation == 3){ //ROTATE 90 DEGREES 
      console.log("ROTATE THE GRAPH! 90 degrees ");


      //ROTATE TRIANGULAR 90 DEGREES 
      if (grid==3){ 
        console.log("ROTATING TRIANGULAR by 90 degrees")
        //ROTATE AXES
        d3.select(".stimulus") 
          .style("transform", " rotate(90deg) translate(0px,50px) scale(0.85, 0.85)")
         
          //NOT WORKING
          //ROTATE Y AXIS LABELS
        //  d3.select(".yaxis").selectAll(".tick").select("text")
        //  .style("transform", "rotate(-90deg) translate(20px, -25px)")  

        // z = d3.select(".yaxis").selectAll(".tick").select("text")
        // bb = z.node().getBBox()
        // console.log(bb)
        d3.select(".yaxis").selectAll(".tick").select("text")
          .attr("rotate",  -90)
        //   .attr("transform-origin",  bb.x+bb.width/2+" "+bb.y+bb.height/2)
          .style("transform", "translate(5px,0px)")   


      } 
      //ROTATE ORTHOGONAL 90 DEGREES
      else{ //otherwise orthog; need more vertical space
        console.log("ROTATING ORTHOGONAL by 90 degrees")
        //ROTATE AXES
        d3.select(".stimulus") 
          .style("transform", " rotate(90deg) translate(0px,50px) scale(0.85, 0.85)")
        //ROTATE Y AXIS LABELS
        d3.select(".yaxis").selectAll(".tick").select("text")
          .style("transform", "rotate(-90deg) translate(20px, -25px)")

      }

      // //FOR ANY GRID ROTATE THE DATA LABELS
      d3.selectAll(".tmlabel")
      .style("transform", "rotate(-90deg) translate(0px,10px)")   

      
      //ROTATE X AXIS TITLE 90 DEGREES
      //SPLIT TO 3 LINES 
      
      //get transform coords 
      //so we can rotate around the coordinates
      z = d3.select(".xaxis").select(".axisTitle")
      bb = z.node().getBBox()
      // console.log(bb)
      
      //change to two line
      d3.select(".xaxis").select(".axisTitle")
        .attr("transform-origin",  bb.x+bb.width/2+" "+bb.y+bb.height/2)
        .attr("transform",  "rotate(-90) translate(-40,0)")
        .select("text")
        .text("Start")
        
      //add second line
      d3.select(".xaxis").select(".axisTitle")
        .append("text")
        .text("& End")
        .attr("x", bb.x+60)
        .attr("y", bb.y+30)

      //add third line
      d3.select(".xaxis").select(".axisTitle")
        .append("text")
        .text("Time")
        .attr("x", bb.x+65)
        .attr("y", bb.y+45)  
        
    }


    //-------------------  X LABEL ROTTATION  ------------------------//  
    
    //ROTATE LABEL 45 DEGREES 
    if(lrotation == 2){ //POINTY ARROW    
      console.log("Rotate the labels 45 degrees");

      //ROTATE X AXIS TICK LABLES 
      d3.select(".xaxis").selectAll(".tick text")
        // .attr("transform-origin",  "center")
        .attr("text-anchor", "middle")
        .attr("transform",  " translate(-23,20) rotate(-60)");

      if(arotation !=3){
        // SHIFT TITLE DOWN (only if not rotated 90 axis)
        d3.select(".xaxis").select(".axisTitle")
          .attr("transform-origin",  "middle")
          .attr("transform",  "translate(0,20)");  
      }
      
    }

    //ROTATE LABEL 90 DEGREES 
    if(lrotation == 3){ //ROTATE 90 DEGREES 
      console.log("Rotate the labels 90 degrees");
     
       //ROTATE X AXIS TICK LABLES 
       d3.select(".xaxis").selectAll(".tick text")
       // .attr("transform-origin",  "center")
       .attr("text-anchor", "middle")
       .attr("transform",  " translate(-15,28) rotate(-90)");

       if(arotation !=3){
        // SHIFT TITLE DOWN (only if not rotated 90 axis)
        d3.select(".xaxis").select(".axisTitle")
          .attr("transform-origin",  "middle")
          .attr("transform",  "translate(0,30)");  
      } 
    }

      // if (grid==3){ 
      //  //ROTATE the stimulus DIV 45 degrees and shift upwards 
      //   d3.select(".stimulus") 
      //  .style("transform", "rotate(45deg) translate(-50px,-20px) scale(0.85,0.85)")   //scale(0.85, 0.85)")   
      // }
      // //ROTATE ORTHOGONAL 45 DEGREES  
      // else{ //otherwise orthog; need more vertical space
      //  //ROTATE the stimulus DIV 45 DEGREES AND shift dowwnwards
      //   d3.select(".stimulus") 
      //  .style("transform", "rotate(45deg) translate(0px,20px) scale(0.85,0.85)")
      // }
    

    //IS THIS CHUNK REDUNDANT TO THE STUFF ABOVE? NOT SURE??  
    //-------------------  EQUILATERAL SHAPE  ------------------------//  
    //AJUST Y AXIS ROTATION FOR EQUILATERAL 
    // if (shape == 2) { //EQUILATERAL
    //   console.log("ADJUSTING Y axis labels for GRID " + grid, " SHAPE "+shape +" SHAPE "+shape)

      // //ORTHOGONAL GRID
      // if(grid !=3) {  
      // //   //move stim down and left 
      //   d3.select(".theGraph") 
      //  .style("transform", "translate(-20px,50px)")   //shift down and left
      // }
      
      // //TRIANGULAR GRID
      // if (grid == 3) { 
      // //move stim down and left 
      //    d3.select(".theGraph") 
      //      .style("transform", "translate(-20px,50px)")   //shift down and left
      // // tweak y axis label rotation on triangular 
      //   d3.select(".yaxis").select(".axisTitle")
      //     .attr("transform","rotate(-5) translate(30,-55)")
      // }
    // }

  }); //END D3.CSV


  
}//end drawTriangleModel


//LINEAR MODEL —————————————————————————————————————————————————————————
function drawLinearModel(datafile, explicit) {

  //---------HELPER FUNCTIONS -----------------------//
  function drawLinearLeaders(x,y,label,start,end){
    var leaders = svg.append("g")
      .attr("class","leaders");

    leaders.append ("line")
      .attr("class","starttime")
      .attr("x1",x(start))
      .attr("y1",y(label))
      .attr("x2",x(start))
      .attr("y2",height)

    leaders.append("line")
      .attr("class", "enddtime")
      .attr("x1",x(end))
      .attr("y1",height)
      .attr("x2",x(end))
      .attr("y2",y(label))
  }
  function drawLinearGrid(x,y,range,graphLabel){
    // gridlines in x axis function
    function make_x_gridlines() {
      return d3.axisBottom(x)
          .ticks(range)
    }
    // gridlines in y axis function
    function make_y_gridlines() {
      return d3.axisLeft(y)
          .ticks(graphLabel.length)
    }
    // add the X gridlines
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
        )

    // add the Y gridlines
    svg.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
      )
  }

  //---------CREATE & DRAW DATA  ----------//
  d3.csv(datafile, function(error, data) {
      if (error) throw error;

      // format the data
      var count = data.length;
      var graphLabel=[[]];
      var dmin, dmax, range = "";
      // var dmin = moment("11:59","HH:mm");  //create a new dummy xmin set to 11:59
      // var dmax = moment("00:00","HH:mm");  //create a new dummy xmin set to 00:00
      // var range = 0; //dummy for time range

      data.forEach(function(d) {
        //store the raw data in vars
        d.events = d.events;
        d.starttime = d.starttime;
        d.endtime =d.endtime;
        //create time objects for start and end time
        d.startt = moment(d.starttime, "HH:mm");
        d.endt = moment(d.endtime, "HH:mm");
        // console.log("start: "+d.startt.format("HH:mm")+" end: "+d.endt.format("HH:mm"));
        d.duration =  d.endt.diff(d.startt,"minutes");
        // console.log("duration: "+d.duration);
        d.midpoint = d.endt.clone();
        d.midpoint = d.midpoint.subtract(d.duration/2,'minutes');
        // console.log("midpoint: "+d.midpoint.format("HH:mm"));
        
        //setup arrays for labels and clicked answers
        // clicked.push([d.events,"false"]) //add the datapoint to an clicked array as default not clicked
        // graphLabel.push([d.events]);
        
        //set min and max
        // dmin = moment.min(dmin, d.startt)
        // dmax = moment.max(dmax, d.endt)
        // range = dmax.diff(dmin,'hours');
         //INITIALIZE RANGE
         if (dmin == "") {dmin = d.startt.clone();}
         if (dmax == "") {dmax = d.endt.clone();}
         dmin = moment.min(dmin, d.startt)
         dmax = moment.max(dmax, d.endt)
         range = dmax.diff(dmin,'hours');
        
      });

    // set graph scales, domains and ranges
    var x = d3.scaleTime()
      .range([0, width])
      .domain([dmin, dmax])
    //set the  number of ticks
    var xAxis = d3.axisBottom(x)
      .ticks(range);
    var y = d3.scalePoint()
      .range([height, 0])
      .domain(graphLabel);
      drawXAxis(xAxis,xAxisTitle);
      drawYAxis_Orthogonal(y,yAxisTitle);
      drawLinearGrid(x,y,range,graphLabel);
    // draw the data
    var node = svg.append("g")
                  .attr("class","data")
                  .selectAll(".segment")
                  .data(data)
                  .enter()
                  .append("g");
    //draw the data points
    var dot = node.append("line")
      .attr("class", "segment")
      .attr("x1", function(d) { return x(d.startt); })
      .attr("y1", function(d) { return y(d.events); })
      .attr("x2", function(d) { return x(d.endt); })
      .attr("y2", function(d) { return y(d.events); })
      .attr("selected",false)
      .on("mouseover", function(d) {
        d3.select(this).transition()
           .duration(0);
          if (scaffold == 3){drawLinearLeaders(x,y,d.events,d.startt, d.endt);}
        })
      .on("mouseout", function(d) {
       d3.selectAll(".leaders").remove();
      //  var state =  d3.select(this).attr("selected");
      //  if (state == 'true') {
      //    d3.select(this).transition()
      //         .duration(0)
      //         .style("fill", "green");
      //            }
      //  else {
      //    d3.select(this).transition()
      //         .duration(0)
      //         .style("fill", "black");
      //  }
      })
      .on("click", function(d) {
        if(colorClick) {
          var status =  d3.select(this).attr("selected");
          // console.log(status);
          if (status == 'true')
          {
            d3.select(this).transition()
                 .duration(0)
                 .style("stroke", "black")
                 .attr("selected",false);
            displayAnswer("remove",d.events);
          }
          else {
            d3.select(this).transition()
              .duration(0)
              .style("stroke", selectColor)
              .attr("selected",true);
            displayAnswer("add",d.events);
          }
        }
      });

  });
}//end drawLinearModel