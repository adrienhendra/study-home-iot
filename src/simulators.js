/* Include jQuery module, better to be before any other scripts */
import $ from 'jquery';

/* Import bootstrap */
import 'bootstrap';
import 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';

/* Then jquery */
import 'webpack-jquery-ui';
import 'webpack-jquery-ui/css';

/* Include MQTT */
import * as MQTT from 'mqtt';

// /* Import bootstrap */
// import 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

/* Files to bundle */
import './style.css';
import './home.png';

/* Import my modules */
// import IoTMon from './iotmon';

/* Alias for my console debug */
const Console = console;

// const SRV_IP_ADDRESS = 'iot-rpi-00.local';
const SRV_IP_ADDRESS = '192.168.1.6';
const MQTT_USER = 'iotuser';
const MQTT_PASSWORD = 'iot12345';

var test = () => {
    Console.log('SIM: Hello World');
    //   alert("Heeeei!");
};

Console.log('SIM: Test 2');
test();

Console.log('SIM: Test 3');

/*****************************************************************************/
let mqttClient = null;
let mqttState = false;

/* MQTT function */
function mqttConnect(hostUrl) {
    if (false == mqttState) {
        let temp_url = null != hostUrl ? hostUrl : `ws://${SRV_IP_ADDRESS}:8081`;

        /* Create MQTT client */
        mqttClient = MQTT.connect(temp_url, {
            clientId: `mqttjs_${Math.random()
                .toString(16)
                .substr(2, 8)}`,
            protocolId: 'MQTT',
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
            username: MQTT_USER,
            password: MQTT_PASSWORD,
            will: {
                topic: 'WILL',
                payload: 'Goodbye!',
                qos: 0,
                retain: false
            },
            resubscribe: true
        });

        if (undefined !== typeof mqttClient && null !== mqttClient) {
            /* Subscribe to all MQTT events */
            mqttClient.on('connect', () => {
                Console.log('MQTT Connected!');
            });

            mqttClient.on('reconnect', () => {
                Console.log('MQTT Reconnected!');
            });

            mqttClient.on('close', () => {
                Console.log('MQTT close!');
            });

            mqttClient.on('offline', () => {
                Console.log('MQTT offline!');
            });

            mqttClient.on('error', error => {
                Console.log(`MQTT error! ${error}`);
            });

            mqttClient.on('end', () => {
                Console.log('MQTT end!');
            });

            mqttClient.on('message', (topic, message, packet) => {
                Console.log(`MQTT message! ${packet.cmd} - ${packet.topic}: ${message}`);
            });

            mqttClient.on('packetsend', packet => {
                Console.log(`MQTT packet send! ${packet.cmd} - ${packet.topic}`);
            });

            mqttClient.on('packetreceive', packet => {
                Console.log(`MQTT packet received! ${packet.cmd} - ${packet.topic}`);
            });

            /* Subscribe to topic */
            mqttClient.subscribe('home/mon');

            /* Publish test */
            mqttClient.publish('home/0', 'Heylo!');
        }

        mqttState = true;
    } else {
        Console.log('MQTT already connected!');
    }
}

function mqttDisconnect() {
    if (true == mqttState) {
        mqttClient.end(false, () => {
            Console.log('Connection closed!');
        });
        mqttState = false;
    } else {
        Console.log('MQTT already connected!');
    }
}

/*****************************************************************************/
/* Simulator function */
let sim_ticker = null;
function SimStart() {
    sim_ticker = setInterval(() => {
        Console.log('Tick...');
    }, 1000);
}

function SimStop() {
    if (undefined !== typeof sim_ticker && null != sim_ticker) {
        clearInterval(sim_ticker);
    } else {
        Console.log('Simulation ticker is not yet created!');
    }
}

/*****************************************************************************/
/* Connect button with jQuery */
$(() => {
    let connect_btn = $('#sim-btn-connect').button();
    connect_btn.on('click', () => {
        mqttConnect(null);
        Console.log('MQTT connected!');
        $('#sim-connection-status-text').text('MQTT Connected!');
        $('#sim-connection-status')
            .removeClass('alert-danger')
            .addClass('alert-success');
    });

    let disconnect_btn = $('#sim-btn-disconnect').button();
    disconnect_btn.on('click', () => {
        mqttDisconnect();
        Console.log('MQTT disconnected!');
        $('#sim-connection-status-text').text('MQTT Disconnected!');
        $('#sim-connection-status')
            .removeClass('alert-success')
            .addClass('alert-danger');
    });

    let start_btn = $('#sim-btn-start').button();
    start_btn.on('click', () => {
        SimStart();
        Console.log('Simulator started!');
    });

    let stop_btn = $('#sim-btn-stop').button();
    stop_btn.on('click', () => {
        SimStop();
        Console.log('Simulator stopped!');
    });

    let timer_val = $('#sim-timer-spinner').spinner();
});
