(function ($, gc) {

    gc.validators = gc.validators || {};

    gc.validators.NumberValidator = gc.validators.AbstractValidator.extend({

        options: {
            errorMessage: 'Este campo só aceita números em notação decimal, negativos e/ou fracionados.',
            successMessage: 'Campo válido.'
        },

        validate: function () {
            
        }
    });

}(jQuery, window.gc = window.gc || {}));
