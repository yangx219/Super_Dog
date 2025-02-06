import { Sitting,Running,Jumping,Falling,Rolling,Plongee,Hit } from './joueurEtats.js';
import{CollisionAnimation} from './collisionAnimation.js';
export class Joueur {
  constructor(game) {
     this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 50;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = document.getElementById('joueur');
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame;
    //20 frames par seconde
    this.fps = 20;
    //temps entre chaque frame
    this.frameInterval = 1000 / this.fps;
    //temps écoulé depuis la dernière frame
    this.frameTimer = 0;
    this.hx = 0;
    this.vy = 0;
    this.moveSpeed = 0;
    this.maxMoveSpeed = 10;
    this.weight = 1;
    this.etats = [new Sitting(this.game),new Running(this.game),new Jumping(this.game),new Falling(this.game),new Rolling(this.game),new Plongee(this.game),new Hit(this.game)];
    

    
  }
  update(keyPress, deltaTime) {
    this.collisionDetection();
    this.currentEtat.handleInput(keyPress);
    //horizontal movement de la joueur
    this.x += this.moveSpeed;
    //si le joueur a ete hit, on ne peut pas utiliser les touches de left et right
    if(keyPress.indexOf('ArrowRight') !== -1 && this.currentEtat !== this.etats[6]) {
      this.moveSpeed = this.maxMoveSpeed;
    }else if(keyPress.indexOf('ArrowLeft') !== -1 && this.currentEtat !== this.etats[6]) {
      this.moveSpeed = -this.maxMoveSpeed;
    }else 
      this.moveSpeed = 0;
    //control de bordure
    if (this.x < 0) {
      this.x = 0;
    }else if (this.x > this.game.width - this.width) {
      this.x = this.game.width - this.width;
    }

    //vertical movement de la joueur
    this.y += this.vy;
    if(!this.surTerrain()) this.vy += this.weight;
    else this.vy = 0;

    //control de bordure
    if (this.y > this.game.height - this.height-this.game.groundMargin) {
      this.y = this.game.height - this.height-this.game.groundMargin;
    }

    //sprite animation
    /** si le temps écoulé depuis la dernière frame est supérieur à frameInterval
     * on passe à la frame suivante
     */
    if(this.frameTimer > this.frameInterval){
      this.frameTimer = 0;
      if(this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    }else
      this.frameTimer += deltaTime;
  }
  draw(context) {
    //dessiner un rectangle autour de la joueur pour le collision detection
    if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(this.image, this.frameX*this.width, this.frameY*this.height,this.width, this.height,this.x, this.y, this.width, this.height);
  }

  surTerrain(){
    return this.y >= this.game.height - this.height-this.game.groundMargin;
  }
  /**
   * @param {string} etat
   * @param {number} gameSpeed
   * @return {void}
   * pour changer l'état du joueur
   */
  setEtat(etat, gameSpeed){
    this.currentEtat = this.etats[etat];
    this.game.gameSpeed = this.game.maxGameSpeed * gameSpeed;
    //on entre dans le nouvel état
    this.currentEtat.enter();
  }

  //méthode pour détecter les collisions
  collisionDetection(gameObject){
    this.game.ennemis.forEach(enemi => {
      if(
        enemi.x < this.x + this.width &&
        enemi.x + enemi.width > this.x &&
        enemi.y < this.y + this.height &&
        enemi.y + enemi.height > this.y
      ){
        //collision
        enemi.markedForDeletion = true;
        this.game.collisions.push(new CollisionAnimation(this.game,enemi.x+enemi.width*0.5,enemi.y+enemi.height*0.5));
        //que on est en etat rolling ou plongee, on peut tuer les ennemis
        if (this.currentEtat === this.etats[4]||this.currentEtat === this.etats[5]){
          this.game.score++;
        }else{
          //on passe à l'état HIT
          this.setEtat(6, 0);
          this.game.vies--;
          
          if (this.game.vies == 0){
            this.game.soundGameOver.play();
            this.game.gameOver = true;
          }


      }
    }
    });
  }
}