

$(document).on('ready pjax:scriptcomplete',function(){
    /**
     * Code included inside this will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
     * @see https://learn.jquery.com/using-jquery-core/document-ready/
     */
});

// disable arrow keys changing radio selection
$('input[type="radio"]').keydown(function(e)
{
    let arrowKeys = [37, 38, 39, 40];
    if (arrowKeys.indexOf(e.which) !== -1) {
        $(this).blur();
        console.log(e);
        return false;
    }
});

// disable submit button after being clicked once to avoid multiple submissions
$("#ls-button-submit").on('click', function (event) {
    event.preventDefault();
    let button = $(this);
    button.prop('disabled', true);
});

function togglesDiv(divsId){
    let catdiv = document.getElementById(divsId);
    if(catdiv.style.display === ""){
        catdiv.style.display = "none";
    } else {
        catdiv.style.display = "";
    }
}


function maxDiff(qID, randomize) {

    // Identify some elements
    let thisQuestion = $('#question' + qID);
    let thisTable = $('table.subquestion-list:eq(0)', thisQuestion);

    // Assign a new question class
    $(thisQuestion).addClass('max-diff-array');

    // Move the columns
    $('thead tr:eq(0)', thisTable).prepend($('thead tr:eq(0) th:eq(1)', thisTable));
    $('tr.answers-list', thisTable).each(function(i){
        $('td.answer-item:eq(0)', this).prependTo(this);
    });

    // Random rows
    if(randomize) {
        let rowsArr = [];
        $('tr.answers-list', thisTable).each(function(i){
            $(this).attr('data-index', i);
            rowsArr.push(i);
        });
        shuffleArray(rowsArr);
        $(rowsArr).each(function(i){
            $('tbody', thisTable).append($('tr[data-index="'+this+'"]', thisTable));
        });
    }

    // Prevent clicking twice in the same row
    $('.answer-item', thisQuestion).on('click', function (i) {

        // allow all clicks
        $('.answer-item', thisQuestion).each(function (){
            $(this).css('pointer-events', 'auto');
        });

        $('input:radio:checked', thisQuestion).each(function(i) {
            let thisRow = $(this).closest('tr.answers-list');
            let radio = $('input:radio', thisRow).not(this);
            let thisRowLabel = radio.next('label');

            // disallow clicking on the same row other end
            radio.closest('.answer-item').css('pointer-events', 'none');
            thisRowLabel.css('pointer-events', 'none');

        });
    });

    // Fix up the row classes
    $('tr.answers-list', thisTable).each(function(i) {
        $(this).addClass('array'+(2-(i%2)));
    });
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

