cc.Class({
    extends: cc.Component,

    properties: {
        bg_1: cc.Node,
        bg_2: cc.Node,
        gameReady: cc.Node,
        gamePlaying: cc.Node,
        gamePause: cc.Node,
        gamePopup: cc.Node,
        gameOver: cc.Node,
        hero: cc.Node,
        pre_bullet: cc.Prefab,
        pre_enemy_1: cc.Prefab,
        pre_enemy_2: cc.Prefab,
        pre_enemy_3: cc.Prefab,
        pre_game_popup: cc.Prefab,
        bulletTime: cc.Integer,
        bulletPool: cc.NodePool,
        gameType: cc.Integer,
        GameTypeReady: cc.Integer,
        GameTypePlaying: cc.Integer,
        GameTypePause: cc.Integer,
        GameTypePopup: cc.Integer,
        GameTypeOver: cc.Integer,
        lab_score: cc.Label,
        lab_final_score: cc.Label,
        lab_bestScore: cc.Label,
        lab_question: cc.Label,
        editbox_answer: cc.EditBox,
        bgm: cc.AudioClip,
        soundDieEnemy: cc.AudioClip,
        soundDieHero: cc.AudioClip,
        soundAndwerCorrect: cc.AudioClip,
        soundAndwerIncorrect: cc.AudioClip,
        bgmPlayingID: null,
        qaList: {
            default: null,
            type: Object
        },
        qaRandomNum: 0,
        AnswerInCorrect_Event_Handler: {
            default: null,
            type:cc.Component.EventHandler
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.game = this;
        cc.log('onLoad');
        this.isBgMove = false;
        this.bg_1.y = 0;
        this.bg_2.y = this.bg_1.y + this.bg_1.height;
        this.setTouch();
        this.gameReady.active = true;
        this.gamePlaying.active = false;
        this.gamePause.active = false;
        this.gamePopup.active = false;
        this.gameOver.active = false;
        this.bulletTime = 0;
        this.bulletPool = new cc.NodePool();
        this.enemyTime = 0;
        this.enemyPool_1 = new cc.NodePool();
        this.enemyPool_2 = new cc.NodePool();
        this.enemyPool_3 = new cc.NodePool();
        this.gamePause.zIndex = 2;
        this.gamePopup.zIndex = 2;
        this.gameOver.zIndex = 3;
        this.GameTypeReady = 0;
        this.GameTypePlaying = 1;
        this.GameTypePause = 2;
        this.GameTypePopup = 3;
        this.GameTypeOver = 4;
        this.gameType = this.GameTypeReady;
        this.qaList = this.getQAList();

        // Open the collision manager, without this part statement you will not detect any collision.
        cc.director.getCollisionManager().enabled = true;
        this.randomNum = [60, 90, 100];
        this.scoreNum = 0;
        this.bestScoreNum = cc.sys.localStorage.getItem('bestScore');

        if (this.bestScoreNum === null) {
            this.bestScoreNum = 0;
        }
        this.addScore(0);

        this.gameTime = 0;

        this.bgmPlayingID = cc.audioEngine.play(this.bgm, true, 1);
        cc.audioEngine.setVolume(this.bgmPlayingID, 0.3);
    },
    
    start () {
        cc.log('start');
    },

    setTouch: function () {
        this.node.on('touchstart', function (event) {
            // cc.log('mouse down');
            this.gameReady.active = false;
            this.gamePlaying.active = true;
            this.isBgMove = true;
            if (this.gameType === this.GameTypeReady) {
                this.gameType = this.GameTypePlaying;
            }
            
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            // cc.log('TOUCH_START');
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            // cc.log('TOUCH_MOVE');
            var pos_hero = this.hero.getPosition();
            var pos_move = event.getDelta();
            var pos_end = cc.v2(pos_hero.x + pos_move.x, pos_hero.y + pos_move.y);
            // cc.log(pos_move);
            if (pos_end.x < -290) {
                pos_end.x = -290;
            } else if (pos_end.x > 290) {
                pos_end.x = 290;
            }
            if (pos_end.y < -533) {
                pos_end.y = -533;
            } else if (pos_end.y > 533) {
                pos_end.y = 533;
            }
            this.hero.setPosition(pos_end);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            // cc.log('TOUCH_END');
            // var bullet = cc.instantiate(this.pre_bullet);
            // bullet.parent = this.node;
            // var pos = this.hero.getPosition();
            // bullet.setPosition(cc.v2(pos.x, pos.y + this.hero.height / 2));
        }, this);
    },

    getQAList() {
        return [
            {
                question: "【一月】用英文怎么说？",
                answer: "January"
            },
            {
                question: "【二月】用英文怎么说？",
                answer: "February"
            },
            {
                question: "【三月】用英文怎么说？",
                answer: "March"
            },
            {
                question: "【四月】用英文怎么说？",
                answer: "April"
            },
            {
                question: "【五月】用英文怎么说？",
                answer: "May"
            },
            {
                question: "【六月】用英文怎么说？",
                answer: "June"
            },
            {
                question: "【七月】用英文怎么说？",
                answer: "July"
            },
            {
                question: "【八月】用英文怎么说？",
                answer: "August"
            },
            {
                question: "【九月】用英文怎么说？",
                answer: "September"
            },
            {
                question: "【十月】用英文怎么说？",
                answer: "October"
            },
            {
                question: "【十一月】用英文怎么说？",
                answer: "November"
            },
            {
                question: "【十二月】用英文怎么说？",
                answer: "December"
            }
        ];
    },

    addScore: function (score) {
        this.scoreNum = this.scoreNum + score;
        this.lab_score.string = this.scoreNum;
        if (this.bestScoreNum < this.scoreNum) {
            this.bestScoreNum = this.scoreNum;
            cc.sys.localStorage.setItem('bestScore', this.bestScoreNum);
        }
        this.lab_bestScore.string = this.bestScoreNum;
    },
    
    startPopup: function () {
        if (this.scoreNum > 0 && (this.scoreNum % 350 === 0)) {
            //this.gamePlaying.active = false;
            this.gamePopup.active = true;
            this.gameType = this.GameTypePopup;

            this.qaRandomNum = Math.floor(Math.random() * (this.qaList.length - 1));
            cc.log('popup - game', this.qaRandomNum);
            this.lab_question.string = this.qaList[this.qaRandomNum].question;
            this.editbox_answer.textLabel.string = "";
            cc.audioEngine.pause(this.bgmPlayingID);
        }    
    },

    onGameOver: function () {
        this.lab_final_score.string = this.lab_score.string;
        cc.audioEngine.stop(this.bgmPlayingID);
        this.gameOver.active = true;
        this.gamePause.active = false;
        this.gamePopup.active = false;
    },

    playSoundEnemyDie: function () {
        cc.audioEngine.play(this.soundDieEnemy, false, 1);
    },

    playSoundHeroDie: function () {
        cc.audioEngine.play(this.soundDieHero, false, 1);
    },

    playSoundAnswerIncorrect: function () {
        cc.audioEngine.play(this.soundAndwerIncorrect, false, 1);
    },

    playSoundAnswerCorrect: function () {
        cc.audioEngine.play(this.soundAndwerCorrect, false, 1);
    },

    onSubmitAnswer: function (sender, str) {
        cc.log('Answer you type...', this.editbox_answer.textLabel.string);
        cc.log('Question...', this.qaList[this.qaRandomNum].question);
        cc.log('Answer...', this.qaList[this.qaRandomNum].answer);

        // If the answer correct
        if (this.isAnswerCorrect(this.editbox_answer.textLabel.string, this.qaList[this.qaRandomNum].answer)) {
            cc.log('Correct...');
            //this.Hide_Window();
            this.playSoundAnswerCorrect();
            this.editbox_answer.textLabel.string = "";
            this.gameType = this.GameTypePlaying;
            this.gamePopup.active = false;
            this.gamePause.active = false;
            this.gameOver.active = false;
            this.addScore(1000);
            cc.audioEngine.resume(this.bgmPlayingID);
        }
        // If the answer is incorrect
        else {
            cc.log('Incorrect...');
            //this.Hide_Window();
            this.playSoundAnswerIncorrect();
            this.editbox_answer.textLabel.string = "";
            this.AnswerInCorrect_Event_Handler.emit();
        }
    },

    isAnswerCorrect(usersAnswer, correctAnswer) {
        if (usersAnswer === correctAnswer) {
            return true;
        } else {
            return false;
        }
    },

    clickBtn: function (sender, str) {
        switch (str) {
            case 'pause':
                cc.log('clicked!');
                this.gamePause.active = true;
                this.gameType = this.GameTypePause;
                cc.audioEngine.pause(this.bgmPlayingID);
                break;
            case 'continue':
                cc.log('continue!');
                this.gamePause.active = false;
                this.gameType = this.GameTypePlaying;
                cc.audioEngine.resume(this.bgmPlayingID);
                break;
            case 'restart':
                cc.log('restart!');
                this.bgmPlayingID = cc.audioEngine.play(this.bgm, true, 1);
                cc.audioEngine.setVolume(this.bgmPlayingID, 0.3);
                this.gameTime = 0;
                this.scoreNum = 0;
                this.addScore(0);
                this.gameType = this.GameTypePlaying;
                this.gamePopup.active = false;
                this.gamePause.active = false;
                this.gameOver.active = false;
                this.removeAllBullet();
                this.removeAllEnemy();
                this.hero.setPosition(cc.v2(0, -350));
                var js = this.hero.getComponent('Hero');
                if (js) {
                    js.init();
                }
                break;
            case 'home':
                cc.log('home!');
                this.bgmPlayingID = cc.audioEngine.play(this.bgm, true, 1);
                cc.audioEngine.setVolume(this.bgmPlayingID, 0.3);
                this.gameTime = 0;
                this.scoreNum = 0;
                this.addScore(0);
                this.gameType = this.GameTypeReady;
                this.gameOver.active = false;
                this.gamePopup.active = false;
                this.gamePause.active = false;
                this.gamePlaying.active = false;
                this.gameReady.active = true;
                this.isBgMove = false;
                this.removeAllBullet();
                this.removeAllEnemy();
                this.hero.setPosition(cc.v2(0, -350));
                var js = this.hero.getComponent('Hero');
                if (js) {
                    js.init();
                }
                break;
        }
    },

    setBg: function () {
        // cc.log(this.bg_1.y);
        if (this.bg_1.y <= -this.bg_1.height) {
            this.bg_1.y = this.bg_2.y + this.bg_2.height;
        }
        if (this.bg_2.y <= -this.bg_2.height) {
            this.bg_2.y = this.bg_1.y + this.bg_1.height;
        }
        this.bg_1.y = this.bg_1.y - 2;
        this.bg_2.y = this.bg_2.y - 2;
    },

    createBullet: function () {
        let bullet = null;
        if (this.bulletPool.size() > 0) {
            bullet = this.bulletPool.get();
        } else {
            bullet = cc.instantiate(this.pre_bullet);
        }
        bullet.parent = this.node;
        var pos = this.hero.getPosition();
        bullet.setPosition(cc.v2(pos.x, pos.y + this.hero.height / 2 + 5));
    },

    // Put the bullet back to the pool
    onBulletKilled: function (bullet) {
        this.bulletPool.put(bullet);
    },

    removeAllBullet: function () {
        var children = this.node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            var js = children[i].getComponent('Bullet');
            if (js) {
                this.onBulletKilled(children[i]);
            }
        }
    },

    removeAllEnemy: function () {
        var children = this.node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].getComponent('Enemy_1')) {
                game.onEnemyKilled(children[i], 1);
            }
            else if (children[i].getComponent('Enemy_2')) {
                game.onEnemyKilled(children[i], 2);
            }
            else if (children[i].getComponent('Enemy_3')) {
                game.onEnemyKilled(children[i], 3);
            }
        }
    },

    // Enemy_1
    createEnemy: function (enemyType) {
        cc.log('createEnemy...', enemyType);
        let enemy = null;
        var str = ''; 
        var pos_enemy = cc.v2(0, 0);
        // Create Enemy 1
        if (enemyType === 1) {
            if (this.enemyPool_1.size() > 0) {
            enemy = this.enemyPool_1.get();
            } else {
                enemy = cc.instantiate(this.pre_enemy_1);
            }
            str = 'Enemy_1';
            pos_enemy.x = -320 + Math.random() * 640;
            pos_enemy.y = 666 + Math.random() * 200;
        }
        // Create Enemy 2
        else if (enemyType === 2) {
            if (this.enemyPool_2.size() > 0) {
            enemy = this.enemyPool_2.get();
            } else {
                cc.log('pre');
                enemy = cc.instantiate(this.pre_enemy_2);
                cc.log(enemy);
            }
            str = 'Enemy_2';
            cc.log(enemy);
            pos_enemy.x = -320 + Math.random() * 640;
            pos_enemy.y = 666 + Math.random() * 200;
        }
        // Create Enemy 3
        else if (enemyType === 3) {
            if (this.enemyPool_3.size() > 0) {
            enemy = this.enemyPool_3.get();
            } else {
                cc.log('pre');
                enemy = cc.instantiate(this.pre_enemy_3);
                cc.log(enemy);
            }
            str = 'Enemy_3';
            cc.log(enemy);
            pos_enemy.x = -300 + Math.random() * 600;
            pos_enemy.y = 740 + Math.random() * 200;
        }
        
        enemy.parent = this.node;
        var js = enemy.getComponent(str)
        cc.log(js);
        if (js) {
            cc.log(`componet ${str} exists...`);
            js.init();
        }
        //var pos = cc.v2(0, 666);
        enemy.setPosition(pos_enemy);
    },

    // Put the bullet back to the pool
    onEnemyKilled: function (enemy, enemyType) {
        if (enemyType === 1) {
            this.enemyPool_1.put(enemy);
        }
        else if (enemyType === 2) {
            this.enemyPool_2.put(enemy);
        }
        else if (enemyType === 3) {
            this.enemyPool_3.put(enemy);
        }
    },

    update(dt) {
        if (this.isBgMove) {
            this.setBg();
        }

        var randomNumberEnemy = 5;
        if ( this.gameType === this.GameTypePlaying) {
            this.gameTime++;

            // Every 5 sec, increase difficulty
            if (this.gameTime % 300 === 0) {
                randomNumberEnemy = randomNumberEnemy + Math.round(this.gameTime / 300);
                if (randomNumberEnemy > 20) {
                    randomNumberEnemy = 20;
                }
                this.randomNum[0] = this.randomNum[0] - 2;
                this.randomNum[1] = this.randomNum[1] - 1;
                if (this.randomNum[0] < 40) {
                    this.randomNum[0] = 40;
                }
                if (this.randomNum[1] < 70) {
                    this.randomNum[1] = 70;
                } 
            }
        }

        this.bulletTime++;
        // cc.log('type: ', this.gameType);
        // if (this.gameType !== this.GameTypePlaying) return;
        if (this.bulletTime === 8) {
            this.bulletTime = 0;
            if (this.gameType === this.GameTypePlaying) {
                this.createBullet();
            }
        }

        this.enemyTime++;
        if (this.enemyTime === 120) { 
            this.enemyTime = 0;
            var num_random = Math.floor(Math.random() * randomNumberEnemy) + 1;
            for (var i = 0; i < num_random; i++) {
                if (game.gameType === game.GameTypePlaying || game.gameType === game.GameTypeOver) { // Playing

                    // Create an enemy
                    var num = Math.random() * 100;
                    if (num < this.randomNum[0]) {
                        this.createEnemy(1);
                    }
                    else if (num < this.randomNum[1]) {
                        this.createEnemy(2);
                    }
                    else if (num < this.randomNum[2]) {
                        this.createEnemy(3);
                    }
                }
            }
            
        }  
    },

        // getAllUsers
    getAllUsers() {
        cc.log('getAllUsers...');
        var http = 'http://';
        var domain = 'localhost';
        var url  = http + domain + "/api/records/users/";
        var xhr  = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onload = function () {
            var users = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                cc.console(users);
            } else {
                cc.error(users);
            }
        }
        xhr.send(null);
    },

    // getSingleUser
    getSingleUser(userId) {
        cc.log('getSingleUser...' + userId);

        // Get a user
        var http = 'http://';
        var domain = 'localhost';
        var url  = http + domain + "/api/records/users/" + userId;
        var xhr  = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onload = function () {
            var users = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                cc.log('getSingleUser...' + users);
            } else {
                cc.error(users);
            }
        }
        xhr.send(null);
    },

    // createNewUser
    createNewUser(userName) {
        cc.log('postNewUser...' + userName);

        // Post a user
        var http = 'http://';
        var domain = 'localhost';
        var url  = http + domain + "/api/records/users";
        var data = {};
        data.name = userName;
        var json = JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.onload = function () {
            var users = JSON.parse(xhr.responseText);
            cc.log(xhr.readyState + ':' + xhr.status);
            if (xhr.readyState == 4 && xhr.status == "200") {
                cc.log('createNewUser ... ' + users);
            } else {
                cc.error(users);
            }
        }
        xhr.send(json);
    },

    // updateScore
    updateScore(userId, newScore) {
        cc.log('postNewUser...' + userId + ':' + newScore);

        // Update a user
        var http = 'http://';
        var domain = 'localhost';
        var url  = http + domain + "/api/records/users/" + userId;
        var data = {};
        data.score = newScore;
        var json = JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.onload = function () {
            var users = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                cc.log('updateScore...' + users);
            } else {
                cc.error(users);
            }
        }
        xhr.send(json);
    },

    // updateEnable
    updateEnable(userId, enable) {
        cc.log('updateEnable...' + userId + ':' + enable);

        // Update a user
        var http = 'http://';
        var domain = 'localhost';
        var url  = http + domain + "/api/records/users/" + userId;
        var data = {};
        data.enable = enable;
        var json = JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.onload = function () {
            var users = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                cc.log('updateEnable...' + users);
            } else {
                cc.error(users);
            }
        }
        xhr.send(json);
    },
});
