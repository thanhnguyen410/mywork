(function($) {
    $(document).ready(function() {

        var input = $('#search-keyword');
        var cacheResult = {};

        input.typeahead({
            highlight: true,
            minLength: 3,
            hint: false
        }, {
            source: function(query, process) {
                query = $.trim(query);

                if (cacheResult[query]) {
                    return process(cacheResult[query]);
                }
                var urlSearch = "/ajax/search_tags/" + query + "/index.html";
                return $.ajax({
                    url: urlSearch,
                    dataType: "JSON",
                    data: {},
                    success: function(data) {
                        if (!data) {
                            return false;
                        }
                        var newData = [];
                        $.each(data.hits.hits, function(index, value) {
                            newData.push(value._source);
                        });
                        cacheResult[query] = newData;

                        return process(newData);
                    }
                });
            },
            displayKey: 'tag_value',
            templates: {
                suggestion: function (hit) {
                    // render the hit
                    return '<div class="hit">' +
                        '<div class="name">' + hit.tag_value_txt + '</div>' +
                        '</div>';
                }
            }
        });

    });

})(jQuery);