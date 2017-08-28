$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

$(document).ready(function(){
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

