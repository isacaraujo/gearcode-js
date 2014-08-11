(function ($, gc) {
    
    gc.components = gc.components || {};
    
    gc.components.TemplateEngine = gc.core.EventDispatcher.extend({
        
        statics: {
            
            compile: function (ui, params) {
                if (!params) return;
                for (var key in params) {
                    if (params.hasOwnProperty(key)) {
                        var search = "{{ " + key + " }}";
                        ui = this.replace(ui, search, params[key]);
                    }
                }
                return $(ui).get(0);
            },
            
            replace: function (ui, from, to) {
                var lines = ui.split("\n");
                var len = lines.length;
                for (var i = 0; i < len; i++) {
                    while (lines[i].indexOf(from) > -1) {
                        lines[i] = lines[i].replace(from, to);
                    }
                }
                return lines.join("\n");
            }
        }
    });
    
}(jQuery, window.gc = window.gc || {}));
