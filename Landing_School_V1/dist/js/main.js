// SHOWCASE SLIDESHOW //
let scSlides = document.querySelectorAll('.sc-slide'),
	scSlideshowBtn1 = document.querySelector('.sc-slideshow-btn1'),
	scSlideshowBtn2 = document.querySelector('.sc-slideshow-btn2'),
	scSlide1 = document.querySelector('.sc-slide1'),
	scSlide2 = document.querySelector('.sc-slide2');

function reset() {
	for (let i = 0; i < scSlides.length; i++) {
		scSlides[i].style.display = 'none';
	}
}

scSlideshowBtn1.addEventListener('click', function() {
	reset();
	scSlide1.style.display = 'block';
});

scSlideshowBtn2.addEventListener('click', function() {
	reset();
	scSlide2.style.display = 'block';
});
