/**
 * 首页逻辑代码
 *
 * @author  Vincent Zheng
 * @version 1.0
 * @since   2015-09-21
 * @review
 */

var tuekeyTimer = null;
Template.home.onCreated(function() {
    console.log('rendered');
    var self = this;
    self.autorun(function() {
        if (Session.get('leaderboardSelector') || Session.get('leaderboardOptions')) {
            self.subscribe('leaderboard', Session.get('leaderboardSelector'), Session.get('leaderboardOptions'));
        }
        if (Session.get('statisticsSelector') || Session.get('statisticsOptions')) {
            self.subscribe('statistics', Session.get('statisticsSelector'), Session.get('statisticsOptions'));
        }

    });

    Session.set('leaderboardSelector', {});
    Session.set('leaderboardOptions', {
        sort: {
            score: -1
        },
        limit: 15
    });
    Session.set('statisticsSelector', {});
    Session.set('statisticsOptions', {});
    Session.set('score', 0);

    // 微信授权
    var code = parse('code');
    if (!code) {
        Meteor.call('getUserInfoByCode', code, function(err, result) {
            if (!err && result) {
                //alert(result.nickname);
                Session.set('userInfo', result);
            }
        })
    } else {
        // location.assign('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APPID + '&redirect_uri=' + REDIRECTURI + '&response_type=code&scope=snsapi_userinfo&state=professional_edition#wechat_redirect');
    }


});

Template.home.onRendered(function() {
    var scaleX = $('body').width() / PAGE_WIDTH,
        scaleY = $('body').height() / PAGE_HEIGHT,
        scale = scaleX < scaleY ? scaleX : scaleY;
    if (scaleX < scaleY) {
        $('#mobileViewport').attr('content', 'width=' + PAGE_WIDTH + ', initial-scale=' + scale + ', maximum-scale=' + scale + ', user-scalable=no');
    } else {
        $('#mobileViewport').attr('content', 'height=' + PAGE_HEIGHT + ', initial-scale=' + scale + ', maximum-scale=' + scale + ', user-scalable=no');
    }
    //$('.page-viewport').css('padding', '0 ' + ($('.page-viewport').width() - PAGE_WIDTH) / 2 + 'px');
    $('.wheel-containner').draggable({
        axis: 'x',
        containment: 'parent'
    });
    Session.set('desc', '奔跑吧火鸡，感恩节华泰中心邀您一起来烤火鸡啦！');
    var int = 0;
    var desc = Session.get('desc');
    wx.ready(function() {
        wx.onMenuShareTimeline({
            title: '奔跑吧火鸡，感恩节华泰中心邀您一起来烤火鸡啦！', //分享标题
            link: FORWARD_LINK, //分享链接
            imgUrl: WX_LOGO, //分享图标
            success: function() {
                //用户确认分享后执行的回调函数
                Meteor.call('addStatistics', 'share');
                $('.page2').hide();
                $('.page1').show();
            },
            cancel: function() {
                //用户取消分享后 执行的回调函数

            }
        });
        wx.onMenuShareAppMessage({
            title: '奔跑吧火鸡，感恩节华泰中心邀您一起来烤火鸡啦！', //分享标题
            desc: desc, //分享描述
            link: FORWARD_LINK,
            imgUrl: WX_LOGO, //分享图标
            type: '', //分享类型默认为link
            dataUrl: '', //默认为空
            success: function() {
                //用户确认分享后执行的回调函数
                Meteor.call('addStatistics', 'share');
                $('.page2').hide();
                $('.page1').show();
            },
            cancel: function() {
                //用户取消分享后执行的回调函数

            }
        });
        wx.onMenuShareQQ({
            title: '奔跑吧火鸡，感恩节华泰中心邀您一起来烤火鸡啦！', // 分享标题
            desc: desc, // 分享描述
            link: FORWARD_LINK, // 分享链接
            imgUrl: WX_LOGO, // 分享图标
            success: function() {
                // 用户确认分享后执行的回调函数
                Meteor.call('addStatistics', 'share');
                $('.page2').hide();
                $('.page1').show();
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            }
        });
    });
    // 调用loading
    var imgArr = [
        '/page1/gamebg.png',
    ];
    Array.prototype.push.apply(imgArr, $('img'));
    var total = imgArr.length,
        count = 0;
    imgpreload(imgArr, {
        each: function() {
            count++;
            $('.progress').html(Math.floor(count / total * 100) + '%');
        },
        all: function() {
            $('.progress').html('100%');
            setTimeout(function() {
                $('.loading').hide();
                $('.page1').show();

            }, 500);
        }
    });

    // 进入游戏
    $('.page1 .img3').on('click', function(event) {
        $('.page1').hide();
        $('.page5').hide();
        $('.page4').hide();
        $('.page2').show();
        Session.set('score', 0);
        Meteor.call('addStatistics', 'game');
        var index = 3,
            timer = Meteor.setInterval(function() {
                $('.time-no').hide();
                if (index > 0) {
                    $('.page2 .time-' + index).show();
                    $('.timermusic')[0].play();
                    index--;
                } else {
                    $('.timermusic')[0].pause();
                    Meteor.clearInterval(timer);
                    // 重置计时器
                    if ($('#gettime').html() === "0") {
                        $('#gettime').html('60');
                    }
                    // 计时器
                    int = self.setInterval(function run() {
                        var s = document.getElementById("gettime");
                        if (s.innerHTML == "0") {
                            if ($('#gettime').html() === "0") {
                                $('.bgmusic')[0].pause();
                                $('.page3').show();
                                // 停止烤鸡运动
                                Meteor.clearInterval(tuekeyTimer);
                                $('.page2 .img8').data('unable', true);
                                self.clearInterval(int);
                                var userInfo = Session.get('userInfo');
                                var score = Session.get('score'),
                                    nickname = userInfo ? userInfo.nickname : '';
                                Meteor.call('getGameScore', nickname, score, function(error, result) {

                                });
                                return false;
                            }
                        }
                        s.innerHTML = s.innerHTML * 1 - 1;
                    }, 1000);
                    flyingturkey($('.page2 .turkey1'), _.random(40, 60), 0);
                    flyingturkey($('.page2 .turkey2'), _.random(40, 60), 0);
                    flyingturkey($('.page2 .turkey3'), _.random(40, 60), 0);

                    tuekeyTimer = Meteor.setInterval(function() {
                        var item = $('.page2 .img8:not(:visible)')[0];
                        if (item) {
                            $(item).data('unable', false);
                            $(item).css('display', 'block');
                            $(item).css('right', '-189px');
                            flyingturkey($(item), _.random(40, 60), 0);
                        }
                    }, 100);

                }

            }, 1000);


    });
    // $('.page3').on('click', function (event) {
    //     $('.page3').hide();
    // });
    // 排行榜
    $('.page1 .img1').on('click', function(event) {
        $('.page5').show();
    });
    $('.page5').on('click mousedown', function(event) {
        $('.page5').hide();
    });
    // 游戏规则
    $('.page1 .img2').on('click', function(event) {
        $('.page4').show();
    });
    $('.page4').on('click mousedown', function(event) {
        $('.page4').hide();
    });
    // 发炮
    $('.page2 .img5').addClass('blinkingfire');
    $('.page2').on('click', function(e) {
        // $('.page2 .img5').removeClass('blinkingfire');
        var item = $('.fire-containner img:not(:visible)')[0];
        if (!item) return;
        $('.shellmusic')[0].play();
        $(item).show();
        $(item).css('bottom', '-19px');
        $(item).css('left', $('.wheel-containner').css('left'));
        $(item).animate({
            bottom: '300px'
        }, {
            duration: 500,
            easing: 'linear',
            // 
            step: function(now, fx) {
                if (now === fx.end) {
                    $(fx.elem).css('display', 'none');
                }
                if ($(fx.elem).css('display') === 'none') {
                    return;
                }
                var item = $(fx.elem).offset();
                var turkey1 = $('.page2 .turkey1').offset();
                var turkey2 = $('.page2 .turkey2').offset();
                var turkey3 = $('.page2 .turkey3').offset();
                if (Math.abs(item.left + $(fx.elem).width() / 2 - (turkey3.left + $('.page2 .turkey3').width() / 2)) < 100 &&
                    Math.abs(item.top + $(fx.elem).height() / 2 - (turkey3.top + $('.page2 .turkey3').height() / 2)) < 100) {
                    $('.page2 .turkey3').data('unable', true);
                    $('.hittermusic')[0].play();
                    $(fx.elem).css('display', 'none');
                    var score = Session.get('score');
                    score += 10;
                    Session.set('score', score);
                    $(fx.elem).stop(true);
                    $('.page2 .img11').css('left', turkey3.left + 'px');
                    $('.page2 .img11').show();
                    $('.page2 .img11').fadeOut(1000);
                } else if (Math.abs(item.left + $(fx.elem).width() / 2 - (turkey2.left + $('.page2 .turkey2').width() / 2)) < 100 &&
                    Math.abs(item.top + $(fx.elem).height() / 2 - (turkey2.top + $('.page2 .turkey2').height() / 2)) < 100) {
                    $('.page2 .turkey2').data('unable', true);
                    $('.hittermusic')[0].play()
                    $(fx.elem).css('display', 'none');
                    var score = Session.get('score');
                    score += 10;
                    Session.set('score', score);
                    $(fx.elem).stop(true);
                    $('.page2 .img10').css('left', turkey2.left + 'px');
                    $('.page2 .img10').show();
                    $('.page2 .img10').fadeOut(1000);
                } else if (Math.abs(item.left + $(fx.elem).width() / 2 - (turkey1.left + $('.page2 .turkey1').width() / 2)) < 100 &&
                    Math.abs(item.top + $(fx.elem).height() / 2 - (turkey1.top + $('.page2 .turkey1').height() / 2)) < 100) {
                    $('.page2 .turkey1').data('unable', true);
                    $('.hittermusic')[0].play()
                    $(fx.elem).css('display', 'none');
                    var score = Session.get('score');
                    score += 10;
                    Session.set('score', score);
                    $(fx.elem).stop(true);
                    $('.page2 .img9').css('left', turkey1.left + 'px');
                    $('.page2 .img9').show();
                    $('.page2 .img9').fadeOut(1000);
                }
            }
        });;
    });
    // 得分榜
    //再玩一次
    $('.page3 .img3').on('click', function(event) {
        $('.page3').hide();
        $('.page2').show();
        Meteor.call('addStatistics', 'game');
        // 重置计时器
        if ($('#gettime').html() === "0") {
            $('#gettime').html('60');
        }
        $('.bgmusic')[0].play();
        // 重置烤鸡运动
        tuekeyTimer = Meteor.setInterval(function() {
            var item = $('.page2 .img8:not(:visible)')[0];
            if (item) {
                $(item).data('unable', false);
                $(item).css('display', 'block');
                $(item).css('right', '-189px');
                flyingturkey($(item), _.random(40, 60), 0);
            }
        }, 100);
        // 重置分数
        Session.set('score', 0);
        // 计时器
        int = self.setInterval(function run() {
            var s = document.getElementById("gettime");
            if (s.innerHTML == "0") {
                if ($('#gettime').html() === "0") {
                    $('.bgmusic')[0].pause();
                    $('.page3').show();
                    // 停止烤鸡运动
                    Meteor.clearInterval(tuekeyTimer);
                    self.clearInterval(int);
                    var userInfo = Session.get('userInfo');
                    // Leaderboard.insert({
                    //     score: Session.get('score'),
                    //     nickname: userInfo?userInfo.nickname: '',
                    //     timestamp: Date.now()
                    // });
                    var score = Session.get('score'),
                        nickname = userInfo ? userInfo.nickname : '';
                    Meteor.call('getGameScore', nickname, score, function(error, result) {

                    });
                    return false;
                }
            }
            s.innerHTML = s.innerHTML * 1 - 1;
        }, 1000);
    });
    //排行榜
    $('.page3 .img4').on('click', function(event) {
        $('.page3').hide();
        $('.page5').show();
    });
    //分享游戏
    $('.page3 .img5').on('click', function(event) {
        $('.page3').hide();
        $('.page6').show();
    });
    $('.page6 .img2').on('click', function(event) {
        $('.page6').hide();
        $('.page2').hide();
        $('.page2 .img8').data('unable', true);
        $('.page1').show();
        var score = Session.get('score');
        Session.set('desc', '我在华泰中心烤火鸡得了' + score + '分，你能得几分赶紧来比赛');
        var desc = Session.get('desc');
        wx.onMenuShareTimeline({
            title: '奔跑吧火鸡，感恩节华泰中心邀您一起来烤火鸡啦！', //分享标题
            link: FORWARD_LINK, //分享链接
            imgUrl: WX_LOGO, //分享图标
            success: function() {
                //用户确认分享后执行的回调函数
                Meteor.call('addStatistics', 'share');
                $('.page2').hide();
                $('.page1').show();
            },
            cancel: function() {
                //用户取消分享后 执行的回调函数

            }
        });
        wx.onMenuShareAppMessage({
            title: '奔跑吧火鸡，感恩节华泰中心邀您一起来烤火鸡啦！', //分享标题
            desc: desc, //分享描述
            link: FORWARD_LINK,
            imgUrl: WX_LOGO, //分享图标
            type: '', //分享类型默认为link
            dataUrl: '', //默认为空
            success: function() {
                //用户确认分享后执行的回调函数
                Meteor.call('addStatistics', 'share');
                $('.page2').hide();
                $('.page1').show();
            },
            cancel: function() {
                //用户取消分享后执行的回调函数

            }
        });
        wx.onMenuShareQQ({
            title: '奔跑吧火鸡，感恩节华泰中心邀您一起来烤火鸡啦！', // 分享标题
            desc: desc, // 分享描述
            link: FORWARD_LINK, // 分享链接
            imgUrl: WX_LOGO, // 分享图标
            success: function() {
                // 用户确认分享后执行的回调函数
                Meteor.call('addStatistics', 'share');
                $('.page2').hide();
                $('.page1').show();
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            }
        });
    });
});
Template.home.helpers({
    leaderstatics: function() {
        var arr = Leaderboard.find({}, {
                sort: {
                    score: -1
                }
            }).fetch(),
            num = 1,
            leaderstatics = [];
        _.each(arr, function(item) {
            leaderstatics.push({
                num: num,
                nickname: item.nickname,
                scores: item.score
            });
            item.num = num;
            num++;
        });
        //console.log(leaderstatics);
        return leaderstatics;
        // return arr;
    },
    score: function() {
        return Session.get('score');
    }
});
/**
 *120秒倒计时
 * 
 */
function run() {
    var s = document.getElementById("gettime");
    if (s.innerHTML == 0) {
        return false;
    }
    s.innerHTML = s.innerHTML * 1 - 1;
}
/*
 *飞出的火焰
 *
 */
function flyingfire(bottom) {
    // 第一、二、三跑道bottom的值分别为70px、150px、230px
    $('.page2 .img5').animate({
        bottom: bottom + "px"
    }, function() {

    });
}

/*
 *奔跑的火鸡动画实现
 *
 */
function flyingturkey(speed) {
    var distance = 640,
        move = 0,
        url1 = 'url(/page2/runningturkey.png)',
        url2 = 'url(/page2/cryturkey.png)',
        flag = 1;
    for (; move <= distance; move = move + 20) {

        if (move % 2 === 0 && flag % 2 == 0) {
            $(".page2 .img8").animate({
                right: move + "px"
            }, speed, function() {
                $(".page2 .img8").css('backgroundImage', url1);
            });
        } else {
            $(".page2 .img8").animate({
                right: move + "px"
            }, 500, function() {
                $(".page2 .img8").css('backgroundImage', url2);
            });
        }
        flag++;
    }
}


/**
 *120秒倒计时
 * 
 */
function run() {
    var s = document.getElementById("gettime");
    if (s.innerHTML == 0) {
        return false;
    }
    s.innerHTML = s.innerHTML * 1 - 1;
}
/*
 *飞出的火焰
 *
 */
function flyingfire(bottom) {
    // 第一、二、三跑道bottom的值分别为70px、150px、230px
    $('.page2 .img5').animate({
        bottom: bottom + "px"
    }, function() {

    });
}

/**
 * 奔跑的火鸡动画实现
 * @param  {Object} turkey 火鸡jQuery对象
 * @param  {Number} speed  执行一次动画的时间
 * 
 * @return {Void}
 */

function flyingturkey(turkey, speed, move) {
    var url1 = 'url(/page2/t1.png)',
        url2 = 'url(/page2/t2.png)',
        url3 = 'url(/page2/t3.png)',
        url4 = 'url(/page2/t4.png)',
        url5 = 'url(/page2/t5.png)',
        url6 = 'url(/page2/t6.png)';
    if (move > PAGE_WIDTH + turkey.width()) {
        turkey.css('display', 'none');
        return;
    }
    switch (move % 60) {
        case 0:
            if (turkey.data('unable')) {
                turkey.css('display', 'none');
                return;
            }
            turkey.animate({
                right: move + "px"
            }, speed, function() {
                turkey.find('img').hide();
                turkey.find('.t1').show();
                move += 10;
                flyingturkey(turkey, speed, move);
            });
            break;
        case 10:
            if (turkey.data('unable')) {
                turkey.css('display', 'none');
                return;
            }
            turkey.animate({
                right: move + "px"
            }, speed, function() {
                turkey.find('img').hide();
                turkey.find('.t2').show();
                move += 10;
                flyingturkey(turkey, speed, move);
            });
            break;
        case 20:
            if (turkey.data('unable')) {
                turkey.css('display', 'none');
                return;
            }
            turkey.animate({
                right: move + "px"
            }, speed, function() {
                turkey.find('img').hide();
                turkey.find('.t3').show();
                move += 10;
                flyingturkey(turkey, speed, move);
            });
            break;
        case 30:
            if (turkey.data('unable')) {
                turkey.css('display', 'none');
                return;
            }
            turkey.animate({
                right: move + "px"
            }, speed, function() {
                turkey.find('img').hide();
                turkey.find('.t4').show();
                move += 10;
                flyingturkey(turkey, speed, move);
            });
            break;
        case 40:
            if (turkey.data('unable')) {
                turkey.css('display', 'none');
                return;
            }
            turkey.animate({
                right: move + "px"
            }, speed, function() {
                turkey.find('img').hide();
                turkey.find('.t5').show();
                move += 10;
                flyingturkey(turkey, speed, move);
            });
            break;
        case 50:
            if (turkey.data('unable')) {
                turkey.css('display', 'none');
                return;
            }
            turkey.animate({
                right: move + "px"
            }, speed, function() {
                turkey.find('img').hide();
                turkey.find('.t6').show();
                move += 10;
                flyingturkey(turkey, speed, move);
            });
            break;
    }
}



/**
 * 获取URL中的参数的值
 * 
 * @param  {String} key 参数
 * 
 * @return {String}     值
 */
function parse(key) {
    var result = '',
        tmp = [];
    location.search
        .substr(1)
        .split('&')
        .forEach(function(item) {
            tmp = item.split('=');
            if (tmp[0] === key) {
                result = decodeURIComponent(tmp[1]);
            }
        });
    return result;
}
/*
 *游戏加载loading样式
 *@param {String} imgs  参数
 *@param {String} settings 参数
 */
function imgpreload(imgs, settings) {
    if ('string' == typeof imgs) {
        imgs = [imgs];
    }

    var loaded = [];

    $.each(imgs, function(i, elem) {
        var img = new Image();

        var url = elem;

        var img_obj = img;

        if ('string' != typeof elem) {
            url = $(elem).attr('src') || $(elem).css('background-image').replace(/^url\((?:"|')?(.*)(?:'|")?\)$/mg, "$1");

            img_obj = elem;
        }

        $(img).bind('load error', function(e) {
            loaded.push(img_obj);

            $.data(img_obj, 'loaded', ('error' == e.type) ? false : true);

            // http://msdn.microsoft.com/en-us/library/ie/tkcsy6fe(v=vs.94).aspx
            if (settings.each instanceof Function) {
                settings.each.call(img_obj, loaded.slice(0));
            }

            // http://jsperf.com/length-in-a-variable
            if (loaded.length >= imgs.length && settings.all instanceof Function) {
                settings.all.call(loaded);
            }

            $(this).unbind('load error');
        });

        img.src = url;
    });
}