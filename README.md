# GearcodeJS

Biblioteca para producao e desenvolvimento de projetos  
baseados em javascript orientado a objetos para browsers.

Otimizado para desenvolvimento de dispositivos Mobile.   

## Exemplo:

    <!DOCTYPE html>
    <html lang="pt-br">
        <head>
            <title>Gearcode - Hello World</title>
        </head>
        <body>
            <main id="wrapper">
                <div class="logs" data-accessor="logs"></div>
                <button type="button" data-accessor="button1">Clique aqui</button>
            </div>
            <script src="vendors/jquery/jquery.min.js"></script>
            <script src="vendors/gearcode/gearcode.min.js"</script>
            <script>
            (function ($) {
                
                // Defina uma classe que irá receber seu container.
                // Por extender a classe AbstractScreen, o core da 
                // aplicação irá mapear a aplicação e definir
                // seus "accessors".
                var Main = gc.screen.AbstractScreen.extend({
                
                    counter: null,
                
                    // busca pelo [data-accessor="logs"]
                    logs: null,
                    
                    // busca pelo [data-accessor="button1"]
                    button1: null,

                    // A função init representa o construtor da classe
                    init: function(options) {
                    
                        // O método _super evoca o mesmo método na classe-mãe.
                        this._super(options);
                        
                        // É importante inicializar os atributos do objeto
                        // em seu construtor.
                        this.counter = 0;
                        
                        // Os métodos são evocados com a seguinte sintaxe.
                        this.setEvents();
                    },
                    
                    setEvents: function () {
                    
                        // o método "on" recebe 3 argumentos:
                        // [EventName, FnCallback, UseCapture, Scope]
                        this.on('click', this.onClick, false, this);
                    },

                    // Como definimos o escopo do click,
                    // o nome "this" pode ser usado internamente.
                    onClick: function(event) {
                    
                        // Os objetos to tipo DisplayObject possui um método
                        // .sel() que retorna uma instancia jQuery.
                        this.log.sel().append('<p>Click #' + (++this.counter) + ' realizado!</p>');
                    }
                });
                
                // Garantia que nossa aplicação seja inicializada
                // após o carregamento da página.
                $(document).ready(function () {
                
                    // O construtor de uma classe tipo gc.display.DisplayObject pode
                    // receber como argumento um objeto, um seletor jQuery, um wrapper
                    // ou um DOM object.
                    return new Main('#wrapper');
                });
            })(jQuery);
            </script>
        </body>
    </html>
