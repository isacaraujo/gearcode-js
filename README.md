Biblioteca para producao e desenvolvimento de projetos  
baseados em javascript orientado a objetos para browsers.  
Utiliza o principio de orientação a objetos por protopicação.

Otimizado para desenvolvimento de dispositivos Mobile.   

O projeto foi baseado no esquema de Classes em Javascript escrito  
por John Risig (criador do jQuery), sendo este baseado na biblioteca  
Prototype.

Exemplo de como criar uma classe Javascript baseada neste framework:

    :::javascript
        (function() {
            var Main = gc.core.EventDispatcher.extend({
                
                init: function() {
                    this._super($('#main').get(0));
                    this.one('click', this.onClick1, false, this);
                    this.one('click', this.onClick2, false, this);
                },
                
                onClick1: function(evt) {
                    console.log('onClick called');
                },
                
                onClick2: function(evt) {
                    console.log('onClick called');
                }
            });
            return new Main();
        })();