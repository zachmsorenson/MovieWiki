

function toggleEditOverlay(){
    var overlay = $('#edit_overlay');
    if (overlay.css('display') == 'none'){
        overlay.css('display', 'block');
    } else {
        overlay.css('display', 'none');
    }
}

function postType(){
    var value = $('#title_type')[0].value;
    $('#page_title_type')[0].innerHTML = value;
    var id = $('#const')[0].innerHTML;
    var postObj = { 'table': 'Titles', 'column': 'title_type', 'value': value, 'id': id};
    sendPost('Titles', 'title_type', value, id);
}

function postGenres(){

    var selectedValues = [];
    $("#genres :selected").each(function(){
        selectedValues.push($(this).val());
    });

    var value = "";
    for (i = 0; i < selectedValues.length; i++){
        value += selectedValues[i];
        if (i !== selectedValues.length-1){
            value += ',';
        }
    }

    $('#page_genres')[0].innerHTML = value;
    var id = $('#const')[0].innerHTML;

    sendPost('Titles', 'genres', value, id);
}

function sendPost(table, column, value, id){
    var postObj = { 'table': table, 'column': column, 'value': value, 'id': id};
    $.ajax({
        type: 'POST',
        url: 'update',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(postObj)
    });
}
