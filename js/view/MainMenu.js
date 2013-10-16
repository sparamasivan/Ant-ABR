define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/MainMenu.html',
    'model/MediaQuery',
    'event/Dispatcher',
    'jquery-jswipe'
], function(
    $,
    Backbone,
    Handlebars,
    Template,
    ModelMediaQuery,
    EventDispatcher
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        render: function(parent) {

        	this.setElement($(this.template()));

        	this.$el.appendTo(parent);

			$(".menuTrigger").click(function(event){
				if ($('.page, .mainMenuWrapper, .menuTrigger, .secondaryMenu, .swipeMe, .view-report .test-headers, .mainNav').hasClass('active'))
					$('.page, .mainMenuWrapper, .menuTrigger, .secondaryMenu, .swipeMe, .view-report .test-headers, .mainNav').removeClass("active");
				else
					$('.page, .mainMenuWrapper, .menuTrigger, .secondaryMenu, .swipeMe, .view-report .test-headers, .mainNav').addClass("active");

				event.stopPropagation();
			});

			$(".mainMenu li a").hover(function(){
				$(this).closest('.mainMenu li').find(this).toggleClass('hover');
			});

			$('.mainMenu li:last-child').addClass('last');

			$(window).scroll(function ()
			{
				if(($(window).scrollTop())>50)
				{
					$(".view-navigation .navigation").addClass('is-away-from-top');
				}
				else
				{
					$(".view-navigation .navigation").removeClass('is-away-from-top');
				}
			});
        }
    });
});
