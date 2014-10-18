(function ($, gc) {

    gc.validators = gc.validators || {};

    gc.validators.ExtensionValidator = gc.validators.AbstractValidator.extend({

        options: {
            errorMessage: 'Extensão não permitida.',
            successMessage: 'Campo válido.',
            extensions: null
        },

        validate: function (value) {
            var reg = '(' + this.options.extensions + ')$';
            var result = new RegExp(reg).test(value);
            console.log('validate extension', result);
            return result;
        }
    });

}(jQuery, window.gc = window.gc || {}));
