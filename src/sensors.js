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

/* Assets */

class TemperatureSensor {
    constructor(name) {
        this.name = name;
    }
}

class HumiditySensor {
    constructor() {}
}

class BarometerSensor {
    constructor() {}
}

class LightSensor {
    constructor() {}
}

class MotionSensor {
    constructor() {}
}

class SoundSensor {
    constructor() {}
}

class PresenceSensor {
    constructor() {}
}

class WaterLevelSensor {
    constructor() {}
}

class WeatherSensor {
    constructor() {}
}

class ButtonSensor {
    constructor() {}
}

class SlideSensor {
    constructor() {}
}

class RotarySensor {
    constructor() {}
}

/* Exports */
export {
    TemperatureSensor,
    HumiditySensor,
    BarometerSensor,
    LightSensor,
    MotionSensor,
    SoundSensor,
    PresenceSensor,
    WaterLevelSensor,
    WeatherSensor,
    ButtonSensor,
    SlideSensor,
    RotarySensor
};
