$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

$('#crop,#format,#resize').change(function () {
	
	if ($(this).attr('id') === 'crop') {
		if ($(this).is(':checked')) {
			$(".cropdimensions").show();
		}
		else {
			$(".cropdimensions").hide();
		}	
	}	

    if ($(this).attr('id') === 'format') {
		if ($(this).is(':checked')) {
			$("#formats").show();
		}
		else {
			$("#formats").hide();
		}	
	}	

	if ($(this).attr('id') === 'resize') {
		if ($(this).is(':checked')) {
			$("#dimensions").show();
		}
		else {
			$("#dimensions").hide();
		}	
	}	
});

$(document).ready(function(){
	$('#dimensions').hide();
	$('#formats').hide();
	$(".cropdimensions").hide();
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
});
	

