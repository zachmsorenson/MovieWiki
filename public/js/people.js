
function toggleEditOverlay(){
    var overlay = $('#edit_overlay');
    if (overlay.css('display') == 'none'){
        overlay.css('display', 'block');
    } else {
        overlay.css('display', 'none');
    }
}

function postBirth(){
    var value = $('#birth_year')[0].value;
    $('#page_birth_year')[0].innerHTML = value;
    var id = $('#const')[0].innerHTML;

    sendPost('Names', 'birth_year', value, id);
}

function postDeath(){
    var value = $('#death_year')[0].value;
    $('#page_death_year')[0].innerHTML = value;
    var id = $('#const')[0].innerHTML;

    sendPost('Names', 'death_year', value, id);
}

function postProfessions(){

    var selectedValues = [];
    $("#professions :selected").each(function(){
        selectedValues.push($(this).val());
    });

    var value = "";
    for (i = 0; i < selectedValues.length; i++){
        value += selectedValues[i];
        if (i !== selectedValues.length-1){
            value += ',';
        }
    }

    $('#page_professions')[0].innerHTML = value;
    var id = $('#const')[0].innerHTML;

    sendPost('Names', 'primary_profession', value, id);
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