// Userlist data array for filling in info box
var cardListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    populateCardTable();

    // Add User button click
    $('#btnAddCard').on('click', addCard);

    $('#cardList table tbody').on('click', 'td a.linkshowcard', showCardInfo);

     // Delete User link click
    $('#cardList table tbody').on('click', 'td a.linkdeletecard', deleteCard);

});

// Functions =============================================================

// Fill table with data
function populateCardTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/cards/list', function( data ) {
        debugger;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowcard" rel="' + this._id + '">' + this.title + '</a></td>';
            tableContent += '<td>' + this.description + '</td>';
            tableContent += '<td><a href="#" class="linkdeletecard" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });
        cardListData = data;
        // Inject the whole content string into our existing HTML table
        $('#cardList table tbody').html(tableContent);
    });

    $.getJSON( '/cardtype/list', function( data ) {
        $('#cardtype').html('');
        $('#cardtype').append($("<option />").val("").text(""));
        $.each(data, function(){
            $('#cardtype').append($("<option />").val(this._id).text(this.name));
        });
    });
};


// Show User Info
function showCardInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisCardId = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = cardListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisCardId);

    // Get our User Object
    var thisCardObject = cardListData[arrayPosition];

    //Populate Info Box
    $('#cardInfoTitle').text(thisCardObject.description);
    $('#cardInfoDescription').text(thisCardObject.description);
    $('#cardInfoCardType').text(thisCardObject.cardtype.name);
    $('#cardInfoWeek').text(thisCardObject.week);
    $('#cardInfoDay').text(thisCardObject.day);

};

// Add User
function addCard(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addCard input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
        // If it is, compile all user info into one object
        var newCard = {
            'title': $('#addCard fieldset input#inputCardTitle').val(),
            'description': $('#addCard fieldset input#inputCardDescription').val(),
            'week': $('#addCard fieldset input#inputCardWeek').val(),
            'day': $('#addCard fieldset input#inputCardDay').val(),
            'cardtype': {'_id':$("#cardtype").val(),'name':$("#cardtype option:selected").text()}
        }
        debugger;
        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: JSON.stringify(newCard),
            contentType: 'application/json',
            url: '/cards/add',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addCard fieldset input').val('');

                // Update the table
                populateCardTable();

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

// Delete User
function deleteCard(event) {
    debugger;
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/cards/delete/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateCardTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

