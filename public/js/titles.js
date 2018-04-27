

function toggleEditOverlay(){
    var overlay = $('#edit_overlay');
    console.log('toggle');
    console.log(overlay);
    console.log(overlay.css('display'));
    if (overlay.css('display') == 'none'){
        overlay.css('display', 'block');
    } else {
        overlay.css('display', 'none');
    }
}

function