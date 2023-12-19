//@ts-check
import Phaser from "phaser";

export const TILE_SIZE = 18;
export const WIDTH = 88 * TILE_SIZE;
export const HEIGHT = 40 * TILE_SIZE;

export const events = new Phaser.Events.EventEmitter();

export const COIN_COLLECTED_EVENT = "coin-collected";

/** @type {HTMLDialogElement} */ //@ts-ignore
export const restartDialog = document.getElementById("restart-dialog");
/** @type {HTMLElement} */ //@ts-ignore
export const scoreSpan = document.getElementById("score-span");
/** @type {HTMLButtonElement} */ //@ts-ignore
export const restartButton = document.getElementById("restart-button");

/** @type {HTMLDialogElement} */ //@ts-ignore
export const startDialog = document.getElementById("start-dialog");
/** @type {HTMLButtonElement} */ //@ts-ignore
export const startButton = document.getElementById("start-button");

export const SCENE_KEYS = {
	main: "main-scene",
	ui: "ui-scene",
};

export const ASSET_KEYS = {
	player: "robot",
	coin: "coin",
	enemy: "enemy",
    map: "map",
	tileset: {
		marble: "marble",
		rock: "rock",
		sand: "sand",
		stone: "stone",
	},
	audio: {
		coin: "coin-noise",
		jump: "jump-noise",
		music: "music",
	},
};
