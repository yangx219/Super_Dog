class Layer {
    constructor(game, image, layerHeight, layerwidth,speedModifier) {
        this.game = game;
        this.image = image;
        this.speedModifier = speedModifier;
        this.width = layerwidth;
        this.height = layerHeight;
        this.x = 0;
        this.y = 0;
    }

    update() {
        if (this.x < -this.width) this.x = 0;
        //le background se déplace vers la gauche
        else this.x -= this.game.gameSpeed * this.speedModifier;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        //on dessine une deuxième image à la suite de la première
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
    
}


export class Background {
    constructor(game) {
        this.game = game;
        this.width = 1667;
        this.height = 500;

        this.layerImg1 = document.getElementById('layer1');
        this.layerImg2 = document.getElementById('layer2');
        this.layerImg3 = document.getElementById('layer3');
        this.layerImg4 = document.getElementById('layer4');
        this.layerImg5 = document.getElementById('layer5');



        this.layers = [];
        this.layers.push(new Layer(this.game, this.layerImg1, this.height, this.width, 0));
        this.layers.push(new Layer(this.game, this.layerImg2, this.height, this.width, 0.2));
        this.layers.push(new Layer(this.game, this.layerImg3, this.height, this.width, 0.4));
        this.layers.push(new Layer(this.game, this.layerImg4, this.height, this.width, 0.6));
        this.layers.push(new Layer(this.game, this.layerImg5, this.height, this.width, 0.8));

    }

    update() {
        this.layers.forEach(layer => {
            layer.update();
        });
    }

    draw(context) {
        this.layers.forEach(layer => {
            layer.draw(context);
        });
    }
}