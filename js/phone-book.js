var editId;

// TODO edit API url's
var API_URL = {

    LOGIN: 'http://localhost:8031/login',
    LOAD_BP: 'http://localhost:8031/bloodPressureForUser/',
    READ: 'http://localhost:8011/agenda/14',
    UPDATE: 'http://localhost:8011/agenda/14/contact/',
    DELETE: 'http://localhost:8031/deleteBloodPressure/'
};
//window.PhoneBook.getRow({firstName:"ana"})
window.PhoneBook = {
    loggedUser: null,
    login: function(event) {
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
                window.PhoneBook.loggedUser = username;
                window.PhoneBook.load();
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
        console.log(username, pass, 1);
        event.preventDefault();
        return false;
    },


    load: function () {
        $.ajax({
            url: API_URL.LOAD_BP + window.PhoneBook.loggedUser,
            method: "GET"
        }).done(function (responseBP) {
            PhoneBook.display(responseBP);
        });
    },




 getRow: function(listItem) {
        // ES6 string template



        return `<tr>
            <td>${listItem.dateBP}</td>
            <td>${listItem.systolicBP}</td>
            <td>${listItem.diastolicBP}</td>
            <td>${listItem.pulseBP}</td>
            <td>${listItem.notesBP}</td>
            <td><a data-id="${listItem.idBP}" class="edit">
             <img src="img/edit1.png" alt="Edit" title="Edit">
             </a></td>
            <td><a data-id="${listItem.idBP}" class="delete">
            <img src="img/delete1.png" alt="Delete" title="Delete">
            </a></td>
        </tr>`;
    },
    getActionRow: function() {
        // ES5 string concatenation
        return '<tr>' +
            '<td><input type="text" required name="firstName" placeholder="Enter first name"></td>' +
            '<td><input type="text" name="lastName" placeholder="Enter last name"></td>' +
            '<td><input type="text" required name="phone" placeholder="Enter phone"></td>' +
            '<td><button type="submit">Save</button></td>' +
            '</tr>';



    },

    delete: function(id) {
        $.ajax({
            url: API_URL.DELETE + id,
            method: "DELETE",
            crossOrigin: true,
            data: {
                id: id
            }
        }).done(function (response) {
            if (response) {
                PhoneBook.load();
            }
        });
    },

    add: function gfd(person) {
        console.log(person);
        $.ajax({
            url: API_URL.CREATE,
            headers: {

                "Content-Type": "application/json"
            },
            method: "POST",
            data: JSON.stringify(person, null, 2)
        }).done(function (response) {
            if (response.success) {
                PhoneBook.load();
            }
        });
    },

    save: function(person) {
        console.log(person);
        $.ajax({
            url: API_URL.UPDATE+person.id,
            method: "PUT",
            headers: {

                "Content-Type": "application/json"
            },
            data: JSON.stringify(person, null, 2)
        }).done(function (response) {
            if (response.success) {
                editId = '';
                PhoneBook.load();
            }
        });
    },

    bindEvents: function() {
        $('#phone-book tbody').delegate('a.edit', 'click', function () {
            var id = $(this).data('id');
            PhoneBook.edit(id);
        });

        $('#bpTable tbody').delegate('a.delete', 'click', function () {
            debugger;
            var id = $(this).data('id');
            console.info('click on ', this, id);
            PhoneBook.delete(id);
        });

        $( ".add-form" ).submit(function() {
            const person = {
                firstName: $('input[name=firstName]').val(),
                lastName: $('input[name=lastName]').val(),
                phone: $('input[name=phone]').val()
            };

            if (editId) {
                person.id = editId;
                PhoneBook.save(person);
            } else {
                PhoneBook.add(person);
            }
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
        window.list = list;
        var rows = '';

        // ES6 function systax inside forEach
        list.forEach(listItem => rows += PhoneBook.getRow(listItem));
        //rows += PhoneBook.getActionRow();
        $('#bpTable tbody').html(rows);
    }
};

var persons = [];
console.info('loading persons');
//PhoneBook.load();
PhoneBook.bindEvents();