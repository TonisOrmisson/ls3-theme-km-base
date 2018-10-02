
//Check if we have to work on IE10 *sigh*
var isIE10 = false;
/*@cc_on
    if (/^10/.test(@_jscript_version)) {
        isIE10 = true;
    }
@*/
console.ls.log("isIE10: ", isIE10);

// Submit the form with Ajax
var AjaxSubmitObject = function () {
    var activeSubmit = false;
    // First we get the value of the button clicked  (movenext, submit, prev, etc)
    var move = '';

    var startLoadingBar = function () {
        $('#ajax-loading').show();
    };


    var endLoadingBar = function () {
        $('#ajax-loading').hide();
    };


    var checkScriptNotLoaded = function (scriptNode) {
        if (scriptNode.src) {
            return ($('head').find('script[src="' + scriptNode.src + '"]').length > 0);
        }
        return true;
    };

    var bindActions = function () {
        var logFunction = new ConsoleShim('PJAX-LOG', (LSvar.debugMode < 1));

        var pjaxErrorHandler = function (href, options, requestData) {
            logFunction.log('requestData', requestData);
            if (requestData.status >= 500) {
                document.getElementsByTagName('html')[0].innerHTML = requestData.responseText;
                throw new Error(JSON.stringify({
                    state: requestData.status,
                    message: 'Error in PHP!',
                    data: requestData
                }));
            }

            if (requestData.status >= 404) {
                window.location.href = href;
                return false;
            }
            if (requestData.status >= 300 || requestData.status == 0) {
                logFunction.log('responseURL', requestData.responseURL);
                var responseHeaders = requestData.getAllResponseHeaders().trim().split(/[\r\n]+/);
                var headerMap = {};
                responseHeaders.forEach(function (line) {
                    var parts = line.split(': ');
                    var header = parts.shift();
                    var value = parts.join(': ');
                    headerMap[header.toLowerCase()] = value;
                });
                window.location = headerMap['x-redirect'] || headerMap.location || href;
                return false;
            }
        };

        var globalPjax = new Pjax({
            elements: ['form#limesurvey'], // default is "a[href], form[action]"
            selectors: ['#dynamicReloadContainer', '#beginScripts', '#bottomScripts'],
            debug: true,
            forceRedirectOnFail: true,
            pjaxErrorHandler: pjaxErrorHandler,
            reRenderCSS: true,
            logObject: logFunction,
            scriptloadtimeout: 1500,
        });
        // Always bind to document to not need to bind again
        // Restrict to [type=submit]:not([data-confirmedby])
        // - :submit is the default if button don't have type (reset button on slider for example),
        // - confirmedby have their own javascript system
        $(document).on('click', '#ls-button-submit, #ls-button-previous', function (e) {
            $('#limesurvey').append('<input id="onsubmitbuttoninput" name=\'' + $(this).attr('name') + '\' value=\'' + $(this).attr('value') + '\' type=\'hidden\' />');
            if (isIE10 || /Edge\/\d+\.\d+/.test(navigator.userAgent)) {
                e.preventDefault();
                $('#limesurvey').trigger('submit');
                return false;
            }
        });

        // If the user try to submit the form
        // Always bind to document to not need to bind again
        $(document).on('submit', '#limesurvey', function (e) {
            // Prevent multiposting
            //Check if there is an active submit
            //If there is -> return immediately
            if (activeSubmit) return;
            //block further submissions
            activeSubmit = true;
            if ($('#onsubmitbuttoninput').length == 0) {
                $('#limesurvey').append('<input id="onsubmitbuttoninput" name=\'' + $('#limesurvey [type=submit]:not([data-confirmedby])').attr('name') + '\' value=\'' + $('#limesurvey [type=submit]:not([data-confirmedby])').attr('value') + '\' type=\'hidden\' />');
            }
            //start the loading animation
            startLoadingBar();

            $(document).on('pjax:scriptcomplete.onreload', function () {
                // We end the loading animation
                endLoadingBar();
                hilightQuestionErrors();

                //free submitting again
                activeSubmit = false;
                if (/<###begin###>/.test($('#beginScripts').text())) {
                    $('#beginScripts').text('');
                }
                if (/<###end###>/.test($('#bottomScripts').text())) {
                    $('#bottomScripts').text('');
                }

                $(document).off('pjax:scriptcomplete.onreload');
            });

        });
        return globalPjax;
    };

    return {
        bindActions: bindActions,
        startLoadingBar: startLoadingBar,
        endLoadingBar: endLoadingBar,
        unsetSubmit: function () {
            activeSubmit = false;
        },
        blockSubmit: function () {
            activeSubmit = true;
        }
    };
};

// check and hilight all unanswered questions
function hilightQuestionErrors() {
    var hasErrors = false;
    var firstErrorQuestionContainer;

    $( ".ls-question-mandatory" ).each(function( i, obj ) {
        if(i === 0){
            hasErrors = true;
            firstErrorQuestionContainer = $(this).closest(".question-container");
        }
        $( this )
            .closest(".question-container")
            .addClass("question-hilight");
    });

    if(hasErrors){
        var navHeight = $('.navbar').outerHeight();
        var errorMessages = $('.ls-questions-have-errors');
        var errorMessagesHeight = errorMessages.outerHeight();
        errorMessages.insertBefore(firstErrorQuestionContainer);
        console.log(firstErrorQuestionContainer);
        console.log(firstErrorQuestionContainer.offset().top -(navHeight * 2) - errorMessagesHeight);

        // scroll to first error question
        $('html, body').animate({
            scrollTop: firstErrorQuestionContainer.offset().top -(navHeight * 2) - errorMessagesHeight
        }, 1);
    }

};
