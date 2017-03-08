// Poopy version

var selectionMode;
var deletionMode;

$(document).ready(function() {
    selectionMode = false;
    deletionMode = false;

    $('.hour').on('mouseenter', function() {
        if (!selectionMode) {
            if (!$(this).hasClass('selected')) {
                $(this).addClass('hover');
            };
        }
        else {
            if (deletionMode) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        }
    }).on('click', function() {
        if (!selectionMode) {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                $(this).removeClass('hover');
                deletionMode = true;
                selectionMode = true;
                focusOn($(this).parent());
            }
            else {
                $(this).removeClass('hover');
                $(this).addClass('selected');
                selectionMode = true;
                focusOn($(this).parent());
            }
        }
        else {
            deletionMode = false;
            selectionMode = false;
            clearFocus();
        }
    }).on('mouseleave', function () {
        if (!selectionMode) {
            $(this).removeClass('hover');
        }
        else {
            if (deletionMode) {
                $(this).removeClass('selected');
            }
        }
    });
});

function collectData() {
    let dayContainer = $('.day');

}

function focusOn(day) {
    let targetDayClass = $(day).attr('class').split('\ ')[1];
    let dayContainer = $('.day');

    for (let i = 0; i < dayContainer.length; i++) {
        if ($(dayContainer[i]).hasClass(targetDayClass)) {
            continue;
        }

        let hours = $(dayContainer[i]).children();
        for (let j = 0; j < hours.length; j++) {
            $(hours[j]).addClass('disabled');
        }
    }
}

function clearFocus() {
    let dayContainer = $('.day');

    for (let i = 0; i < dayContainer.length; i++) {

        let hours = $(dayContainer[i]).children();
        for (let j = 0; j < hours.length; j++) {
            $(hours[j]).removeClass('disabled');
        }
    }
}
