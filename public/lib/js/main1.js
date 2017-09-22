$("[data-toggle='toggle']").click(function() {
    var selector = $(this).data("target");
    $(selector).toggleClass('in');
});

$(document).ready(function() {
	// initial page render settings
	//$('.imageContainer').css('display', 'none');
    //$('.sidenav').addClass('sideNavFullWidth');
    // swal("Congratulations!", "All images processed", "success");

    //---------------------------------------------
    //Global objects
    //---------------------------------------------
    var img = new Image();
    var isMultipleUpload = false;

    //---------------------------------------------
    //Global objects end
    //---------------------------------------------

	var requestPayload = {};
	var operationsArr = [];
	var url = "/image/process";
	var img = new Image();

	var reorder = function() {
		var operationArray = $('.operationsOrder > li');
		var operationOrder = [];
		var operationOrder = operationArray.map(function(li, liValue){
			return $(liValue).text();
		});

		return JSON.stringify(operationOrder.get());
	};

	var clearAllInputs = function(selector) {
		//console.log('selector >>>', selector);
	  $(selector).find(':input').each(function() {
	  	//console.log('this.type', this.type);

	    if(this.type == 'submit'){
	          //do nothing
	      }
	      else if(this.type == 'checkbox') {
	      	if (this.checked) {
	      		$(this).trigger('click');
	      	}
	      }
	      else if(this.type == 'radio') {      		
      		$(this)[0].checked = false;
	      }
	      else{
	        $(this).val('');
	      }
	   });
	}

	$(".operationsOrder").sortable();

	// $('.singleUpload, .multiUpload').click(function() {// for overlay buttons

	// 	$('.homeOverlay').css({top:"-100vh"});

	// 	if($(this).attr('class').indexOf('singleUpload') !== -1) {
	// 		$('.singleUploadContainer').addClass('active');
	// 		$('.nav-tabs > li:nth-child(1)').addClass('active');
	// 		url = '/image/process';
	// 		$('.submitBtnContainer > button').text('PROCESS SINGLE');
	// 	}
	// 	else {
	// 		$('.multipleUploadContainer').addClass('active');
	// 		$('.nav-tabs > li:nth-child(2)').addClass('active');
	// 		url = '/image/multipleUpload';
	// 		$('.submitBtnContainer > button').text('PROCESS MULTIPLE');
	// 	}
	// });

	$('.nav-tabs > li:first-child').click(function() {// for nav tabs
		url = '/image/process';
		$('.submitBtnContainer > button').text('PROCESS SINGLE');

		if($('.imageContainer img').attr('src')){
            $('.sidenav').addClass('decreasWidth');
			$('.rightPanel').addClass('rightShow');

            isMultipleUpload = false;
		}
		else{
            $('.sidenav').removeClass('decreasWidth');
			$('.rightPanel').addClass('rightShow');
		}
		requestPayload = {};//on changing tabs resetting the request payload
		clearAllInputs('.rightPanel');
		$('.saveBtn').css('display', 'none');
		$('#accordion').css('display', 'none');
	});

	$('.nav-tabs > li:last-child').click(function() {
        isMultipleUpload = true;
		url = '/image/multipleUpload';
		$('.submitBtnContainer > button').text('PROCESS MULTIPLE');
        $('.sidenav').addClass('decreasWidth');
		$('.rightPanel').addClass('rightShow');
		// $('.saveBtn').addClass('rightShow');


		requestPayload = {};//on changing tabs resetting the request payload
		clearAllInputs('.rightPanel');
		$('#accordion').css('display', 'block');
		$('.saveBtn').css('display', 'block');
	});

	$("#selectedImage").change(function () {
		var filePath = $(this)[0].value;
		var selectedFileName = filePath.replace(/^.*[\\\/]/, '');

		$("#fileNameDisplayBox").val(selectedFileName);
		$('.uploadButton').slideDown(500);
		$("#imageUploadForm").submit();
	});

	$("#imageUploadForm").submit(function(e) {// single image upload
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

				var path = this.responseText.substring(1);
				var fileName = path.replace(/^.*[\\\/]/, '');
				var width = 0;

				img.src = path;

				requestPayload.imageFileName = fileName;
				requestPayload.imagePath = path;

				$('.progress, .progressBar').css('display', 'block');

				var showProgress = setInterval(showImage, 20);
                function showImage() {
					width = width + 1;

					if (width <= 100) {
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

                        // render the crop image logic
                        renderCropImage();
					//	$('.sidenav').removeClass('sideNavFullWidth');
					    $('.sidenav').addClass('decreasWidth');
						$('.rightPanel').addClass('rightShow');
						clearInterval(showProgress);
					}
				}
			}
		}
	});

    function renderCropImage(){
        var path = img.src;
        var imgWidth = img.width;
        var imgHeight = img.height;

        //set image layer's height and width according to image
        //if image is horizontal

        if(imgWidth > imgHeight){
            $(".layer").css({
				"width":imgWidth,
				"height":imgHeight,
				"display": "inline-block",
				"vertical-align": "middle",
				"margin": "0 auto",
				"top": $(img).position().top,
                "left":0
			});
			$(".croppedImg").css({
				"width":imgWidth,
				"height":imgHeight,
				"display": "inline-block",
				"vertical-align": "middle",
				"margin": "0 auto",
                'left':0,
				"top": Number($(img).position().top),
				'background': 'url('+path+') no-repeat -0px -0px',
				'background-size': imgWidth + 'px'
			});
        }
        //if image is Vertical
        else if(imgWidth < imgHeight){
            $(".layer").css({
				"width":imgWidth,
				"height":imgHeight,
				"display": "inline-block",
				"vertical-align": "middle",
				"margin": "0 auto",
				"left": Number($(img).position().left),
                "top":0
			});

			$(".croppedImg").css({
				"width":imgWidth,
				"height":imgHeight,
				"display": "inline-block",
				"vertical-align": "middle",
				"margin": "0 auto",
                "left": Number($(img).position().left),
                "top":0,
				'background': 'url('+path+') no-repeat -0px -0px',
				'background-size': imgWidth + 'px'
			});
        }
        //if image is square
        else {
            $(".layer").css({
                "width":imgWidth,
                "height":imgHeight,
                "display": "inline-block",
                "vertical-align": "middle",
                "margin": "0 auto",
                "left": Number($(img).position().left),
                "top":Number($(img).position().top)
            });

            $(".croppedImg").css({

                "width":imgWidth,
                "height":imgHeight,
                "display": "inline-block",
                "vertical-align": "middle",
                "margin": "0 auto",
                "left": Number($(img).position().left),
                "top":Number($(img).position().top),
                'background': 'url('+path+') no-repeat -0px -0px',
                'background-size': imgWidth + 'px'
            });
        }
    }

	// function resetCroppedImg (){
	// 		var layerWidth = Number($(".layer")[0].clientWidth);
	// 		var layerHeight = Number($(".layer")[0].clientHeight);
	// 		var centerX = layerWidth/2;
	// 		var centerY = layerHeight/2;
	// 		var offsetX = 0;
	// 		var offsetY = 0;
	// 		var url = $('.imageContainer > img').attr('src');
	// 		console.log("img",img);

	// 		$('.croppedImg').css({
	//                 'width': layerWidth,
	//                 'height': layerHeight,
	//                 'left': Number($(".imageContainer > img").position().left),
	// 				'top': Number($(".imageContainer > img").position().top),
	// 				'border': '1px dashed #fff',
	//                 'background': 'url('+url+') no-repeat -'+ (offsetX + 1)+'px -'+(offsetY + 1)+'px',
	// 				'background-size': layerWidth + 'px',
	// 			});

	// }


	//crop logic

	$(".labelsSection > label > input").change(function(){
		var panelID = $(this).parent().parent().parent().attr('id');
		var size = Number($(this).val());
        var cropDimension = ($(this).parent()[0].innerText).trim();
		var layerWidth = Number($(".layer")[0].clientWidth);
		var layerHeight = Number($(".layer")[0].clientHeight);
		var centerX = layerWidth/2;
		var centerY = layerHeight/2;
		var offsetX = centerX - size/2;
		var offsetY = centerY - size/2;
		var url = $('.imageContainer > img').attr('src');

		console.log("onload img", img);

		var imageCropper = function () {
			$('.croppedImg').css({
                'width': size,
                'height': size,
                'left': offsetX + Number($(img).position().left),
				'top': offsetY + Number($(img).position().top),
				'border': '1px dashed #fff',
                'background': 'url('+url+') no-repeat -'+ (offsetX + 1)+'px -'+(offsetY + 1)+'px',
				'background-size': layerWidth + 'px',
			});
		}

		console.log('panelID', panelID);

		switch(panelID) {
			case 'cropSlider':
				requestPayload.crop = cropDimension;
                if(!isMultipleUpload){imageCropper();};
				break;

			case 'resizeSlider':
				var dimension = Number($(this).val());
				requestPayload.resize = dimension+"x"+dimension;
				break;

			case 'formatSlider':
				var format = $(this).val();
				requestPayload.format = format;
				break;

			case 'mulGenSlider':
				var mulGen = $(this).val();
				console.log('mulGen', mulGen);
				if (mulGen === 'Yes') {
					requestPayload.multiGenerate = true;
					console.log('requestPayload.multiGenerate', requestPayload.multiGenerate);
				}
				else {
					requestPayload.multiGenerate = false;
					console.log('requestPayload.multiGenerate', requestPayload.multiGenerate);
				}
		}
	});

    //---------------------------------------------
    //Reset crop logic
    //---------------------------------------------

    function resetCropLogic() {
        var layerWidth = Number($(".layer")[0].clientWidth);
		var layerHeight = Number($(".layer")[0].clientHeight);

		var url = $('.imageContainer > img').attr('src');
		$('.croppedImg').css({
            'width': layerWidth,
            'height': layerHeight,
            'left': Number($(img).position().left),
			'top': Number($(img).position().top),
			'border': 0,
            'background': 'url('+url+') no-repeat 0px 0px',
			'background-size': layerWidth + 'px',
		});
    }

	$('.submitChanges').click(function(event) {

		if($('input[name=configType]:checked').val() == "savedConfigId"){
			if($(".configCheckbox input[name=qwe]:checked").val()){
				requestPayload.configId = $(".configCheckbox input[name=qwe]:checked").val();
				$('.loaderLayer, .loader').css('display', 'block');
	            $.ajax({
	    			type: 'POST',
	    			url: url,
	    			data: JSON.stringify(requestPayload),
	    			contentType: 'application/json',
	    			success: function(result) {
	    				requestPayload = {}
	    				console.log('Process Multiple result => ', result);
	    				$('.loaderLayer, .loader').css('display', 'none');
	                    swal("Congratulations!", "All images processed", "success")
	    	            .then(function() {
	    	            	window.location = '/home';
	    	            });
	    			},
	    	        error: function(error){
	    	            console.log('Process Multiple Error => ', error);
	    	        }
	    		});
			}
		} else {
			requestPayload.operationOrder = reorder(); // sending operation order to server based on user's choice
			requestPayload.sourcePath = (url == "/image/multipleUpload") ? $('input[name=sourceInput]').val() : true;
			requestPayload.destPath = $('input[name=destInput]').val();

	        if(requestPayload.operationOrder && JSON.parse(requestPayload.operationOrder).length && requestPayload.sourcePath){
	            $('.loaderLayer, .loader').css('display', 'block');
	            $.ajax({
	    			type: 'POST',
	    			url: url,
	    			data: JSON.stringify(requestPayload),
	    			contentType: 'application/json',
	    			success: function(result) {
	    				requestPayload = {}
	    				console.log('Process Multiple result => ', result);
	    				$('.loaderLayer, .loader').css('display', 'none');
	                    swal("Congratulations!", "All images processed", "success")
	    	            .then(function() {
	    	            	window.location = '/home';
	    	            });
	    			},
	    	        error: function(error){
	    	            console.log('Process Multiple Error => ', error);
	    	        }
	    		});
	        } else {

	            //TODO: Display info alert
	        }
	    }
	});

	$('input[name=sourceInput]').on('input',function (){
		$(this).removeClass("required");
	});

	$('input[name=sourceInput]').focus(function(){
        $(this).addClass("required");
     });


	$(".saveBtn").click(function () {

		requestPayload.operationOrder = reorder(); // sending operation order to server based on user's choice
		requestPayload.sourcePath = (url == "/image/multipleUpload") ? $('input[name=sourceInput]').val() : true;
		requestPayload.destPath = $('input[name=destInput]').val();

		// if($('input[name=sourceInput]').val() === '') {
	 //        swal("Please provide source path", "", "error");	       
		// }
        if(requestPayload.operationOrder && JSON.parse(requestPayload.operationOrder).length && requestPayload.sourcePath){
    		$.ajax({
    			type: 'POST',
    			url: 'saveConfig',
    			data: JSON.stringify(requestPayload),
    			contentType: 'application/json',
    			success: function(result) {
    				requestPayload = {};
    				console.log('Save config result', result);
                    swal("Configurations saved successfully!", "", "success")
    					.then(function() {
    						window.location = '/home';
    					});
    			},
    	        error: function(error){
    	        	requestPayload = {};
    	        	console.log('Save config Error => ', error);
    	        }
    		});
        } else {
        	if(!requestPayload.sourcePath){
        		$('input[name=sourceInput]').trigger('focus');
        	}
            $('.loaderLayer, .loader').css('display', 'none');
            //TODO: Display info alert
        }
	})

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
					$('input[name=cropRadio]').removeAttr('checked');
                    //reset crop logic
                    resetCropLogic();
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

	// $('input[name=multiGenerate]').change(function() {
	// 	if($(this).is(':checked')){
	// 		requestPayload.multiGenerate = true;
	// 		console.log('requestPayload.multiGenerate', requestPayload.multiGenerate);
	// 	}
	// 	else{
	// 		requestPayload.multiGenerate = false;
	// 	}
	// });

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

	 $('.configCheckbox > input[name=qwe]').change(function() {
        $("#savedConfigId")[0].checked = true;
    });
    $('#newConfigId').change(function() {
        console.log($('.configCheckbox > input[name=qwe]'));
        $('.configCheckbox > input[name=qwe]').each(function() {
            if($(this).is(":checked")){
                $(this)[0].checked = false;
            }
        });
    });

});
