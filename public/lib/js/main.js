$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

$('#resize').change(function () {	   
    if($(this).is(':checked')) {
       $("#dimensions").show();        
    }
    else {
       $("#dimensions").hide();
    }    
});

$('#format').change(function () {	   
    if($(this).is(':checked')) {
       $("#formats").show();        
    }
    else {
       $("#formats").hide();
    }    
});

$(document).ready(function(){
	$('#dimensions').hide();
	$('#formats').hide();
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
	

