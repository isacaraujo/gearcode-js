(function ($, gc) {

    gc.validators = gc.validators || {};

    gc.validators.AlphaValidator = gc.validators.AbstractValidator.extend({

        options: {
            errorMessage: 'Este campo só aceita letras.',
            successMessage: 'Campo válido.'
        },

        validate: function (value) {
            
        }
    });

}(jQuery, window.gc = window.gc || {}));
