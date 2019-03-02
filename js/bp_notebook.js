var editId;

var API_URL = {

    LOGIN: 'http://localhost:8031/login',
    LOAD_BP: 'http://localhost:8031/bloodPressureForUser/',
    CREATE_BP: 'http://localhost:8031/saveBloodPressureForUserName/',
    UPDATE_BP: 'http://localhost:8031/updateBloodPressure/',
    DELETE: 'http://localhost:8031/deleteBloodPressure/'
};
window.BP_Notebook = {

    loggedUser: null, //set the loggedUser (userName)
    editBPId: null, // if null -> POST else -> PUT (needed for edid function )

    logOut: function(event){
    //perform log out (the page is reloaded and the login modal is displayed)
         $(".showOnLogged").hide();
         //refresh
         location.reload();;
    },

    login: function(event) {
    //perform the login
    //get user name and password values from inputs
     var username = $(event.target).parents("#modalLoginContent").find('input[name="username"]').val(),
         pass = $(event.target).parents("#modalLoginContent").find('input[name="password"]').val();

     $.ajax({
            //set the URL and method for login
            url: API_URL.LOGIN,
            method: "GET",
            //set the @RequestParam for needed for the loginController
            data: jQuery.param({ userName: username, userPass : pass}) ,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

        }).done(function (response) {
            //print the response from java inn console for debugging purposes only
            console.log("response from java", response);
           // debugger; // if not commented - add a debugger point
            if (response) {
                //if response is true:
                //hide the login modal
                $("#myModal").hide();
                //add "loggedIn" class to page body
                $("body").addClass("loggedIn");
                //save the userName value in loggedUser - need it for other functions
                window.BP_Notebook.loggedUser = username;
               //load the table page
                window.BP_Notebook.load();
            }
            else {
                   // show user incorrect
                   // hide "Insert username and password" text
                   $("#userForm").hide();
                   //display "Username and Password don't match / User does not exist" text
                   $("#userIncorrect").css({"display":"block","color":"red"});
                   //clear the inputs
                   $(".form-control[name='username']").val('');
                   $(".form-control[name='password']").val('');
            }

        }).fail(function(response) {
            console.log(response);
                   // show database connection not working
                   $("#userForm").hide();
                   $("#dbNotWorking").css({"display":"block","color":"red"});
                   //clear the inputs
                   $(".form-control[name='username']").val('');
                   $(".form-control[name='password']").val('');
        });
        console.log("userName and password match");
        event.preventDefault();
        return false;
    },


    load: function () {
    //load the table
        $.ajax({
            url: API_URL.LOAD_BP + window.BP_Notebook.loggedUser,
            method: "GET"
        }).done(function (responseBP) {
            BP_Notebook.display(responseBP);
        });
    },


 getRow: function(listItem) {
 //set the row values for each column
        // ES6 string template
        return `<tr>
            //format the date to Local Date format
            <td>${new Date(listItem.dateBP).toLocaleDateString("en-US", { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
            <td>${listItem.systolicBP}</td>
            <td>${listItem.diastolicBP}</td>
            <td>${listItem.pulseBP}</td>
            <td>${listItem.notesBP}</td>
            <td><a data-id="${listItem.idBP}" class="edit">
                   <img src="img/edit1.png" alt="Edit" title="Edit">
               </a>
               <a data-id="${listItem.idBP}" class="delete">
                    <img src="img/delete1.png" alt="Delete" title="Delete">
               </a>
            </td>
        </tr>`;
    },
    getActionRow: function() {
    //set the input row
        // ES5 string concatenation
        return '<tr>' +
            //set the date column to shoe a date-piker: type="datetime-local"
            '<td><input type="datetime-local" required name="bpDate" placeholder="Enter date"></td>' +
            '<td><input type="text" required name="systolic" placeholder="Enter systolic value"></td>' +
            '<td><input type="text" required name="diastolic" placeholder="Enter diastolic value"></td>' +
            '<td><input type="text" required name="pulse" placeholder="Enter pulse value"></td>' +
            '<td><input type="text" name="notes" placeholder="Enter notes"></td>' +
            '<td><button class = "saveButton" type="submit" title="Save"></button></td>' +
            '<td><button class = "cancelButton" type="submit" title="Cancel" onclick="BP_Notebook.cancelEdit(this)"></button></td>' +
            '</tr>';
    },

    delete: function(idToDelete) {
    //delete a row
        $.ajax({
            url: API_URL.DELETE + idToDelete,
            method: "DELETE",
            crossOrigin: true,
            data: {
            //set the @PathVariable for the controller
                id: idToDelete
            }
        }).done(function (response) {
            if (response) {
                //after delete is performed in db ,reload the table
                BP_Notebook.load();
            }
        });
    },

    add: function addBP(bpToSave) {
    //save/add a blood pressure in db
        console.log(bpToSave); //print the bp values
        $.ajax({
            url: API_URL.CREATE_BP,
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            //set the jason needed for the controller
            data: JSON.stringify(bpToSave)
        }).done(function (response) {
             console.log("response save: "+response);
            if (response) {
             //after save is performed in db ,reload the table
                BP_Notebook.load();
            }
        });
    },

    update: function(id, bpToSave) {
    //update a blood pressure
        console.log(id); //print the bp id
        $.ajax({
            url: API_URL.UPDATE_BP+id,
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            //set the jason needed for the controller
            data: JSON.stringify(bpToSave)
        }).done(function (response) {
            if (response) {
               //after update is performed in db ,reload the table
                BP_Notebook.load();
            }
        });
    },
    edit: function (id) {
       //edit an existing blood pressure
       // ES5 function systax inside find
       //set the editBPId - is needed for the save button , to check if update or add function will be performed
       editBPId = id;
       console.log( window.list);
       //get the values for the bp to edit from the bp list
       var editBP = window.list.find(function (oneBP) {
                console.log("edit "+id);
                //return the bp with the matching id
                return oneBP.idBP == id;
            });
       console.warn('edit', editBP);
       //set the inputs with the values needed to be edited
       $('input[name=bpDate]').val(new Date(editBP.dateBP).toISOString().slice(0,19)),
       $('input[name=systolic]').val(editBP.systolicBP),
       $('input[name=diastolic]').val(editBP.diastolicBP),
       $('input[name=pulse]').val(editBP.pulseBP),
       $('input[name=notes]').val(editBP.notesBP)
    },

    bindEvents: function() {
        $('#bpTable tbody').delegate('a.edit', 'click', function () {
          //when edit button is clicked , get the bp id and perform edit function
            var id = $(this).data('id');
            console.info('click on ', this, id);
            BP_Notebook.edit(id);
        });

        $('#bpTable tbody').delegate('a.delete', 'click', function () {
            //when delete button is clicked , get the bp id and perform delete function
            var id = $(this).data('id');
            console.info('click on ', this, id);
            BP_Notebook.delete(id);
        });

        $( ".add-form" ).submit(function() {
        //when save button is clicked
            //print the date
            console.log(new Date(new Date($('input[name=bpDate]').val()).toISOString()));
            //set the values to be saved
            const bpToSave = {
                //format the date to "yyyy-MM-dd’T’HH:mm:ss.SSSZ" format
                dateBP: new Date(new Date($('input[name=bpDate]').val()).toISOString()),
                systolicBP: $('input[name=systolic]').val(),
                diastolicBP: $('input[name=diastolic]').val(),
                pulseBP: $('input[name=pulse]').val(),
                notesBP: $('input[name=notes]').val(),
                //set the username for bp from the logged user
                userName: window.BP_Notebook.loggedUser,

            };
            //check which is needed to be performed to add a bp to the list
            if (window.editBPId == null){
            //perform add function - for save
            BP_Notebook.add(bpToSave);
            }else {
            //perform update function - for edit
            BP_Notebook.update(editBPId,bpToSave);
            }
        });
    },


    cancelEdit: function(button) {
        //clear the inputs
        $( ".add-form" ).get(0).reset();
        //in case a edit is canceled set the editBPId back to null
        window.editBPId = null;
    },

    display: function(list) {
    //display the table for blood pressures
        window.list = list; //create a variable list with all the blood pressures
        var rows = '';

        // ES6 function systax inside forEach
        //create the table rows
        list.forEach(listItem => rows += BP_Notebook.getRow(listItem));
        //add the row with the inputs for save and edit
        rows += BP_Notebook.getActionRow();
        $('#bpTable tbody').html(rows);
    }
};
BP_Notebook.bindEvents();