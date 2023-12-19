//@ts-check
import Phaser from "phaser";
import { TileMap } from "../tilemap";
import {
	WIDTH,
	HEIGHT,
	TILE_SIZE,
	events,
	COIN_COLLECTED_EVENT,
	scoreSpan,
	restartDialog,
	ASSET_KEYS,
	SCENE_KEYS,
} from "../constants";
import { CoinsGroup } from "../entities/coins";
import { EnemiesGroup } from "../entities/enemies";
import { Player } from "../entities/player";

export class MainScene extends Phaser.Scene {
	constructor() {
		super({
			key: SCENE_KEYS.main,
			active: true,
		});

		/** @type {TileMap} */ //@ts-ignore setup in create()
		this.map;
		/** @type {Player} */ //@ts-ignore setup in create()
		this.player;
		/** @type {CoinsGroup} */ //@ts-ignore setup in create()
		this.coins;
		/** @type {EnemiesGroup} */ //@ts-ignore setup in create()
		this.enemies;

		this.coinNoise;
		this.music;

		this.score = 0;
	}

	init() {
		this.score = 0;
	}

	preload() {
		this.load.atlas(ASSET_KEYS.player, "robot.png", "robot.json");
		this.load.image(ASSET_KEYS.tileset.marble, "tilesets/marble.png");
		this.load.image(ASSET_KEYS.tileset.rock, "tilesets/rock.png");
		this.load.image(ASSET_KEYS.tileset.sand, "tilesets/sand.png");
		this.load.image(ASSET_KEYS.tileset.stone, "tilesets/stone.png");
		this.load.tilemapTiledJSON(ASSET_KEYS.map, "tilesets/map.json");
		this.load.image(ASSET_KEYS.coin, "coin.png");
		this.load.image(ASSET_KEYS.enemy, "spikeBall.png");
		this.load.audio(ASSET_KEYS.audio.coin, "coin.mp3");
		this.load.audio(ASSET_KEYS.audio.jump, "jump.wav");
		this.load.audio(ASSET_KEYS.audio.music, "background-music.mp3");
	}

	create() {
		this.scene.launch(SCENE_KEYS.ui);
		this.physics.world.setBounds(0, 0, WIDTH, HEIGHT);
		this.map = new TileMap(this.make.tilemap({ key: ASSET_KEYS.map }));

		this.coins = new CoinsGroup(this.physics.add.group());

		this.player = new Player(
			this.physics.add.sprite(
				this.map.playerSpawn.x,
				this.map.playerSpawn.y,
				ASSET_KEYS.player,
				"character_robot_idle.png"
			),
			this
		);

		this.enemies = new EnemiesGroup(
			this.physics.add.group(),
			this.map.enemySpawnPoints
		);

		this.setupAudio();
		this.setupCamera();
		this.setupCollisions();
	}

	setupAudio() {
		this.coinNoise = this.sound.add(ASSET_KEYS.audio.coin);
		this.music = this.sound.add(ASSET_KEYS.audio.music, {
			loop: true,
			volume: 0.2,
		});
		this.music.play();
	}

	setupCollisions() {
		this.physics.add.collider(this.coins.group, this.map.platforms);
		this.physics.add.collider(this.coins.group, this.coins.group);
		this.physics.add.collider(this.player.sprite, this.map.platforms);
		this.physics.add.collider(this.enemies.group, this.map.platforms);
		this.physics.add.collider(this.enemies.group, this.enemies.group);
		this.physics.add.collider(this.enemies.group, this.coins.group);

		this.physics.add.overlap(
			this.player.sprite,
			this.coins.group,
			this.collectCoin,
			undefined,
			this
		);

		this.physics.add.overlap(
			this.player.sprite,
			this.enemies.group,
			this.hitPlayer,
			undefined,
			this
		);

		this.physics.add.overlap(
			this.enemies.group,
			this.map.platforms,
			this.enemyBounce,
			undefined,
			this
		);
	}

	setupCamera() {
		this.cameras.main.setBounds(0, 0, WIDTH, HEIGHT);
		this.cameras.main.startFollow(this.player.sprite);
		this.cameras.main.zoom = 1.5;
	}

	update() {
		this.player?.update();
	}

	collectCoin(player, coin) {
		this.score++;
		events.emit(COIN_COLLECTED_EVENT, this.score);

		scoreSpan.innerText = this.score.toString();

		coin.disableBody(true, true);
		this.coinNoise?.play();

		// spawn an enemy for every 4 coins collected
		if (this.coins.group.countActive() % 4 === 0) {
			this.enemies?.spawn();
		}

		this.coins?.respawn();
	}

	hitPlayer(player, enemy) {
		this.physics.pause();
		// light blue death color for Hawkin
		this.player?.sprite.setTint(0x0000bb);
		this.music?.stop();
		restartDialog.showModal();
	}

	enemyBounce(enemy, platform) {
		enemy.setAcceleration(
			Phaser.Math.FloatBetween(-200, 200),
			Phaser.Math.FloatBetween(-200, 200)
		);
	}
}
