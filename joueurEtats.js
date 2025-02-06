import { Poussiere ,Feu,Eclaboussure} from "./particules.js";

const etats = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    PLONGEE: 5,
    HIT: 6
    
}

class Etat {
    constructor(etat,game) {
        this.etat = etat;
        this.game = game;
    }
        
}

export class Sitting extends Etat {
    //on crée un constructeur qui prend en paramètre le game parce que game inclut le joueur
    constructor(game) {
        super('SITTING', game);
        
    }

    enter(){
        this.game.joueur.maxFrame = 4;
        this.game.joueur.frameY = 5;
        

    }
    handleInput(keyPress){
        //si on appuie sur la touche droite ou gauche, on passe à l'état RUNNING
        if(keyPress.includes('ArrowLeft') || keyPress.includes('ArrowRight')){
            this.game.joueur.setEtat(etats.RUNNING,1);
        }else if(keyPress.includes('Enter')){
            this.game.joueur.setEtat(etats.ROLLING,2);
        }

        
    }

        
    }
export class Running extends Etat {
    constructor(game) {
        super('RUNNING',game);
    }

    enter(){
        this.game.joueur.maxFrame = 8;
        this.game.joueur.frameY = 3;

    }
    handleInput(keyPress){

        this.game.particules.push(new Poussiere(this.game, this.game.joueur.x + this.game.joueur.width * 0.5, this.game.joueur.y + this.game.joueur.height));
        //si on appuie sur la touche bas, on passe à l'état SITTING
        if(keyPress.includes('ArrowDown') ){
            this.game.joueur.setEtat(etats.SITTING,0);
        }else if(keyPress.includes('ArrowUp')){
            this.game.joueur.setEtat(etats.JUMPING, 1);
        }else if(keyPress.includes('Enter')){
            this.game.joueur.setEtat(etats.ROLLING,2);
        }

        
    }

}

export class Jumping extends Etat {
    constructor(game) {
        super('JUMPING',game);
    }

    enter(){
        if(this.game.joueur.surTerrain()) this.game.joueur.vy -= 25;
        this.game.joueur.maxFrame = 6;
        this.game.joueur.frameY = 2;
       

    }
    handleInput(keyPress){
        //on passe à l'état FALLING si vy > weight
        if(this.game.joueur.vy > this.game.joueur.weight){
            this.game.joueur.setEtat(etats.FALLING,1);
        }else if(keyPress.includes('Enter')){
            this.game.joueur.setEtat(etats.ROLLING,2);
        }else if(keyPress.includes('ArrowDown')){
            this.game.joueur.setEtat(etats.PLONGEE,0);
        }
    }

}

/**Quand la joueur est en faling, on va pas ecouter les touches de clavier, on va juste le laisser tomber sur le terrain.
 * et on va passer à l'état RUNNING si le joueur touche le terrain*/
export class Falling extends Etat {
    constructor(game) {
        super('FALLING',game);
    }

    enter(){
        this.game.joueur.frameX = 0;
        this.game.joueur.maxFrame = 6;
        this.game.joueur.frameY = 2;
       

    }
    handleInput(keyPress){
        //on passe à l'état FALLING si vy > weight
        if(this.game.joueur.surTerrain()){
            this.game.joueur.setEtat(etats.RUNNING,1);
        }else if(keyPress.includes('ArrowDown')){
            this.game.joueur.setEtat(etats.PLONGEE,0);
        }

        
    }

}


export class Rolling extends Etat {
    constructor(game) {
        super('ROLLING',game);

    }
    //enter est appelé quand on passe à cet état
    enter(){
        this.game.joueur.frameX = 0;
        this.game.joueur.maxFrame = 6;
        this.game.joueur.frameY = 6;
       

    }
    handleInput(keyPress){
        //unshift ajoute un élément au début du tableau
        this.game.particules.unshift(new Feu(this.game, this.game.joueur.x + this.game.joueur.width * 0.3, this.game.joueur.y + this.game.joueur.height*0.5));
       
        if(this.game.joueur.surTerrain()&& !keyPress.includes('Enter') ){
            this.game.joueur.setEtat(etats.RUNNING,1);
        }else if(!keyPress.includes('Enter')&&!this.game.joueur.surTerrain()){
            this.game.joueur.setEtat(etats.FALLING,1);
            
        }else if (keyPress.includes('Enter')&&this.game.joueur.surTerrain()&&keyPress.includes('ArrowUp')){
            //si on appuie sur la touche enter et la touche haut, on fait un plongeon
            this.game.joueur.vy -=27;
        }else if(keyPress.includes('ArrowDown')&& !this.game.joueur.surTerrain()){
            this.game.joueur.setEtat(etats.PLONGEE,0);
        }

        
    }

}


export class Plongee extends Etat {
    constructor(game) {
        super('PLONGEE',game);

    }
    //enter est appelé quand on passe à cet état
    enter(){
        this.game.joueur.frameX = 0;
        this.game.joueur.maxFrame = 6;
        this.game.joueur.frameY = 6;
        this.game.joueur.vy = 16;
       

    }
    handleInput(keyPress){
        //unshift ajoute un élément au début du tableau
        this.game.particules.unshift(new Feu(this.game, this.game.joueur.x + this.game.joueur.width * 0.3, this.game.joueur.y + this.game.joueur.height*0.5));
       
        if(this.game.joueur.surTerrain()){
            this.game.joueur.setEtat(etats.RUNNING,1);
            //si on est sur le terrain, on ajoute  des éclaboussures
            for (let i=0;i<40;i++){
                this.game.particules.unshift(new Eclaboussure(this.game, this.game.joueur.x + this.game.joueur.width, this.game.joueur.y + this.game.joueur.height));
            }    
        }else if(keyPress.includes('Enter')&&this.game.joueur.surTerrain()){
            this.game.joueur.setEtat(etats.ROLLING,2);
        }
        
    }

}



export class Hit extends Etat {
    constructor(game) {
        super('HIT',game);

    }
    //enter est appelé quand on passe à cet état
    enter(){
        this.game.joueur.frameX = 0;
        this.game.joueur.maxFrame = 10;
        this.game.joueur.frameY = 4;
       

    }
    handleInput(keyPress){
       
        if(this.game.joueur.frameX >= this.game.joueur.maxFrame&&this.game.joueur.surTerrain()){
            this.game.joueur.setEtat(etats.RUNNING,1);
        }else if(this.game.joueur.frameX >= this.game.joueur.maxFrame && !this.game.joueur.surTerrain()){
            this.game.joueur.setEtat(etats.FALLING,1);
        }
        
    }

}