//@ts-check
import "./style.css";
import Phaser from "phaser";
import { MainScene } from "./scenes/main";
import { UiScene } from "./scenes/ui";
import {
	SCENE_KEYS,
	restartButton,
	restartDialog,
	startButton,
	startDialog,
} from "./constants";

/** @type {Phaser.Types.Core.GameConfig} */
const config = {
	type: Phaser.WEBGL,
	width: window.innerWidth,
	height: window.innerHeight,
	scene: [MainScene, UiScene],
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 500 },
			//debug: true,
		},
	},
};

const game = new Phaser.Game(config);
game.pause();

function startGame() {
	startDialog.close();
	game.resume();
}

startDialog.showModal();
startDialog.addEventListener("close", startGame);
startButton.addEventListener("click", startGame);

restartButton.addEventListener("click", () => {
	game.scene.start(SCENE_KEYS.main);
	restartDialog.close();
});
