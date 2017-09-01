$("[data-toggle='toggle']").click(function() {
    var selector = $(this).data("target");
    $(selector).toggleClass('in');
});

$(document).ready(function() {
		
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

				div.appendChild(img);

				$(".croppedImg").css({
					'width':'100%',
					'min-height':'100%',
					'top':0,
					'left':0,
					'background': 'url('+path+') no-repeat -0px -0px',
					'background-size': $('.imageContainer')[0].clientWidth + 'px'
				});



			}
		}
	});

	//crop logic

	$(".testing > label > input").change(function(){		
		var size = Number($(this).val());		
		var containerWidth = $("#imageContainer")[0].clientWidth;
		var containerHeight = $("#imageContainer")[0].clientHeight;

		var centerX = containerWidth/2;
		var centerY = containerHeight/2;

		var offsetX = centerX - size/2;
		var offsetY = centerY - size/2;

		var url = $('.imageContainer > img').attr('src');
	

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
});

