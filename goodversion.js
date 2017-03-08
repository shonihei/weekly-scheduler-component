// Good version

var mousedown;
var deletionMode;

$(document).ready(function() {
    mousedown = false;
    deletionMode = false;

    // Prevent right click
    $('.schedule').on('contextmenu', function() {
        return false;
    });

    $('.hour').on('mouseenter', function() {
        if (!mousedown) {
            $(this).addClass('hover');
        }
        else {
            if (deletionMode) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        }
    }).on('mousedown', function() {
        mousedown = true;
        focusOn($(this).parent());

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            deletionMode = true;
        }
        else {
            $(this).addClass('selected');
        }
        $(this).removeClass('hover');
    }).on('mouseup', function() {
        deletionMode = false;
        mousedown = false;
        clearFocus();
    }).on('mouseleave', function () {
        if (!mousedown) {
            $(this).removeClass('hover');
        }
    });
});

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

    $(day).on('mouseleave', function() {
        clearFocus();
        mousedown = false;
        deletionMode = false;
    });
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
