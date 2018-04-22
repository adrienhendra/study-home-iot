/* Sensors class */

/* Import glboal objects */
import {
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
} from './iotmon';
/* Aliases */
// const PxApplication = PIXI.Application;
// const PxContainer = PIXI.Container;
// const PxLoader = PIXI.loader;
// const PxResources = PIXI.loader.resources;
// // const PxTextureCache = PIXI.utils.TextureCache;
// const PxSprite = PIXI.Sprite;
// const PxRectangle = PIXI.Rectangle;
// const PxText = PIXI.Text;
// const PxGraphics = PIXI.Graphics;

/* Alias for my console debug */
// const Console = console;

/* Assets */

/* Default constants */
const DEF_NODATA = null;

class DigitalControlRemote {
    constructor(name, ctrlObj = null) {
        this.name = name;
        this.controlObjects = ctrlObj;

        /* Functions bind */
        this.updateControl = this.updateControl.bind(this);
        this.readVal = this.readVal.bind(this);
        this.getChannelName = this.getChannelName.bind(this);

        /* Create object facade */
        this.sprites = new Object();
        if (undefined !== typeof this.controlObjects && null != this.controlObjects) {
            Object.keys(this.controlObjects).forEach(k => {
                Console.log(
                    `Added control object ${this.controlObjects[k].name} with initial value of ${
                        this.controlObjects[k].val
                    }`
                );
            });
        }
    }

    updateControl(channel, value) {
        let temp_val = this.controlObjects[channel];
        if (undefined !== typeof temp_val && null != temp_val) {
            /* Channel available */
            Console.log(`[DIGITAL] Name: ${this.name}, Ch: ${channel}, Val: ${value}`);

            /* TODO: Send out new channel value */
        } else {
            /* Channel not available */
            Console.log(`[DIGITAL] Name: ${this.name}, Ch: ${channel}, Val: ${value} is not available.`);
        }
    }

    readVal(channel) {
        let temp_val = this.controlObjects[channel];
        let read_val = DEF_NODATA;
        if (undefined !== typeof temp_val && null != temp_val) {
            read_val = this.controlObjects[channel].val;
        }
        PxResources['chime'].sound.play();

        return read_val;
    }

    getChannelName(channel) {
        let temp_val = this.controlObjects[channel];
        let read_val = DEF_NODATA;
        if (undefined !== typeof temp_val && null != temp_val) {
            read_val = this.controlObjects[channel].name;
        }
        return read_val;
    }
}

class AnalogControlRemote {
    constructor(name, ctrlObj = null) {
        this.name = name;
        this.controlObjects = ctrlObj;
        this.updateControl = this.updateControl.bind(this);
        this.readVal = this.readVal.bind(this);
        this.getChannelName = this.getChannelName.bind(this);
    }

    updateControl(channel, value) {
        let temp_val = this.controlObjects[channel];
        if (undefined !== typeof temp_val && null != temp_val) {
            /* Channel available */
            Console.log(`[ANALOG] Name: ${this.name}, Ch: ${channel}, Val: ${value}`);

            /* TODO: Send out new channel value */
        } else {
            /* Channel not available */
            Console.log(`[ANALOG] Name: ${this.name}, Ch: ${channel}, Val: ${value} is not available.`);
        }
    }

    readVal(channel) {
        let temp_val = this.controlObjects[channel];
        let read_val = DEF_NODATA;
        if (undefined !== typeof temp_val && null != temp_val) {
            read_val = this.controlObjects[channel].val;
        }
        return read_val;
    }

    getChannelName(channel) {
        let temp_val = this.controlObjects[channel];
        let read_val = DEF_NODATA;
        if (undefined !== typeof temp_val && null != temp_val) {
            read_val = this.controlObjects[channel].name;
        }
        return read_val;
    }
}

/* Exports */
export { DigitalControlRemote, AnalogControlRemote };
