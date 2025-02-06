class Ennemi{
    constructor(){
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
    }
    update(deltaTime){
        //movement de l'ennemi
        this.x -= this.speedX + this.game.gameSpeed;
        this.y += this.speedY;

        //sprite animation
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        }else{
            this.frameTimer += deltaTime;
        }
        //si l'ennemi sort de l'écran, on le retire du tableau
        if(this.x < 0 - this.width){
            this.markedForDeletion = true;
        }

    }
    draw(context){
        //on dessine rectangle de hitbox pour verifier les collisions
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        //on dessine l'ennemi
        context.drawImage(this.image, this.frameX*this.width, this.frameY*this.height, this.width, this.height, this.x, this.y, this.width, this.height);

    }
}



export class EnnemiVolant extends Ennemi{
    constructor(game){
        super();
        this.game = game;
        this.width = 83.2;
        this.height = 44;
        this.x = this.game.width + Math.random()*this.game.width*0.5;
        this.y = Math.random()*this.game.height*0.5;
        this.speedX = Math.random() + 1;
        this.speedY = 0;
        this.maxFrame = 5;

        this.image = document.getElementById('enemy_fly');
        //velocity of angle pour le vol de l'ennemi volant 
        this.angle = 0;
        this.va = Math.random()*0.1 + 0.1;
    }
    update(deltaTime){  
        super.update(deltaTime);
        //on fait voler l'ennemi en sinusoïdale
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }
}

export class EnnemiTerrain extends Ennemi{
    constructor(game){
        super();
        this.game = game;
        this.width = 60;
        this.height = 87;
        this.x = this.game.width
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('enemy_plant');
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 1;
    }
    
}


export class EnnemiGrimpant extends Ennemi{
    constructor(game){
        super();
        this.game = game;
        this.width = 120;
        this.height = 144;
        this.x = this.game.width;
        this.y = Math.random()*this.game.height*0.5;
        this.image = document.getElementById('enemy_spider_big');
        this.speedX = 0;
        //movement vertical de l'ennemi up or down
        this.speedY = Math.random() > 0.5 ? 1 : -1;
    }
    update(deltaTime){
        super.update(deltaTime);
        //si l'ennemi touche le terrain, on change sa direction
        if(this.y > this.game.height - this.height - this.game.groundMargin) this.speedY *= -1;
        //si l'ennemi sort de l'écran, on le retire du tableau
        if(this.y < -this.height) this.markedForDeletion = true;
    }
    draw(context){
        super.draw(context);

        //on dessine toile d'araignée
        context.beginPath();
        context.moveTo(this.x + this.width/2, 0);
        context.lineTo(this.x + this.width/2, this.y + 50);
        context.stroke();

        context.closePath();
    }

}