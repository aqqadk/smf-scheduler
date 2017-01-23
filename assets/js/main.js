// var data = {object} //Creates a new block for each object
var data = {
        "Line_1":{
            "artist":"Audien",
            "day":"1",
            "start_time":"13:00",
            "end_time":"14:00",
            "stage":"Main Stage"
        },
        "Line_2":{
            "artist":"Slushii",
            "day":"1",
            "start_time":"13:30",
            "end_time":"14:30",
            "stage":"Eclipse Stage"
        },
        "Line_3":{
            "artist":"DJ Snake",
            "day":"1",
            "start_time":"14:30",
            "end_time":"15:30",
            "stage":"Main Stage"
        },
        "Line_4":{
            "artist":"Marshmello",
            "day":"2",
            "start_time":"14:15",
            "end_time":"15:15",
            "stage":"Horizon Stage"
        }
    
}

var blocks = 0;

function addBlock(artist,day,start_time,end_time,stage) {
    
	/* Not ready; getElementById needs to be unique/ search though nested. Line_1.Eclipse
	document.getElementById("artist").value = artist;
	document.getElementById(day).setAttribute("selected","true");
	document.getElementById("start_time").value = start_time;
	document.getElementById("end_time").value = end_time;
	document.getElementById(stage).setAttribute("selected","true");
	*/
	
	//Increments blocks
	blocks++;
	
	//Clones 'read' div and makes it visible by changing 'display'
	var newFields = document.getElementById('read').cloneNode(true);
	newFields.style.display = 'block';
	
	//Gives the Line_ name to each element for #jquery-serialize-object
	newFields.id = 'Line_' + blocks;
	var newField = newFields.childNodes;
	for (var i=0;i<newField.length;i++) {
		var theName = newField[i].name
		if (theName)
			newField[i].name = "Line_" + blocks + theName;
	}
	
	//Writes cloned 'read' div under the 'write' span
	var insertHere = document.getElementById('write');
	insertHere.parentNode.insertBefore(newFields,insertHere);
}

//testing zone
//onLoad create the first block
//console.log(loadBlocks(data));



$(function(ready){
    addBlock();
    
    $('#days').change(function() {
        var days = $("#days").val();
        $('.day').empty().append('<option value="null">--</option>');
        
        //n set to 1 to avoid the default value of -- being selected
        for (var n = 1; n <= days; ++ n) { 
            $(".day").append('<option value="'+n+'">Day '+n+'</option>');
        }
        
    });
    
});

function addStage() {
    var stage = $("#stageName").val(); //search for ID addStage get val
    $(".stage").append('<option value="'+stage+'">'+stage+'</option>');
}

function removeStage() {
    var stage = $("#stageName").val();
    $(".stage option[value='"+stage+"']").remove();
}






//Loops through var data = {} object and pulls each Line_ and runs the addBlock() function
function loadBlocks(data){
	for (var key in data) {
	  if (data.hasOwnProperty(key)) {
	    addBlock(data[key].artist, data[key].day, data[key].start_time, data[key].end_time, data[key].stage);
	    console.log(data[key].stage);
	  }
	}
}


//Converts to Objects, checks for conflictions + lists conflictions
function check(){
    var data = $('form#set_schedule').serializeObject();
    var tmp_day = '2000-01-01',
    outer_key,
    outer,
    inner_key,
    inner,
    tmp_range,
    checked = {},
    conflict_found = {},
    conflicts = [],
    i;
    
    for (outer_key in data) {
        if (Object.prototype.hasOwnProperty.call(data, outer_key)) {
            outer = data[outer_key];
            
            tmp_range = moment(tmp_day + 'T' + outer.start_time).twix(tmp_day + 'T' + outer.end_time);
            
            checked[outer_key] = true;
            
            for (inner_key in data) {
                if (Object.prototype.hasOwnProperty.call(data, inner_key) && outer_key !== inner_key && !checked[inner_key]) {
                    inner = data[inner_key];
                    
                    if(outer.day === inner.day && inner.start_time != outer.end_time && (tmp_range.contains(tmp_day + 'T' + inner.start_time) || tmp_range.contains(tmp_day + 'T' + inner.end_time))) {
                        conflict_found[outer_key] = true;
                        conflict_found[inner_key] = true;
                        conflicts.push([
                            outer_key,
                            inner_key
                        ]);
                    }
                }
            }
        }
    }
    
    
    // Ouput:
    document.getElementById('output').innerHTML = '';
    
    for (i = 0; i < conflicts.length; i++) {
        document.getElementById('output').innerHTML += '<li><strong>' + data[conflicts[i][0]].artist + '</strong> conflicts with <strong>' + data[conflicts[i][1]].artist + '</strong></li>';
    }
    
    for (outer_key in data) {
        if (Object.prototype.hasOwnProperty.call(data, outer_key) &&
            !conflict_found[outer_key]
        ) {
            document.getElementById('output').innerHTML += '<li><strong>' + data[outer_key].artist + '</strong> does not conflict with anyone</li>';
        }
    }
    
}