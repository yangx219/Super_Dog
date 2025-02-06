export class KeyPressHandler {
    constructor(game) {
        this.game = game;   
        this.keys = [];
        //quand on appuie sur une touche, on l'ajoute au tableau keys
        window.addEventListener('keydown', (e) => {
           if(( e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight'||
                e.key === 'Enter' 
                )&& this.keys.indexOf(e.key) === -1){
               this.keys.push(e.key);
               //si on appuie sur la touche d, on active ou désactive le mode debug pour afficher les hitbox
           }else if(e.key === 'd') this.game.debug = !this.game.debug;
        });
        //quand on relache une touche, on la retire du tableau keys
        window.addEventListener('keyup', (e) => {
            if( e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight'||
                e.key === 'Enter'){
                //splice est utilisé pour retirer un élément d'un tableau
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}