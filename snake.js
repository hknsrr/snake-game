(function () {

	var snakeBody = jQuery('<div class="snakeBody">');

	var positionList = JSON.parse(localStorage.getItem('positionList') || "[]");

	var direction = JSON.parse(localStorage.getItem('direction')) || {
		horizontal: 1,
		vertical: 0
	};
	var score = 0;
	var docWidth = $(document).width(),
		docHeight = $(document).height();

	var getBody = function () {
		var targetArea = {
			top: Number(jQuery('.snakeBody:first').css('top').replace('px', '')) + (direction.vertical && direction.vertical * 15),
			left: Number(jQuery('.snakeBody:first').css('left').replace('px', '')) + (direction.horizontal && direction.horizontal * 15)
		};
		return jQuery(document.elementFromPoint(targetArea.left, targetArea.top));
	};

	var saveGameData = function () {
		localStorage.setItem('positionList', JSON.stringify(positionList));
		localStorage.setItem('direction', JSON.stringify(direction));
	};

	jQuery(document).keydown(function (e) {

		// 32 space
		// 37 Left arrow
		// 38 Up arrow
		// 39 Right arrow
		// 40 Down arrow
		// console.log(e.keyCode);

		if (jQuery.inArray(e.keyCode, [32, 37, 38, 39, 40]) == -1) return;

		if (e.keyCode == 32) {
			saveGameData();
			getBody().length > 0 && (getBody()[0].click());
			e.preventDefault();
			return;
		} else if (e.keyCode == 37 || e.keyCode == 39) { //horizontal reverse control
			if (direction.horizontal == 1 || direction.horizontal == -1)
				return;
		}
		else if (e.keyCode == 38 || e.keyCode == 40) { //vertical reverse control
			if (direction.vertical == 1 || direction.vertical == -1)
				return;
		}
		direction = {
			horizontal: (e.keyCode == 37 && -1) || (e.keyCode == 39 && 1) || 0,
			vertical: (e.keyCode == 38 && -1) || (e.keyCode == 40 && 1) || 0
		};
		e.preventDefault();

	});


	var getNextPosition = function (elem) {

		var position = {};
		//***

		direction.horizontal && (position.left = Number(jQuery(elem).css('left').replace('px', '')) + (direction.horizontal * 15));
		direction.vertical && (position.top = Number(jQuery(elem).css('top').replace('px', '')) + (direction.vertical * 15));

		position.top && ((position.top > jQuery(window).height() && (position.top = 0)) || (position.top < 0 && (position.top = jQuery(window).height())));
		position.left && ((position.left > jQuery(window).width() && (position.left = 0)) || (position.left < 0 && (position.left = jQuery(window).width())));

		var prey = jQuery('.prey');
		var preyPosition = prey.position();

		var sneak = jQuery('.snakeBody:first');
		var sneakPosition = sneak.position();

		if (sneakPosition.left == preyPosition.left && sneakPosition.top == preyPosition.top) { // prey contacted

			prevPosition(prey);

			var lastItemLeft = jQuery('.snakeBody').last().offset().left;
			var lastItemTop = jQuery('.snakeBody').last().offset().top;

			jQuery('body').append('<div class="snakeBody" style="top:' + lastItemTop + 'px; left:' + lastItemLeft + 'px"></div>');

			score = score + 2;
			jQuery('#score').text('Score: ' + score);

		} else if (sneakPosition.left + 15 > docWidth || sneakPosition.top + 15 > docHeight) {

			gameOver();
		}

		jQuery('.snakeBody').each(function (key) {  // check the snake hit the its tail
			if (key != 0) {
				var tailLeft = jQuery(this).offset().left;
				var tailTop = jQuery(this).offset().top;

				if (sneakPosition.left == tailLeft && sneakPosition.top == tailTop)
					gameOver();
			}
		})

		return position;
	};

	var prevPosition = function (element) { // create new random pos for prev

		$div = element,
			divWidth = $div.width(),
			divHeight = $div.height(),
			heightMax = docHeight - divHeight,
			widthMax = docWidth - divWidth;

		var randomWidth = [];
		var randomHeight = [];

		for (var index = 0; index < widthMax; index++) {
			if (index % 15 == 0)
				randomWidth.push(index);
		}

		for (var index2 = 0; index2 < heightMax; index2++) {
			if (index2 % 15 == 0)
				randomHeight.push(index2);
		}

		$div.css({
			left: randomWidth[Math.floor(Math.random() * randomWidth.length)],
			top: randomHeight[Math.floor(Math.random() * randomHeight.length)]
		});
	}

	var gameOver = function () { // GAME OVER
		jQuery('<p>').text('GAME OVER! Your score is: ' + score).appendTo('body').addClass('center animate');
		clearInterval(scoreInterval);
		clearInterval(gameInterval);
		jQuery('.snakeBody:first').css('opacity', 0);
	}

	var gameInterval = setInterval(function () {

		jQuery('.snakeBody').each(function (key) {
			positionList[key] = {
				top: Number(jQuery(this).css('top').replace('px', '')),
				left: Number(jQuery(this).css('left').replace('px', ''))
			};
			if (key == 0)
				jQuery(this).css(getNextPosition(jQuery(this)));
			else
				jQuery(this).css(positionList[key - 1]);
		});

	}, 100); // speed

	var scoreInterval = setInterval(function () { // 1 score increment every 10 seconds

		score++;
		jQuery('#score').text('Score: ' + score);

	}, 10000);

	jQuery('body').append('<style>.snakeBody { z-index:99999999; width: 15px; height: 15px; position: fixed; top: 0; left:0; background: black;} .snakeBody:first-child {background: red;}</style>');

	// initialize
	var i = 0;
	while (i < 3) {
		jQuery('body').append(snakeBody.clone().css(positionList[i] || { left: i + 'px' }));

		i++;
	}
	jQuery('.snakeBody:first').css('background', 'red');

})();