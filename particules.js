class Particules{
    constructor(game){
        this.game = game;
        this.markedForDeletion = false;
    }
    update(){
        //on déplace la particule
        this.x -= this.speedX + this.game.gameSpeed;
        this.y += this.speedY;
        //on réduit la taille de la particule
        this.size *= 0.94;
        //si la taille est inférieure à 0.5 on marque la particule pour suppression
        if(this.size < 0.5){
            this.markedForDeletion = true;
        }
    }
}


export class Poussiere extends Particules{
    constructor(game, x, y){
        super(game);
        this.size = Math.random() * 10 + 10;
        this.x = x;
        this.y = y;
        this.speedX = Math.random();
        this.speedY = Math.random();
        this.color = 'rgba(4,55,98,0.8)';;
    }
    draw(context){
        context.beginPath();
        // on dessine arc avec x, y, rayon, angle de départ, angle de fin
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        
    }
    
}



export class Feu extends Particules{
    constructor(game, x, y){
        super(game);
        this.image = document.getElementById('feu');
        this.size = Math.random() * 60 + 50;
        this.x = x;
        this.y = y;
        this.speedX = 1;
        this.speedY = 1;
        this.angle = 0;
        this.va = Math.random() * 0.3 - 0.1;
    }
    update(){
        super.update();
        this.angle += this.va;
        this.x += Math.sin(this.angle*10);
    }
    draw(context){
        //save et restore sont utilisés pour ne pas affecter les autres dessins
        context.save();
        context.drawImage(this.image, this.x, this.y, this.size, this.size);
        context.restore();
    }
    
}

export class Eclaboussure extends Particules{
    constructor(game, x, y){
        super(game);
        this.size = Math.random() * 100 + 100;
        this.x = x - this.size/2;
        this.y = y - this.size/2;
        this.speedX = Math.random() * 6 -3;
        this.speedY = Math.random() * 2 - 2;
        this.weight = 0;
        this.image = document.getElementById('feu');
    }
    update(){
        super.update();
        this.weight += 0.1;
        this.y += this.weight;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
    
}