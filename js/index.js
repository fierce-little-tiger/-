
(function ($) {
   
    var Carousel = function (con) {
        var self = this;
        this.con = con;
        this.setDirect();
        this.conItem = con.find("ul.list");
        this.prev = con.find(".prev-btn");
        this.next = con.find(".next-btn");
        this.conItems = con.find("li");
        this.conItemFirst = this.conItems.first();
        this.conItemLast = this.conItems.last();
        this.flag = true;
        this.settings = {
            width: 280,
            height: 420,
            postWidth: 250,
            postHeight: 420,
            scale: 0.8,
            speed: 500,
            verticalAlign: 'center',
            autoPlay: false,
            delay: 1000
        }
        $.extend(this.settings, this.getSetting());
        this.setSettingValue();
        this.setPostOther();
        this.next.on("click", function () {
            if (self.flag) {
                self.flag = false;
                self.rotate("left");
            }

        });
        this.prev.on("click", function () {
            if (self.flag) {
                self.flag = false;
                self.rotate("right");
            }
        });
        if (this.settings.autoPlay) {
            this.autoPlay();
            this.con.hover(function () {
                window.clearInterval(self.timer);
            }, function () {
                self.autoPlay();
            });
        }

    }

    Carousel.prototype = {
        setDirect: function () {
            var prev = $("<div></div>").addClass("content-btn prev-btn").append($("<img/>").attr("src", "Public/Home/img/new/left.png").addClass("btn-img"));
            this.con.prepend(prev);
            var next = $("<div></div>").addClass("content-btn next-btn").append($("<img/>").attr("src", "Public/Home/img/new/right.png").addClass("btn-img"));
            this.con.append(next);
        },
        autoPlay: function () {
            var self = this;
            this.timer = window.setInterval(function () {
                self.next.click();
            }, this.settings.delay);
        },

        rotate: function (dir) {
            var _this = this;
            var zIndex = []
            if (dir === "left") {
                this.conItems.each(function () {
                    var prev = $(this).prev().get(0) ? $(this).prev() : _this.conItemLast;
                    zIndex.push(prev.css("zIndex"));
                    $(this).animate({
                        width: prev.width(),
                        height: prev.height(),
                        top: prev.css("top"),
                        left: prev.css("left"),
                        opacity: prev.css("opacity")
                    }, _this.settings.speed, function () {
                        _this.flag = true;
                    });
                });
                this.conItems.each(function (i) {
                    $(this).css({
                        zIndex: zIndex[i]
                    })
                });
            } else if (dir === "right") {
                this.conItems.each(function () {
                    var next = $(this).next().get(0) ? $(this).next() : _this.conItemFirst;
                    zIndex.push(next.css("zIndex"));
                    $(this).animate({
                        width: next.width(),
                        height: next.height(),
                        top: next.css("top"),
                        left: next.css("left"),
                        opacity: next.css("opacity")
                    }, _this.settings.speed, function () {
                        _this.flag = true;
                    });
                });
                this.conItems.each(function (i) {
                    $(this).css({
                        zIndex: zIndex[i]
                    })
                });
            }
        },
        setPostOther: function () {
            var self = this,
                sliceItem = this.conItems.slice(1),
                sliceLength = sliceItem.length,
                rightItem = sliceItem.slice(0, sliceLength / 2),
                leftItem = sliceItem.slice(sliceLength / 2),
                level = Math.floor(sliceLength / 2),
                llevel = level,
                rw = this.settings.postWidth,
                rh = this.settings.postHeight,
                gap = (this.settings.width - this.settings.postWidth) / 2 / level;
            rightItem.each(function (i) {
                rw = rw * self.settings.scale;
                rh = rh * self.settings.scale;
                var j = i;
                $(this).css({
                    zIndex: --level,
                    width: rw,
                    height: rh,
                    left: (self.settings.width + self.settings.postWidth) / 2 + gap * (++i) - rw,
                    top: self.setVerticalAlign(rh),
                    opacity: 1 / (++j)
                });
            });
            var lw = rightItem.last().width(),
                lh = rightItem.last().height();
            leftItem.each(function (i) {
                $(this).css({
                    zIndex: level++,
                    width: lw,
                    height: lh,
                    left: gap * i,
                    top: self.setVerticalAlign(lh),
                    opacity: 1 / llevel--
                });
                lw = lw / self.settings.scale;
                lh = lh / self.settings.scale;
            });
        },
        setVerticalAlign: function (h) {
            if (this.settings.verticalAlign === "middle") {
                return (this.settings.height - h) / 2;
            } else if (this.settings.verticalAlign === "top") {
                return 0;
            } else if (this.settings.verticalAlign === "bottom") {
                return this.settings.height - h;
            } else {
                return (this.settings.height - h) / 2;
            }
        },
        setSettingValue: function () {
            this.con.css({
                width: this.settings.width,
                height: this.settings.height
            });
            this.conItem.css({
                width: this.settings.width,
                height: this.settings.height,
                left: 55,
            });
            var w = (this.settings.width - this.settings.postWidth) / 2;
            this.prev.css({
                width: w,
                height: this.settings.height,
                zIndex: Math.ceil((this.conItems.length) / 2)
            });
            this.prev.find("img").css({
                width: 50,
                height: 50,
            });
            this.next.css({
                width: w,
                height: this.settings.height,
                zIndex: Math.ceil((this.conItems.length) / 2)
            });
            this.next.find("img").css({
                width: 50,
                height: 50
            });
            this.conItemFirst.css({
                top: 0,
                left: 35,
                width: this.settings.postWidth,
                height: this.settings.postHeight,
                zIndex: this.conItems.length
            });
        },
        getSetting: function () {
            var con = this.con.attr("data-setting");
            if (con && con !== "") {
                return $.parseJSON(con);
            } else {
                return "";
            }
        }
    }
    Carousel.init = function (carousel) {
        var _this = this;
        carousel.each(function () {
            new _this($(this));
        });
    }
    window.Carousel = Carousel;
})(jQuery)
$(function () {
    $.ajax({
        type: 'POST',
        url: 'http://api.tianshuai.com.cn/index/index/actiondownloadApk',
        dataType: 'json',
        success: function (data) {
            if (data.code == 200) {
                var cours = data.data.apk_file_name;
                $('.apptinsine').attr('href', cours);
                $('.mobileTinsine').attr('href', cours)
            } else if (data.code == 202) {
            }
        }
    })
})
