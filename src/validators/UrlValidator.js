(function ($, gc) {

    gc.validators = gc.validators || {};

    gc.validators.UrlValidator = gc.validators.AbstractValidator.extend({

        options: {
            errorMessage: 'Endereço de url inválido.',
            successMessage: 'Campo válido.'
        },

        validate: function (value) {
            var result = /^http(s)?:\/\/(\w+\.){1,}\w+/.test(value);
            console.log('url validate: ', result);
            return result;
        }
    });

}(jQuery, window.gc = window.gc || {}));
