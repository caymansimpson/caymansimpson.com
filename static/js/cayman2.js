var twinkler = [];
var cloudTimer;
var numClouds;

$(window).bind("load", function() {
	// todo: things
});

$( document ).ready(function() {
	//transition("welcome")

	$("body").keydown(function(e) {
		var current = getCurrentFacet();
		if(e.which == 37) { // left
			if(current == "midnight") transition("midday");
			else if(current == "midday") transition("morning");
		}
		else if(e.which == 39) { // right
			if(current == "morning") transition("midday");
			else if(current == "midday") transition("midnight");
		}
	})
});


// TODO: implement
function transition(id) {

	// Can't transition to something you're already on
	if(getCurrentFacet() == id) return;

	// Deconstructors
	clearWelcome();
	clearClouds();
	clearStars();

	var data = JSON.parse($("#" + id).html());
	var skeleton = _.template($('#facet-template').html());
	$('.content').html(skeleton(data));

	window[data['initializeFunc']];
	$('body').removeClass().addClass(id);
}

function getCurrentFacet() {
	return $('body').attr('class');
}

/* ===============================================================================================================================================================
 * ===============================================================================================================================================================
 * ========================================================================== WELCOME ===========================================================================
 * ===============================================================================================================================================================
 * ===============================================================================================================================================================
 * All the Welcome functions
 */

//TODO: create welcome, disable arrows and key clicks, hide header, hide footer
function paintWelcome() {
	$('.header,.footer,.arrow-holder>img').hide();
// <button id="welcomebutton" onClick="transition('aspirer')">
//         <span class="roundedbuttontext">Let's Rock and Roll</span>
//       </button>
}

function clearWelcome() {
	$('.header,.footer,.arrow-holder>img').show();
	//TODO: initialize everything -- arrows, keyclicks, header, footer

}

//TODO: Constructor for aspirer. figure something out!
function doSomething() {

}


/* ===============================================================================================================================================================
 * ===============================================================================================================================================================
 * =========================================================================== CLOUDS ============================================================================
 * ===============================================================================================================================================================
 * ===============================================================================================================================================================
 * All the Cloud functions
 */




function gaussian(mean) {
	return 2*mean*(Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random())/6
}

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
		var expected = normalpdf(-2 + i*4/100.0, 0, 1)*800/25

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


function paintStars() {
	for(var i = 0; i < 100; i++) {
		var star = document.createElement("img");
		star.className = "star";
		star.style.height = gaussian(4.5);
		star.style.top = Math.random()*$("html").height() - +$("body").css('margin-top').replace("px","");
		star.style.left = Math.random()*$("html").width();

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