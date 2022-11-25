/**
 * Coder: EzrealY
 * Time: 2017.07.31
 * Mail: 1005526074@qq.com
 * 效果原作者: https://oss.so/article/71
 */

;(function ($, window, document, undefined) {
    var Dimensional = function (elem, options) {
        this.defaults = {
            shutterW: 1200,
            shutterH: 500,
            isAutoPlay: false,
            playInterval: 3000,
            curDisplay: 0,
            fullPage: false
        };
        this.opts = $.extend({}, this.defaults, options);

        this.inital(elem);
    };

    Dimensional.prototype = {
        play: function () {
            var self = this;

            if (this.opts.isAutoPlay) {
                clearInterval(this.playTime);

                this.playTime = setInterval(function () {
                    self.$nextBtn.click();
                }, this.opts.playInterval);
            }
        },

        inital: function (elem) {
            var self = this;
            this.$shutter = elem;

            this.play();
        },

        carousel:function(root) {
            var figure = root.querySelector('figure'),
                nav = root.querySelector('nav'),
                images = figure.children,
                n = images.length,
                gap = root.dataset.gap || 0,
                bfc = 'bfc' in root.dataset,
                theta = 2 * Math.PI / n,
                currImage = 0;

            setupCarousel(n, parseFloat(getComputedStyle(images[0]).width));
            window.addEventListener('resize', function () {
                setupCarousel(n, parseFloat(getComputedStyle(images[0]).width));
            });
        },


        setupCarousel:function(n, s) {
            var apothem = s / (2 * Math.tan(Math.PI / n));

            figure.style.transformOrigin = '50% 50% ' + -apothem + 'px';

            for (var i = 0; i < n; i++) {
                images[i].style.padding = gap + 'px';
            }for (i = 1; i < n; i++) {
                images[i].style.transformOrigin = '50% 50% ' + -apothem + 'px';
                images[i].style.transform = 'rotateY(' + i * theta + 'rad)';
            }
            if (bfc) for (i = 0; i < n; i++) {
                images[i].style.backfaceVisibility = 'hidden';
            }rotateCarousel(currImage);
        },

         setupNavigation:function() {
            nav.addEventListener('click', onClick, true);

            function onClick(e) {
                e.stopPropagation();

                var t = e.target;
                if (t.tagName.toUpperCase() != 'BUTTON') return;

                if (t.classList.contains('next')) {
                    currImage++;
                } else {
                    currImage--;
                }

                rotateCarousel(currImage);
            }
        },

        rotateCarousel:function(imageIndex) {
            figure.style.transform = 'rotateY(' + imageIndex * -theta + 'rad)';
        },


        constructor: Dimensional
    };

    $.fn.dimensional = function (options) {
        this.each(function () {
            var dimensional = new Dimensional($(this), options);
        });
    };

})($, window, document);

