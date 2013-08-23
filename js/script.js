jQuery(document).ready(function($){

	$(".menuTrigger").click(function(){
		if ($('.page, .mainMenuWrapper, .menuTrigger, .secondaryMenu, .swipeMe, .view-report .test-headers, .mainNav').hasClass('active'))
        $('.page, .mainMenuWrapper, .menuTrigger, .secondaryMenu, .swipeMe, .view-report .test-headers, .mainNav').removeClass("active");
    else
        $('.page, .mainMenuWrapper, .menuTrigger, .secondaryMenu, .swipeMe, .view-report .test-headers, .mainNav').addClass("active");
		event.stopPropagation();
	});
	
	/*$('.swipeMe').swipe({
		 threshold: {
      x: 100,
      y: 50
     },
     swipeRight: function() {
			$('.page, .mainMenuWrapper, .menuTrigger, .secondaryMenu, .swipeMe, .view-report .test-headers, .mainNav').addClass('active')
		},
		 swipeLeft: function() { 
			$('.page, .mainMenuWrapper, .menuTrigger, .secondaryMenu, .swipeMe, .view-report .test-headers, .mainNav').removeClass('active') 
		}
	});*/
	
	$(".mainMenu li a").hover(function(){
		$(this).closest('.mainMenu li').find(this).toggleClass('hover');
	});
	
	$('.mainMenu li:last-child').addClass('last');

	$(window).scroll(function ()
    {
    if(($(window).scrollTop())>50)
    {
       $(".view-navigation").addClass('active');
    }
    else
    {
       $(".view-navigation").removeClass('active');
    }
  });

});