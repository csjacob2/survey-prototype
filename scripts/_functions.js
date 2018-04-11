const axios = require("axios");

$(document).ready(function() {

    survey.loadIntro();
    survey.initialize();

    $('#emailAddress').popover({
        title: 'Email Bad',
        content: 'Please enter a valid e-mail address (e.g. han.solo@gmail.com)',
        placement: 'top',
        trigger: 'manual',
        template: '<div class="popover email_error" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
    });

    $('#btn_next.btn').on('click', function(event) {
        // email screen/modal
        survey.verifyEmail();
    });

    $('form#survey_submit').on('keypress click', function(event) {
        // control submitting/POST (this is because ENTER key will submit by default but we don't want it to do that on email input

        if (event.keyCode === 13) {
            // allows user to press enter on email address modal
            event.preventDefault();
            survey.enterRedirect();
        } else if (event.type === 'click' && event.target.id == 'btn_submit') {
            // submit button actually submits the survey
            event.preventDefault();
            survey.submit();
        } else {}
    });
});


var survey = (function() {

    function _loadIntro() {
        $('#submit_email').modal({
            backdrop: 'static'
        });
        $('.modal-backdrop').addClass('email');
        $('#submit_email').modal('show');
    }

    function _initialize() {
        $('#btn_submit').prop('disabled', true);

        // get survey data stored in external file
        $.getJSON("data/survey.json", function (data) {
            for (var question in data) {
                // add question to question block, add ID value
                $('.survey_questions .survey_question').attr('id', 'qid_' + data[question].questionID);
                $('.survey_questions .survey_question .text').html(data[question].label);

                var qidPath = '.survey_questions #qid_' + data[question].questionID;

                new Promise(function (resolve, reject) {
                    // add options to template and display
                    $.get('templates/options.template', function (source) {
                        //use handlebar template to format message
                        var template = Handlebars.compile(source);
                        var options = template(data[question].options);
                        $('.survey_questions .options').append(options);
                        resolve(data[question]);
                    });
                })
                .then(function (result) {
                    //update input name/type
                    $(qidPath + ' .input').attr('name', result.questionID);
                    $(qidPath + ' .input').attr('type', result.type);

                    //is input required?
                    if (data[question].required) {
                        $(qidPath + ' .input').prop('required', true);
                    }

                    //add handler to enable submit button if an option is clicked
                    $('.options .option input').change(function () {
                        $('#btn_submit').prop('disabled', false);
                    })
                });
            }
        });
    }

    function _verifyEmail(){
        var emailAddress = $('#emailAddress').val().trim();

        if (fieldValid(emailAddress)) {
            // store, dismiss login modal
            $('#submit_email').modal('hide');
            console.log('valid email');

            //use blur() on active element and auto-dismiss mobile/tablet keyboards
            document.activeElement.blur();
        } else {
            console.log('emailaddress bad');
            $('#emailAddress').popover('show');
        }
    }

    function _submit() {
        //survey responses returned in an array of objects
        var surveyResponses = retrieveResponses();
        //using npm json-server for fake data posting
        var url = 'http://localhost';

        if (surveyResponses) {
            axios
                .post(url, surveyResponses)
                .then(function(response){
                    // survey responses have been successfully posted
                    endSurvey();
                })
                .catch(function(error) {
                    console.log(error);
                    endSurvey();
                });
        }
    }

    function endSurvey() {
        $('#modal_thankYou').modal('show');
        $('#modal_thankYou').on('shown.bs.modal',function(){
            //attach handler to make full modal clickable to dismiss
            new Promise(function (resolve, reject) {
                $('#modal_thankYou').on('click',function(){
                    $('#modal_thankYou').modal('hide');
                });
                resolve();
            })
            .then(function (result) {
                $('#modal_thankYou').on('hidden.bs.modal', function (e) {
                    window.location.href = "http://www.lolcats.com/";
                })
            });
        });
    }


    function _enterRedirect() {
        //helper function to prevent enter key from submit/POST
        _verifyEmail();
    }

    function fieldValid(field) {
        // basic email validation or empty field

        if (/(.+)@(.+){2,}\.(.+){2,}/.test(field)) {
            return true;
        } else {
            return false;
        }
    }

    function retrieveResponses() {
        //retrieve data to store as object
        // assume that this will be stored in a database which has autonumbering for unique ids for answers
        var responses = $(':input').serializeArray();

        return responses;
    }

    return {
        loadIntro:      _loadIntro,
        initialize:     _initialize,
        verifyEmail:    _verifyEmail,
        enterRedirect:  _enterRedirect,
        submit:         _submit
    }
}());