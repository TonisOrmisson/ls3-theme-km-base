// disable arrow keys changing radio selection
$('input[type="radio"]').keydown(function(e)
{
    var arrowKeys = [37, 38, 39, 40];
    if (arrowKeys.indexOf(e.which) !== -1) {
        $(this).blur();
        console.log(e);
        return false;
    }
});

function togglesDiv(divsId){
    var catdiv = document.getElementById(divsId);
    if(catdiv.style.display === ""){
        catdiv.style.display = "none";
    } else {
        catdiv.style.display = "";
    }
}


function maxDiff(qID, randomize) {

    // Identify some elements
    var thisQuestion = $('#question'+qID);
    var thisTable = $('table.subquestion-list:eq(0)', thisQuestion);

    // Assign a new question class
    $(thisQuestion).addClass('max-diff-array');

    // Move the columns
    $('thead tr:eq(0)', thisTable).prepend($('thead tr:eq(0) th:eq(1)', thisTable));
    $('tr.answers-list', thisTable).each(function(i){
        $('td.answer-item:eq(0)', this).prependTo(this);
    });

    // Random rows
    if(randomize) {
        var rowsArr = [];
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
    $('input.radio', thisQuestion).on('click', function () {

        $('input.radio', thisQuestion).prop('disabled', false);
        $('input.radio:checked', thisQuestion).each(function(i) {
            var thisRow = $(this).closest('tr.answers-list');
            $('input.radio', thisRow).not(this).prop('disabled', true);
        });
    });

    // Fix up the row classes
    var rowClass = 1;
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

