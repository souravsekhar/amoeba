$("[data-toggle='toggle']").click(function() {
    var selector = $(this).data("target");
    $(selector).toggleClass('in');
});

$(document).ready(function() {

	var requestPayload = {};
	var operationsArr = [];

	var reorder = function() {
		var operationArray = $('.operationsOrder > li');
		var operationOrder = [];		
		var operationOrder = operationArray.map(function(li, liValue){							
			return $(liValue).text();
		});

		return JSON.stringify(operationOrder.get());
	};

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
				var fileName = path.replace(/^.*[\\\/]/, '');
				var width = 0;

				img.src = path;	

				requestPayload.imageFileName = fileName;
				requestPayload.imagePath = path;				

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
						$('.progressBar').html('UPLOADED');

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
			}
		}
	});

	//crop logic

	$(".labelsSection > label > input").change(function(){					
		var panelID = $(this).parent().parent().parent().attr('id');
		var size = Number($(this).val());		
		var containerWidth = $("#imageContainer")[0].clientWidth;
		var containerHeight = $("#imageContainer")[0].clientHeight;

		var centerX = containerWidth/2;
		var centerY = containerHeight/2;

		var offsetX = centerX - size/2;
		var offsetY = centerY - size/2;

		var url = $('.imageContainer > img').attr('src');

		var imageCropper = function () {
			$('.croppedImg').css({
				'width': size,
				'min-height': size,
				'left': offsetX,
				'top': offsetY,			
				'background': 'url('+url+') no-repeat -'+ (offsetX + 1)+'px -'+(offsetY + 1)+'px',
				'background-size': $('.imageContainer')[0].clientWidth + 'px',
				'border': '1px dashed #fff'		
			});
		}		

		switch(panelID) {
			case 'cropSlider':				
				requestPayload.crop = {};
				requestPayload.crop.size = size;
				imageCropper();				
				break;

			case 'resizeSlider':
				var dimension = Number($(this).val());
				requestPayload.resize = {};
				requestPayload.resize.dimension = dimension;
				break;

			case 'formatSlider':
				var format = $(this).val();
				requestPayload.formats = {};
				requestPayload.formats.format = format;				
				break;
		}	
	});

	$("#selectedImage").change(function () {		
		var filePath = $(this)[0].value;
		var selectedFileName = filePath.replace(/^.*[\\\/]/, '');
		$("#fileNameDisplayBox").val(selectedFileName);
		$('.uploadButton').slideDown(500);
	});

	$('.submitChanges').click(function() {		
		requestPayload.operationOrder = reorder(); // sending operation order to server based on user's choice

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
	});

	$('#cropCheck, #resizeCheck, #compositeCheck, #formatCheck').on('change', function () {		
		var tempArr = [];
		var removeUncheckedOperation = function (self) {			
			operationsArr.forEach(function (elem) {				
				if (elem.text == $(self).attr('id')) {					
					operationsArr.splice(operationsArr.indexOf({id: elem.id, text: elem.text}), 1);
				}
			});
		};

		switch($(this).attr('id')) {
			case 'cropCheck':
				var $li = $('<li>', {'id': 'cropDrag'});
				var $span = $('<span>', {'class':'btn btn-info buttonAlign'})
				$span.html("Crop");	
				$li.append($span);
				if ($(this).is(':checked')) {				
					tempArr.push($(this).attr('id'));	
					$('.operationsOrder').append($li);

				}
				else {							
					tempArr.splice(tempArr.indexOf($(this).attr('id')), 1);
					removeUncheckedOperation(this);					
					$('#cropDrag').remove();

					requestPayload.crop = {}; //not sending operation data on uncheck of crop operation
				}

				break;

			case 'resizeCheck':
				var $li = $('<li>', {'id': 'resizeDrag'});
				var $span = $('<span>', {'class':'btn btn-info btn-arrow-right buttonAlign'})
				$span.html("Resize");	
				$li.append($span);
				if ($(this).is(':checked')) {				
					tempArr.push($(this).attr('id'));	
					$('.operationsOrder').append($li);

				}
				else {					
					tempArr.splice(tempArr.indexOf($(this).attr('id')), 1);
					removeUncheckedOperation(this);
					$('#resizeDrag').remove();

					requestPayload.resize = {}; //not sending operation data on uncheck of resize operation
				}

				break;

			case 'formatCheck':
				var $li = $('<li>', {'id': 'formatDrag'});
				var $span = $('<span>', {'class':'btn btn-info btn-arrow-right buttonAlign'})
				$span.html("Format");	
				$li.append($span);
				if ($(this).is(':checked')) {				
					tempArr.push($(this).attr('id'));	
					$('.operationsOrder').append($li);

				}
				else {					
					tempArr.splice(tempArr.indexOf($(this).attr('id')), 1);
					removeUncheckedOperation(this);
					$('#formatDrag').remove();

					requestPayload.formats = {} //not sending operation data on uncheck of format operation
				}	
		}
		
		if($('.operationsOrder li').length > 0){			
			$('.reorderSection').slideDown(500);

		}
		else {			
			$('.reorderSection').slideUp(500);
		}

		tempArr.forEach(function (operation, index) {
			operationsArr.push({
				id: operationsArr.length,
				text: operation
			});
		});
	});

	$('input[name=multiGenerate]').change(function() {
		console.log('input clicked');
		if($(this).is(':checked')){
			requestPayload.multiGenerate = true;
		}
	});
});
