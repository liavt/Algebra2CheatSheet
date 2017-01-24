/*global $*/

function getComponents(mag, head){
	return [mag*Math.cos(head * Math.PI / 180), mag*Math.sin(head * Math.PI / 180)];
}

$(document).ready(function(){
	$('#vec-comp-submit').click(function(){
		var html = '';
		
		var magnitude = $("#vec-comp-magnitude").val();
		var heading = $("#vec-comp-heading").val();
		
		if(!magnitude){
			html = "Must enter a magnitude";
		}else if(!heading){
			html = "Must enter a heading";
		}else{
			var result = getComponents(magnitude, heading);
			
			html = "X Component: "+result[0]+"<br>Y Component: "+result[1];
		}
		
		$("#vec-comp-result").html(html);
	});
});