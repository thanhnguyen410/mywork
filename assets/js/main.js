jQuery(document).ready(function($){
    //open the lateral panel
    $('.cd-btn').on('click', function(event){
        event.preventDefault();
        $('.cd-panel').addClass('is-visible');
    });
    //clode the lateral panel
    $('.cd-panel').on('click', function(event){
        if( $(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close') ) {
            $('.cd-panel').removeClass('is-visible');
            event.preventDefault();
        }
    });
    var  mn = $(".topbar");
    mns = "main-nav-scrolled";
    hdr = $('.topheader').height();
    $(window).scroll(function() {
        if( $(this).scrollTop() > hdr ) {
            mn.addClass(mns);
        } else {
            mn.removeClass(mns);
        }
    });
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('#scroll').fadeIn();
        } else {
            $('#scroll').fadeOut();
        }
    });
    $('#scroll').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });

    var hashTagActive = "";
    $(".menu-top a").click(function (event) {
        if(hashTagActive != this.hash) { //this will prevent if the user click several times the same link to freeze the scroll.
            event.preventDefault();
            $(".menu-top a").each(function(){
                $(this).removeClass("active");
            });
            //calculate destination place
            var dest = 0;
            if ($(this.hash).offset().top > $(document).height() - $(window).height()) {
                dest = $(document).height() - $(window).height();
            } else {
                dest = $(this.hash).offset().top;
            }
            //go to destination
            $('html,body').animate({
                scrollTop: dest
            }, 1000, 'swing');
            hashTagActive = this.hash;
            $(this).addClass("active");
        }
    });
    $('.btn-register').click(function(){
        var isMobile = window.matchMedia("only screen and (max-width: 760px)");
        if (isMobile.matches) {
            if (window.location.hash == '#form-landing-mobile') {
                window.location.hash = '';
            }
            setTimeout(function () {
                window.location.hash = 'form-landing-mobile';
            }, 300);
            return false;
        }else{
            $("html, body").animate({ scrollTop: 0 }, 600);
            return false;
        }
    });
    $('.btn-submit').click(function(){
        $.ajax({
            url: '',
            type: 'POST',
            data: $('#form-landing').serialize(),
            dataType: 'json',
            success:function(result){
                if(result.status){

                    alert(result.msg);
                }else{
                    $('.has-error').remove();
                    $('#form-landing input, select, textarea').each(function(){
                        if($(this).attr('name') && result.data[$(this).attr('name').replace(/.*\[/,'').replace(/\].*/,'')]){
                            $(this).after('<span style="color: #ffffff;" class="has-error"><br/>'+result.data[$(this).attr('name').replace(/.*\[/,'').replace(/\].*/,'')]+'</span>');
                        }
                    });
                    if(result.msg){
                        alert(result.msg);
                    }
                }
            }
        });
    });
    $('.btn-submit-mobile').click(function(){
        $.ajax({
            url: '',
            type: 'POST',
            data: $('#form-landing-mobile').serialize(),
            dataType: 'json',
            success:function(result){
                if(result.status){

                    alert(result.msg);
                }else{
                    $('.has-error').remove();
                    $('#form-landing-mobile input, select, textarea').each(function(){
                        if($(this).attr('name') && result.data[$(this).attr('name').replace(/.*\[/,'').replace(/\].*/,'')]){
                            $(this).after('<span style="color: #ffffff;" class="has-error"><br/>'+result.data[$(this).attr('name').replace(/.*\[/,'').replace(/\].*/,'')]+'</span>');
                        }
                    });
                    if(result.msg){
                        alert(result.msg);
                    }
                }
            }
        });
        return false;
    });
    // MATS
    if($('#list-suggest li:first a.close-suggest').length) {
        var key = $('#list-suggest li:first a.close-suggest').data('close');
        setTimeout(function(){
            $.ajax({
                url: '/index.php?page=ajax&do=close_suggest',
                type: 'post',
                data: {key: key},
                dataType: 'json',
                success: function(res) {
                    if (res.success) {
                        $('#list-suggest li:first').remove();
                    }
                }
            });
        }, 10000);
    }
    $('.close-suggest').click(function(){
        var li = $(this).closest('li');
        $.ajax({
            url: '/index.php?page=ajax&do=close_suggest',
            type: 'post',
            data: {key: $(this).data('close')},
            dataType: 'json',
            success: function(res) {
                if (res.success) {
                    li.remove();
                }
            }
        });
    });

    function closeSuggest(e, time) {

    }
});