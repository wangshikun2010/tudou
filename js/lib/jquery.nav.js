jQuery.easing = {
    backout: function(e, f, a, k, h) {
        var g = 1.70158;
        return k * ((f = f / h - 1) * f * ((g + 1) * f + g) + 1) + a;
    },

    linear: function(e, f, a, h, g) {
        return h * f / g + a
    }
};

(function(a) {
    a.fn.lavaLamp = function(b) {
        b = a.extend({},b || {});
        return this.each(function() {
            var c = a(this),
            f = function() {},
            h = a('<li class="back"><div class="left"></div></li>').appendTo(c),
            k = a("li", this),
            g = a("li.current", this)[0] || a(k[0]).addClass("current")[0];
            k.not(".back").hover(function() {
                d(this)
            },
            f);
            a(this).hover(f,
            function() {
                d(g)
            });
            e(g);
            function e(l) {
                h.css({
                    left: l.offsetLeft + "px",
                    width: l.offsetWidth + "px"
                });
                g = l
            }
            function d(l) {
                h.each(function() {
                    a.dequeue(this, "fx")
                }).animate({
                    width: l.offsetWidth,
                    left: l.offsetLeft
                },
                b.speed, b.fx)
            }
        })
    }
})(jQuery);
