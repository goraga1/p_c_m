// Userlist data array for filling in info box
var userListData = [];
var cardListData = [];
var cardTypeListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);


    populateCardTypeTable();

    // Add User button click
    $('#btnAddCardType').on('click', addCardType);

     // Delete User link click
    $('#cardTypeList table tbody').on('click', 'td a.linkdeletecardtype', deleteCardType);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/list', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.email + '">' + this.firstname + " " + this.lastname + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });
        userListData = data;
        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Fill table with data
function populateCardTypeTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/cardtype/list', function( data ) {
        debugger;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowcardtype" rel="' + this._id + '">' + this.name + '</a></td>';
            tableContent += '<td><a href="#" class="linkdeletecardtype" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });
        cardTypeListData = data;
        // Inject the whole content string into our existing HTML table
        $('#cardTypeList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserEmail = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.email; }).indexOf(thisUserEmail);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.firstname + " " + thisUserObject.lastname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'password': $('#addUser fieldset input#inputUserPassword').val(),
            'lastname': $('#addUser fieldset input#inputUserFirstName').val(),
            'firstname': $('#addUser fieldset input#inputUserLastName').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/add',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

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
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/delete/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

// Add User
function addCardType(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addCardType input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newCard = {
            'name': $('#addCardType fieldset input#inputCardTypeName').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newCard,
            url: '/cardtype/add',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addCard fieldset input').val('');

                // Update the table
                populateCardTypeTable();

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
function deleteCardType(event) {
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/cardtype/delete/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateCardTypeTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};
