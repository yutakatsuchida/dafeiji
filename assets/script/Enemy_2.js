

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.init();
    },

    init: function () {
        this.hp = 8;

        // set speed
        this.speed = 150 + Math.random() * 300;

        this.isDie = false;
        this.normal();
    },

    normal: function () {
        // Get Animation component
        var anim = this.getComponent(cc.Animation);

        // Play the animation
        anim.play('enemyNormal_2');
    },

    hit: function () {
        this.hp--;

        if (this.hp <= 0) {
            this.isDie = true;
            this.die();
            game.playSoundEnemyDie();
            return;
        }
        // Get Animation component
        var anim = this.getComponent(cc.Animation);
        anim.over = function () {
            this.normal();
           
        }.bind(this);
        // Play the animation
        anim.play('enemyHit_2');
    },

    die: function () {
        // Get Animation component
        var anim = this.getComponent(cc.Animation);
        anim.over = function () {
            game.onEnemyKilled(this.node, 2);
            game.addScore(200);
            game.startPopup();
        }
        // Play the animation
        anim.play('enemyDie_2');
    },

    update(dt) {
        if (this.isDie) return;

        // When the game is in playing, the enemies move
        if (game.gameType === game.GameTypePlaying || game.gameType === game.GameTypeOver) {
            this.node.y = this.node.y - this.speed * dt;
        }

        if (this.node.y <= -654) {
            game.onEnemyKilled(this.node, 2);
        }
    },
});
