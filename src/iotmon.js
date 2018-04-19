/* IoT monitor window */

/* Import pixi.js */
import * as PIXI from 'pixi.js';

/* Aliases */
const PxApplication = PIXI.Application;
const PxLoader = PIXI.loader;
const PxResources = PIXI.loader.resources;
const PxSprite = PIXI.Sprite;

/* Import assets */
import './assets/icon.png';
import './assets/cat.png';

/* My modules */
import { scaleToWindow } from './scaleToWindow';

class IoTMon {
    constructor(container) {
        // Pixi.js example
        this.pixiApp = new PxApplication({
            width: 800,
            height: 600,
            backgroundColor: 0x4b87f4,
            antialias: true,
            autoResize: true
        });

        this.container = container;
        this.scale = 1.0;

        this.container.appendChild(this.pixiApp.view);

        var basicText = new PIXI.Text('Hello IoT');
        basicText.x = 50;
        basicText.y = 100;

        this.pixiApp.stage.addChild(basicText);

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
    }

    autoScale() {
        /* Auto scale window */
        this.scale = scaleToWindow(this.pixiApp.renderer.view);
        console.log('New scale: ' + this.scale);
    }

    loadImage() {
        /* Load sprite */
        PxLoader.add([this.textures])
            .on('progress', (loader, resource) => {
                console.log('Loading ... ' + resource.url + ' ' + loader.progress + ' %');
                if (null != resource.error) {
                    console.log(' Error: ' + resource.error);
                }
            })
            .load(() => {
                console.log('All files loaded!');
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
            });
    }
}

export default IoTMon;
