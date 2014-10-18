(function ($, gc) {

    gc.validators = gc.validators || {};

    gc.validators.DateValidator = gc.validators.AbstractValidator.extend({

        options: {
            errorMessage: 'Este campo requer a data.',
            successMessage: 'Campo válido.'
        },

        validate: function () {
            
        }
    });

}(jQuery, window.gc = window.gc || {}));
