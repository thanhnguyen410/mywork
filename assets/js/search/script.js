
$(document).ready(function()
{
    var $frmSearch = $('#frm-search');
    var thisUrl = document.location.href;
    var nextScroll = false;
    if(thisUrl.indexOf("#list_job") > -1 || thisUrl.indexOf("#list_hoso") > -1) {
        $("html, body").animate({ scrollTop: $('#search-result').offset().top }, "slow");
        nextScroll = true;
    }

    if(thisUrl.indexOf("#category") > -1) {
        $('.tabsearch-newlayout').addClass('open-category');
        if (!nextScroll)
            $("html, body").animate({ scrollTop: $('.c-search-newlayout', '.search-newlayout').offset().top }, "slow");
    }
    if(thisUrl.indexOf("#location") > -1) {
        $('.tabsearch-newlayout').addClass('open-location');
        if (!nextScroll)
            $("html, body").animate({ scrollTop: $('.c-search-newlayout', '.search-newlayout').offset().top }, "slow");
    }

    if ($('.tab-list-all.active').size())
    {
        $('.item-tag', '.listjobs-advancesearch').unbind('click').click(function(e) {
            var item = $(this);
            var parent = $(this).parents('.listjobs-advancesearch:first');
            var panel = $('.tabsearch-newlayout');
            var type = parent.attr('data-type');

            if(type == 'location') {
                $('#sl-location').attr('data-region', '0');
            }

            if (item.hasClass('selected') && $('.item-tag.selected', parent).size() == 1) {
                panel.removeClass('open-location').removeClass('open-category');
                return false;
            } else {
                $('.item-tag', parent).removeClass('selected');
                item.addClass('selected');
            }

            $('.sl-'+type+' .value', '#frm-search').text($.trim(item.text()));

            var itemText = $.trim(item.text());
            var title_filter = '';
            var status_filter = '';
            var search_filter = '';
            if (parseInt(item.attr('data-value'))) {
                title_filter = itemText;
                status_filter = 'Ngành nghề: <span>' + itemText + '</span>';
                search_filter = 'ngành ' + itemText;
                if (type == 'location') {
                    title_filter = 'tại ' + itemText;
                    status_filter = 'Nơi làm việc: <span>' + itemText + '</span>';
                    search_filter = 'tại ' + itemText;
                }
            }
            $('.title-'+type).text(title_filter);
            $('.status-'+type).html(status_filter);
            $('.status-'+type, '.link-high-salary').html(search_filter);

            panel.removeClass('open-location').removeClass('open-category');
            $('#sl-'+type, '#frm-search').val(item.attr('data-value')).trigger('change');
            e.preventDefault();
        })
    }

    $('.sl-category').unbind('click').click(function(e) {
        $('.tabsearch-newlayout').toggleClass('open-category').removeClass('open-location');
        $("html, body").animate({ scrollTop: $('.c-search-newlayout', '.search-newlayout').offset().top }, "slow");
        e.preventDefault();
    });

    $('.sl-location').unbind('click').click(function(e) {
        $('.tabsearch-newlayout').toggleClass('open-location').removeClass('open-category');
        $("html, body").animate({ scrollTop: $('.c-search-newlayout', '.search-newlayout').offset().top }, "slow");
        e.preventDefault();
    });

    $('.open-search-advance').unbind('click').click(function(e) {
        $('.list-advance-s').slideToggle();
        $("html, body").animate({ scrollTop: $('.c-search-newlayout', '.search-newlayout').offset().top }, "slow");
        e.preventDefault();
    });


    $('.listjobs-advancesearch').each(function() {
        var type = $(this).attr('data-type');
        var item = $('.item-tag.selected:first', $(this));
        if (item.size()) {
            var textDisplay = $.trim(item.text());
            if($.cookie("detect_location") !== null && type == 'location' && $('input[name="location"]').data('region') == '1') {
                if($.cookie("detect_location") == 'south') textDisplay = 'Miền Nam';
                if($.cookie("detect_location") == 'north') textDisplay = 'Miền Bắc';
            }
            $('.sl-'+type+' .value', '#frm-search').text(textDisplay);
        }
    });

    if ($('#btn-search_right').size()) {
        $('#btn-search_right').unbind('click').click(function(e) {
            $('.opt-right-item').each(function(index) {
                var optItem = $(this);
                $('select[name="'+ optItem.attr('data-ref') +'"').val($('>option:selected', optItem).val());
            });
            $frmSearch.submit();
            e.preventDefault();
        })
    }

    var rightCol = $('.search-right-col');

    if ($('.sidebarListItem', rightCol).size()) {
        var rightTop = rightCol.position().top;
        var rightWidth = rightCol.width();
        $('.sidebarListItem', rightCol)
            .css({
                "max-height": $(window).height() - 5,
                "overflow-y": 'scroll',
                "top": 5
            })
            .affix({
                offset: {
                    top: rightTop,
                    bottom: 500
                }
            })
            .on('affixed.bs.affix', function() {
                $(this).css({
                    "position": "fixed",
                    "width": rightWidth,
                    "top": 5
                })
            })
            .on('affixed-top.bs.affix', function() {
                $(this).css({
                    "position": "relative",
                    "width": rightWidth,
                    "top": 5
                })
            })
            .on('affixed-bottom.bs.affix', function() {
                $(this).css({
                    "position": "relative",
                    "width": rightWidth,
                    "top": 5
                })
            }).niceScroll({
                cursorcolor: "#DDD",
                cursorwidth: "10px",
                cursorminheight: 50,
                autohidemode: false
            })
        ;
    } else {
        fixRightBlock();
    }


    function fixRightBlock()
    {
        return false;
        $('.search-right-col .box-content-right')
            .css({
                "max-height": $(window).height() - 38,
                "overflow-y": 'scroll'
            })
            .enscroll({
                showOnHover: false,
                easingDuration: 300,
                verticalTrackClass: 'track-css',
                verticalHandleClass: 'handle-css'
            });

        var rightBlock = $('.right-block-result');
        var anchor = $('#footer-anchor').position();

        $(window).scroll(function () {
            var position = $('.search-right-col').position();

            if ($('#search-result').size()) {
                if (position.top <= $(window).scrollTop()) {
                    rightBlock.addClass("right-fix");
                } else {
                    rightBlock.removeClass("right-fix");
                }
                rightBlock.removeClass("right-absolute");
                if (anchor.top + 15 - $(window).height() / 2 <= $(window).scrollTop()) {
                    rightBlock.removeClass("right-fix");
                    rightBlock.addClass("right-absolute");
                }
                if ($('.item', '#search-result').size() || $('.job-view-detail', '#search-result').size() || $('.hoso-view-detail', '#search-result').size()) {
                    rightBlock.removeClass("right-relative");
                } else {
                    rightBlock.addClass("right-relative");
                }
            }
        });
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
});

function text_limiter(str, limit, end_char, outlen)
{
    if(typeof(limit) == 'undefined') {
        limit = 100;
    }
    if(typeof(end_char) == 'undefined') {
        end_char = '...';
    }
    if(typeof(outlen) != 'undefined') {
        limit = limit - outlen;
    }

    var str_temp = str.substr(0, limit);
    var flag = str.substr(limit, 1);

    if(flag != ' ') {

        var arr_str = str_temp.split(" ");

        arr_str.splice(arr_str.length - 1, 1);

        str_temp = arr_str.join(" ")
    }

    if(str.length > limit ) {
        return str_temp + end_char;
    } else {
        return str;
    }
}