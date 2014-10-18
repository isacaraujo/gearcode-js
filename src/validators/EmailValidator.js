(function ($, gc) {

    gc.validators = gc.validators || {};

    gc.validators.EmailValidator = gc.validators.AbstractValidator.extend({

        options: {
            errorMessage: 'O endereço de e-mail informado é invalido.',
            successMessage: 'Campo válido.'
        },

        validate: function (value) {
            return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);
        }
    });

}(jQuery, window.gc = window.gc || {}));
