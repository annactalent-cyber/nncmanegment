jQuery(document).on('ready', function() {
	"use strict";
	/* -------------------------------------
			NAVIGATION TOGGLE
	-------------------------------------- */
	jQuery('.bt-btntogglemenu').on('click', function(event) {
		event.preventDefault();
		jQuery('#bt-nav').slideToggle('slow');
		jQuery('body.bt-homeone').toggleClass('bt-pagescrolldiable');
		jQuery('body.bt-hometwo').toggleClass('bt-pagescrolldiable');
	});
	/* -------------------------------------
			SHARE ICONS TOGGLE
	-------------------------------------- */
	var _bt_btnshare = jQuery('.bt-btnshare');
	_bt_btnshare.on('click', function(event) {
		event.preventDefault();
		var _bt_shapreicons = jQuery('.bt-shapreicons');
		jQuery(this).parent('li').toggleClass('bt-showicon');
	});
	/* -------------------------------------
			HOME BANNER SLIDER				
	-------------------------------------- */
	var _bt_homeslidervone = jQuery('#bt-homeslidervone');
	_bt_homeslidervone.pogoSlider({
		pauseOnHover: false,
		autoplay: true,
		generateNav: false,
		generateButtons: true,
		displayProgess: false,
		autoplayTimeout: 6000,
		responsive: true,
		onSlideStart: (function(){
			var _slideslength = jQuery('.pogoSlider-slide').length;
			var _currentSlide = this.currentSlideIndex + 1;
			jQuery('#bt-totalslides').text(_slideslength);
			jQuery('#bt-currentslides').text(_currentSlide);
		}),
	}).data('plugin_pogoSlider');
	/* -------------------------------------
			ALBUMBS GALLERY
	-------------------------------------- */
	var _tg_categoryAlbumbs = jQuery('[id="bt-weddingalbum"],[id="bt-kidsalbum"], [id="bt-twinssisteralbum"], [id="bt-halloweenalbum"], [id="bt-stationphotographyalbum"], [id="bt-femalemodelalbum"], [id="bt-femalemodeltwoalbum"], [id="bt-randomclickalbum"]');
	if(_tg_categoryAlbumbs.hasClass('bt-album')){
		_tg_categoryAlbumbs.jGallery({
			textColor: '#fff',
			mode: 'full-screen',
			canChangeMode: false,
			browserHistory: false,
			backgroundColor: '#000',
		});
	}
	jQuery('.bt-callalbum').on('click', function(event) {
		event.preventDefault();
		var clickedValue = jQuery(this).attr('data-number');
		console.log(clickedValue);
		jQuery('.jgallery').each(function(){
			jQuery(this).hide();
			if(jQuery(this).attr('data-jgallery-id') == clickedValue) {
				jQuery(this).show();
			}
		});
		jQuery('body.bt-homevalbums').toggleClass('bt-showalbum');
	});
	jQuery('#bt-btnclosealbum').on('click', function(event){
		jQuery('body.bt-homevalbums').toggleClass('bt-showalbum');
	});
	/* -------------------------------------
			BANNER FADEOUT
	-------------------------------------- */
	function bannerFadeout(){
		jQuery(window).on('scroll', function () {
			var scroll = jQuery(window).scrollTop();
			/*if (scroll > 1) {
				jQuery('.bt-homevtwo').addClass('bt-fixed');
			}
			if (scroll === 0){
				jQuery('.bt-homevtwo').removeClass('bt-fixed');
			}*/
			var mainPosition = jQuery('.bt-main').offset().top;
			if (scroll >= mainPosition) {
				jQuery('.bt-homevtwo').addClass('bt-fixed');
			}else{
				jQuery('.bt-homevtwo').removeClass('bt-fixed');
			}
		});
	}
	bannerFadeout();
	/* -------------------------------------
			PRETTY PHOTO GALLERY
	-------------------------------------- */
	jQuery("a[data-rel]").each(function () {
		jQuery(this).attr("rel", jQuery(this).data("rel"));
	});
	jQuery("a[data-rel^='prettyPhoto']").prettyPhoto({
		animation_speed: 'normal',
		theme: 'dark_square',
		slideshow: 3000,
		autoplay_slideshow: false,
		social_tools: false,
	});
	/*--------------------------------------
			PADDING EQUEL TO WINDOW HEIGHT
	--------------------------------------*/
	function paddingequlheight(){
		var $_height = jQuery(window).height();
		jQuery('body.bt-homevthree .bt-wrapper').css({'padding-top': $_height + 'px'});
	}
	paddingequlheight();
	/* -------------------------------------
			HOME BANNER SLIDER				
	-------------------------------------- */
	var mySlider = jQuery('#bt-homeslidervthree');
	mySlider.pogoSlider({
		generateButtons: true,
		autoplayTimeout: 6000,
		displayProgess: false,
		pauseOnHover: false,
		generateNav: false,
		responsive: true,
		autoplay: false,
		onSlideStart: function(current){ 
			var currentSlide = jQuery(this)[0].currentSlideIndex + 1; 
			jQuery('.bt-albumpost').each(function(){
				jQuery(this).removeClass('active').fadeOut();
				var dataSlide = jQuery(this).data('slide');
				if(currentSlide == dataSlide){
					jQuery(this).addClass('active').delay(300).fadeIn();
				}
			});
		}
	}).data('plugin_pogoSlider');
	/*--------------------------------------
			HOME PAGE FOUR SLIDER
	--------------------------------------*/
	var _bt_sliderfour = jQuery('#bt-sliderfour');
	_bt_sliderfour.slick({
		infinite: true,
		slidesToShow: 1,
		dots: true,
		arrows: false,
		dotsClass: 'bt-slidernav',
	});
	/*--------------------------------------
			HOME PAGE FIVE SLIDER
	--------------------------------------*/
	function slickSlider(){
		var _status = jQuery('.tg-bannerfullwidthslidecount');
		var _slider = jQuery('#tg-postfullslider');
		_slider.on('init reInit afterChange', function (event, slick, currentSlide) {
			var i = (currentSlide ? currentSlide : 0) + 1;
			_status.html("<span>" + i + "</span><span>" + slick.slideCount + "</span>");
		});
		_slider.slick({
			fade: true,
			arrows: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			asNavFor: '#tg-postthumbnail',
		});
		jQuery('#tg-postthumbnail').slick({
			dots: false,
			arrows: false,
			vertical: true,
			infinite: true,
			slidesToShow: 9,
			centerMode: true,
			slidesToScroll: 1,
			focusOnSelect: true,
			asNavFor: _slider,
		});
		jQuery('#bt-togglethumbnails').on('click', function(){
			jQuery('body.bt-homevfive').toggleClass('bt-hidethumbnail');
		});
	}
	slickSlider();
	/* --------------------------------------
			LOAD MORE GALLERY
	-------------------------------------- */
	function loadMoregallery() {
		jQuery(".bt-loaditem").slice(0, 9).show();
		jQuery("#bt-btnloadmore").on('click', function (e) {
			e.preventDefault();
			jQuery(".bt-loaditem:hidden").slice(0, 2).slideDown();
			if (jQuery(".bt-loaditem:hidden").length == 0) {
				jQuery("#bt-btnloadmore").fadeOut('slow');
			}
			jQuery('html,body').animate({
				scrollTop: jQuery(this).offset().top -30
			}, 1500);
		});
	}
	loadMoregallery();
	function indexsixloadMoregallery() {
		jQuery(".bt-indexsixloaditem").slice(0, 11).show();
		jQuery("#bt-indexsixbtnloadmore").on('click', function (e) {
			e.preventDefault();
			jQuery(".bt-indexsixloaditem:hidden").slice(0, 2).slideDown();
			if (jQuery(".bt-indexsixloaditem:hidden").length == 0) {
				jQuery("#bt-indexsixbtnloadmore").fadeOut('slow');
			}
			jQuery('html,body').animate({
				scrollTop: jQuery(this).offset().top -30
			}, 1500);
		});
	}
	indexsixloadMoregallery();
	function loadmorephotographer() {
		jQuery(".bt-loadmorephotographer").slice(0, 8).show();
		jQuery("#bt-btnloadmorephotographer").on('click', function (e) {
			e.preventDefault();
			jQuery(".bt-loadmorephotographer:hidden").slice(0, 2).slideDown();
			if (jQuery(".bt-loadmorephotographer:hidden").length == 0) {
				jQuery("#bt-btnloadmorephotographer").fadeOut('slow');
			}
			jQuery('html,body').animate({
				scrollTop: jQuery(this).offset().top -30
			}, 1500);
		});
	}
	loadmorephotographer();
	/* ---------------------------------------
			HOME EIGHT SLIDER
	-------------------------------------- */
	var homeEightSlider = jQuery('#bt-homesliderveight');
	homeEightSlider.slick({
		dots: false,
		arrows: true,
		slidesToShow: 3,
		infinite: false,
		slidesToScroll: 1,
		prevArrow: '<span class="tg-btnprev"><i class="fa fa-angle-left"></i></span>',
		nextArrow: '<span class="tg-btnnext"><i class="fa fa-angle-right"></i></span>',
		responsive: [{
			breakpoint: 1080,
			settings: {slidesToShow: 2}
		},
		{
			breakpoint: 600,
			settings: {slidesToShow: 2}
		},
		{
			breakpoint: 480,
			settings: {slidesToShow: 1}
		}]
	});
	/* -------------------------------------
			COUNTER
	-------------------------------------- */
	var _bt_counters = jQuery('.bt-counters');
	_bt_counters.appear(function () {
		var _bt_timer = jQuery('.bt-count h3');
		_bt_timer.countTo();
	});
	/* -------------------------------------
			PROGRESS BAR
	-------------------------------------- */
	var _bt_memberskills = jQuery('#bt-memberskills');
	_bt_memberskills.appear(function () {
		var _bt_memberskillholder = jQuery('.bt-memberskillholder');
		_bt_memberskillholder.each(function () {
			jQuery(this).find('.bt-memberskillbar').animate({
				width: jQuery(this).attr('data-percent')
			}, 2500);
		});
	});
	/*--------------------------------------
			HOME PAGE FOUR SLIDER
	--------------------------------------*/
	var _bt_portfolioslider = jQuery('#bt-portfolioslider');
	_bt_portfolioslider.slick({
		infinite: true,
		slidesToShow: 1,
		arrows: true,
		prevArrow: '<span class="tg-btnprev"><i class="fa fa-angle-left"></i></span>',
		nextArrow: '<span class="tg-btnnext"><i class="fa fa-angle-right"></i></span>',
	});
	/* -------------------------------------
			TOGGLE CONTACT US
	-------------------------------------- */
	jQuery("#bt-btnplus").on('click', function() {
		jQuery("#bt-contactinfo").toggle("slow");
	});
	/* -------------------------------------
			TOGGLE CONTACT US
	-------------------------------------- */
	var _bt_btnheadertoggle = jQuery("#bt-btnheadertoggle");
	_bt_btnheadertoggle.on('click', function() {
		jQuery("body").toggleClass('bt-showheader');
	});
	
	/* -------------------------------------
			SCROLL TO SECTION
	-------------------------------------- */
	jQuery('#bt-btnscrollto').click(function(event) {
		event.preventDefault();
		jQuery.scrollTo('#bt-main', 800);
	});
	/* -------------------------------------
			CUBE GALLERY
	-------------------------------------- */
	if (jQuery('#bt-threecolumnscubegallery').length > 0){
		jQuery('#bt-threecolumnscubegallery').cubeportfolio({
			layoutMode: 'grid',
			sortToPreventGaps: true,
			animationType: 'fadeOutTop',
			gapHorizontal: 0,
			gapVertical: 0,
			gridAdjustment: 'responsive',
			mediaQueries: [
				{
					width: 768,
					cols: 3,
				},
				{
					width: 480,
					cols: 2,
				}
			],
			caption: 'zoom',
			displayType: 'fadeIn',
			displayTypeSpeed: 100,
			plugins: {
				loadMore: {
					selector: '#bt-loadMore',
					action: 'click',
					loadItems: 3,
				}
			},
		});
	};
	if (jQuery('#bt-threecolumnscubevonegallery').length > 0){
		jQuery('#bt-threecolumnscubevonegallery').cubeportfolio({
			layoutMode: 'grid',
			sortToPreventGaps: true,
			animationType: 'fadeOutTop',
			gapHorizontal: 0,
			gapVertical: 0,
			gridAdjustment: 'responsive',
			mediaQueries: [
				{
					width: 768,
					cols: 3,
				},
				{
					width: 480,
					cols: 2,
				}
			],
			caption: 'zoom',
			displayType: 'fadeIn',
			displayTypeSpeed: 100,
			plugins: {
				loadMore: {
					selector: '#bt-loadMore',
					action: 'click',
					loadItems: 3,
				}
			},
		});
	};
	if (jQuery('#bt-threecolumnscubegalleryvtwo').length > 0){
		jQuery('#bt-threecolumnscubegalleryvtwo').cubeportfolio({
			layoutMode: 'grid',
			sortToPreventGaps: true,
			animationType: 'fadeOutTop',
			gapHorizontal: 30,
			gapVertical: 30,
			gridAdjustment: 'responsive',
			mediaQueries: [
				{
					width: 768,
					cols: 3,
				},
				{
					width: 480,
					cols: 2,
				}
			],
			caption: 'zoom',
			displayType: 'fadeIn',
			displayTypeSpeed: 100,
			plugins: {
				loadMore: {
					selector: '#bt-loadMore',
					action: 'click',
					loadItems: 3,
				}
			},
		});
	};
	if (jQuery('#bt-threecolumnscubegallery').length > 0){
		jQuery('#bt-threecolumnscubegallery').cubeportfolio({
			layoutMode: 'grid',
			sortToPreventGaps: true,
			animationType: 'fadeOutTop',
			gapHorizontal: 0,
			gapVertical: 30,
			gridAdjustment: 'responsive',
			mediaQueries: [
				{
					width: 768,
					cols: 3,
				},
				{
					width: 480,
					cols: 2,
				}
			],
			caption: 'zoom',
			displayType: 'fadeIn',
			displayTypeSpeed: 100,
			plugins: {
				loadMore: {
					selector: '#bt-loadMore',
					action: 'click',
					loadItems: 3,
				}
			},
		});
	};
	if (jQuery('#bt-threecolumnscubegallery').length > 0){
		jQuery('#bt-threecolumnscubegallery').cubeportfolio({
			layoutMode: 'grid',
			sortToPreventGaps: true,
			animationType: 'fadeOutTop',
			gapHorizontal: 30,
			gapVertical: 30,
			gridAdjustment: 'responsive',
			mediaQueries: [
				{
					width: 768,
					cols: 3,
				},
				{
					width: 480,
					cols: 2,
				}
			],
			caption: 'zoom',
			displayType: 'fadeIn',
			displayTypeSpeed: 100,
			plugins: {
				loadMore: {
					selector: '#bt-loadMore',
					action: 'click',
					loadItems: 3,
				}
			},
		});
	};
	if (jQuery('#bt-indexfourphotogallery').length > 0){
		jQuery('#bt-indexfourphotogallery').cubeportfolio({
			layoutMode: 'grid',
			sortToPreventGaps: true,
			animationType: 'fadeOutTop',
			gapHorizontal: 30,
			gapVertical: 30,
			gridAdjustment: 'responsive',
			mediaQueries: [
				{
					width: 768,
					cols: 2,
				},
				{
					width: 767,
					cols: 1,
				}
			],
			caption: 'zoom',
			displayType: 'fadeIn',
			displayTypeSpeed: 100,
			plugins: {
				loadMore: {
					selector: '#bt-loadMore',
					action: 'click',
					loadItems: 3,
				}
			},
		});
	};
	if (jQuery('#js-grid-agency').length > 0){
		jQuery('#js-grid-agency').cubeportfolio({
			filters: '#js-filters-agency',
			layoutMode: 'grid',
			defaultFilter: '*',
			animationType: 'slideLeft',
			gapHorizontal: 30,
			gapVertical: 30,
			gridAdjustment: 'responsive',
			mediaQueries: [{
				width: 1100,
				cols: 3,
			},{
				width: 480,
				cols: 2,
			}],
			caption: 'zoom',
			displayType: 'fadeIn',
			displayTypeSpeed: 100,
			plugins: {
				loadMore: {
					selector: '#bt-loadMore',
					action: 'click',
					loadItems: 3,
				}
			},
		});
	};
	if (jQuery('#bt-threecolumnscubegallery').length > 0){
		jQuery('#bt-threecolumnscubegallery').cubeportfolio({
			layoutMode: 'grid',
			sortToPreventGaps: true,
			animationType: 'fadeOutTop',
			gapHorizontal: 30,
			gapVertical: 30,
			gridAdjustment: 'responsive',
			mediaQueries: [
				{
					width: 768,
					cols: 3,
				},
				{
					width: 480,
					cols: 2,
				}
			],
			caption: 'zoom',
			displayType: 'fadeIn',
			displayTypeSpeed: 100,
		});
	};
	if (jQuery('#bt-portfoliovfourgallery').length > 0){
		jQuery('#bt-portfoliovfourgallery').cubeportfolio({
			layoutMode: 'grid',
			sortToPreventGaps: true,
			animationType: 'fadeOutTop',
			gapHorizontal: 30,
			gapVertical: 30,
			gridAdjustment: 'responsive',
			mediaQueries: [
				{
					width: 768,
					cols: 3,
				},
				{
					width: 480,
					cols: 2,
				}
			],
			caption: 'zoom',
			displayType: 'fadeIn',
			displayTypeSpeed: 100,
		});
	};
	if (jQuery('#bt-portfoliovonegallery').length > 0){
		jQuery('#bt-portfoliovonegallery').cubeportfolio({
			layoutMode: 'grid',
			sortToPreventGaps: true,
			animationType: 'fadeOutTop',
			gapHorizontal: 30,
			gapVertical: 30,
			gridAdjustment: 'responsive',
			mediaQueries: [
				{
					width: 768,
					cols: 3,
				},
				{
					width: 480,
					cols: 2,
				}
			],
			caption: 'zoom',
			displayType: 'fadeIn',
			displayTypeSpeed: 100,
			plugins: {
				loadMore: {
					selector: '#bt-loadMore',
					action: 'click',
					loadItems: 3,
				}
			},
		});
	};
	if (jQuery('#bt-cubegallery').length > 0){
		jQuery('#bt-cubegallery').cubeportfolio({
			layoutMode: 'mosaic',
			sortToPreventGaps: true,
			animationType: 'fadeOutTop',
			gapHorizontal: 20,
			gapVertical: 20,
			gridAdjustment: 'responsive',
			mediaQueries: [
				{
					width: 1500,
					cols: 6,
				},
				{
					width: 1100,
					cols: 4,
				},
				{
					width: 800,
					cols: 3,
				},
				{
					width: 480,
					cols: 2,
					options: {
						caption: '',
						gapHorizontal: 10,
						gapVertical: 10,
					}
				}
			],
			caption: 'zoom',
			displayType: 'fadeIn',
			displayTypeSpeed: 100,
			plugins: {
				loadMore: {
					selector: '#bt-loadMore',
					action: 'click',
					loadItems: 3,
				}
			},
		});
	};
	if (jQuery('#bt-freephotosgallery').length > 0){
		jQuery('#bt-freephotosgallery').cubeportfolio({
			filters: '#js-filters-agency',
			layoutMode: 'mosaic',
			defaultFilter: '*',
			animationType: 'slideLeft',
			gapHorizontal: 20,
			gapVertical: 20,
			gridAdjustment: 'responsive',
			mediaQueries: [
				{
					width: 1500,
					cols: 6,
				},
				{
					width: 1100,
					cols: 4,
				},
				{
					width: 800,
					cols: 3,
				},
				{
					width: 480,
					cols: 2,
					options: {
						caption: '',
						gapHorizontal: 10,
						gapVertical: 10,
					}
				}
			],
			caption: 'zoom',
			displayType: 'fadeIn',
			displayTypeSpeed: 100,
			plugins: {
				loadMore: {
					selector: '#bt-loadMore',
					action: 'click',
					loadItems: 3,
				}
			},
		});
	};
});
/* -------------------------------------
		THEME PRELOADER
-------------------------------------- */
function hideThemePreloader() {
	var $preloader = jQuery('#bt-preloader');
	if ($preloader.length) {
		$preloader.find('.bt-preloadericon').fadeOut();
		$preloader.delay(100).fadeOut('fast');
	}
}

if (document.readyState === 'complete') {
	hideThemePreloader();
} else {
	jQuery(window).on('load', hideThemePreloader);
	setTimeout(hideThemePreloader, 600);
}