const kinveyAppID = 'kid_HytUggyI';
const kinveyAppSecret = 'c1e7187a27604d488e2d5f0705079814';
const kinveyServiceBaseUrl = 'https://baas.kinvey.com/';

function showView(viewId) {
    $("main > section").hide();

    $("#" + viewId).show();
}

function showHideNavigationLinks() {
    let loggedIn = sessionStorage.authToken != null
    if (loggedIn){
        $("#linkHome").show();
        $("#linkLogin").hide();
        $("#linkRegister").hide();
        $("#linkListBooks").show();
        $("#linkCreateBook").show();
        $("#linkLogout").show();
    }
    else {
        $("#linkHome").show();
        $("#linkLogin").show();
        $("#linkRegister").show();
        $("#linkListBooks").hide();
        $("#linkCreateBook").hide();
        $("#linkLogout").hide();
    }
}

function showHomeView() {
    showView('viewHome');
}

function showLoginView() {
    showView('viewLogin');
}

function showInfo(messageText) {
    $('#infoBox').text(messageText).show().delay(3000).fadeOut();
}

function login() {
    let authBase64 = btoa(kinveyAppID + ":" + kinveyAppSecret);
    let loginURL = kinveyServiceBaseUrl + "user/" + kinveyAppID + "/login";
    let loginData = {
        username: $('#loginUser').val(),
        username: $('#loginPass').val()
    };

    $.ajax({
        method: "POST",
        url: loginURL,
        data: loginData,
        header: {"Authorization" : "Basic" + authBase64},
        success: loginSuccess(),
        error: showAjaxError
    });

    function loginSuccess(data, status) {
        //sessionStorage.authToken = data._kmd.authToken;
        showListBooksView();
        showHideNavigationLinks();
        showInfo("Login Success");
    }
}

function showAjaxError(data, status) {
    let errorMsg = "Error: " + JSON.stringify(data);
    $('#errorBox').text(errorMsg).show();
}

function showRegisterView() {
    showView('viewRegister');
}

function register() {
    let authBase64 = btoa(kinveyAppID + ":" + kinveyAppSecret);
    let loginURL = kinveyServiceBaseUrl + "user/" + kinveyAppID + "/";
    let loginData = {
        username: $('#registerUser').val(),
        username: $('#registerPass').val()
    };

    $.ajax({
        method: "POST",
        url: loginURL,
        data: loginData,
        header: {"Authorization" : "Basic" + authBase64},
        success: registerSuccess(),
        error: showAjaxError
    });

    function registerSuccess(data, status) {
        //sessionStorage.authToken = data._kmd.authToken;
        showListBooksView();
        showHideNavigationLinks();
        showInfo("Register Success");
    }
}

function showListBooksView() {
    showView('viewBooks');
    $("#books").text("Loading ...");

    let booksURL = kinveyServiceBaseUrl + "appdata/" + kinveyAppID + "/books";
    let authHeaders = {"Authorization" : "Kinvey " + sessionStorage.authToken};

    $.ajax({
        method: "GET",
        url: booksURL,
        header: authHeaders,
        success: booksLoaded,
        error: showAjaxError
    });

    function booksLoaded(books, status) {
        showInfo("Book Loaded.");
        $("#books").text("");
        let booksTable = $("<table>")
            .append($("<tr>")
                .append($("<th>Title</th>"))
                .append($("<th>Author</th>"))
                .append($("<th>Description</th>"))
            );

        for (let book of books){
            booksTable.append($("<tr>")
                .append($("<td></td>").text(book.title))
                .append($("<td></td>").text(book.author))
                .append($("<td></td>").text(book.description))
            );
        }

        $('#books').append(booksTable);
    }

    function booksLoaded(data, status) {
        showInfo("Books Loaded.");
        alert(JSON.stringify(data))
    }
}

function showCreateBookView() {
    showView('viewCreateBook');
}

function logout() {
    sessionStorage.clear();
    showHomeView();
    showHideNavigationLinks();
}

$(function () {
    $("#linkHome").click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkListBooks").click(showListBooksView);
    $("#linkCreateBook").click(showCreateBookView);
    $("#linkLogout").click(logout);

    $('#buttonLogin').click(login);
    $('#buttonRegister').click(register);
    $('#buttonCreateBook').click(createBook);

    showHomeView();
    showHideNavigationLinks();

    $(document)
        .ajaxStart(function () {
            $("#loadingBox").show();
        })
        .ajaxStop(function () {
            $("#loadingBox").hide();
        });
});