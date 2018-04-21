/* IoT monitor window */

/* Import pixi.js */
import * as PIXI from 'pixi.js';

/* Aliases */
const PxApplication = PIXI.Application;
const PxContainer = PIXI.Container;
const PxLoader = PIXI.loader;
const PxResources = PIXI.loader.resources;
const PxTextureCache = PIXI.utils.TextureCache;
const PxSprite = PIXI.Sprite;
const PxRectangle = PIXI.Rectangle;
const PxText = PIXI.Text;
const PxGraphics = PIXI.Graphics;

/* Import assets */
import './assets/icon.png';
import './assets/cat.png';

/* My modules */
import { scaleToWindow } from './scaleToWindow';

class IoTMon {
    constructor(appBody) {
        /* Sensors items */
        this.sensors = new Array();
        this.sensorTickCounter = 0.0;

        this.appBody = appBody;

        /* Pixi.js example */
        this.pixiApp = new PxApplication({
            width: 640,
            height: 640,
            backgroundColor: 0x4b87f4,
            antialias: true,
            autoResize: true
        });

        this.appBody.appendChild(this.pixiApp.view);

        this.scale = 1.0;
        this.gameState = this.gamePlay;

        this.textures = [
            {
                name: 'tex-icon',
                url: 'assets/icon.png',
                onComplete: () => {
                    console.log('Completed icon');
                }
            },
            {
                name: 'tex-cat',
                url: 'assets/cat.png',
                onComplete: () => {
                    console.log('Completed cat');
                }
            }
        ];

        /* Load these textures */
        PxLoader.add([this.textures])
            .on('progress', (loader, resource) => {
                console.log('Loading ... ' + resource.url + ' ' + loader.progress + ' %');
                if (null != resource.error) {
                    console.log(' Error: ' + resource.error);
                }
            })
            .load(() => {
                console.log('All files loaded!');

                /* Reinit state */
                this.gameState = this.gamePlay;

                /* Begin setup */
                this.loadImage();

                /* Begin game loop */
                this.pixiApp.ticker.add(delta => this.gameLoop(delta));
            });

        // /* Make stage interactive */
        // this.pixiApp.stage.interactive = true;
        // this.pixiApp.stage.on('click', () => {
        //     console.log('Stage clicked!');
        // });
    }

    autoScale() {
        /* Auto scale window */
        this.scale = scaleToWindow(this.pixiApp.renderer.view);
        console.log('New scale: ' + this.scale);
    }

    loadImage() {
        // let ball = new PxSprite(PxResources['assets/icon.png'].texture);
        // let cat = new PxSprite(PxResources['assets/cat.png'].texture);
        let ball = new PxSprite(PxResources[this.textures[0].name].texture);
        ball.position.set(50, 50);
        let cat = new PxSprite(PxResources[this.textures[1].name].texture);
        cat.position.set(10, 10);
        let cat2 = new PxSprite(PxResources[this.textures[1].name].texture);
        cat2.position.set(30, 30);
        /* Add the picture */
        this.pixiApp.stage.addChild(ball);
        this.pixiApp.stage.addChild(cat);
        this.pixiApp.stage.addChild(cat2);
        console.log('Ball & cat loaded?');

        /* Set cat velocities */
        cat.vx = 0;
        cat.vy = 0;
        cat2.vy = 0;
        cat2.vy = 0;

        /* Create a circle */
        let circle = new PxGraphics();
        circle.lineStyle(1, 0x33ff33, 1);
        circle.beginFill(0x33ff33, 0.8);
        circle.drawCircle(0, 0, 20);
        circle.endFill();
        circle.x = 10;
        circle.y = 10;
        let circle_text = new PxText('100 degC');
        circle_text.style = { fill: 'black', fontSize: '16px', fontFamily: 'courier' };
        circle_text.x = 35;
        circle_text.y = 2;

        /* Create container for circle object with text */
        let circle_cont = new PxContainer();
        circle_cont.addChild(circle);
        circle_cont.addChild(circle_text);
        circle_cont.x = 200;
        circle_cont.y = 200;
        circle_cont.updateText = text => {
            circle_text.text = text;
        };
        this.pixiApp.stage.addChild(circle_cont);

        /* Make circle container interactive */
        circle_cont.interactive = true;
        circle_cont.on('click', () => {
            console.log('Circle container clicked!');
        });

        /* Add circle container to stage */

        /* Load cat1 and cat2 objects into sensors for testing purpose */
        this.sensors.push(cat);
        this.sensors.push(cat2);
        this.sensors.push(circle_cont);
    }

    updateTickCounter(glDelta) {
        this.sensorTickCounter += 1.0 + glDelta;
        if (this.sensorTickCounter > 60.0) this.sensorTickCounter = 0.0;
        return this.sensorTickCounter;
    }

    gameLoop(delta) {
        /* Update state */
        this.gameState(delta);
    }

    gamePlay(delta) {
        /* Get current game timeloop */
        let temp_gl_counter = this.updateTickCounter(delta);

        /* Blinking sensor item */
        if (temp_gl_counter < 50.0) {
            this.sensors[1].visible = true;
        } else {
            this.sensors[1].visible = false;
        }

        /* Move Sprite */
        this.sensors[0].vx = 2;
        this.sensors[0].vy = 0;
        this.sensors[0].x += this.sensors[0].vx;
        if (this.sensors[0].x > 400) {
            this.sensors[0].x = 100;
        }

        this.sensors[2].updateText('ASA: ' + temp_gl_counter);
    }
}

export default IoTMon;
