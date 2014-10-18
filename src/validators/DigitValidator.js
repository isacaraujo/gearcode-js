(function ($, gc) {

    gc.validators = gc.validators || {};

    gc.validators.DigitValidator = gc.validators.AbstractValidator.extend({

        options: {
            errorMessage: 'Este campo só aceita números.',
            successMessage: 'Campo válido.'
        },

        validate: function () {
            
        }
    });

}(jQuery, window.gc = window.gc || {}));
