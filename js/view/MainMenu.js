define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/MainMenu.html',
    'jquery-jswipe'
], function(
    $,
    Backbone,
    Handlebars,
    Template
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        render: function(parent) {

        	this.setElement($(this.template({
                userDetails: this.model.getUserDetails(),
                menuLinks: this.model.getMenuLinks(),
                logoutLink: this.model.getLogoutLink()
            })));

        	this.$el.appendTo(parent);

			this.$el.find(".menuTrigger").click(function(event){
				if ($('.page, .mainMenuWrapper, .menuTrigger, .secondaryMenu, .swipeMe, .view-report .test-headers, .mainNav').hasClass('active'))
					$('.page, .mainMenuWrapper, .menuTrigger, .secondaryMenu, .swipeMe, .view-report .test-headers, .mainNav').removeClass("active");
				else
					$('.page, .mainMenuWrapper, .menuTrigger, .secondaryMenu, .swipeMe, .view-report .test-headers, .mainNav').addClass("active");

				event.stopPropagation();
			});

			this.$el.find(".mainMenu li a").hover(function(){
				$(this).closest('.mainMenu li').find(this).toggleClass('hover');
			});

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
