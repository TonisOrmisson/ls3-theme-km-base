
var globalI = 0;
// check for unanswered mandatory on any page load
$( document ).ready(function() {
    hilightQuestionErrors();
});
// check for unanswered mandatory on any ajax request
$(document).on('pjax:success', function(){
    // We end the loading animation
    endLoadingBar();
    // hilight the errors
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
        globalI +=1;

        $( this )
            .closest(".question-container")
            .addClass("question-hilight");
    });

    if(hasErrors){
        console.log(firstErrorQuestionContainer);
        var navHeight = $('.navbar').outerHeight();
        var errorMessages = $('.ls-questions-have-errors');

        var errorMessagesHeight = errorMessages.outerHeight();

        errorMessages.insertBefore(firstErrorQuestionContainer);

        console.log(navHeight);
        console.log(errorMessagesHeight);
        console.log(firstErrorQuestionContainer.offset().top);

        // scroll to first error question
        $('html, body').animate({
            scrollTop: firstErrorQuestionContainer.offset().top -(navHeight * 2) - errorMessagesHeight
        }, 50);
    }

};



