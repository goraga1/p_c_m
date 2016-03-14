// Userlist data array for filling in info box
var questionsData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    populateQuestionTable();

    // Add User button click
    $('#btnAddQuestion').on('click', addQuestion);

    // $('#cardList table tbody').on('click', 'td a.linkshowcard', showCardInfo);

    //  // Delete User link click
    // $('#cardList table tbody').on('click', 'td a.linkdeletecard', deleteCard);

});

// Functions =============================================================

// Fill table with data
function populateQuestionTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/questions/list', function( data ) {
        debugger;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowcard" rel="' + this._id + '">' + this.question + '</a></td>';
            tableContent += '<td>' + this.description + '</td>';
            tableContent += '<td><a href="#" class="linkdeletecard" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });
        questionsData = data;
        // Inject the whole content string into our existing HTML table
        $('#questionList table tbody').html(tableContent);
    });

    $.getJSON( '/users/list', function( data ) {
        $('#user').html('');
        $('#user').append($("<option />").val("").text(""));
        $.each(data, function(){
            $('#user').append($("<option />").val(this._id).text(this.firstname + " " + this.lastname));
        });
    });

    $.getJSON( '/languages/list', function( data ) {
        $('#language').html('');
        $('#language').append($("<option />").val("").text(""));
        $.each(data, function(){
            $('#language').append($("<option />").val(this._id).text(this.name));
        });
    });
};


// Add User
function addQuestion(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addQuestion input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
        // If it is, compile all user info into one object
        var newCard = {
            'question': $('#addQuestion fieldset input#inputQuestion').val(),
            'user': {'_id':$("#user").val(),'name':$("#user option:selected").text() },
            'language': {'_id':$("#language").val(),'name':$("#language option:selected").text() }
        }
        debugger;
        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: JSON.stringify(newCard),
            contentType: 'application/json',
            url: '/questions/add',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addQuestion fieldset input').val('');

                // Update the table
                populateQuestionTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};


