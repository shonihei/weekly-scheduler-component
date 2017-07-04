(function($) {
    $.fn.weekly_schedule = function(callerSettings) {

        var settings = $.extend({
            days: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"], // Days displayed
            hours: "7:00AM-10:00PM", // Hours displyed
            fontFamily: "Montserrat", // Font used in the component
            fontColor: "black", // Font colot used in the component
            fontWeight: "100", // Font weight used in the component
            fontSize: "0.8em", // Font size used in the component
            hoverColor: "#727bad", // Background color when hovered
            selectionColor: "#9aa7ee", // Background color when selected
            headerBackgroundColor: "transparent", // Background color of headers
            triggerMethod: "click-and-drag", // Default selection method
            onSelected: function(){}, // handler called after selection
            onRemoved: function(){} // handler called after removal
        }, callerSettings||{});

        var parsed = parseHours(settings.hours);
        settings.hoursParsed = parsed.str;
        settings.hoursDetail = parsed.det;

        var mousedown = false;
        var devarionMode = false;

        var schedule = this;

        function getSelectedHour() {
            var dayContainer = $('.day');
            var output = {};
            for (var i = 0; i < dayContainer.length; i++) {
                var children = $(dayContainer[i]).children();

                var hoursSelected = [];
                for (var j = 0; j < children.length; j++) {
                    if ($(children[j]).hasClass('selected')) {
                        hoursSelected.push(children[j]);
                    }
                }
                output[i] = hoursSelected;
            }
            return output;
        }

        function dump() {
            var dayContainer = $('.day');
            var output = "";
            for (var i = 0; i < dayContainer.length; i++) {
                var curDay = $(dayContainer[i]).data('day');
                var hoursContainer = $(dayContainer[i]).children();
                var on = false;

                var selected = [];
                for (var j = 0; j < hoursContainer.length; j++) {
                    var cur = $(hoursContainer[j]);
                    var curSelected = $(cur).hasClass('selected');
                    var next = $(cur).next();
                    var nextSelected = $(next).hasClass('selected');

                    if (next.length == 0 && curSelected) {
                        on = false;
                        selected.push($(cur));
                        output += curDay + " " +
                                  $(selected[0]).data('start') + " start, " + curDay +
                                  " " +$(selected[selected.length - 1]).data('end')
                                  + " end, ";
                        selected = [];
                    }
                    else if (!on && curSelected) {
                        on = true;
                        selected.push($(cur));
                    } else if (on && curSelected) {
                        selected.push($(cur));
                    } else if (on && !curSelected) {
                        on = false;
                        output += curDay + " " +
                                  $(selected[0]).data('start') + " start, " + curDay +
                                  " " +$(selected[selected.length - 1]).data('end')
                                  + " end, ";
                        selected = [];
                    }
                }

            }
            return output;
        }

        if (typeof callerSettings == 'string') {
            switch (callerSettings) {
                case 'getSelectedHour':
                    return getSelectedHour();
                    break;
                case 'dump':
                    return dump();
                    break;
                default:
                    throw 'Weekly schedule method unrecognized!'
            }
        }
        // options is an object, initialize!
        else {
            var days = settings.days; // option
            var hours = settings.hoursParsed; // option
            var det = settings.hoursDetail;
            var triggerMethod = settings.triggerMethod;

            $(schedule).addClass('schedule');

            /*
             * Generate Necessary DOMs
             */

            // Create Header
            var dayHeaderContainer = $('<div></div>', {
                class: "header"
            });

            var align_block = $('<div></div>', {
                class: "align-block"
            });

            dayHeaderContainer.append(align_block);

            // Insert header items
            for (var i = 0; i < days.length; ++i) {
                var day_header = $('<div></div>', {
                    class: "header-item " + days[i] + "-header"
                });
                var header_title = $('<h3>' + capitalize(days[i]) + '</h3>')

                day_header.append(header_title);
                dayHeaderContainer.append(day_header);
            }


            var days_wrapper = $('<div></div>', {
                class: 'days-wrapper'
            });

            var hourHeaderContainer = $('<div></div>', {
                class: 'hour-header'
            });

            days_wrapper.append(hourHeaderContainer);

            for (var i = 0; i < hours.length; i++) {
                var hour_header_item = $('<div></div>', {
                    class: 'hour-header-item ' + hours[i]
                });

                var header_title = $('<h5>' + hours[i] +'</h5>');

                hour_header_item.append(header_title);
                hourHeaderContainer.append(hour_header_item);
            }



            for(var i = 0; i < days.length; i++) {
                var day = $('<div></div>', {
                    class: "day " + days[i]
                });

                $(day).data("day", days[i]);

                for(var j = 0; j < hours.length; j++) {
                    var hour = $('<div></div>', {
                        class: "hour " + hours[j],
                    });

                    $(hour).data("start", det[j].start);
                    $(hour).data("end", det[j].end);

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
                height: "100%",
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

            switch (triggerMethod) {
                case "click-and-drag":
                    initClickAndDrag();
                    break;
                case "click-hover-and-click":
                    initClickHoverAndClick();
                    break;
                case "click-click":
                    initClickClick();
                    break;
                default:

            }
        }

        function initClickClick() {
            var selectionMode = false;
            var removalMode = false;
            var start;
            var end;
            var startDay;
            $('.hour').on('click', function() {
                if (selectionMode || removalMode) {
                    if ($(this).parent()[0] == startDay[0]) {

                        end = $(this);

                        var children = $(startDay).children();
                        var beginSelection = false;

                        var startVal1 = $(start).data("start");
                        var startVal2 = $(this).data("start");

                        if (startVal2 < startVal1) {
                            end = start;
                            start = $(this);
                        }

                        for (var i = 0; i < children.length; i++) {
                            if (children[i] == start[0]) {
                                beginSelection = true;
                            }
                            if (beginSelection) {
                                if (selectionMode) {
                                    $(children[i]).addClass('selected');
                                }
                                else if (removalMode) {
                                    $(children[i]).removeClass('selected');
                                }
                            }
                            if (children[i] == end[0]) {
                                beginSelection = false;
                            }
                            clearFocus();
                        }
                    }
                    start = null;
                    startDay = null;
                    selectionMode = false;
                    removalMode = false;
                }
                else {
                    focusOn($(this).parent(), false);
                    if ($(this).hasClass('selected')) {
                        selectionMode = false;
                        removalMode = true;
                        start = $(this);
                        startDay = $(this).parent();
                    }
                    else {
                        selectionMode = true;
                        removeClass = false;
                        start = $(this);
                        startDay = $(this).parent();
                    }
                }
            }).on('mouseenter', function() {
                $(this).addClass('hover');
            }).on('mouseleave', function() {
                $(this).removeClass('hover');
            });
        }

        function initClickHoverAndClick() {
            $('.hour').on('click', function() {
                if (!mousedown) {
                    mousedown = true;
                    focusOn($(this).parent(), true);
                    if ($(this).hasClass('selected')) {
                        schedule.trigger('selectionremoved')
                        $(this).removeClass('selected');
                        devarionMode = true;
                    }
                    else {
                        schedule.trigger('selectionmade')
                        $(this).addClass('selected');
                    }
                }
                else {
                    if (devarionMode) {
                        $(this).removeClass('selected');
                    }
                    else {
                        $(this).addClass('selected');
                    }

                    clearFocus();
                    mousedown = false;
                    devarionMode = false;
                }


                $(this).removeClass('hover');
            }).on('mouseenter', function() {
                if (!mousedown) {
                    $(this).addClass('hover');
                }
                else if (devarionMode) {
                    $(this).removeClass('selected');
                }
                else {
                    $(this).addClass('selected');
                }
            }).on('mouseleave', function() {
                $(this).removeClass('hover');
            });
        }

        function initClickAndDrag() {
            $('.hour').on('mouseenter', function() {
                if (!mousedown) {
                    $(this).addClass('hover');
                }
                else {
                    if (devarionMode) {
                        $(this).removeClass('selected');
                    }
                    else {
                        $(this).addClass('selected');
                    }
                }
            }).on('mousedown', function() {
                mousedown = true;
                focusOn($(this).parent(), true);

                if ($(this).hasClass('selected')) {
                    schedule.trigger('selectionremoved')
                    $(this).removeClass('selected');
                    devarionMode = true;
                }
                else {
                    schedule.trigger('selectionmade')
                    $(this).addClass('selected');
                }
                $(this).removeClass('hover');
            }).on('mouseup', function() {
                devarionMode = false;
                mousedown = false;
                clearFocus();
            }).on('mouseleave', function () {
                if (!mousedown) {
                    $(this).removeClass('hover');
                }
            });
        }

        function parseHours(string) {
            var output = [];
            var detail = [];

            var split = string.toUpperCase().split("-");
            var startInt = parseInt(split[0].split(":")[0]);
            var endInt = parseInt(split[1].split(":")[0]);

            var startHour = split[0].includes("PM") ? startInt + 12 : startInt;
            var endHour = split[1].includes("PM") ? endInt + 12 : endInt;

            var curHour = startHour;

            for (curHour; curHour <= endHour; curHour++) {
                var detailedData = {
                    start : curHour,
                    end : curHour + 1,
                };
                var parsedStr = "";

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
                detail.push(detailedData);
            }

            return {
                str: output,
                det: detail,
            };
        }

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function focusOn(day, autounfocus) {
            var targetDayClass = $(day).attr('class').split('\ ')[1];
            var dayContainer = $('.day');

            for (var i = 0; i < dayContainer.length; i++) {
                if ($(dayContainer[i]).hasClass(targetDayClass)) {
                    continue;
                }

                var hours = $(dayContainer[i]).children();
                for (var j = 0; j < hours.length; j++) {
                    $(hours[j]).addClass('disabled');
                }
            }
            if (autounfocus) {
                $(day).on('mouseleave', function() {
                    clearFocus();
                    mousedown = false;
                    devarionMode = false;
                });
            }
        }

        function clearFocus() {
            var dayContainer = $('.day');

            for (var i = 0; i < dayContainer.length; i++) {

                var hours = $(dayContainer[i]).children();
                for (var j = 0; j < hours.length; j++) {
                    $(hours[j]).removeClass('disabled');
                }
            }
        }

    };
}(jQuery));
