cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.init();
    },
    
    onCollisionEnter: function (other, self) {
        if (self.tag === 10 && this.isDie === false) { // tag 10 -- hero
            this.isDie = true;
            game.gameType = game.GameTypeOver;
            this.die();
        }
    },

    init: function () {
        this.node.active = true;
        this.isDie = false;
        this.normal();
    },

    normal: function () {
        // Get Animation component
        var anim = this.getComponent(cc.Animation);
        // Play the animation
        anim.play('heroNormal');
    },

    die: function () {
        game.playSoundHeroDie();
        // Get Animation component
        var anim = this.getComponent(cc.Animation);
        // Play the animation
        anim.play('heroDie');

        // call function
        anim.over = function () {
            this.node.active = false;
            game.onGameOver();
        }.bind(this);
    },

    update (dt) {},
});
