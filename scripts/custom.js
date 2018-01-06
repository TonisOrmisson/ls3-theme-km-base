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