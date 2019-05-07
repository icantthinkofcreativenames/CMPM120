var game = new Phaser.Game(600, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });
//use the tutorial from http://phaser.io/tutorials/making-your-first-phaser-2-game
function preload() {
	// preload assets
		game.load.image('sky', 'assets/img/sky.png');
		game.load.image('ground', 'assets/img/platform.png');
		game.load.image('star', 'assets/img/star.png');
		game.load.spritesheet('dude','assets/img/dude.png', 32, 48);
		game.load.image('diamond','assets/img/diamond.png');
		game.load.spritesheet('baddie','assets/img/baddie.png', 32, 32);
}

var platforms;
var stars;
var diamond;
var score = 100;
var scoreText;
function create() {
	// place your assets

	//the arcade physic system
	game.physics.startSystem(Phaser.Physics.ARCADE);
	//background for the game
	game.add.sprite(0,0,'sky');
	//contain the ground and 2 of the ledges

	platforms = game.add.group();
	//physic for any object in this group
		platforms.enableBody = true;
	// the ground
		var ground = platforms.create(0,game.world.height -50,'ground');
	//scale the ground to fit width of the game
			ground.scale.setTo(2, 2);
	//stops it from falling away when you jump on it
			ground.body.immovable = true;
	//create a 1st ledge
		var ledge = platforms.create(450,450,'ground');
			ledge.body.immovable = true;
	//create a 2nd ledge
		ledge = platforms.create(-265,320,'ground');
			ledge.body.immovable = true;
	//create a 3rd ledge
		ledge = platforms.create(-180,500,'ground');
			ledge.body.immovable = true;
	// create a 4th ledge
		ledge = platforms.create(350,650,'ground');
			ledge.body.immovable = true;
	//The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    // physics on the player
    game.physics.arcade.enable(player);
    //slight bounce to the player
    	player.body.bounce.y = 0.2;
    //gravity of the player
    	player.body.gravity.y = 300;
    //collision detection
    	player.body.collideWorldBounds = true;
    // two animation, left and right
    	player.animations.add('left', [0, 1, 2, 3], 10, true);
    	player.animations.add('right', [5, 6, 7, 8], 10, true);

    //baddies and its setting
    baddie = game.add.sprite(100,200,'baddie');
    baddie2 = game.add.sprite(369,100,'baddie');
    //physics of the baddie
    	game.physics.arcade.enable(baddie);
    	game.physics.arcade.enable(baddie2);
    //gravity of the baddie
    	baddie.body.gravity.y = 300;
    	baddie2.body.gravity.y = 300;
    //collision detection
    	baddie.body.collideWorldBounds = true;
    	baddie2.body.collideWorldBounds = true;
    
    //animation for the baddies
    	baddie.animations.add('left', [0, 1], 10, true);
    	baddie2.animations.add('right', [2,3], 10, true);

    //star group
    stars = game.add.group();
    //collision for star
    	stars.enableBody = true;
    //12 stars that is created evenly spaced apart
    	for (var i = 0; i < 12; i++)
    	{
    	//create a star inside stars group
    		var star = stars.create(i * 70, 0, 'star');
    	//gravity on the star
    		star.body.gravity.y = 300;
    	//slight bounce to it
    		star.body.bounce.y = 0.7+Math.random()*0.3;
    	}
    //diamond 
    diamonds = game.add.group();
    	diamonds.enableBody = true;
    	var diamond = diamonds.create(200*Math.random()+200,100*Math.random()+200,'diamond');

    //score
     
}

function update() 
{
	// run game loop
	var hitPlatform = game.physics.arcade.collide(player, platforms);
	cursors = game.input.keyboard.createCursorKeys();
	//reset the velocity
	player.body.velocity.x = 0;
		if(cursors.left.isDown)
		{
	//move to the left
			player.body.velocity.x = -150;

			player.animations.play('left');
		}
		else if(cursors.right.isDown)
		{
	//move to the right
			player.body.velocity.x = 150;
			player.animations.play('right');
		}
		else
		{
	//standing still
			player.animations.stop();
			player.frame = 4;
		}

		baddie.animations.play('left');
		baddie2.animations.play('right');

	//allow the player to jump if they are touching the ground
		if(cursors.up.isDown && player.body.touching.down && hitPlatform)
		{
			player.body.velocity.y = -350;
		}

	//check star collision against platform
	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.collide(diamonds,platforms);
	game.physics.arcade.collide(baddie,platforms);
	game.physics.arcade.collide(baddie2,platforms);
	//check to see if player overlap the star or not
	game.physics.arcade.overlap(player, stars, collectStar, null, this);
		function collectStar (player, star) 
		{
    // Removes the star from the screen
    		star.kill();
 	//Add and update the score
 				score+=10;
 				scoreText.text = 'Score: ' + score;
		}	
	//check to see if player overlap the baddies
	game.physics.arcade.overlap(player, baddie, collectBaddie, null, this);
		function collectBaddie(player,baddie)
		{
	//Add and update the score,get rid of the sprite on screen
			baddie.kill();
				score+=-25
				scoreText.text = 'Score:' + score;
		}
	//check to see if player overlap the baddies2
	game.physics.arcade.overlap(player, baddie2, collectBaddie2, null, this);
		function collectBaddie2(player,baddie2)
		{
	//Add and update the score,get rid of the sprite on screen
			baddie2.kill();
				score+=-25
				scoreText.text = 'Score:' + score;
		}	

	game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);
		function collectDiamond(player,diamond)
		{
	//Add and update the score,get rid of the sprite on screen
			diamond.kill();
				score+=50;
				scoreText.text = 'Score:' + score;
 		}
}

