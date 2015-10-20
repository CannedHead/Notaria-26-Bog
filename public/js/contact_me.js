$(function() {

    $('#contactSpinner').hide();
    $("input,textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var email = $("input#email").val();
            var message = $("textarea#message").val();

            $("#contactBtn").hide().fadeOut( "slow", function() {
                $('#contactSpinner').show();
            }); 

            $.ajax({
                url: "/api/mailer",
                type: "POST",
                data: {
                    email: email,
                    message: message
                },
                cache: false,
                success: function() {
                    $( "#contactSpinner" ).fadeOut( "slow", function() {
                        $('#contactBtn').show().fadeIn( "slow");  
                        $('#contactSuccess').html('<span class="fa fa-check-circle"></span> Tu mensaje ha sido enviado exitosamente');
                        $('#contactSuccess').removeClass('hidden').fadeIn( "slow"); 
                    });                                                   
                    //clear all fields
                    $('#contactForm').trigger("reset");

                    setTimeout(function(){
                        $('#contactSuccess').addClass('hidden').fadeOut( "slow"); 
                    }, 3500); 
                },
                error: function() {
                    $( "#contactSpinner" ).fadeOut( "slow", function() {
                        $('#contactBtn').show().fadeIn( "slow");  
                        $('#contactError').html('<span class="fa fa-exclamation-triangle"></span> Ha sucedido un Error, Vuelve a intentarlo');
                        $('#contactError').removeClass('hidden').fadeIn( "slow"); 
                    });                                                   
                    //clear all fields
                    $('#contactForm').trigger("reset");

                     setTimeout(function(){
                        $('#contactError').addClass('hidden').fadeOut( "slow"); 
                    }, 3500);                           
                },
            })
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});
