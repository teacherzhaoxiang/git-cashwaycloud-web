/**
 * author levi
 * url http://levi.cg.am
 */
var timeInterval;
$(function () {
    if (!timeInterval) {
        getTime();
    }
    $(document).mousemove(function (e) {
        var key = e.which; //获取鼠标键位
        if (key == 3) //(1:代表左键； 2:代表中键； 3:代表右键)
         {
            return;
            e.preventDefault();
            console.log(e);
            //获取右键点击坐标
            var x = e.clientX;
            var y = e.clientY;
            //$(".mode").show().css({left:x,top:y});
        }
        var _this = this;
        if (!!this.move) {
            var posix = !document.move_target ? {
                'x': 0,
                'y': 0
            } : document.move_target.posix;
            callback = document.call_down || function () {
                var navWidth = ($(".tools").width() + 20); //获取侧边栏宽度   +20是因为有padding
                var headerHeight = ($("#tools").height() + 20); //获取头部高度  +20是因为有padding
                var contentW = $("#content").width() * canvasScale;
                var contentH = $("#content").height() * canvasScale;
                var top = (e.pageY - posix.y - headerHeight) / canvasScale;
                var left = (e.pageX - posix.x - navWidth) / canvasScale;
                actDomId = $("#actDomId").attr("actDomId");
                //判断边界
                if (top <= 0) {
                    top = 0;
                }
                if (top >= contentH / canvasScale - $('#' + actDomId).height()) {
                    top = contentH / canvasScale - $('#' + actDomId).height();
                }
                if (left <= 0) {
                    left = 0;
                }
                if (left >= contentW / canvasScale - $('#' + actDomId).width()) {
                    left = contentW / canvasScale - $('#' + actDomId).width();
                }
                $(this.move_target).css({
                    'top': top,
                    'left': left,
                });
            };
            callback.call(this, e, posix);
        }
    }).mouseup(function (e) {
        if (!!this.move) {
            var callback = document.call_up || function () { };
            callback.call(this, e);
            $.extend(this, {
                'move': false,
                'move_target': null,
                'call_down': false,
                'call_up': false
            });
        }
    });
});
//将属性变成静态化
function copyHTML() {
    var html = $("#content").html();
    var reg = new RegExp('<div class="coor"></div>', "g");
    var res = html.replace(reg, "");
    console.log(res);
    $("#copyHTML").html(res);
}
var box = 0;
//添加元素
function addHTML(params, type) {
    ALLPAGE = 0;
    box = new Date().getTime();
    actDomId = 'box' + box;
    var html = '';
    console.log(type);
    if (type == 'Carousel') {
        html =
            '<div class="box boxBg" onclick="change_type(event,this)"  style="display:flex;align-items:center;justify-content:center;z-index:' +
                (++maxZIndex) + '" data-type=' + type + ' id="box' + box + '">' +
                '<div class="swiper-container swiper-no-swiping" style="text-align:center;line-height:170px;">' +
                '<div class="swiper-wrapper">' +
                '<div class="swiper-slide">添加轮播</div></div></div>' +
                '<div class="coor"></div>' +
                '</div>';
        swiperType["box" + box] = {
            type: 'slide',
            direction: 'horizontal'
        };
        HTML[0]['swiperType'] = swiperType;
        // console.log(swiperType)
    }
    else if (type == "model") {
        //getModel();
        $('.RCM-container').css({
            'display': 'none'
        });
        editor_status(type);
    }
    else if (type == "iframe") {
        html = '<div class="box boxBg" onclick="change_type(event,this)" onmousedown="changeDom(this)" style="display:flex;align-items:center;justify-content:center;z-index:' + (++maxZIndex) + '" data-type=' + type + ' id="box' + box + '">' +
            '<div class="box_box"><div class="box_modal flex">' + params + '</div>' +
            '<iframe width="100%" height="100%" scrolling="auto" frameborder="0" src=""></iframe>' +
            '	</div><div class="coor"></div>' +
            '</div>';
    }
    else if (type == "time") {
        var display = 'flex';
        type = 'font';
        html = '<div class="box boxBg timmer" onclick="change_type(event,this)" onmousedown="changeDom(this)" style="display:' + display +
            ';align-items:center;justify-content:center;z-index:' + (++maxZIndex) + '" data-type=' + type + ' id="box' + box +
            '">' + '<div class="textarea"></div>' +
            '	<div class="coor"></div>' +
            '</div>';
    }
    else if (type == "weather") {
        // getWeather();
        // let display = 'flex';
        // type = 'font';
        // html = '<div class="box boxBg" onclick="change_type(event,this)" onmousedown="changeDom(this)" style="top:40px;left:40px;display:' + display +
        // 	';align-items:center;justify-content:center;text-align: center;z-index:' + (++maxZIndex) + '" data-type=' + type + ' id="box' + box +
        // 	'">' +
        // 	'<div class="textarea weather" style="display:flex;justify-content:center;flex-direction: column;"><div class="weather">'+(WEATHER.cityName||'')+'</div><div class="weather">'+(WEATHER.temp2||'')+'/'+(WEATHER.temp1||'')+'</div><div>'+(WEATHER.wea||'')+(WEATHER.airLevel?' 空气'+WEATHER.airLevel:'')+'</div></div>' +
        // 	'	<div class="coor"></div>' +
        // 	'</div>';
    }
    else {
        var display = 'flex';
        if (type == 'document') {
            $('.tips_box').css({
                'display': 'block'
            }); //显示提示框
            $('.tips_box .tips').animate({
                'opacity': 1
            });
            display = 'none';
        }
        html = '<div class="box boxBg" onclick="change_type(event,this)" onmousedown="changeDom(this)" style="top:40px;left:40px;display:' + display +
            ';align-items:center;justify-content:center;z-index:' + (++maxZIndex) + '" data-type=' + type + ' id="box' + box +
            '">' +
            params +
            '	<div class="coor"></div>' +
            '</div>';
        //var embed = '<embed class="pdfobject" src="http://114.116.120.8:8090/download?filename=hall/b2c16b0e-e358-4410-b3f5-2e46aeeb6628.xls" type="application/excel" style="overflow: auto; width: 100%; height: 100%;">';
    }
    console.log(params);
    $("#content").append(html);
    if (!timeInterval) {
        getTime();
    }
    init(); //初始化drag事件
}
function getNongli(sy, sm, sd) {
    var lunarYearArr = [
        0x0b557,
        0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
        0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
        0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
        0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
        0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
        0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
        0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
        0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
        0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
        0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
        0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
        0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
        0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
        0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
        0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
        0x0d520 //2100
    ], lunarMonth = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'], lunarDay = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '初', '廿'], tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'], diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    // 公历转农历函数
    function sloarToLunar(sy, sm, sd) {
        // 输入的月份减1处理
        sm -= 1;
        // 计算与公历基准的相差天数
        // Date.UTC()返回的是距离公历1970年1月1日的毫秒数,传入的月份需要减1
        var daySpan = (Date.UTC(sy, sm, sd) - Date.UTC(1949, 0, 29)) / (24 * 60 * 60 * 1000) + 1;
        var ly, lm, ld;
        // 确定输出的农历年份
        for (var j = 0; j < lunarYearArr.length; j++) {
            daySpan -= lunarYearDays(lunarYearArr[j]);
            if (daySpan <= 0) {
                ly = 1949 + j;
                // 获取农历年份确定后的剩余天数
                daySpan += lunarYearDays(lunarYearArr[j]);
                break;
            }
        }
        // 确定输出的农历月份
        for (var k = 0; k < lunarYearMonths(lunarYearArr[ly - 1949]).length; k++) {
            daySpan -= lunarYearMonths(lunarYearArr[ly - 1949])[k];
            if (daySpan <= 0) {
                // 有闰月时，月份的数组长度会变成13，因此，当闰月月份小于等于k时，lm不需要加1
                if (hasLeapMonth(lunarYearArr[ly - 1949]) && hasLeapMonth(lunarYearArr[ly - 1949]) <= k) {
                    if (hasLeapMonth(lunarYearArr[ly - 1949]) < k) {
                        lm = k;
                    }
                    else if (hasLeapMonth(lunarYearArr[ly - 1949]) === k) {
                        lm = '闰' + k;
                    }
                    else {
                        lm = k + 1;
                    }
                }
                else {
                    lm = k + 1;
                }
                // 获取农历月份确定后的剩余天数
                daySpan += lunarYearMonths(lunarYearArr[ly - 1949])[k];
                break;
            }
        }
        // 确定输出农历哪一天
        ld = daySpan;
        // 将计算出来的农历月份转换成汉字月份，闰月需要在前面加上闰字
        if (hasLeapMonth(lunarYearArr[ly - 1949]) && (typeof (lm) === 'string' && lm.indexOf('闰') > -1)) {
            lm = "\u95F0" + lunarMonth[/\d/.exec(lm) - 1];
        }
        else {
            lm = lunarMonth[lm - 1];
        }
        // 将计算出来的农历年份转换为天干地支年
        ly = getTianGan(ly) + getDiZhi(ly);
        // 将计算出来的农历天数转换成汉字
        if (ld < 11) {
            ld = "" + lunarDay[10] + lunarDay[ld - 1];
        }
        else if (ld > 10 && ld < 20) {
            ld = "" + lunarDay[9] + lunarDay[ld - 11];
        }
        else if (ld === 20) {
            ld = "" + lunarDay[1] + lunarDay[9];
        }
        else if (ld > 20 && ld < 30) {
            ld = "" + lunarDay[11] + lunarDay[ld - 21];
        }
        else if (ld === 30) {
            ld = "" + lunarDay[2] + lunarDay[9];
        }
        return {
            lunarYear: ly,
            lunarMonth: lm,
            lunarDay: ld,
        };
    }
    // 计算农历年是否有闰月，参数为存储农历年的16进制
    // 农历年份信息用16进制存储，其中16进制的最后1位可以用于判断是否有闰月
    function hasLeapMonth(ly) {
        // 获取16进制的最后1位，需要用到&与运算符
        if (ly & 0xf) {
            return ly & 0xf;
        }
        else {
            return false;
        }
    }
    // 如果有闰月，计算农历闰月天数，参数为存储农历年的16进制
    // 农历年份信息用16进制存储，其中16进制的第1位（0x除外）可以用于表示闰月是大月还是小月
    function leapMonthDays(ly) {
        if (hasLeapMonth(ly)) {
            // 获取16进制的第1位（0x除外）
            return (ly & 0xf0000) ? 30 : 29;
        }
        else {
            return 0;
        }
    }
    // 计算农历一年的总天数，参数为存储农历年的16进制
    // 农历年份信息用16进制存储，其中16进制的第2-4位（0x除外）可以用于表示正常月是大月还是小月
    function lunarYearDays(ly) {
        var totalDays = 0;
        // 获取正常月的天数，并累加
        // 获取16进制的第2-4位，需要用到>>移位运算符
        for (var i_1 = 0x8000; i_1 > 0x8; i_1 >>= 1) {
            var monthDays = (ly & i_1) ? 30 : 29;
            totalDays += monthDays;
        }
        // 如果有闰月，需要把闰月的天数加上
        if (hasLeapMonth(ly)) {
            totalDays += leapMonthDays(ly);
        }
        return totalDays;
    }
    // 获取农历每个月的天数
    // 参数需传入16进制数值
    function lunarYearMonths(ly) {
        var monthArr = [];
        // 获取正常月的天数，并添加到monthArr数组中
        // 获取16进制的第2-4位，需要用到>>移位运算符
        for (var i_2 = 0x8000; i_2 > 0x8; i_2 >>= 1) {
            monthArr.push((ly & i_2) ? 30 : 29);
        }
        // 如果有闰月，需要把闰月的天数加上
        if (hasLeapMonth(ly)) {
            monthArr.splice(hasLeapMonth(ly), 0, leapMonthDays(ly));
        }
        return monthArr;
    }
    // 将农历年转换为天干，参数为农历年
    function getTianGan(ly) {
        var tianGanKey = (ly - 3) % 10;
        if (tianGanKey === 0)
            tianGanKey = 10;
        return tianGan[tianGanKey - 1];
    }
    // 将农历年转换为地支，参数为农历年
    function getDiZhi(ly) {
        var diZhiKey = (ly - 3) % 12;
        if (diZhiKey === 0)
            diZhiKey = 12;
        return diZhi[diZhiKey - 1];
    }
    return sloarToLunar(sy, sm - 1, sd);
}
function getTime() {
    timeInterval = setInterval(function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var cDate = year + '年' + month + '月' + day + '日  ' + hours + "时" + minutes + "分" + seconds + "秒";
        var luna = getNongli(year, month + 1, day);
        var lunaDate = luna.lunarYear + '年' + luna.lunarMonth + '月' + luna.lunarDay + '日  ' + hours + "时" + minutes + "分" + seconds + "秒";
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        var nomalDate = year + '-' + month + '-' + day + ' ' + hours + ":" + minutes + ":" + seconds; //默认类型的日期时间格式
        $('.timmer .textarea').text(nomalDate); // 默认类型的日期时间格式
        $('.timmer .cDate').text(cDate);
        $('.timmer .lunaDate').text(lunaDate);
    }, 1000);
}
function changeDom(dom) {
    console.log('changeDom');
    _this = dom = $(dom);
    actDomId = dom.prop("id");
    $("#actDomId").attr("actDomId", actDomId);
}
var dbClickNum = 0;
var timer;
function change_type(e, dom) {
    dbClickNum < 2 && dbClickNum++;
    console.log(dbClickNum);
    dbClickNum <= 1 ? timer = setTimeout(function () {
        if (dbClickNum <= 1) {
            console.log('change_type');
            _this = dom = $(dom);
            actDomId = dom.prop("id");
            $("#actDomId").attr("actDomId", actDomId);
            var border_arr = dom.css('border') ? dom.css('border').split(' ') : [];
            var border_color = border_arr.slice(2, border_arr.length).join('');
            var type = dom.attr('data-type');
            var fontType = dom.attr('data-ftype');
            showBgOpt(0);
            if (type == 'font' || fontType) {
                //console.log($('#'+actDomId).height())
                $('#' + actDomId + ' textarea').height($('#' + actDomId).height());
                //console.log($('#'+actDomId).height())
                if ($('#' + actDomId + '.timmer').length > 0) {
                    $('#dateFormat').css({ 'display': 'block' });
                }
                else {
                    $('#dateFormat').css({ 'display': 'none' });
                }
                if (fontType) {
                    $('.font_display .direction').eq(fontType).addClass('selected');
                }
                else {
                    $('.font_display .direction').removeClass('selected');
                }
                console.log($('#font_bg').css('background-color'));
                var font_color = colorHex(_this.css('color')); //获取当前选中编辑框字体十六进制色值
                var font_bg = colorHex(_this.css('background-color')); //获取当前选中编辑框字体十六进制色值
                $('#font_color').val(font_color);
                $('#font_bg').val(font_bg);
                $('#font_size').val(_this.css('font-size'));
                $('#font_type').val(_this.css('font-family'));
                $('.fontStyle,#displayStyle').css({
                    'display': 'block'
                });
            }
            else {
                $('#dateFormat').css({ 'display': 'none' });
                $('.fontStyle,#displayStyle').css({
                    'display': 'none'
                });
            }
            $('#border_size').val(parseInt(border_arr[0]));
            $('#border_type').val(border_arr[1]);
            $('#border_color').val(colorHex(border_color));
            console.log(dom.width());
            $('#box_w').val(dom.width());
            console.log(dom.height());
            $('#box_h').val(dom.height());
            $('#box_x').val(parseFloat(dom.css('top')));
            $('#box_y').val(parseFloat(dom.css('left')));
        }
        dbClickNum = 0;
    }, 200) : '';
    if (dbClickNum == 2) {
        clearTimeout(timer);
        dbClickNum = 0;
        console.log('双击事件');
        var content_1 = document.querySelector('#content');
        var position = {
            left: dom.offsetLeft,
            right: dom.offsetLeft + dom.offsetWidth,
            top: dom.offsetTop,
            bottom: dom.offsetTop + dom.offsetHeight
        };
        function getPosition(position, id) {
            var newPosition = {
                left: 0,
                right: content_1.offsetWidth,
                top: 0,
                bottom: content_1.offsetHeight
            };
            for (var _i = 0, _a = content_1.childNodes; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.id == id) {
                    continue;
                }
                //先判断是否在左边再判断位置
                position.left >= item.offsetLeft + item.offsetWidth &&
                    newPosition.left <= item.offsetLeft + item.offsetWidth ?
                    newPosition.left = item.offsetLeft + item.offsetWidth : '';
                //先判断是否在右边再判断位置
                item.offsetLeft >= position.right &&
                    item.offsetLeft <= newPosition.right ?
                    newPosition.right = item.offsetLeft : '';
                //先判断是否在上面再判断位置
                item.offsetTop + item.offsetHeight <= position.top &&
                    item.offsetTop + item.offsetHeight >= newPosition.top ?
                    newPosition.top = item.offsetTop + item.offsetHeight : '';
                //先判断是否在下面再判断位置
                item.offsetTop >= position.bottom &&
                    item.offsetTop <= newPosition.bottom ?
                    newPosition.bottom = item.offsetTop : '';
            }
            return newPosition;
        }
        var newPosition = getPosition(position, dom.id);
        dom.style.left = newPosition.left + 'px';
        dom.style.top = newPosition.top + 'px';
        dom.style.width = newPosition.right - newPosition.left + 'px';
        dom.style.height = newPosition.bottom - newPosition.top + 'px';
        console.log(dom);
        console.log(getPosition(position, dom.id), 'newPosition');
    }
    e.stopPropagation();
}
/*RGB颜色转换为16进制*/
function colorHex(rgb) {
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var that = rgb;
    if (/^(rgb|RGB)/.test(that)) {
        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i = 0; i < aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = that;
        }
        return strHex;
    }
    else if (reg.test(that)) {
        var aNum = that.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return that;
        }
        else if (aNum.length === 3) {
            var numHex = "#";
            for (var i = 0; i < aNum.length; i += 1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    }
    else {
        return that;
    }
}
;
//绑定元素事件
var i = 0;
var actDomId = '';
function getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURIComponent(r[2]);
    return null;
}
function init() {
    var max = getUrlParam('resolutionValue').split('*');
    console.log(max);
    $(".edit_box").mousedown(function (e) {
        if (e.button == "2") {
            $('.RCM-container').hide();
            if (!$(e.toElement).parents(".box").hasClass("box") && !$(e.toElement).hasClass("box")) {
                actDomId = "";
            }
        }
    });
    $('#content .box').mousedown(function (e) {
        var event = e || window.e;
        if (event.button == "2") {
            actDomId = this.id;
            if ($(this).attr('data-type') == 'font') {
                $('.nocenter[data-content="edit"]').css({
                    'display': 'none'
                });
            }
            else {
                $('.nocenter[data-content="edit"]').css({
                    'display': 'block'
                });
            }
            // popMenu();//右键弹出菜单
        }
        else {
            actDomId = "";
        }
        var offset = $(this).offset();
        //$(this).css('z-index',++maxZIndex);
        this.posix = {
            'x': e.pageX - offset.left,
            'y': e.pageY - offset.top
        };
        $.extend(document, {
            'move': true,
            'move_target': this
        });
    }).on('mousedown', '.coor', function (e) {
        //$(this).css('z-index',new Date().getTime());
        var _this = this;
        var posix = {
            'w': $(_this).parent().width() * canvasScale,
            'h': $(_this).parent().height() * canvasScale,
            'x': e.pageX,
            'y': e.pageY
        };
        //判断边界
        $.extend(document, {
            'move': true,
            'call_down': function (e) {
                var left = $('#' + _this.offsetParent.id).width() + $('#' + _this.offsetParent.id)[0].offsetLeft;
                var top = $('#' + _this.offsetParent.id).height() + $('#' + _this.offsetParent.id)[0].offsetTop;
                left = (left + 6);
                top = (top + 6);
                if (left <= $("#content").width() + 10) {
                    var width = Math.max(30, e.pageX - posix.x + posix.w) / canvasScale;
                    width > max[0] ? width = max[0] : '';
                    $(_this).parent().css({
                        'width': width
                    });
                }
                if (top <= $("#content").height() + 10) {
                    var height = Math.max(30, e.pageY - posix.y + posix.h) / canvasScale;
                    height > max[1] ? height = max[1] : '';
                    $(_this).parent().css({
                        'height': height
                    });
                }
            }
        });
        return false;
    });
}
