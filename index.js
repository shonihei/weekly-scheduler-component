var selected;

$(document).ready(function() {
    selected = false;

    $('.hour').on('mouseenter mouseleave', function() {
        if (!selected) {
            $(this).toggleClass('hover');
        }
        else {
            if ($(this).hasClass('selected')) {
                console.log("remove me");
            }
            $(this).addClass('selected');
        }
    }).on('click', function() {
        if (!selected) {
            $(this).toggleClass('hover');
            $(this).toggleClass('selected');
            selected = true;
            focusOn($(this).parent());
        }
        else {
            selected = false;
            clearFocus();
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
