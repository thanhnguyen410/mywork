var mats = {
    // Log CPM
    logCPM: function() {
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
    },

    // Get Applicants Potential
    getApplicantsProtential: function () {
        if ($('#box-applicants-potential').length) {
            var data = {}
            var setData = function() {
                data = {
                    'job_name': $('[name=job_name]').val(),
                    'job_rank' : $('#frmPost [name=job_rank]').val(),
                    'job_model' : $('#frmPost [name=job_model]').val(),
                    'job_experience' : $('#frmPost [name=job_experience]').val(),
                    'job_level' : $('#frmPost [name=job_level]').val(),
                    'job_sex' : $('#frmPost [name=job_sex]').val(),
                    'job_salary_type' : $('#frmPost [name=job_salary_type]').val()
                };

                var locations = [];
                $('#frmPost input[name^=location]').each(function(){
                    var self = $(this);
                    if (self.prop('checked') == true) {
                        locations.push(self.val());
                    }
                });

                var categories = [];
                $('#frmPost input[name^=category]').each(function(){
                    var self = $(this);
                    if (self.prop('checked') == true) {
                        categories.push(self.val());
                    }
                });

                data.locations = locations.join();
                data.categories = categories.join();
            }

            var submit = function() {
                setData();
                $.ajax({
                    url: '/index.php?page=mats&action=getApplicantsPotential',
                    type: 'post',
                    data: data,
                    dataType: 'json',
                    success: function(res) {
                        if (res.success) {
                            $('#box-applicants-potential .qty').text(res.qty);
                        }
                    }
                });
            }

            $('#frmPost select, #frmPost input[name^=location], #frmPost input[name^=category], input[name=job_name]').change(function(){
                submit();
            });

            submit();
        }
    },
    generateHtmlToPDF: function (html, fileName) {
        var doc = new jsPDF();
        var specialElementHandlers = {
            '#editor': function (element, renderer) {
                return true;
            }
        };
        doc.fromHTML(html, 15, 15, {
            'width': 170,
            'elementHandlers': specialElementHandlers
        });
        doc.save(fileName+'.pdf');
    },
    init: function() {
        this.logCPM();
        this.getApplicantsProtential();
    }
}


$(function(){
   //mats.init();
});

