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

/* Default constants */
const DEF_NODATA = null;

class DigitalControlRemote {
    constructor(name, x, y, pixiAppRef, ctrlObj = null) {
        this.name = name;
        this.controlObjects = ctrlObj;
        this.x = x;
        this.y = y;
        this.pixiAppRef = pixiAppRef;

        /* Texture pack to use is fixed */
        this.textureRef = PxResources['control-textures'].textures;

        /* Functions bind */
        this.updateControl = this.updateControl.bind(this);
        this.readVal = this.readVal.bind(this);
        this.getChannelName = this.getChannelName.bind(this);
        this.redraw = this.redraw.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);

        /* Create object facade */
        this.sprites = new Object();
        if (undefined !== typeof this.controlObjects && null != this.controlObjects) {
            let temp_y_container_offset = 0;
            Object.keys(this.controlObjects).forEach(k => {
                Console.log(
                    `Added control object ${this.controlObjects[k].name} with initial value of ${
                        this.controlObjects[k].val
                    } with type of ${this.controlObjects[k].type}`
                );

                /* Create sprite */
                let remote_container = new PxContainer();
                let remote_sprite = null;
                let remote_text = null;

                /* Select appropriate image */
                switch (this.controlObjects[k].type) {
                    case 'light-switch':
                        remote_sprite = new PxSprite(this.textureRef['lamp-auto.png']);
                        /* Make container interactive */
                        remote_container.interactive = true;

                        break;
                    default:
                        Console.log('Unsupported type');
                }

                /* Values are always string */
                remote_text = new PxText(this.controlObjects[k].val);
                remote_text.style = { fill: 'black', fontSize: '24px', fontFamily: 'courier' };

                /* Attach function as property to update the sprite */
                remote_container.updateVal = text => {
                    remote_text.text = text;
                };

                remote_container.readVal = () => {
                    return remote_text.text;
                };

                if (true === remote_container.interactive) {
                    remote_container.on('click', () => {
                        this.onClickHandler(k, this.name, this.controlObjects[k].name);
                    });
                }

                /* Calculate position of sprite */
                let text_x_offset = 0;
                let text_y_offset = 0;
                let max_y_size = 0;
                if (null !== remote_sprite) {
                    /* Resize sprite to 32x32px */
                    remote_sprite.scale.set(32.0 / remote_sprite.width);

                    remote_sprite.position.set(0, 0);
                    remote_container.addChild(remote_sprite);
                    text_x_offset = remote_sprite.width + 5;
                    text_y_offset = 0;
                    max_y_size = remote_sprite.height;
                }
                remote_text.position.set(text_x_offset, text_y_offset);

                remote_container.addChild(remote_text);

                /* Set remote container position */
                remote_container.position.set(this.x + 0, this.y + temp_y_container_offset);

                /* Update y offset */
                temp_y_container_offset += (max_y_size > remote_text.height ? max_y_size : remote_text.height) + 5;

                /* Add container to Application */
                this.pixiAppRef.stage.addChild(remote_container);

                /* Record containers */
                this.sprites[this.controlObjects[k].name] = remote_container;
            });
        }
    }

    updateControl(channel, value, sendSignal) {
        let temp_val = this.controlObjects[channel];
        if (undefined !== typeof temp_val && null != temp_val) {
            /* Channel available */
            Console.log(
                `[DIGITAL] Name: ${this.name} ${this.controlObjects[channel].name}, Ch: ${channel}, Val: ${value}`
            );
            /* Update control value here */
            this.controlObjects[channel].val = value;

            /* TODO: Emit actual changes here */
            if (true === sendSignal) {
                /* Send signal to MQTT */
                Console.log('Send signal to MQTT');
            }
        } else {
            /* Channel not available */
            Console.log(
                `[DIGITAL] Name: ${this.name} ${
                    this.controlObjects[channel].name
                }, Ch: ${channel}, Val: ${value} is not available.`
            );
        }

        /* Redraw sprite */
        this.redraw();
    }

    readVal(channel) {
        let temp_val = this.controlObjects[channel];
        let read_val = DEF_NODATA;
        if (undefined !== typeof temp_val && null != temp_val) {
            read_val = this.controlObjects[channel].val;
        }
        // PxResources['chime'].sound.play();

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

    onClickHandler(idx, objectName, channelName) {
        Console.log(`${objectName} ${channelName} clicked!`);
        let curr_val = parseInt(this.readVal(idx));
        Console.log(`Current value for channel ${idx} is ${curr_val}`);
        if (-1 === curr_val) {
            Console.log('Please wait until remote is ready.');
            return;
        }

        if (0 === curr_val) {
            this.updateControl(idx, 1, true);
        } else {
            this.updateControl(idx, 0, true);
        }
        Console.log(`New value for channel ${idx} is ${this.readVal(idx)}`);
        PxResources['chime'].sound.play();
    }

    redraw() {
        Object.keys(this.controlObjects).forEach(k => {
            this.sprites[this.controlObjects[k].name].updateVal(this.controlObjects[k].val);
        });
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
