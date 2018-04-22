/* IoT monitor window */

/* Import pixi.js */
import * as PIXI from 'pixi.js';
import 'pixi-sound';

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

/* Alias for my console debug */
const Console = console;

/* Import assets */
import './assets/asset-textures.tjson';
import './assets/asset-textures.png';
import './assets/control-textures.tjson';
import './assets/control-textures.png';
import './assets/weather-textures.tjson';
import './assets/weather-textures.png';

/* My modules */
import { scaleToWindow } from './scaleToWindow';
import * as SENSORS from './sensors';
import * as REMOTES from './remotes';

/* Import assets (for testing only) */
import './sounds/chime.mp3';
import './assets/iot-home-textures.tjson';
import './assets/iot-home-textures.png';
import './assets/icon.png';
import './assets/cat.png';

/* IoT Monitor top module */
class IoTMon {
    constructor(appBody) {
        /* Create sensor object to keep track of all sensors */
        // this.sensors = new Obj

        /* Create remote object to keep track of all remotes */



        /* Sensors items */
        this.sensors = new Array();
        this.sensors_dict = new Object();
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

        this.manifest = [
            /* Main assets */
            {
                name: 'asset-textures',
                url: 'assets/asset-textures.json',
                onComplete: () => {
                    Console.log('Completed asset textures');
                }
            },
            {
                name: 'control-textures',
                url: 'assets/control-textures.json',
                onComplete: () => {
                    Console.log('Completed control textures');
                }
            },
            {
                name: 'weather-textures',
                url: 'assets/weather-textures.json',
                onComplete: () => {
                    Console.log('Completed weather textures');
                }
            },
            /* These as for testing purpose only */
            {
                name: 'tex-icon',
                url: 'assets/icon.png',
                onComplete: () => {
                    Console.log('Completed icon');
                }
            },
            {
                name: 'tex-cat',
                url: 'assets/cat.png',
                onComplete: () => {
                    Console.log('Completed cat');
                }
            },
            {
                name: 'chime',
                url: 'sounds/chime.mp3',
                onComplete: () => {
                    Console.log('Completed chime');
                }
            }
        ];

        /* Load manifest */
        PxLoader.add([this.manifest])
            .add('assets/iot-home-textures.json')
            .on('progress', (loader, resource) => {
                Console.log('Loading ... ' + resource.url + ' ' + loader.progress + ' %');
                if (null != resource.error) {
                    Console.log(' Error: ' + resource.error);
                }
            })
            .load(() => {
                Console.log('All files loaded!');

                /* Auto scale */
                // this.autoScale();

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

        /* Test object */
        this.testremotes = new REMOTES.DigitalControlRemote('DIG', {
            0: { name: 'a', val: 0 },
            1: { name: 'b', val: 0 },
            2: { name: 'c', val: 0 }
        });

        // this.testremotes = new REMOTES.DigitalControlRemote('DIG', { 0: { name: 'a', val: 0 } });
        this.testremotes.updateControl(0, 'aa');
        this.testremotes.updateControl(2, 'aa');
        // Console.log(`testremotes value is ${this.testremotes.readVal(0)}`);
        // Console.log(`testremotes value is ${this.testremotes.readVal(2)}`);
    }

    autoScale() {
        /* Auto scale window */
        this.scale = scaleToWindow(this.pixiApp.renderer.view);
        Console.log('New scale: ' + this.scale);
    }

    createSensorNode(name, textureName, sensorType, options, updateFn = null, textureAtlasName = null) {
        let item_sprite = null;

        let x_pos = options.x;
        let y_pos = options.y;

        /* Determine if it is necessary to load texture from texture atlas or not */
        if ('undefined' !== typeof textureAtlasName || null !== textureAtlasName) {
            let tex_ref = PxResources[textureAtlasName].textures;
            item_sprite = new PxSprite(tex_ref[textureName]);
        } else {
            item_sprite = new PxSprite(PxResources[textureName].texture);
        }

        /* Check if sprite is generated properly */
        if ('undefined' !== typeof item_sprite || null !== item_sprite) {
            /* Set sprite options */
            item_sprite.position.set(x_pos, y_pos);

            /* Add special functions */
            let sensor_obj = {
                name: name,
                sensor_type: sensorType,
                sprite: item_sprite,
                update: updateFn
            };

            /* Add to stage array */
            this.sensors_dict[name] = sensor_obj;
        } else {
            Console.log('Something wrong here ...');
        }
    }

    loadImage() {
        /* Draw GUI Frame */
        let gf = PxResources['assets/iot-home-textures.json'].textures;
        let gfsp = new PxSprite(gf['Frame.png']);
        let sp_layout = new PxSprite(gf['Layout.png']);
        let sp_fp = new PxSprite(gf['fish-pond.png']);
        let sp_fsg = new PxSprite(gf['fence-ok.png']);
        // let sp_fsng = new PxSprite(gf['fence-not-ok.png']);
        gfsp.position.set(0, 0);
        sp_layout.position.set(24, 24);
        sp_fp.position.set(400, 360);
        sp_fsg.position.set(24, 24);
        this.pixiApp.stage.addChild(gfsp);
        this.pixiApp.stage.addChild(sp_layout);
        this.pixiApp.stage.addChild(sp_fp);
        this.pixiApp.stage.addChild(sp_fsg);

        let ball = new PxSprite(PxResources['tex-icon'].texture);
        ball.position.set(50, 50);
        let cat = new PxSprite(PxResources['tex-cat'].texture);
        cat.position.set(10, 10);
        let cat2 = new PxSprite(PxResources['tex-cat'].texture);
        cat2.position.set(30, 30);
        /* Add the picture */
        this.pixiApp.stage.addChild(ball);
        this.pixiApp.stage.addChild(cat);
        this.pixiApp.stage.addChild(cat2);
        Console.log('Ball & cat loaded?');

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
            Console.log('Circle container clicked!');
            PxResources['chime'].sound.play();

            let test_sensor = new SENSORS.TemperatureSensor('dummy');
            Console.log(test_sensor.name);
        });

        /* Add circle container to stage */

        /* Load cat1 and cat2 objects into sensors for testing purpose */
        this.sensors.push(cat);
        this.sensors.push(cat2);
        this.sensors.push(circle_cont);

        /* Create new my sensor */
        this.createSensorNode(
            'test',
            'fish-pond.png',
            'water-level-sensor',
            { x: 300, y: 300 },
            null,
            'assets/iot-home-textures.json'
        );

        /* Test adding my new object to the stage */
        this.pixiApp.stage.addChild(this.sensors_dict['test'].sprite);

        /* Test if remotes can access PIXI class or not */
        this.testremotes.readVal(0);
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

        /* Move test sprite */
        this.sensors_dict['test'].sprite.y += 1;
        if (this.sensors_dict['test'].sprite.y > 400) {
            this.sensors_dict['test'].sprite.y = 100;
        }
    }
}

export default IoTMon;

export {
    PxApplication,
    PxContainer,
    PxLoader,
    PxResources,
    PxTextureCache,
    PxSprite,
    PxRectangle,
    PxText,
    PxGraphics,
    Console
};
