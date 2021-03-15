
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad() { 
        this.init();
    },

    init: function () {
        // set the status of the enemy - Alive
        this.isDie = false;

        // set speed
        this.speed = 200 + Math.random() * 800;

        // Get Animation component
        var anim = this.getComponent(cc.Animation);

        // Play the animation
        anim.play('enemyNormal_1');
    },
    
    // Hit the enemy 
    hit: function () {
        this.isDie = true;

        // Get Animation component
        var anim = this.getComponent(cc.Animation);

        // Play the animation
        anim.play('enemyDie_1');

        game.playSoundEnemyDie();

        // When the animation is over, remove the enemy
        anim.over = function () {
            cc.log('executed over function...');
            game.onEnemyKilled(this.node, 1);
            game.addScore(100);
            game.startPopup();
            
        }
    },

    update(dt) {
        if (this.isDie) return;

        // When the game is in playing, the enemies move
        if (game.gameType === game.GameTypePlaying || game.gameType === game.GameTypeOver) {
            this.node.y = this.node.y - this.speed * dt;
        }

        if (this.node.y <= -654) {
            game.onEnemyKilled(this.node, 1);
        }
    },
});
