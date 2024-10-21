function getData() {
    $.ajax({
        url: "https://jsonplaceholder.typicode.com/users",
        method: "GET",
        dataType: "json",
        success: function (data) {
            let user = $("#user");
            user.empty();  // Clear previous data
            $.each(data, function (index, value) {
                user.append(
                    `<div class="mb-3">
                        <div> id : ${value.id}</div>
                        <div> name : ${value.name}</div>
                        <div> username : ${value.username}</div>
                        <div> email : ${value.email}</div>
                        <div> street : ${value.address.street}</div>
                        <div> suite : ${value.address.suite}</div>
                        <div> city : ${value.address.city}</div>
                        <div> zipcode : ${value.address.zipcode}</div>
                        <div> lat : ${value.address.geo.lat}</div>
                        <div> lng : ${value.address.geo.lng}</div>
                    </div>
                    <hr />`
                );
            });
        },
        error: function (error) {
            console.error("Error fetching user data:", error);
        }
    });
}


function getUserDataForSpecificUser(userId) {
    $.ajax({
        url: "https://jsonplaceholder.typicode.com/users/${userId}",
        method: "GET",
        dataType: "json",
        success: function (data) {
            let user = $("#user");
            user.empty();  

            
            user.append(
                `<div class="mb-3">
                    <div> id : ${data.id}</div>
                    <div> name : ${data.name}</div>
                    <div> username : ${data.username}</div>
                    <div> email : ${data.email}</div>
                    <div> street : ${data.address.street}</div>
                    <div> suite : ${data.address.suite}</div>
                    <div> city : ${data.address.city}</div>
                    <div> zipcode : ${data.address.zipcode}</div>
                    <div> lat : ${data.address.geo.lat}</div>
                    <div> lng : ${data.address.geo.lng}</div>
                </div>
                <hr />`
            );
        },
        error: function (error) {
            console.error("Error fetching specific user data:", error);
        }
    });
}


function postData() {
    $.ajax({
        url: "https://jsonplaceholder.typicode.com/users",
        method: "POST",
        dataType: "json",
        contentType: "application/json",  
        data: JSON.stringify({
            name: 'Abdullah',
            username: 'abd',
            email: 'abd@example.com'
        }),
        success: function (data) {
            let user = $("#user");
            user.empty();

            
            user.append(
                `<div class="mb-3">
                    <div> id : ${data.id}</div>
                    <div> name : ${data.name}</div>
                    <div> username : ${data.username}</div>
                    <div> email : ${data.email}</div>
                </div>
                <hr />`
            );
        },
        error: function (error) {
            console.error("Error posting user data:", error);
        }
    });
}





function putData() {
    $.ajax({
        url: "https://jsonplaceholder.typicode.com/users/1",
        method: "PUT",
        dataType: "json",
        contentType: "application/json",  
        data: JSON.stringify({
            name: 'moneeb',
            username: 'moneebazhar',
            email: 'moneeb@example.com'
        }),
        success: function (data) {
            let user = $("#user");
            user.empty();

            
            user.append(
                `<div class="mb-3">
                    <div> id : ${data.id}</div>
                    <div> name : ${data.name}</div>
                    <div> username : ${data.username}</div>
                    <div> email : ${data.email}</div>
                </div>
                <hr />`
            );
        },
        error: function (error) {
            console.error("Error posting user data:", error);
        }
    });
}



function patchData() {
    $.ajax({
        url: "https://jsonplaceholder.typicode.com/users/3",
        method: "PATCH",
        dataType: "json",
        contentType: "application/json",  
        data: JSON.stringify({
            name: 'waleed',
            username: 'waleedGill',
            email: 'waleed@example.com'
        }),
        success: function (data) {
            let user = $("#user");
            user.empty();

            
            user.append(
                `<div class="mb-3">
                    <div> id : ${data.id}</div>
                    <div> name : ${data.name}</div>
                    <div> username : ${data.username}</div>
                    <div> email : ${data.email}</div>
                </div>
                <hr />`
            );
        },
        error: function (error) {
            console.error("Error posting user data:", error);
        }
    });
}



function deleteData() {
    $.ajax({
        url: "https://jsonplaceholder.typicode.com/users/3",  
        method: "DELETE",
        success: function () {
            let user = $("#user");
            user.empty();  

            
            user.append(`<div>User with ID 3 has been deleted successfully.</div>`);
        },
        error: function (error) {
            console.error("Error deleting user data:", error);
        }
    });
}


$(function() {
    $('#button1').on('click', getData);  
    $('#button2').on('click', function() {
        getUserDataForSpecificUser(1);   
    });
    $('#button3').on('click', postData); 
    $('#button4').on('click', putData); 
    $('#button5').on('click', patchData); 
    $('#button6').on('click', deleteData); 
});
