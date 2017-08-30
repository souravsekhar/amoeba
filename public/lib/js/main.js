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
	// $("#uploadFormSubmit").submit(function(e) {
	// 	console.log("form submitting", $('#imageInput')[0].files[0]);
	// 	e.preventDefault();
	// 	var url = "/image/upload";
	// 	// var $copy = $(this).clone();
	// 	// console.log("$copy.get(0)", $copy.get(0));
	// 	var formData = new FormData();
	// 	formData.append('imageFile', $('#imageInput')[0].files[0]);
	//     $.ajax({
	//            type: "POST",
	//            url: url,
	//            data: formData,
	//            contentType: 'multipart/form-data',
	//            dataType: 'json',
	//            processData: false,
	//            success: function(data){
	//                console.log(data);
	//            }
	//          });
	// 	});
	$("#uploadFormSubmit").submit(function(e) {
		e.preventDefault();		

		var formElement = document.querySelector("form");
		var request = new XMLHttpRequest();		

		request.open("POST", "/image/upload");			
		request.send(new FormData(formElement));

		request.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				window.location.href = "/show";
			}
		}
	});
});

	

