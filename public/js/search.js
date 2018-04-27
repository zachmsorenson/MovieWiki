
var selection = $('#selection')[0];

selection.addEventListener('change', function() {
    if(selection.value == 'Titles'){
        // show title filter and hide name filter
        $('#filter_title').css('display', 'inline-block');
        $('#filter_name').css('display', 'none');
    } else {
        // else do the opposite
        $('#filter_title').css('display', 'none');
        $('#filter_name').css('display', 'inline-block');
    }
})