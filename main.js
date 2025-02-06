import{Joueur} from './joueur.js';
import { KeyPressHandler } from './keyPress.js';
import { Background } from './background.js';
import { EnnemiVolant,EnnemiTerrain,EnnemiGrimpant } from './ennemi.js';
import{UI} from './UI.js';

window.addEventListener('load', function() {
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  canvas.width = 1000;
  canvas.height = 500;


  class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.groundMargin = 80;
        this.gameSpeed = 0;
        this.maxGameSpeed = 6;
        this.background = new Background(this);
        this.joueur = new Joueur(this);
        this.keyPress = new KeyPressHandler(this);
        this.UI = new UI(this);
        this.ennemis = [];
        this.ennemiTimer = 0;
        this.ennemiInterval = 3000;

        this.particules = [];
        this.collisions = []; 

        this.debug = false;
        
        this.score = 0;
        this.winningScore = 20;

        this.time = 0;
        this.maxTime = 50000;
        this.gameOver = false;
        this.vies = 3;

        this.maxParticules = 60;

        this.joueur.currentEtat = this.joueur.etats[0];
        //on initialise l'état courant
        this.joueur.currentEtat.enter();

        //sound
        this.soundCollision = new Audio('/sound/Ice attack 2.wav');
        this.soundGameOver = new Audio('/sound/Healing Full.wav');
        this.soundBackground = new Audio('/sound/Juhani Junkala [Retro Game Music Pack] Title Screen.wav');

        this.soundBackground.loop = true;
        this.soundBackground.volume = 0.2;
        
        


    }

    /**
     * 
     * cette méthode met à jour les éléments du jeu
     */
    update(deltaTime) {
      this.soundBackground.play();
      this.time += deltaTime;
      if(this.time > this.maxTime) this.gameOver = true;
      //collisionDetection();
      this.background.update();
      this.joueur.update(this.keyPress.keys, deltaTime);
      // on ajoute un ennemi toutes les 1000ms
      if (this.ennemiTimer > this.ennemiInterval)
      {
        this.ajoutEnnemi();
        this.ennemiTimer = 0;
      }else{
        this.ennemiTimer += deltaTime;
      }
      //on met à jour les ennemis
      this.ennemis.forEach(ennemi => {
        ennemi.update(deltaTime);
        if (ennemi.markedForDeletion) {
          const index = this.ennemis.indexOf(ennemi);
          this.ennemis.splice(index, 1);
        }
      });

      //on met à jour les particules
      this.particules.forEach((particule, index) => {
        particule.update();
        if (particule.markedForDeletion) {
          this.particules.splice(index, 1);
        }
      });

      if(this.particules.length > this.maxParticule){
        this.particules.length =  this.maxParticule;
      }

      //collision Animation
      this.collisions.forEach((collision,index) => {
        collision.update(deltaTime);
        this.soundCollision.play();
        if (collision.markedForDeletion) {
          
          this.collisions.splice(index, 1);
        }
      });

      
    }


    draw(context) {
      this.background.draw(context);
      this.joueur.draw(context);
      this.ennemis.forEach(ennemi => {
        ennemi.draw(context);
      });
      this.particules.forEach(particule => {
        particule.draw(context);
      });
      this.collisions.forEach(collision => {
        collision.draw(context);
      });
      this.UI.draw(context);

    }

    ajoutEnnemi() {
      this.ennemis.push(new EnnemiVolant(this));
      // on ajoute un ennemi terrain avec une probabilité de moins de 50%
      if (this.gameSpeed > 0 && Math.random() < 0.5) this.ennemis.push(new EnnemiTerrain(this));
      else if (this.gameSpeed > 0 ) this.ennemis.push(new EnnemiGrimpant(this));
      
    }
     
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;

  // Game loop
  function gameLoop(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    context.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(context);
    if(!game.gameOver) requestAnimationFrame(gameLoop);
  }

  gameLoop(0);

});