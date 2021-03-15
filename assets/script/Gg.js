
cc.Class({
    extends: cc.Component,

    properties: {
        label_num: cc.Label,
        
    },

    onLoad() {
        cc.director.preloadScene('Game', function () {
            cc.warn('Next scene preloaded');
        });
        this.timeNum = 5;
        this.label_num.string = this.timeNum;
        this.schedule(function () {
            this.timeNum--;
            this.label_num.string = this.timeNum;
            if (this.timeNum === 0) {
                this.goToGame();
            }
        }, 1);
    },

    goToGame: function () {
        cc.director.loadScene('Game');
    },

    update(dt) {
        

    },
});
