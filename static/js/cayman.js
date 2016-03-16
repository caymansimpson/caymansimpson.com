/*********************************************** Cayman's Online Resume By Cayman Simpson, cayman.simpson@gmail.com **********************************************/
/*																	   	  I have ownership of this code, so swiper no swiping...											  */

/* =====================================================================================================================================================
 * =====================================================================================================================================================
 * ====================================================================== GLOBALS ======================================================================
 * =====================================================================================================================================================
 * ===================================================================================================================================================== */


/* The global variable I user for all setInterval/clearInterval functions for this visualization. Used for animation of progress bar in this case. */
var twinkler;

var cloudTimer;
var numClouds;

var current = "midday";

/* ============================================================================================================================================================
 * ============================================================================================================================================================
 * ====================================================================== ON WINDOW LOAD ======================================================================
 * ============================================================================================================================================================
 * ============================================================================================================================================================
 * Before the window load, I inialize global variables, initialize the buttons, prepare the button's javascript and hide all the elements that appear 'on page
 * load' (which really just load sequentially with a delay for effect).
 */
$(document).ready(function() {
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		alert("This is my personal website, and I have not added mobile support.\n\nFor the best experience, view it on a desktop!");
	}
});

function transition() {
	var visible = $("#mainpage");

	// Check if clicked page is already visible
	if($(visible).attr("class").indexOf(current) >= 0) return; // Already on that page, so don't transition

	// Move Transition Bubbles
	$('.backcircle').stop(true, true).each(function() {
		if($(this).attr('value').indexOf(current) < 0) {
			$(this).animate({
				top: 0
			}, 250)
		} else {
			$(this).animate({
				top: "-" + $("#facetnavigation").height() * .2 + "px"
			}, 250)
		}
	});

	// Change background
	$(visible).attr("class", "facet " + current);

	// So that text scrolls behind them
	$(".headercontainer").attr("class", "headercontainer facet " + current)
	$(".footercontainer").attr("class", "footercontainer facet " + current)


	// Hide old page content and show new page content
	$(".subtextmessage,.maincontent").fadeOut(0, function() {
		$("." + current).fadeIn(0);
	});

	if(current == "midnight") {
		paintStars(100);
	} else {
		clearStars();
	}

	if(current == "midday") {
		paintClouds();
	} else {
		clearClouds();
	}
}

function start() {
	// STEPS:
	// 1) hide everything but welcome button (and disable it)
	// 2) show header and navigation at 0 opacity, disabled
	// 3) adjust facet navigation so that circles are good (initialize, but disable)
	// 4) have button go to first circle, disappear in it, circle absorbs it
	// 5) transition
	
	$('#welcomebutton').prop('disabled', true);

	$("#welcome,#welcomemessage").animate({"opacity": 0}, 250, function() {

		// Callback for hiding welcome stuff
		$(".header,#facetnavigation").css('opacity',0).show();
		initializeNavigation();

		$(".header,#facetnavigation").animate({'opacity': 1}, 100, function() {
			setTimeout(function() {
				var button = document.getElementById("welcomebutton").getBoundingClientRect()
				var circle = $(".backcircle.left")[0].getBoundingClientRect();
				var targettop = circle.top - parseFloat(button.top - button.bottom)/2

				//Callback for showing header/navigation bar
				$("#welcomebutton").css({
					"position": "fixed",
					"top": button.top,
					"left": document.getElementById("welcomebutton").getBoundingClientRect().left,
					"-moz-transform": "scale(1)",
					"-webkit-transform": "scale(1)",
					"transform": "scale(1)",
					"z-index": 4
				})
				$("#welcomebutton").animate({
				  	"left": circle.left + (circle.right - circle.left)/2 - (button.right - button.left)/2
				}, {
					duration: 750,
					step: function(now, fx) {
						$("#welcomebutton").css({
							'top': button.top - (button.top + (button.top - button.bottom)/2 - targettop)*Math.pow(Math.abs(fx.start - now)/Math.abs(fx.start - fx.end), 2),
							"-moz-transform": "scale(" + Math.sqrt(Math.abs(now - fx.end)/Math.abs(fx.start - fx.end)) + ")",
						  	"-webkit-transform": "scale(" + Math.sqrt(Math.abs(now - fx.end)/Math.abs(fx.start - fx.end)) + ")",
						  	"transform": "scale(" + Math.sqrt(Math.abs(now - fx.end)/Math.abs(fx.start - fx.end)) + ")"
						});

					},
					complete: function() {	// Callback for completing button going into morning circle

						$("#welcomeholder").remove();

						$(".backcircle.left").addClass("pulseonce");

						$('.backcircle').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
							$(this).removeClass('pulseonce');

							$(".header,.subtextmessage.morning,.maincontent.morning,#facetnavigation").show();

							current = "morning";

							// Add Events to navigations
							makeResponsiveNavigation();

							// Fully Transition to morning
							transition();

						});

					}
				})
			}, 100) // Pause between button click and button move
			
		});
	});



}

function gaussian(mean) {
	return 2*mean*(Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random())/6
}

/* ===============================================================================================================================================================
 * ===============================================================================================================================================================
 * ===================================================================== AFTER WINDOW RESIZE =====================================================================
 * ===============================================================================================================================================================
 * ===============================================================================================================================================================
 */

$(window).resize(function() {
	$('.navcircle').each(function() {
		$(this).css({'width': $(this).height() + 'px' });
	});
});

/* ===============================================================================================================================================================
 * ===============================================================================================================================================================
 * ====================================================================== AFTER WINDOW LOAD ======================================================================
 * ===============================================================================================================================================================
 * ===============================================================================================================================================================
 */

$(window).bind("load", function() {
	intializeHeader();
	displayWelcome();
});

/* ---------------------------------------- displayWelcome() ----------------------------------------
 * Displays Welcome message with image of flower and nifty custom animations. Also shows the 'Charts'
 * dropdown for user to select visualizations.
 */
function displayWelcome() {
	$("#welcome").css('opacity', 0).show().animate({ opacity: 1 }, 750, function() {
	 	$("#welcome").animate({ top: "15%" }, 1000, function() {
	 		$("#welcomemessage").fadeIn(function () {
	 			setTimeout(function() {
	 				$("#welcomebutton").fadeIn(function() {
	 					initializeRockAndRollButton();
	 				});
	 			}, 500);
	 		});
	 	});
   });
}


/* ===============================================================================================================================================================
 * ===============================================================================================================================================================
 * ============================================================== INITIALIZE RESPONSIVENESS ======================================================================
 * ===============================================================================================================================================================
 * ===============================================================================================================================================================
 * After the window load, I start the progress bar to give the effect of a heavy duty application with much front-end preprocessing.
 */

/* -------------------------------- initializeRockAndRollButton() -----------------------------------
 * Initializes the Rock and Roll Button
 */
function initializeRockAndRollButton() {
	$("#welcomebutton").on("click", function(evt) {
		evt.stopPropagation();
		evt.preventDefault();

		start();
	});
}

function intializeHeader() {

	$(".resume").on('click', function() {
		var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
		var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

		var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
		var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

		var left = ((width / 2) - (width*.7 / 2)) + dualScreenLeft;
		var top = ((height / 2) - (height*.9 / 2)) + dualScreenTop;
		var newWindow = window.open("static/img/resume.pdf","Resume",'scrollbars=yes,location=no,width='+width*.7+',height='+height*.9+',top='+top+',left='+left);

		// Puts focus on the newWindow
		if (window.focus) {
			newWindow.focus();
		}
	});

	// Create contact information so Spam bots can't read
	function obfuscate(str) { return str.replace("DIESPAMBOTSDIE!!!!","n@gmSECONDROUNDHAl.com").replace("SECONDROUNDHA", "ai") };
	$(".contact").attr("href", obfuscate("mailto:cayman.simpsoDIESPAMBOTSDIE!!!!?body=I'd like to treat you to a couple of beers, on me."));

}

function initializeNavigation() {
	$("#facetnavigation").show();

	$('.navcircle').each(function() {
		$(this).css({'width': $(this).height() + 'px' });
	});
}

function makeResponsiveNavigation() {
	$('.backcircle').addClass('hover');

	$('.backcircle').on('click', function() {
		current = $(this).attr('value');
		transition();
	})

	$("body").keydown(function(e) {
		var old = current;
	  if(e.which == 37) { // left
		 if(current == "midnight") current = "midday";
		 else if(current == "midday") current = "morning";
	  }
	  else if(e.which == 39) { // right
		 if(current == "morning") current = "midday";
		 else if(current == "midday") current = "midnight";
	  }

	  transition();
	});
}


/* ===============================================================================================================================================================
 * ===============================================================================================================================================================
 * =========================================================================== CLOUDS ============================================================================
 * ===============================================================================================================================================================
 * ===============================================================================================================================================================
 * All the Clouds functions
 */




function paintClouds() {
	numClouds = 0;
	cloudTimer = setInterval(startCloud, 1000);
}

function startCloud() {
	// Determine how many clouds, how fast (based on width), when they go, and height and dimensions
	var speed = 200000 + Math.random()*50000 - 25000;

	if(numClouds <= 4) {
		numClouds += 1;

		var width = Math.min(gaussian(225), 300);
		var cloud = createCloud(width, 110);
		cloud.style.left = -width
		cloud.style.top = (Math.random()*(50)) + 25 + "%";

		$("body").append(cloud);
		$(cloud).animate({
			"left": $(window).width()
		}, speed, "linear", function() {
			$(this).remove();
			numClouds -= 1;
		})
	}


	clearInterval(cloudTimer);
	cloudTimer = setInterval(startCloud, (numClouds == 0)? 0 : parseInt(Math.random() * 150000));
}

function normalpdf(x, mean, std) {
	return Math.exp(-0.91893853320467274180 - Math.log(std) - Math.pow(x - mean, 2) / (2 * Math.pow(std, 2)));
}


function createCloud(width, height) {
	var cloudholder = document.createElement("div");
	cloudholder.className = "cloudholder"

	$(cloudholder).css({
		"width": width,
		"height": height
	});

	for(var i = 0; i < 100; i++) {
		expected = normalpdf(-2 + i*4/100.0, 0, 1)*800/25

		for(var j = 0; j < expected; j++) {

		 	var d = document.createElement("div");
		 	d.className = "cloud";

		 	$(d).css({
		 		"opacity": gaussian(.1),
		 		"width": gaussian(15),
		 		"height": gaussian(15),
		 		"top": -1*(gaussian(.5))*100 + "%",
		 		"left": i + "%"
		 	});

			$(cloudholder).append(d);
		}
	}

	return cloudholder;
}

function clearClouds() {
	clearInterval(cloudTimer);
	numClouds = 0;
	$(".cloudholder").remove();
}


/* ===============================================================================================================================================================
 * ===============================================================================================================================================================
 * ============================================================================ STARS ============================================================================
 * ===============================================================================================================================================================
 * ===============================================================================================================================================================
 * All the Stars functions
 */


function paintStars(numStars) {
	for(var i = 0; i < numStars; i++) {
		var star = document.createElement("img");
		star.className = "star";
		star.style.height = gaussian(4.5);
		star.style.top = Math.random()*$("body").height();
		star.style.left = Math.random()*$("body").width();

		$("body").append(star)
	}

	twinkle();
}


function twinkle() {
	twinkler = [];

	$(".star").each(function(index, star) {

		var twinkleCycleSpeed = Math.min(gaussian(5000), 10000);

		$(star).css('opacity', Math.min(gaussian(.25), 1));

		twinkler.push(setInterval(function() {
			$(star).animate(
				{ opacity: .8 },
				twinkleCycleSpeed/2, "swing", function() {
					$(star).animate(
						{ opacity: .1 },
						twinkleCycleSpeed/2, "swing"
					);
				}
			);
		}, twinkleCycleSpeed));
	})

}

function clearStars() {
	for(interval in twinkler) {
		clearInterval(twinkle);
		$(".star").remove();
	}
}