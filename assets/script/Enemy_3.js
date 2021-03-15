cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.init();
    },

    init: function () {
        this.hp = 12;

        // set speed
        this.speed = 100 + Math.random() * 400;

        this.isDie = false;
        this.normal();
    },

    normal: function () {
        // Get Animation component
        var anim = this.getComponent(cc.Animation);

        // Play the animation
        anim.play('enemyNormal_3');
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
        anim.play('enemyHit_3');
    },

    die: function () {
        // Get Animation component
        var anim = this.getComponent(cc.Animation);
        anim.over = function () {
            game.onEnemyKilled(this.node, 3);
            game.addScore(500);
            game.startPopup();
        }
        // Play the animation
        anim.play('enemyDie_3');
    },

    update(dt) {
        if (this.isDie) return;

        // When the game is in playing, the enemies move
        if (game.gameType === game.GameTypePlaying || game.gameType === game.GameTypeOver) {
            this.node.y = this.node.y - this.speed * dt;
        }

        if (this.node.y <= -715) {
            game.onEnemyKilled(this.node, 3);
        }
    },
});
