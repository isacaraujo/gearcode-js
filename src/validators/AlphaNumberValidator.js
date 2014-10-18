(function ($, gc) {

    gc.validators = gc.validators || {};

    gc.validators.AlphaNumberValidator = gc.validators.AbstractValidator.extend({

        options: {
            errorMessage: 'Este campo só aceita letras e números.',
            successMessage: 'Campo válido.'
        },

        validate: function (value) {
            return /^[a-z0-9]+$/.test(value);
        }
    });

}(jQuery, window.gc = window.gc || {}));
