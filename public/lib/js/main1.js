$("[data-toggle='toggle']").click(function() {
    var selector = $(this).data("target");
    $(selector).toggleClass('in');
});

$(document).ready(function() {
	// initial page render settings
	$('.rightPanel, .imageContainer').css('display', 'none');
	$('.sidenav').addClass('sideNavFullWidth');

	var requestPayload = {};
	var operationsArr = [];
	var url;

	var reorder = function() {
		var operationArray = $('.operationsOrder > li');
		var operationOrder = [];		
		var operationOrder = operationArray.map(function(li, liValue){							
			return $(liValue).text();
		});

		return JSON.stringify(operationOrder.get());
	};

	$(".operationsOrder").sortable();

	$('.singleUpload, .multiUpload').click(function() {// for overlay buttons

		$('.homeOverlay').css({top:"-100vh"});

		if($(this).attr('class').indexOf('singleUpload') !== -1) {
			$('.singleUploadContainer').addClass('active');
			$('.nav-tabs > li:nth-child(1)').addClass('active');
			url = '/image/process';
			$('.submitBtnContainer > button').text('PROCESS SINGLE');
			// $('.operationsPanelOverlay').css('display', 'block');
		}
		else {			
			$('.multipleUploadContainer').addClass('active');
			$('.nav-tabs > li:nth-child(2)').addClass('active');
			url = '/image/multipleUpload';
			$('.submitBtnContainer > button').text('PROCESS MULTIPLE');
			// $('.operationsPanelOverlay').css('display', 'none');
		}	
	});

	$('.nav-tabs > li:first-child').click(function() {// for nav tabs
		url = '/image/process';
		$('.submitBtnContainer > button').text('PROCESS SINGLE');
		console.log('imagepath', $('.imageContainer img').attr('src'));
		if($('.imageContainer img').attr('src')){
			console.log('image uploaded');
			// $('.operationsPanelOverlay').css('display','block');
			
			$('.sidenav').removeClass('sideNavFullWidth');
			$('.rightPanel').css('display', 'block');
		}
		else{
			$('.sidenav').addClass('sideNavFullWidth');
			$('.rightPanel').css('display', 'none');			
		}
	});

	$('.nav-tabs > li:last-child').click(function() {
		url = '/image/multipleUpload';
		$('.submitBtnContainer > button').text('PROCESS MULTIPLE');
		// $('.operationsPanelOverlay').css('display','none');
		$('.sidenav').removeClass('sideNavFullWidth');
		$('.rightPanel').css('display', 'block');
	});

	$("#selectedImage").change(function () {		
		var filePath = $(this)[0].value;
		var selectedFileName = filePath.replace(/^.*[\\\/]/, '');
		$("#fileNameDisplayBox").val(selectedFileName);
		$('.uploadButton').slideDown(500);
		$("#imageUploadForm").submit();
	});
		
	$("#imageUploadForm").submit(function(e) {
		e.preventDefault();

		var formElement = document.querySelector("#imageUploadForm");
		var request = new XMLHttpRequest();
		
		var formData = new FormData(formElement);

		request.open("POST", "/upload");				
		request.send(formData);

		$('#imageUploadForm > label').css('display', 'none');

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
					if (width <= 200) {
						$('.progressBar').css('width', width+'%');
					}
					else {
						$('.dndHolder').css('display', 'none');
						$('.imageContainer').css('display', 'block');
						div.appendChild(img);

						$('#placeholderImage').remove();

						$('.progressBar').removeClass('active');
						$('.progressBar').html('UPLOADED');
						$('.progress, .progressBar').css('display', 'none');

						// $(".croppedImg").css({
						// 	'width':'inherit',
						// 	'min-height':'100%',
						// 	'top':0,
						// 	'left':0,
						// 	'background': 'url('+path+') no-repeat -0px -0px',
						// 	'background-size': $('.imageContainer')[0].clientWidth + 'px'
						// });

						$(".layer").css({
							"width":img.width,
							"height":img.height,
							"display": "inline-block",
							"vertical-align": "middle",
							"margin": "0 auto",
							"top": $(img).position().top
						});

						$(".croppedImg").css({
							"width":img.width,
							"height":img.height,
							"display": "inline-block",
							"vertical-align": "middle",
							"margin": "0 auto",
							"top": $(img).position().top,
							'left':0,
							'background': 'url('+path+') no-repeat -0px -0px',
							'background-size': $('.imageContainer')[0].clientWidth + 'px'
						});


						$('.operationsPanelOverlay').addClass('fadeout');
						$('.sidenav').removeClass('sideNavFullWidth');
						$('.rightPanel').css('display', 'block');
						
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

	$('.submitChanges').click(function() {		
		requestPayload.operationOrder = reorder(); // sending operation order to server based on user's choice

		$.ajax({
			type: 'POST',
			url: url,
			data: JSON.stringify(requestPayload),
			dataType: "json",
			contentType: 'application/json',
			success: function(result) {
				console.log('result', result);
			}
		});
	});

	$('#cropCheck, #resizeCheck, #compositeCheck, #formatCheck, #invertCheckBoxInput, #flipCheckBoxInput, #greyScaleCheckBoxInput').on('change', function () {		
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

				break;

			case 'invertCheckBoxInput':
				var $li = $('<li>', {'id': 'invertDrag'});
				var $span = $('<span>', {'class':'btn btn-info btn-arrow-right buttonAlign'})
				$span.html("Invert");	
				$li.append($span);
				if ($(this).is(':checked')) {				
					tempArr.push($(this).attr('id'));	
					$('.operationsOrder').append($li);
					requestPayload.invert = true;

				}
				else {					
					tempArr.splice(tempArr.indexOf($(this).attr('id')), 1);
					removeUncheckedOperation(this);
					$('#invertDrag').remove();
					requestPayload.invert = false //not sending operation data on uncheck of format operation
				}

				break;

			case 'flipCheckBoxInput':
				var $li = $('<li>', {'id': 'flipDrag'});
				var $span = $('<span>', {'class':'btn btn-info btn-arrow-right buttonAlign'})
				$span.html("Flip");	
				$li.append($span);
				if ($(this).is(':checked')) {				
					tempArr.push($(this).attr('id'));	
					$('.operationsOrder').append($li);
					requestPayload.flip = true;

				}
				else {					
					tempArr.splice(tempArr.indexOf($(this).attr('id')), 1);
					removeUncheckedOperation(this);
					$('#flipDrag').remove();
					requestPayload.flip = false //not sending operation data on uncheck of format operation
				}

				break;

			case 'greyScaleCheckBoxInput':
				var $li = $('<li>', {'id': 'greyDrag'});
				var $span = $('<span>', {'class':'btn btn-info btn-arrow-right buttonAlign'})
				$span.html("Greyscale");	
				$li.append($span);
				if ($(this).is(':checked')) {				
					tempArr.push($(this).attr('id'));	
					$('.operationsOrder').append($li);
					requestPayload.greyscale = true;

				}
				else {					
					tempArr.splice(tempArr.indexOf($(this).attr('id')), 1);
					removeUncheckedOperation(this);
					$('#greyDrag').remove();
					requestPayload.greyscale = false //not sending operation data on uncheck of format operation
				}

				break;	
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
		if($(this).is(':checked')){
			requestPayload.multiGenerate = true;
		}
	});

	$('#flipCheckBoxInput').change(function () {
		if($(this).is(':checked')) {
			$('.croppedImg').css('transform', 'scaleX(-1)');
		}
		else{
			$('.croppedImg').css('transform', '');
		}
	});

	$('#greyScaleCheckBoxInput').change(function() {
		if($(this).is(':checked')) {
			$('.croppedImg').css('filter', 'grayscale(100%)');
		}
		else {
			$('.croppedImg').css('filter', '');
		}
	});

	$('#invertCheckBoxInput').change(function() {
		if($(this).is(':checked')) {
			$('.croppedImg').css('filter', 'invert(100%)');
		}
		else {
			$('.croppedImg').css('filter', '');
		}
	});
});
