// Escena del Menú
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // Carga de imágenes para el menú
        this.load.image('button', 'images/button.png');
        this.load.image('logo', 'images/logo.png');

        // Carga de música para el menú
        this.load.audio('menuMusic', 'music/inicio.mp3');
    }

    create() {
        // Reproduce la música del menú
        this.menuMusic = this.sound.add('menuMusic');
        this.menuMusic.play({ loop: false });

        // Añade el logo al centro de la pantalla y lo escala
        this.add.image(400, 200, 'logo').setOrigin(0.5).setScale(0.5);

        // Añade un botón de inicio y define su interacción para cambiar a la escena del juego
        let startButton = this.add.sprite(400, 350, 'button').setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        // Añade texto al botón de inicio
        this.add.text(323, 335, 'Iniciar Juego', { fontSize: '20px', fill: '#fff', fontFamily: 'Minecraftia' });

        // Añade un botón de puntuaciones y define su interacción para cambiar a la escena de puntuaciones
        let highScoresButton = this.add.sprite(400, 450, 'button').setInteractive();
        highScoresButton.on('pointerdown', () => {
            this.scene.start('HighScoresScene');
        });
        // Añade texto al botón de puntuaciones
        this.add.text(320, 436, 'Puntuaciones', { fontSize: '20px', fill: '#fff', fontFamily: 'Minecraftia' });
    }
}

// Escena del Juego
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    resetBricks() {
        // Borra los bloques existentes
        this.bricks.clear(true, true);
        
        // Regenera los bloques
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 5; y++) {
                let brick = this.bricks.create(100 + x * 80, 100 + y * 40, 'brick');
                brick.setScale(3.5);
                brick.setTint(this.colors[Phaser.Math.Between(0, this.colors.length - 1)]);
                brick.refreshBody();
            
            }
        }
    }

    preload() {
        // Carga de imágenes necesarias para la escena del juego
        this.load.image('ball', 'images/ball.png');
        this.load.image('paddle', 'images/paddle.png');
        this.load.image('brick', 'images/brick.png');
        this.load.image('menu', 'images/menu.png');
        this.load.image('reinicio', 'images/reinicio.png');
        this.load.image('powerA', 'images/powerA.png');
        this.load.image('powerB', 'images/powerB.png');
        this.load.image('powerC', 'images/powerC.png');
        this.load.image('powerD', 'images/powerD.png');
        this.load.image('powerE', 'images/powerE.png');
        this.load.image('powerF', 'images/powerF.png');

        // Carga de música y sonidos para la escena del juego
        this.load.audio('gameMusic', 'music/iniciojuego.mp3');
        this.load.audio('extraLifeSound', 'music/vidaextra.mp3');
        this.load.audio('gameOverSound', 'music/gameover.mp3');
    }

    create() {
        // Música y sonidos del juego
        this.gameMusic = this.sound.add('gameMusic');
        this.extraLifeSound = this.sound.add('extraLifeSound');
        this.gameOverSound = this.sound.add('gameOverSound');

        // Inicialización de colores para los bloques y sprites de poderes
        this.colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
        this.powerUpSprites = ['powerA', 'powerB', 'powerC', 'powerD', 'powerE', 'powerF'];
        this.activePowerUps = this.physics.add.group();

        // Configuración del texto de cuenta regresiva
        this.countdownText = this.add.text(400, 300, '3', { fontSize: '64px', fill: '#fff', fontFamily: 'Minecraftia' });
        this.countdownText.setOrigin(0.5);

        // Configuración del texto de vidas
        this.lives = 3;
        this.livesText = this.add.text(725, 16, 'Vidas: 3', { fontSize: '15px', fill: '#fff', fontFamily: 'Minecraftia' });

        // Inicia la cuenta regresiva antes de comenzar el juego
        this.startCountdown();
    }

    startCountdown() {
        let countdownTime = 3;

        // Cuenta regresiva que actualiza el texto cada segundo
        const countdownInterval = setInterval(() => {
            countdownTime--;
            this.countdownText.setText(countdownTime.toString());

            // Cuando la cuenta regresiva llega a cero, oculta el texto y empieza el juego
            if (countdownTime <= 0) {
                clearInterval(countdownInterval);
                this.countdownText.setVisible(false);
                this.startGame();
            }
        }, 1000);
    }

    startGame() {
        // Reproduce la música del juego
        this.gameMusic.play({ loop: false });

        // Configuración de la pelota
        this.ball = this.physics.add.image(400, 300, 'ball');
        this.ball.setScale(2.5);
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1);
        this.ball.setVelocity(Phaser.Math.Between(-200, 200), -300);

        // Configuración de la raqueta
        this.paddle = this.physics.add.image(400, 550, 'paddle');
        this.paddle.setScale(2);
        this.paddle.setImmovable(true);

        // Configuración de los bloques
        this.bricks = this.physics.add.staticGroup();
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 5; y++) {
                var brick = this.bricks.create(100 + x * 80, 100 + y * 40, 'brick');
                brick.setScale(3.5);
                brick.setTint(this.colors[Phaser.Math.Between(0, this.colors.length - 1)]);
                brick.refreshBody();
            }
        }

        // Configuración de la puntuación
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Puntuación: 0', { fontSize: '15px', fill: '#fff', fontFamily: 'Minecraftia' });

        // Configuración del texto de Game Over
        this.gameOverText = this.add.text(400, 300, '', { fontSize: '15px', fill: '#fff', fontFamily: 'Minecraftia' });
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setVisible(false);

        // Configuración de controles
        this.cursors = this.input.keyboard.createCursorKeys();

        // Configuración de colisiones entre objetos
        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);
        this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
        this.physics.add.collider(this.paddle, this.activePowerUps, this.collectPowerUp, null, this);

        this.isGameOver = false;
    }

    update() {
        // Actualiza la posición de la raqueta según las teclas de cursor
        if (this.isGameOver) return;

        if (this.paddle && this.cursors) {
            if (this.cursors.left.isDown) {
                this.paddle.setVelocityX(-600);
            } else if (this.cursors.right.isDown) {
                this.paddle.setVelocityX(600);
            } else {
                this.paddle.setVelocityX(0);
            }

            // Limita el movimiento de la raqueta dentro de los bordes del juego
            if (this.paddle.x < 40) {
                this.paddle.x = 40;
            } else if (this.paddle.x > 760) {
                this.paddle.x = 760;
            }

            // Llama a removeLife si la pelota cae debajo de la raqueta
            if (this.ball.y > this.paddle.y) {
                this.removeLife();
            }
        }

        // Actualiza la posición de los poderes activos y los elimina si salen de la pantalla
        this.activePowerUps.getChildren().forEach(powerUp => {
            powerUp.setY(powerUp.y + 2);

            if (powerUp.y > this.sys.canvas.height) {
                powerUp.destroy();
            }
        });
    }

    hitPaddle(ball, paddle) {
        // Calcula la dirección y velocidad de rebote de la pelota al golpear la raqueta
        var diff = 0;

        if (ball.x < paddle.x) {
            diff = paddle.x - ball.x;
            ball.setVelocityX(-10 * diff);
        } else if (ball.x > paddle.x) {
            diff = ball.x - paddle.x;
            ball.setVelocityX(10 * diff);
        } else {
            ball.setVelocityX(2 + Math.random() * 8);
        }
    }

    hitBrick(ball, brick) {
        // Desactiva el bloque y actualiza la puntuación
        brick.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Puntuación: ' + this.score);

        // Genera un poder aleatorio con una probabilidad del 20%
        if (Phaser.Math.Between(0, 4) === 0) {
            let powerUpType = Phaser.Math.RND.pick(this.powerUpSprites);
            let powerUp = this.add.sprite(brick.x, brick.y, powerUpType).setOrigin(0.5);
            powerUp.setScale(3.5);
            this.physics.add.existing(powerUp);
            this.activePowerUps.add(powerUp);
        }

        // Restaura los bloques si todos han sido destruidos y aumenta la velocidad de la pelota
        if (this.bricks.countActive() === 0) {
        this.resetBricks(); // Llama a la nueva función para reiniciar los bloques
        this.ball.setVelocity(this.ball.body.velocity.x * 1.1, this.ball.body.velocity.y * 1.1);
    }
    }

    collectPowerUp(paddle, powerUp) {
        // Destruye el poder y aplica el efecto correspondiente
        powerUp.destroy();
        this.activePowerUps.remove(powerUp);

        switch (powerUp.texture.key) {
            case 'powerA':
                this.duplicateBall();
                break;
            case 'powerB':
                this.increaseBallSpeed();
                break;
            case 'powerC':
                this.addExtraLife();
                break;
            case 'powerD':
                this.expandPaddle();
                break;
            case 'powerE':
                this.shrinkPaddle();
                break;
            case 'powerF':
                this.changeBallColor();
                break;
        }
    }

    duplicateBall() {
        // Duplica la pelota y agrega colisiones con la raqueta y los bloques
        let ball1 = this.physics.add.image(this.ball.x, this.ball.y, 'ball');
        let ball2 = this.physics.add.image(this.ball.x, this.ball.y, 'ball');
        ball1.setScale(2.5);
        ball2.setScale(2.5);
        ball1.setBounce(1);
        ball2.setBounce(1);
        ball1.setCollideWorldBounds(true);
        ball2.setCollideWorldBounds(true);
        ball1.setVelocity(Phaser.Math.Between(-200, 200), -300);
        ball2.setVelocity(Phaser.Math.Between(-200, 200), -300);

        this.physics.add.collider(ball1, this.paddle, this.hitPaddle, null, this);
        this.physics.add.collider(ball2, this.paddle, this.hitPaddle, null, this);
        this.physics.add.collider(ball1, this.bricks, this.hitBrick, null, this);
        this.physics.add.collider(ball2, this.bricks, this.hitBrick, null, this);

        // Destruye las pelotas duplicadas después de 5 segundos
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                ball1.destroy();
                ball2.destroy();
            }
        });
    }

    increaseBallSpeed() {
        // Aumenta la velocidad de la pelota y la restaura después de 5 segundos
        this.ball.setVelocity(this.ball.body.velocity.x * 1.5, this.ball.body.velocity.y * 1.5);
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.ball.setVelocity(this.ball.body.velocity.x / 1.5, this.ball.body.velocity.y / 1.5);
            }
        });
    }

    addExtraLife() {
        // Añade una vida extra y actualiza el texto de vidas
        this.lives++;
        this.livesText.setText('Vidas: ' + this.lives);

        // Reproduce el sonido de vida extra
        this.extraLifeSound.play();
    }

    expandPaddle() {
        // Expande la raqueta y la restaura a su tamaño original después de 5 segundos
        this.paddle.setScale(3);
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.paddle.setScale(2);
            }
        });
    }

    shrinkPaddle() {
        // Reduce el tamaño de la raqueta y la restaura a su tamaño original después de 5 segundos
        this.paddle.setScale(1);
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.paddle.setScale(2);
            }
        });
    }

    changeBallColor() {
    // Cambia el color de fondo a blanco
    this.cameras.main.backgroundColor.setTo(255, 255, 255);

    // Restaura el color original después de 5 segundos
    this.time.addEvent({
        delay: 5000,
        callback: () => {
            this.cameras.main.backgroundColor.setTo(0, 0, 0); // Cambia al color original (puedes ajustar esto si el color original es diferente)
        }
    });
    }

    removeLife() {
        // Reduce el número de vidas y muestra el texto de Game Over si se acabaron las vidas
        this.lives--;
        this.livesText.setText('Vidas: ' + this.lives);

        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.resetBall();
        }
    }

    resetBall() {
        // Restaura la posición y velocidad de la pelota
        this.ball.setPosition(400, 300);
        this.ball.setVelocity(Phaser.Math.Between(-200, 200), -300);
    }

    gameOver() {
        // Muestra el texto de Game Over y gestiona la puntuación alta
        this.isGameOver = true;
        this.ball.setVelocity(0);
        this.paddle.setVelocity(0);
        this.gameOverText.setText('¡Game Over!\nPuntuación Final: ' + this.score);
        this.gameOverText.setVisible(true);

        this.gameMusic.stop();
        this.gameOverSound.play();

        // Guarda la puntuación en el almacenamiento local y muestra los botones de reinicio y menú
        let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push(this.score);
        highScores = highScores.sort((a, b) => b - a).slice(0, 10);
        localStorage.setItem('highScores', JSON.stringify(highScores));

        this.restartButton = this.add.image(400, 380, 'reinicio').setOrigin(0.5).setInteractive();
        this.menuButton = this.add.image(400, 450, 'menu').setOrigin(0.5).setInteractive();

        // Reinicia el juego o regresa al menú al hacer clic en los botones
        this.restartButton.on('pointerdown', () => {
            this.scene.restart();
            this.restartButton.destroy();
            this.menuButton.destroy();
        });

        this.menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
            this.restartButton.destroy();
            this.menuButton.destroy();

            this.gameOverSound.stop();
        });
    }
}

// Escena de Mejores Puntuaciones
class HighScoresScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HighScoresScene' });
    }

    create() {
        // Muestra el título de mejores puntuaciones
        this.add.text(400, 50, 'Mejores Puntuaciones', { fontSize: '30px', fill: '#fff', fontFamily: 'Minecraftia' }).setOrigin(0.5);

        // Muestra las puntuaciones altas guardadas
        let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.forEach((score, index) => {
            this.add.text(400, 100 + index * 30, `${index + 1}. ${score}`, { fontSize: '20px', fill: '#fff', fontFamily: 'Minecraftia' }).setOrigin(0.5);
        });

        // Añade un botón para volver al menú
        let backButton = this.add.sprite(400, 550, 'button').setInteractive();
        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
        this.add.text(365, 538, 'Volver', { fontSize: '20px', fill: '#fff', fontFamily: 'Minecraftia' });
    }
}

// Configuración del juego
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MenuScene, GameScene, HighScoresScene]
};

// Iniciar el juego
const game = new Phaser.Game(config);