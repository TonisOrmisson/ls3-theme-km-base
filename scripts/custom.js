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
