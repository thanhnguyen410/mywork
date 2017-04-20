
function str_to_slug(str)
{
    str= str.toLowerCase();
    str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
    str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    str= str.replace(/đ/g,"d");
    str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
    /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
    str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1-
    str= str.replace(/^\-+|\-+$/g,"");
    //cắt bỏ ký tự - ở đầu và cuối chuỗi
    return str;
}

/**
 * Get action search form
 * @param form
 * @param keyword
 * @param location
 * @param category
 * @param local_id
 * @param cate_id
 * @param type = tuyen-dung|ung-vien
 */
function formSearchAction(form, keyword, location, category, local_id, cate_id, type)
{
    var cate_code = 'm' + cate_id;
    var local_code = 'w' + local_id;

    var action = form.attr('action');
    var new_action = '';

    var regionCode = parseInt($('#sl-location').attr('data-region'));
    if(regionCode == 1) {
        if($.cookie("detect_location") == 'north') {
            local_code = 'w99';
        }
        if($.cookie("detect_location") == 'south') {
            local_code = 'w100';
        }
    }

    if (cate_id && cate_id != 0) {
        new_action = '/'+type+'/'+cate_id +'/'+ category;
    }
    if (local_id && local_id != 0) {
        new_action = '/'+type+'/dia-diem/'+local_id +'/'+ location;
        if(regionCode == 1) {
            new_action = '/'+type+'/dia-diem/' + location;
        }
    }
    if (keyword) {
        new_action = action + keyword;
    }
    if (keyword && local_id && local_id != 0) {
        new_action = action+keyword+'-tai-'+location+'-'+local_code;
    }
    if (keyword && cate_id && cate_id != 0) {
        new_action = action+keyword+'-'+cate_code;
    }
    if (local_id && cate_id && local_id != 0 && cate_id != 0) {
        new_action = action+category+'-tai-'+location+'-c1-'+cate_code+'-'+local_code;
    }
    if (local_id && cate_id && keyword && local_id != 0 && cate_id != 0) {
        new_action = action+keyword+'-tai-'+location+'-'+cate_code+'-'+local_code;
    }

    var txtPage = '';
    if (document.getElementById('list-page').value > 1) {
        txtPage += '/trang/' + document.getElementById('list-page').value + '#list_job';
    }
    if (new_action) {
        form.attr('action', (new_action + '.html' + txtPage).replace('//', '/').toString());
    } else {
        form.attr('action', ('/'+type+'/' + txtPage).replace('//', '/').toString());
    }
}

/** Cookies */
(function ($, document, undefined) {

    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    var config = $.cookie = function (key, value, options) {

        // write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (value === null) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            if (decode(parts.shift()) === key) {
                var cookie = decode(parts.join('='));
                return config.json ? JSON.parse(cookie) : cookie;
            }
        }

        return null;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== null) {

            $.cookie(key, null, options);
            return true;
        }
        return false;
    };
})(jQuery, document);

function initItemWatched(dataType, panel) {
    if (panel == 'undefined') {
        panel = $(document);
    }
    $('.'+dataType+'-view-detail', panel).unbind('click').click(function(e) {
        var item = $(this);
        var items_watched = [];
        if ($.cookie(dataType+'_watched') != 'undefined' && $.cookie(dataType+'_watched')) {
            var strVale = $.cookie(dataType + '_watched').split(';');
            for (var i = 0; i < strVale.length; i++) {
                if (strVale[i])
                    items_watched.push(parseInt(strVale[i]));
            }
        }
        if (!items_watched.length || $.inArray(parseInt(item.attr('data-id')), items_watched) < 0) {
            if (items_watched.length >= 500) {
                items_watched = items_watched.slice(1, items_watched.length);
            }
            items_watched.push(parseInt(item.attr('data-id')));
            $.cookie(dataType+'_watched', items_watched.join(';'), {expires: 365, path:'/'}); // hạn 1 năm
        }
        item.after('<span class="item-watched">Đã xem</span>');
        item.parents('.list-item:first').addClass('item-viewed');
    });

    $('.'+dataType+'-view-detail', panel).each(function(index) {
        var item = $(this);
        if (!item.parent().find('.item-watched').size()) {
            var items_watched = [];
            if ($.cookie(dataType+'_watched') != 'undefined' && $.cookie(dataType+'_watched')) {
                var strVale = $.cookie(dataType + '_watched').split(';');
                for (var i = 0; i < strVale.length; i++) {
                    if (strVale[i])
                        items_watched.push(parseInt(strVale[i]));
                }
            }
            if (list_hs_viewed && list_hs_viewed.length) {
                for (var i = 0; i < list_hs_viewed.length; i++) {
                    if (list_hs_viewed[i])
                        items_watched.push(parseInt(list_hs_viewed[i]));
                }
            }
            if (items_watched.length && $.inArray(parseInt(item.attr('data-id')), items_watched) >= 0) {
                item.after('<span class="item-watched">Đã xem</span>');
                item.parents('.list-item:first').addClass('item-viewed');
            }
        }
    });
}

$(document).ready(function(){
    $('.ui.dropdown').dropdown();
    $('.ui.menu-user.dropdown').dropdown({
        on: 'hover'
    });

    $('.ui.menu-user.dropdown.notification-menu').dropdown({
        on: 'click'
    });


    var nav = $('.mywork-bar');
    var mav = $('.mywork-menu');

    $(window).scroll(function () {
        if (!$('#search-result').size() && !$('#panel-bottm-apply').size() && !$('.my-premium-page').size()) {
            if ($(this).scrollTop() > 100) {
                nav.addClass("headtop");
                mav.addClass("mtop");
                $('#mywork > .container:first').css('margin-top', '150px');
            } else {
                nav.removeClass("headtop");
                mav.removeClass("mtop");
                $('#mywork > .container:first').css('margin-top', '0');
            }
        }
    });

    $('.nicescroll-box').niceScroll({
        cursorcolor: "#DDD",
        cursorwidth: "10px",
        cursorminheight: 76,
        autohidemode: false
    });

    initItemWatched('job');
    initItemWatched('hoso_new');

});
