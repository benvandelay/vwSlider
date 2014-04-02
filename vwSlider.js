(function($){

    $.fn.vwSlider = function(options){

        var self         = this;
        var start        = 1;
        var currentSlide = start - 1;
        var count        = 0;

        var defaults = {

            itemClass       : false,
            auto            : true,
            interval        : 3000,
            navClass        : 'slider-nav',
            swipe           : false,

            //callbacks
            afterScroll     : function() {}

        }

        var settings = $.extend({}, defaults, options);

        var autoEnabled = settings.auto;

        var init = function()
        {
            self.addClass('vwSlider');
            self.wrap('<div class="vwSlider-wrapper"></div>');

            setUpSlidingElement();
            createNav();

            if(settings.auto)
                slideElements();

            if(settings.swipe)
                setUpSwipe();

        };

        var setUpSlidingElement = function()
        {

            if(settings.itemClass){
                var collection = self.children('.' + settings.itemClass);
            } else {
                var collection = self.children();
            }

            collection.each(function(i){
                $(this).addClass('vw-elm sliding-elm-' + i);

                count = i;
            });

        };

        var move = function(direction)
        {

            if(currentSlide + direction <= count && currentSlide + direction >= 0){

                currentSlide = currentSlide + direction;
                self.css('left', -(100 * (currentSlide)) + '%');
                updateNav();
                settings.afterScroll.call(this, currentSlide);

            }

        }

        var slideElements = function()
        {

            var slideInterval = setInterval(function(){

                if(autoEnabled){

                    currentSlide ++;

                    self.css('left', -(100 * (currentSlide)) + '%');

                    updateNav();
                    settings.afterScroll.call(this, currentSlide);

                    if(currentSlide == count){
                        currentSlide = -1;
                    }

                }

            }, settings.interval);

        };

        var createNav = function()
        {

            var nav = '<div class="' + settings.navClass + '"><ul>';

            for(var i = 0; i <= count; i++ )
            {
                if(i == (start - 1))
                    nav += '<li class="active" />';
                else
                    nav += '<li />';
            }

            nav += '</ul></div>';

            self.parent().append(nav);

        };

        var updateNav = function()
        {

            $('.' + settings.navClass + ' li').removeClass('active');
            $('.' + settings.navClass + ' li').eq(currentSlide).addClass('active');

        }

        var setUpSwipe = function(){
            if($.fn.swipe){

                  $('.vwSlider-wrapper').swipe({
                    //Generic swipe handler for all directions
                    swipeLeft : function(e) {
                        e.preventDefault();
                        move(1);
                        autoEnabled = false;
                    },
                    swipeRight : function(e) {
                        e.preventDefault();
                        move(-1);
                        autoEnabled = false;
                    },
                    tap : function(e, target) {
                        var a = $(target).parents('a');
                        a.click();
                        window.location.href = a.attr('href');
                    },
                    excludedElements : [],
                    threshold : 120,

                  });

            } else {

                console.log('jquery touchswipe not installed!');

            }
        }

        init();

    }
})(jQuery);