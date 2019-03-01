var editId;

// TODO edit API url's
var API_URL = {

    LOGIN: 'http://localhost:8031/login',
    LOAD_BP: 'http://localhost:8031/bloodPressureForUser/',
    CREATE_BP: 'http://localhost:8031/saveBloodPressure/',
    UPDATE_BP: 'http://localhost:8031/updateBloodPressure/',


    READ: 'http://localhost:8011/agenda/14',
    UPDATE: 'http://localhost:8011/agenda/14/contact/',
    DELETE: 'http://localhost:8031/deleteBloodPressure/'
};
//window.PhoneBook.getRow({firstName:"ana"})
window.BP_Notebook = {
    loggedUser: null,
 logOut: function(event){
         $(".showOnLogged").hide();
         location.reload();;
 },
    login: function(event) {
    //for bp
     var username = $(event.target).parents("#modalLoginContent").find('input[name="username"]').val(),
         pass = $(event.target).parents("#modalLoginContent").find('input[name="password"]').val();


     $.ajax({
            url: API_URL.LOGIN,//"?username="+username+"&pass=password",
            method: "GET",
//            headers: {
//                "Content-Type": "application/json"
//            },
            data: jQuery.param({ userName: username, userPass : pass}) ,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

//            data: JSON.stringify(person, null, 2)
        }).done(function (response) {
            console.log("response-ul de la java", response);
            debugger;
            if (response) {
                $("#myModal").hide();
                $("body").addClass("loggedIn");
                window.BP_Notebook.loggedUser = username;
                window.BP_Notebook.load();
            }
            else {
                // show database connection not working
                   $("#userForm").hide();
                   $("#dbNotWorking").css({"display":"block","color":"red"});
                   $(".form-control[name='username']").val('');
                   $(".form-control[name='password']").val('');
            }

        }).fail(function(response) {
            console.log(response);
                // show user incorrect
                   $("#userForm").hide();
                   $("#userIncorrect").css({"display":"block","color":"red"});
                   $(".form-control[name='username']").val('');
                   $(".form-control[name='password']").val('');
        });
        console.log(username, pass);
        event.preventDefault();
        return false;
    },


    load: function () {
    //for bp
        $.ajax({
            url: API_URL.LOAD_BP + window.BP_Notebook.loggedUser,
            method: "GET"
        }).done(function (responseBP) {
            BP_Notebook.display(responseBP);
        });
    },




 getRow: function(listItem) {
 //for bp
        // ES6 string template

        return `<tr>
            <td>${listItem.dateBP}</td>
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
    //for bp
        // ES5 string concatenation
        return '<tr>' +
            '<td><input type="text" required name="bpDate" placeholder="Enter date"></td>' +
            '<td><input type="text" required name="systolic" placeholder="Enter systolic value"></td>' +
            '<td><input type="text" required name="diastolic" placeholder="Enter diastolic value"></td>' +
            '<td><input type="text" required name="pulse" placeholder="Enter pulse value"></td>' +
            '<td><input type="text" required name="notes" placeholder="Enter notes"></td>' +
            '<td><button type="submit">Save</button></td>' +
            '</tr>';
    },

    delete: function(id) {
    //for bp
        $.ajax({
            url: API_URL.DELETE + id,
            method: "DELETE",
            crossOrigin: true,
            data: {
                id: id
            }
        }).done(function (response) {
            if (response) {
                BP_Notebook.load();
            }
        });
    },

    add: function addBP(bpToSave) {
    // for bp
        console.log(bpToSave);
        $.ajax({
            url: API_URL.CREATE_BP,
            headers: {

                "Content-Type": "application/json"
            },
            method: "POST",
            ///????
            data: JSON.stringify(bpToSave)
        }).done(function (response) {
            if (response.success) {
                BP_Notebook.load();
            }
        });
    },

    edit: function(id) {
        console.log(id);
        $.ajax({
            url: API_URL.UPDATE_BP+id,
            method: "PUT",
            headers: {

                "Content-Type": "application/json"
            },
            //?????
            data: JSON.stringify(person, null, 2)
        }).done(function (response) {
            if (response.success) {
                editId = '';
                BP_Notebook.load();
            }
        });
    },

    bindEvents: function() {
        $('#bpTable tbody').delegate('a.edit', 'click', function () {
            var id = $(this).data('id');
            console.info('click on ', this, id);
            BP_Notebook.edit(id);
        });

        $('#bpTable tbody').delegate('a.delete', 'click', function () {
          //for bp
            debugger;
            var id = $(this).data('id');
            console.info('click on ', this, id);
            BP_Notebook.delete(id);
        });

        $( ".add-form" ).submit(function() {
        //for bp
            const bpToSave = {
                dateBP: $('input[name=bpDate]').val(),
                systolicBP: $('input[name=systolic]').val(),
                diastolicBP: $('input[name=diastolic]').val(),
                pulseBP: $('input[name=pulse]').val(),
                notesBP: $('input[name=notes]').val(),
                //???? loggedUser = username
                idUser: loggedUser,

            };

            //add a bp to the list
            BP_Notebook.add(bpToSave);
        });
    },

    edit: function (id) {
        // ES5 function systax inside find
        var editPerson = persons.find(function (person) {
            console.log(person.firstName);
            return person.id == id;
        });
        console.warn('edit', editPerson);

        if (editId) {
            const cancelBtn = `<button onclick="PhoneBook.cancelEdit(this)">Cancel</button>`;
            $('#phone-book tbody tr:last-child() td:last-child()').append(cancelBtn);
        }

        $('input[name=firstName]').val(editPerson.firstName);
        $('input[name=lastName]').val(editPerson.lastName);
        $('input[name=phone]').val(editPerson.phone);
        editId = id;
    },

    cancelEdit: function(button) {
        $( ".add-form" ).get(0).reset();
        editId = '';
        button.parentNode.removeChild(button);
    },

    display: function(list) {
    //for bp
        window.list = list;
        var rows = '';

        // ES6 function systax inside forEach
        list.forEach(listItem => rows += BP_Notebook.getRow(listItem));
        rows += BP_Notebook.getActionRow();
        $('#bpTable tbody').html(rows);
    }
};

var persons = [];
BP_Notebook.bindEvents();