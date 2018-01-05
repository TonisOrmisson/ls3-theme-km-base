

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
    $( ".ls-question-mandatory" ).each(function( i, obj ) {
        $( this )
            .closest(".question-container")
            .addClass("question-hilight");
    });

};

