(function ($, gc) {

    gc.validators = gc.validators || {};

    gc.validators.ValidatorFactory = gc.core.EventDispatcher.extend({

        statics: {

            _validators: {
                "email": "gc.validators.EmailValidator",
                "url": "gc.validators.UrlValidator",
                "date": "gc.validators.DateValidator",
                "datetime": "gc.validators.DateTimeValidator",
                "number": "gc.validators.NumberValidator",
                "digit": "gc.validators.DigitValidator",
                "alpha": "gc.validators.AlphaValidator",
                "alphanumber": "gc.validators.AlphaNumberValidator",
                "phone": "gc.validators.PhoneValidator",
                "creditcard": "gc.validators.CreditCardValidator",
                "extension": "gc.validators.ExtensionValidator"
            },

            make: function (options) {
                if (typeof options === 'string') options = { name: options };
                var className = this._validators[options.name];
                if (className === undefined) {
                    throw "The validator " + options.name + " is not registered.";
                }
                var Klass = this.resolveClass(className);
                return new Klass(options);
            },

            registerValidator: function (name, className) {
                this.resolveClass(Klass);
                this._validators[name] = className;
            },

            resolveClass: function (className) {
                var Klass = window,
                    parts = className.split('.');
                for (var i = 0; i < parts.length; i++) {
                    if (undefined === Klass[parts[i]]) {
                        throw "The class " + className + " not exist!";
                    }
                    Klass = Klass[parts[i]];
                }
                return Klass;
            }
        }
    });

}(jQuery, window.gc = window.gc || {}));
