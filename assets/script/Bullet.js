
cc.Class({
    extends: cc.Component,

    properties: {
      soundBullet: cc.AudioClip,
    },

    onLoad() {
       
    },

    start () {

    },

    onCollisionEnter: function (other, self) {
        if (self.tag === 11) {
            game.onBulletKilled(self.node);
        }

        // Enemy_1
        if (other.tag === 1) {
            
            var js = other.node.getComponent('Enemy_1');
            // cc.log(js);
            if (js && js.isDie === false) {
                cc.log('onCollisionEnter - hit');
                js.hit();
            }
        }
        // Enemy_2
        else if (other.tag === 2) {
            var js = other.node.getComponent('Enemy_2');
            // cc.log(js);
            if (js && js.isDie === false) {
                cc.log('onCollisionEnter - hit');
                js.hit();
            }
        }
        // Enemy_3
        else if (other.tag === 3) {
            var js = other.node.getComponent('Enemy_3');
            // cc.log(js);
            if (js && js.isDie === false) {
                cc.log('onCollisionEnter - hit');
                js.hit();
            }
        }
       
    },

    update(dt) {
        if (game.gameType === game.GameTypePlaying || game.gameType === game.GameTypeOver) {
            this.node.y = this.node.y + 8;
        }
        if (this.node.y >= 590) {
            game.onBulletKilled(this.node);
        }
    },
});
