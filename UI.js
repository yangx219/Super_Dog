export class UI{
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Creepster';
        this.color = 'black';
        this.viesImg = document.getElementById('vies');
    }
    draw(context){
        //juste affecter le texte que l'on veut afficher
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;

        //on dessine le score
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.fillStyle = this.color;
        context.fillText('Score: ' + this.game.score, 20, 40);

        //on dessine le temps
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Time: ' + (this.game.time*0.001).toFixed(1) ,20, 80);

        //on dessine les vies
        for(let i = 0; i < this.game.vies ; i++){
            context.drawImage(this.viesImg, 40*i + 20, 100, 30, 30);
            console.log(this.game.vies)
        }
        

        //game over screen
        if(this.game.gameOver){
            
            context.textAlign = 'center';
            let message1;
            let message2;
            if(this.game.score >= this.game.winningScore){
                message1 = 'You Win!';
                message2 = 'Congratulations!';
            }else{
                message1 = 'Game Over!';
                message2 = 'Try Again!';
            }

            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            context.fillText(message1, this.game.width / 2, this.game.height / 2);
            context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
            context.fillText(message2, this.game.width / 2, this.game.height / 2 + this.fontSize);
            
        }
        
    }
}