$("[data-toggle='toggle']").click(function() {
    var selector = $(this).data("target");
    $(selector).toggleClass('in');
});

$(document).ready(function() {

	var requestPayload = {};

	$(".operationsOrder").sortable();
		
	$("#imageUploadForm").submit(function(e) {
		e.preventDefault();		

		var formElement = document.querySelector("#imageUploadForm");
		var request = new XMLHttpRequest();		
		
		var formData = new FormData(formElement);

		request.open("POST", "/upload");				
		request.send(formData);

		request.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				var div = document.getElementById("imageContainer");
				var img = new Image();
				var path = this.responseText.substring(1);

				img.src = path;	
				var width = 0;

				$('.progress, .progressBar').css('display', 'block');

				var showImage = setInterval(function() {
					width = width + 1;
					if (width <= 100) {
						$('.progressBar').css('width', width+'%');
					}
					else {

						div.appendChild(img);

						$('#placeholderImage').remove();

						$('.progressBar').removeClass('active');

						$(".croppedImg").css({
							'width':'100%',
							'min-height':'100%',
							'top':0,
							'left':0,
							'background': 'url('+path+') no-repeat -0px -0px',
							'background-size': $('.imageContainer')[0].clientWidth + 'px'
						});												

						clearInterval(showImage);
					}			
				}, 30);
				showImage();			
			}
		}
	});

	//crop logic

	$(".labelsSection > label > input").change(function(){
		console.log('radio');	
		var size = Number($(this).val());		
		var containerWidth = $("#imageContainer")[0].clientWidth;
		var containerHeight = $("#imageContainer")[0].clientHeight;

		var centerX = containerWidth/2;
		var centerY = containerHeight/2;

		var offsetX = centerX - size/2;
		var offsetY = centerY - size/2;

		var url = $('.imageContainer > img').attr('src');

		requestPayload.cropSize = size;

		$('.croppedImg').css({
			'width': size,
			'min-height': size,
			'left': offsetX,
			'top': offsetY,			
			'background': 'url('+url+') no-repeat -'+ (offsetX + 1)+'px -'+(offsetY + 1)+'px',
			'background-size': $('.imageContainer')[0].clientWidth + 'px',
			'border': '1px dashed #fff'		
		});		
	});//`url(${url}) no-repeat -${offsetX} -${offsetY}`

	$("#selectedImage").change(function () {		
		var filePath = $(this)[0].value;
		var selectedFileName = filePath.replace(/^.*[\\\/]/, '');
		$("#fileNameDisplayBox").val(selectedFileName);
	});

	$('.submitChanges').click(function() {		
		$.ajax({
			type: 'POST',
			url: '/image/process',
			data: JSON.stringify(requestPayload),
			dataType: "json",
			contentType: 'application/json',
			success: function(result) {
				console.log('result', result);
			}
		});
	})
});
