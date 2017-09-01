$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

var	operationsArr = [];// global array to store operation preferrences

$('#crop,#format,#resize').change(function () {	
	var tempArr = [];
	var removeUncheckedOperation = function (self) {		
		operationsArr.forEach(function (elem) {				
			if (elem.text == $(self).attr('id')) {					
				operationsArr.splice(operationsArr.indexOf({id: elem.id, text: elem.text}), 1);
			}
		});
	}
	if ($(this).attr('id') === 'crop') {
		var $li = $('<li>', {'id':'cropDrag'});
		$li.html("Crop");	
		if ($(this).is(':checked')) {
			$(".cropdimensions").show();
			tempArr.push($(this).attr('id'));
			$('.operation-section').append($li);

		}
		else {
			$(".cropdimensions").hide();			
			tempArr.splice(tempArr.indexOf($(this).attr('id')), 1);
			removeUncheckedOperation(this);
			$('#cropDrag').remove();
		}	
	}	

    if ($(this).attr('id') === 'format') { 
    	var $li = $('<li>', {'id':'formatDrag'});
		$li.html("Format");   	
		if ($(this).is(':checked')) {			
			$("#formats").show();
			tempArr.push($(this).attr('id'));
			$('.operation-section').append($li);
		}
		else {
			$("#formats").hide();
			tempArr.splice(tempArr.indexOf($(this).attr('id')), 1);
			removeUncheckedOperation(this);
			$('#formatDrag').remove();
		}	
	}	

	if ($(this).attr('id') === 'resize') {
		var $li = $('<li>', {'id':'resizeDrag'});
		$li.html("Resize");		
		if ($(this).is(':checked')) {			
			$("#dimensions").show();
			tempArr.push($(this).attr('id'));
			$('.operation-section').append($li);
		}
		else {
			$("#dimensions").hide();
			tempArr.splice(tempArr.indexOf($(this).attr('id')), 1);
			removeUncheckedOperation(this);
			$('#resizeDrag').remove();
		}	
	}	
	
	tempArr.forEach(function (operation, index) {
		operationsArr.push({
			id: operationsArr.length,
			text: operation
		});
	});
});


$(document).ready(function(){
	$('#dimensions').hide();
	$('#formats').hide();
	$(".cropdimensions").hide();	
	$(".operation-section").sortable();
	$(".operation-section").disableSelection();
	$('#searchText').autocomplete({
		source: function (request, response) {
			$.ajax({
				url: "/search",
				method: "GET",
				data: {
					searchText: $('#searchText').val()
				},
				success: function (result) {					
					response(result);
				}
			});
		}
	});
	
	$("#uploadFormSubmit").submit(function(e) {		

		var formElement = document.querySelector("form");
		var request = new XMLHttpRequest();
		var operationArr = $('.operation-section > li');
		var operationOrder = [];

		operationArr.each(function(li, liValue){						
			operationOrder.push($(liValue).text());
		});
		
		var formData = new FormData(formElement);

		formData.append('order', operationOrder);		
		request.open("POST", "/image/upload");			
		request.send(formData);

		request.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				window.alert('Your image has been processed');				
			}
		}
	});
});

	

