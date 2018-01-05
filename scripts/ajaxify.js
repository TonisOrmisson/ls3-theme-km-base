
// Submit the form with Ajax
var AjaxSubmitObject = function () {
    var activeSubmit = false;
    // First we get the value of the button clicked  (movenext, submit, prev, etc)
    var move = "";



    var checkScriptNotLoaded = function(scriptNode){
        if(!!scriptNode.src){
            return ($('head').find('script[src="'+scriptNode.src+'"]').length > 0);
        }
        return true;
    }

    var appendScript = function(scriptText, scriptPosition, src){
        src = src || '';
        scriptPosition = scriptPosition || null;
        var scriptNode = document.createElement('script');
        scriptNode.type  = "text/javascript";
        if(src != false){
            scriptNode.src   = src;
        }
        scriptNode.text  = scriptText;
        scriptNode.attributes.class = "toRemoveOnAjax";
        switch(scriptPosition) {
            case "head": if(checkScriptNotLoaded(scriptNode)){ document.head.appendChild(scriptNode); } break;
            case "body": document.body.appendChild(scriptNode); break;
            case "beginScripts": document.getElementById('beginScripts').appendChild(scriptNode); break;
            case "bottomScripts": //fallthrough
            default: document.getElementById('bottomScripts').appendChild(scriptNode); break;

        }
    };

    var bindActions = function () {
        var globalPjax = new Pjax({
            elements: "#limesurvey", // default is "a[href], form[action]"
            selectors: ["#dynamicReloadContainer", "#beginScripts", "#bottomScripts"],
            debug: window.debugState.frontend,
            forceRedirectOnFail: true,
            reRenderCSS : true,
            logObject : console.ls ? (window.debugState.frontend ? console.ls : console.ls.silent) : console,
            scriptloadtimeout: 1500
        });
        // Always bind to document to not need to bind again
        $(document).on("click", ".ls-move-btn",function () {
            startLoadingBar();
            $("#limesurvey").append("<input name='"+$(this).attr("name")+"' value='"+$(this).attr("value")+"' type='hidden' />");
        });



        // If the user try to submit the form
        // Always bind to document to not need to bind again
        $(document).on("submit", "#limesurvey", function (e) {

            // Prevent multiposting
            //Check if there is an active submit
            //If there is -> return immediately
            if(activeSubmit) return;
            //block further submissions
            activeSubmit = true;

            // check for unanswered mandatory on any ajax request
            $(document).on('pjax:success', function(){
                // hilight the errors
                hilightQuestionErrors();
            });

            $(document).on('pjax:scriptcomplete.onreload', function(){
                // We end the loading animation
                endLoadingBar();
                //free submitting again
                activeSubmit = false;
                if (/<###begin###>/.test($('#beginScripts').text())) {
                    $('#beginScripts').text("");
                }
                if (/<###end###>/.test($('#bottomScripts').text())){
                    $('#bottomScripts').text("");
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
        unsetSubmit: function(){activeSubmit = false;},
        blockSubmit: function(){activeSubmit = true;}
    }
}


// check for unanswered mandatory on any page load
$( document ).ready(function() {
    hilightQuestionErrors();
});





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
        }, 0);
    }

};

var startLoadingBar = function () {
    $('#ajax-loading').show();
};


var endLoadingBar = function () {
    $('#ajax-loading').hide();
};




