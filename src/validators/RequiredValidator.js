(function ($, gc) {

    gc.validators = gc.validators || {};

    gc.validators.RequiredValidator = gc.validators.AbstractValidator.extend({

        options: {
            errorMessage: 'Este campo é requerido.',
            successMessage: 'Campo válido.'
        },

        validate: function (value) {
            return /^[a-z0-9]+$/.test(value);
        }
    });

}(jQuery, window.gc = window.gc || {}));
