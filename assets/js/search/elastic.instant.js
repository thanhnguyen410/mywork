(function($){
    $.fn.extend({
        donetyping: function(callback,timeout){
            timeout = timeout || 1e3; // 1 second default timeout
            var timeoutReference,
                doneTyping = function(el){
                    if (!timeoutReference) return;
                    timeoutReference = null;
                    callback.call(el);
                };
            return this.each(function(i,el){
                var $el = $(el);
                // Chrome Fix (Use keyup over keypress to detect backspace)
                // thank you @palerdot
                $el.is(':input') && $el.on('keyup keypress',function(e){
                    // This catches the backspace button in chrome, but also prevents
                    // the event from triggering too premptively. Without this line,
                    // using tab/shift+tab will make the focused element fire the callback.
                    if (e.type=='keyup' && e.keyCode!=8) return;

                    // Check if timeout has been set. If it has, "reset" the clock and
                    // start over again.
                    if (timeoutReference) clearTimeout(timeoutReference);
                    timeoutReference = setTimeout(function(){
                        // if we made it here, our timeout has elapsed. Fire the
                        // callback
                        doneTyping(el);
                    }, timeout);
                }).on('blur',function(){
                    // If we can, fire the event since we're leaving the field
                    doneTyping(el);
                });
            });
        }
    });
})(jQuery);

(function($) {
    $(document).ready(function() {

        var cacheResult = {};
        var panel = $('.search-newlayout');
        var $keyword = $('#search-keyword', panel);
        var $frmSearch = $('#frm-search', panel);
        var searchResult = $('#search-result');
        var $pagination = $('.pagination');
        var thisUrl = document.location.href;

        if ($.trim($keyword.val()) == 'Nhập từ khóa muốn tìm...') {
            $keyword.val('');
        }
        var lastQuery = $.trim($keyword.val());

        // Input binding
        $keyword.donetyping(function() {
            searchAction($('.gotoPage.active').attr('data-page')-1);
        }).focus(function() {
            $("html, body").animate({ scrollTop: $('.c-search-newlayout', '.search-newlayout').offset().top }, "slow");
        });

        var advanceChange = setInterval(function() {
            $('.data-filter').on('change', function(e) {
                searchAction($('.gotoPage.active').attr('data-page')-1);
            });
            clearInterval(advanceChange);
        }, 80);

        $frmSearch.submit(function() {
            var keyword = str_to_slug($.trim($('#search-keyword').val()));
            var locationTag = $('.item-tag.selected', '.listjobs-advancesearch.s-location');
            var categoryTag = $('.item-tag.selected', '.listjobs-advancesearch.s-category');

            var location = locationTag.size()?str_to_slug($.trim(locationTag.text())):'';
            if ($('#sl-location').attr('data-region') == 1) {
                location = str_to_slug($.trim($('>option:selected', '#detect-location').text()));
            }
            var category = categoryTag.size()?str_to_slug($.trim(categoryTag.text())):'';

            var local_id = locationTag.size()?locationTag.attr('data-value'):'';
            var cate_id = categoryTag.size()?categoryTag.attr('data-value'):'';

            formSearchAction($(this), keyword, location, category, local_id, cate_id, $(this).attr('data-type'));
            return true;
        });

        linkHighSalary();
        var salaryLink = $('.link-high-salary');
        salaryLink.on('change-link', function() {
            history.pushState('Việc làm lương cao', '', salaryLink.attr('href'));
        });

        $('.btn-submit-search').unbind('click').click(function(e) {
            $frmSearch.submit();
            e.preventDefault();
        });

        $('.btn-submit-search-adv').unbind('click').click(function(e) {
            $("html, body").animate({ scrollTop: (searchResult.offset().top - 26) }, "slow");
            e.preventDefault();
        });

        $('.gotoPage', $pagination).unbind('click').click(function(e) {
            $('#list-page').val(+$(this).data('page'));
            $('#frm-search').submit();
            e.preventDefault();
        });

        // Initial search
        //var initSearch = setInterval(function() {
        //    var hasValueChange = false;
        //    $('.data-filter select').each(function(i) {
        //        var value = $(this).find('option:selected').val();
        //        if (value && value != 0 && value != 'all') {
        //            hasValueChange = true;
        //        }
        //    });
        //    if (hasValueChange) {
        //        searchAction($('.gotoPage.active').attr('data-page')-1);
        //    }
        //    clearInterval(initSearch);
        //}, 100);

        // perform a search
        function searchAction(page) {
            var paramsFilter = [];

            if (!js_search_connect) {
                return;
            }

            $('.data-filter.sl-single >select').each(function(i) {
                var slFilter = $(this).attr('name');
                var currentValue = $.trim($(this).find('option:selected').val());
                if (currentValue && currentValue != 0 && currentValue != 'all') {
                    if (($(this).attr('id') == 'sl-job-salary' || $(this).attr('id') == 'sl-hoso-salary') && currentValue.length >= 2) {
                        var arrValue = currentValue.split('-');
                        if (arrValue.length == 1) {
                            paramsFilter.push('salary_min_vnd:' + (parseInt(arrValue[0]) * 1000000));
                        } else {
                            paramsFilter.push('salary_min_vnd:' + (parseInt(arrValue[0]) * 1000000));
                            paramsFilter.push('salary_max_vnd:' + (parseInt(arrValue[1]) * 1000000));
                        }
                        currentValue = 1;
                    }
                    paramsFilter.push(slFilter + ':' + (currentValue));
                }
            });

            $('.data-filter.sl-multiple').each(function(i) {
                var filterMultiple = [];
                var slFilter = $(this).attr('name');
                var slValues = $.trim($(this).val()).split(',');

                $.each(slValues, function(i) {
                    var currentValue = parseInt($.trim(slValues[i]));
                    if (currentValue && currentValue != 0  && currentValue != 'all') {
                        filterMultiple.push(currentValue);
                    }
                });

                if (filterMultiple.length) {
                    paramsFilter.push(slFilter + ':' + filterMultiple.join(','));
                }
            });

            if (listFilter) {
                $.each(listFilter, function(index, value) {
                    paramsFilter.push(index + ':' + value);
                });
            }

            lastQuery = $.trim($keyword.val());
            var query_params = {
                keyword: lastQuery,
                filters: paramsFilter,
                page: page,
                permalink: permalink
            };

            if (cacheResult[lastQuery+'|'+paramsFilter.join('|')])
            {
                var data = cacheResult[lastQuery+'|'+paramsFilter.join('|')];
                if ($('.panel-list-job').size()) {
                    $('.panel-list-top').html(data.panel_list_service);
                    $('.panel-list-job').html(data.panel_list_top);
                } else {
                    $('.panel-list-top').html(data.panel_list_top);
                }
                $('.panel-list-content').html(data.panel_list_content);
                $('.panel-list-right').html(data.panel_list_right);
                $('.panel-list-page').html(data.panel_list_page);
                $('.panel-list-stats').html(data.panel_list_stats);
                searchCallback();
            }
            else
            {
                setTimeout(function() {
                    $keyword.removeClass('searching');
                }, 200);

                if (!$keyword.hasClass('searching')) {
                    var urlSearch = "/ajax/elastic_instant/" + $keyword.attr('data-type') + "/index.html";
                    $.ajax({
                        url: urlSearch,
                        dataType: "JSON",
                        data: query_params,
                        type: 'POST',
                        beforeSend: function() {
                            $keyword.addClass('searching');
                        },
                        success: function(data) {
                            $keyword.removeClass('searching');

                            if (!data) {
                                return;
                            }
                            cacheResult[lastQuery+'|'+paramsFilter.join('|')] = data;
                            if ($('.panel-list-job').size()) {
                                $('.panel-list-top').html(data.panel_list_service);
                                $('.panel-list-job').html(data.panel_list_top);
                            } else {
                                $('.panel-list-top').html(data.panel_list_top);
                            }
                            $('.panel-list-content').html(data.panel_list_content);
                            $('.panel-list-right').html(data.panel_list_right);
                            $('.panel-list-page').html(data.panel_list_page);
                            $('.panel-list-stats').html(data.panel_list_stats);
                            logCPM();
                            searchCallback();
                        },
                        error: function() {
                            $keyword.removeClass('searching');
                        }
                    });
                }
            }
        }

        /**
         * render panel info filters
         */
        function searchCallback() {
            if ($('#list-hoso').size()) {
                initItemWatched('hoso_new', $('#list-hoso'));
            } else {
                initItemWatched('job', $('#list-jobs'));
            }

            var h1_filter = 'Tuyển dụng nhanh và uy tín | Tuyển dụng hiệu quả';
            if ($('.status-location').find('span').size()) {
                h1_filter = $.trim($('.status-location').find('span').text());
                h1_filter = 'Việc làm tại '+h1_filter+', tuyển dụng tại '+h1_filter;
            }
            if ($('.status-category').find('span').size()) {
                h1_filter = $.trim($('.status-category').find('span').text());
                h1_filter = 'Tuyển nhân viên '+h1_filter+', tuyển dụng '+h1_filter+', việc làm '+h1_filter;
            }
            if ($('.status-location').find('span').size() && $('.status-category').find('span').size()) {
                var h1_category = $.trim($('.status-category').find('span').text());
                var h1_location = $.trim($('.status-location').find('span').text());
                h1_filter = 'Tuyển nhân viên '+h1_category+' tại '+h1_location+', việc làm '+h1_category+' tại '+h1_location;
            }
            $('.h1_home strong').text(h1_filter);

            $('.gotoPage', $pagination).unbind('click').click(function(e) {
                $('#list-page').val(+$(this).data('page'));
                $('#frm-search').submit();
                e.preventDefault();
            });

            searchResult.removeClass('site-refresh');

            linkHighSalary();

            $('.nicescroll-box', '.panel-list-top').niceScroll({
                cursorcolor: "#DDD",
                cursorwidth: "10px",
                cursorminheight: 50,
                autohidemode: false
            });
        }

        /**
         * render high salary link
         */
        function linkHighSalary()
        {
            var salaryLink = $('.link-high-salary');
            if (salaryLink.size()) {
                var locationTag = $('.item-tag.selected', '.listjobs-advancesearch.s-location');
                var categoryTag = $('.item-tag.selected', '.listjobs-advancesearch.s-category');

                var location = locationTag.size()?str_to_slug($.trim(locationTag.text())):'';
                var category = categoryTag.size()?str_to_slug($.trim(categoryTag.text())):'';

                var local_id = locationTag.size()?locationTag.attr('data-value'):'';
                var cate_id = categoryTag.size()?categoryTag.attr('data-value'):'';

                var newLink = '';
                if (cate_id && cate_id != 0) {
                    newLink = category +'-m'+ cate_id;
                }
//            if (local_id && local_id != 0) {
//                newLink = location +'-w'+ local_id;
//            }
                if (local_id && cate_id && local_id != 0 && cate_id != 0) {
                    newLink = category+'-tai-'+ location +'-m'+cate_id+'-w'+local_id;
                }
                if (newLink) {
                    salaryLink.show();
                    salaryLink.attr('href', '/viec-luong-cao/' + newLink + '.html');
                    var currentUrl = window.location.href;
                    currentUrl = currentUrl.split('/viec-luong-cao');
                    if (currentUrl.length > 1) {
                        salaryLink.trigger('change-link');
                    }
                } else {
                    salaryLink.hide();
                    salaryLink.attr('href', '#');
                }
            }
        }
    });

    function logCPM() {
        var dataLog = [];
        $('[data-id][data-type]').each(function(){
            var self = $(this);
            if(self.closest('.slick-active').length) {
                if (self.data('flag') == 0) {
                    dataLog.push({id: $(this).data('id'), type: $(this).data('type')});
                    self.attr({'data-flag': 1});
                }
            }
            else {
                dataLog.push({id: $(this).data('id'), type: $(this).data('type')});
            }
        });
        if (dataLog.length > 1) {
            $.ajax({
                url: '/index.php?page=mats&action=log_cpm',
                type: 'post',
                dataType: 'json',
                data: {data:dataLog},
                success: function(res) {

                }
            });
        }
    }
})(jQuery);