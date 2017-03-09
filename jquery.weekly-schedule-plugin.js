(function($) {
    $.fn.weekly_schedule = function(callerSettings) {

        var settings = $.extend({
            days: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
            hours: "7:00AM-10:00PM",
            fontFamily: "Montserrat",
            fontColor: "black",
            fontWeight: "100",
            fontSize: "0.8em",
            hoverColor: "#727bad",
            selectionColor: "#9aa7ee",
            headerBackgroundColor: "transparent",

            onSelected: function(){}, // handler called after selection
            onRemoved: function(){} // handler called after removal
        }, callerSettings||{});

        settings.hoursParsed = parseHours(settings.hours);

        var mousedown = false;
        var deletionMode = false;

        let schedule = this;

        function getSelectedHour() {
            let dayContainer = $('.day');
            let output = {};
            for (let i = 0; i < dayContainer.length; i++) {
                let children = $(dayContainer[i]).children();

                let hoursSelected = [];
                for (let j = 0; j < children.length; j++) {
                    if ($(children[j]).hasClass('selected')) {
                        hoursSelected.push(children[j]);
                    }
                }
                output[i] = hoursSelected;
            }
            return output;
        }

        if (typeof callerSettings == 'string') {
            switch (callerSettings) {
                case 'getSelectedHour':
                    return getSelectedHour();
                    break;
                default:
                    throw 'Weekly schedule method unrecognized!'
            }
        }
        // options is an object, initialize!
        else {
            let days = settings.days; // option
            let hours = settings.hoursParsed; // option

            $(schedule).addClass('schedule');

            /*
             * Generate Necessary DOMs
             */

            // Create Header
            let dayHeaderContainer = $('<div></div>', {
                class: "header"
            });

            let align_block = $('<div></div>', {
                class: "align-block"
            });

            dayHeaderContainer.append(align_block);

            // Insert header items
            for (let i = 0; i < days.length; ++i) {
                let day_header = $('<div></div>', {
                    class: "header-item " + days[i] + "-header"
                });
                let header_title = $('<h3>' + capitalize(days[i]) + '</h3>')

                day_header.append(header_title);
                dayHeaderContainer.append(day_header);
            }


            let days_wrapper = $('<div></div>', {
                class: 'days-wrapper'
            });

            let hourHeaderContainer = $('<div></div>', {
                class: 'hour-header'
            });

            days_wrapper.append(hourHeaderContainer);

            for (let i = 0; i < hours.length; i++) {
                let hour_header_item = $('<div></div>', {
                    class: 'hour-header-item ' + hours[i]
                });

                let header_title = $('<h5>' + hours[i] +'</h5>');

                hour_header_item.append(header_title);
                hourHeaderContainer.append(hour_header_item);
            }



            for(let i = 0; i < days.length; i++) {
                let day = $('<div></div>', {
                    class: "day " + days[i]
                });

                for(let j = 0; j < hours.length; j++) {
                    let hour = $('<div></div>', {
                        class: "hour " + hours[j]
                    });

                    day.append(hour);
                }

                days_wrapper.append(day);
            }

            /*
             * Inject objects
             */

            $(schedule).append(dayHeaderContainer);
            $(schedule).append(days_wrapper);


            /*
             *  Style Everything
             */
            $('.schedule').css({
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start"
            });

            $('.header').css({
                height: "30px",
                width: "100%",
                background: settings.headerBackgroundColor,
                marginBottom: "5px",
                display: "flex",
                flexDirection: "row"
            });
            $('.align-block').css({
                width: "100%",
                height: "100%",
                background: settings.headerBackgroundColor,
                margin: "3px"
            });

            // Style Header Items
            $('.header-item').css({
                width: '100%',
                height: '100%',
                margin: '2px' // option
            });
            $('.header-item h3').css({
                margin: 0,
                textAlign: 'center',
                verticalAlign: 'middle',
                position: "relative",
                top: "50%",
                color: settings.fontColor,
                fontFamily: settings.fontFamily,
                fontSize: settings.fontSize,
                fontWeight: settings.fontWeight,
                transform: "translateY(-50%)",
                userSelect: "none"
            });

            $('.hour-header').css({
                display: 'flex',
                flexDirection: 'column',
                margin: '2px', // option
                marginRight: '1px',
                background: settings.headerBackgroundColor,
                width: '100%'
            });

            $('.days-wrapper').css({
                width: "100%",
                height: "100%",
                background: "transparent", //option
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                position: "relative"
            });

            $('.hour-header-item').css({
                width: "100%",
                height: "100%",
                border: "none", // option
                borderColor: "none", // option
                borderStyle: "none" // option
            });
            $('.hour-header-item h5').css({
                color: settings.fontColor,
                margin: "0", // option
                textAlign: "right",
                verticalAlign: "middle",
                position: "relative",
                fontFamily: settings.fontFamily,
                fontSize: settings.fontSize,
                fontWeight: settings.fontWeight,
                paddingRight: "10%",
                userSelect: "none"
            });

            $('.day').css({
                display: "flex",
                flexDirection: "column",
                marginRight: "1px", // option
                marginBottom: "1px",
                background: "transparent", // option
                width: "100%"
            });
            $('.hour').css({
                background: "#dddddd", // option
                marginBottom: "1px", // option
                width: "100%",
                height: "100%",
                userSelect: "none"
            });

            /*
             * Hook eventlisteners
             */

            $("<style type='text/css' scoped> .hover { background: "
                + settings.hoverColor +
                " !important;} .selected { background: "
                + settings.selectionColor +
                " !important; } .disabled { pointer-events: none !important; opacity: 0.3 !important; box-shadow: none !important; }</style>")
                .appendTo(schedule);

            // Prevent Right Click
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
                    schedule.trigger('selectionremoved')
                    $(this).removeClass('selected');
                    deletionMode = true;
                }
                else {
                    schedule.trigger('selectionmade')
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

        }

        function parseHours(string) {
            let output = [];

            let split = string.toUpperCase().split("-");
            let startInt = parseInt(split[0].split(":")[0]);
            let endInt = parseInt(split[1].split(":")[0]);

            let startHour = split[0].includes("PM") ? startInt + 12 : startInt;
            let endHour = split[1].includes("PM") ? endInt + 12 : endInt;

            let curHour = startHour;

            for (curHour; curHour <= endHour; curHour++) {
                let parsedStr = "";

                if (curHour > 12) {
                    parsedStr += (curHour-12).toString() + ":00PM";
                }
                else if (curHour == 12) {
                    parsedStr += curHour.toString() + ":00PM";
                }
                else {
                    parsedStr += curHour.toString() + ":00AM";
                }

                output.push(parsedStr);
            }

            return output;
        }

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
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

    };
}(jQuery));
