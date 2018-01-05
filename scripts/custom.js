
var globalI = 0;
// check for unanswered mandatory on any page load
$( document ).ready(function() {
    hilightQuestionErrors();
});
// check for unanswered mandatory on any ajax request
$(document).on("ready pjax:scriptcomplete", function(){
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
        console.log(navHeight);
        console.log(firstErrorQuestionContainer.offset().top),


        $('html, body').animate({
            scrollTop: firstErrorQuestionContainer.offset().top - navHeight
        }, 50);
    }

};



