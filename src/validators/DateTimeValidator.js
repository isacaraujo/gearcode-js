(function ($, gc) {

    gc.validators = gc.validators || {};

    gc.validators.DateTimeValidator = gc.validators.AbstractValidator.extend({

        options: {
            errorMessage: 'Este campo requer a data e a hora.',
            successMessage: 'Campo válido.'
        },

        validate: function () {
            
        }
    });

}(jQuery, window.gc = window.gc || {}));
