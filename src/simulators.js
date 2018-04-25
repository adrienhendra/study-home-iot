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

/* Files to bundle */
import './style.css';
import './home.png';

/* Alias for my console debug */
const Console = console;

// const SRV_IP_ADDRESS = 'iot-rpi-00.local';
// const SRV_IP_ADDRESS = '192.168.1.6';
const SRV_IP_ADDRESS = '192.168.232.130';

const FIXED_HOST = 'ws://192.168.232.130:8081'; // VM
const MQTT_USER = 'iotuser';
const MQTT_PASSWORD = 'iot12345';

/*****************************************************************************/
let mqttClient = null;
let mqttState = false;

/*****************************************************************************/
/* UI Update */
function updateStatusMonitor(ok, msg) {
    if (true == ok) {
        $('#sim-connection-status-text').text(msg);
        $('#sim-connection-status')
            .removeClass('alert-danger')
            .addClass('alert-success');
    } else {
        $('#sim-connection-status-text').text(msg);
        $('#sim-connection-status')
            .removeClass('alert-success')
            .addClass('alert-danger');
    }
}

/*****************************************************************************/
/* MQTT function */
function mqttConnect(hostUrl, username, password) {
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
            username: username,
            password: password,
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
                Console.log('MQTT Connect!');
                updateStatusMonitor(true, 'MQTT connect!');
            });

            mqttClient.on('reconnect', () => {
                Console.log('MQTT Reconnect!');
                updateStatusMonitor(false, 'MQTT reconnect!');
            });

            mqttClient.on('close', () => {
                Console.log('MQTT close!');
                updateStatusMonitor(false, 'MQTT close!');
            });

            mqttClient.on('offline', () => {
                Console.log('MQTT offline!');
                updateStatusMonitor(false, 'MQTT offline!');
            });

            mqttClient.on('error', error => {
                Console.log(`MQTT error! ${error}`);
                updateStatusMonitor(false, `MQTT error! ${error}`);
            });

            mqttClient.on('end', () => {
                Console.log('MQTT end!');
                updateStatusMonitor(false, 'MQTT disconnected!');
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
function SimStart(updateRate = 1) {
    let temp_updaterate = updateRate * 1000;
    if (temp_updaterate > 60000) temp_updaterate == 60000;
    if (temp_updaterate < 1000) temp_updaterate == 1;
    sim_ticker = setInterval(() => {
        Console.log('Tick...');
        PublishSimulation();
    }, temp_updaterate);
}

function SimStop() {
    if (undefined !== typeof sim_ticker && null != sim_ticker) {
        clearInterval(sim_ticker);
    } else {
        Console.log('Simulation ticker is not yet created!');
    }
}

const SIM_SENSOR = {
    'temp-br1': { 0: 25 },
    'humi-br1': { 0: 70 },
    'temp-br2': { 0: 25 },
    'humi-br2': { 0: 70 },
    'temp-br3': { 0: 25 },
    'humi-br3': { 0: 70 },
    'temp-dr': { 0: 25 },
    'humi-dr': { 0: 70 }
};

const SIM_REMOTES = {
    'digi-br1': { 0: 0, 1: 0 },
    'digi-br2': { 0: 0 },
    'digi-br3': { 0: 0 },
    'digi-dr': { 0: 0, 1: 0, 2: 0, 3: 0 },
    'digi-kit': { 0: 0 },
    'digi-sto': { 0: 0 },
    'digi-gar': { 0: 0, 1: 0, 2: 0 },
    'digi-t0': { 0: 0 },
    'digi-t1': { 0: 0 },
    'digi-t2': { 0: 0 },
    'digi-o0': { 0: 0, 1: 0 },
    'digi-o1': { 0: 0 },
    'digi-o2': { 0: 0 },
    'digi-o3': { 0: 0 },
    'digi-o4': { 0: 0 }
};

function simRandomize(input) {
    return (input * Math.random() + Math.random()).toFixed(1);
}

function simRandomizeBool(input) {
    let rn = Math.random();
    let retval = '0';
    if (rn > 0.5) {
        retval = '1';
    } else {
        retval = '0';
    }

    return retval;
}

function PublishSimulation() {
    if (null != mqttClient && true == mqttState) {
        /* Simulate each sensors */
        Object.keys(SIM_SENSOR).forEach(k => {
            Object.keys(SIM_SENSOR[k]).forEach(c => {
                /* Create topic */
                let topic = `home/sensors/${k}/${c}`;
                let strval = simRandomize(SIM_SENSOR[k][c]);
                Console.log(`Publish: ${topic} ${strval}`);
                mqttClient.publish(topic, strval);
            });
        });

        /* Simulate each remotes */
        Object.keys(SIM_REMOTES).forEach(k => {
            Object.keys(SIM_REMOTES[k]).forEach(c => {
                /* Create topic */
                let topic = `home/remotes/${k}/${c}`;
                let strval = simRandomizeBool(SIM_REMOTES[k][c]);
                Console.log(`Publish: ${topic} ${strval}`);
                mqttClient.publish(topic, strval);
            });
        });

        // mqttClient.publish('home/sensors/humi-br1/0', (Math.random() * 100).toString());
    }
}

/*****************************************************************************/
/* Connect button with jQuery, load when document is ready */
$(() => {
    /* Set default hostname */
    $('#sim-input-hostname').val(FIXED_HOST);
    $('#sim-input-username').val(MQTT_USER);
    $('#sim-input-password').val(MQTT_PASSWORD);

    let connect_btn = $('#sim-btn-connect').button();
    connect_btn.on('click', () => {
        let host = $('#sim-input-hostname').val();
        let user = $('#sim-input-username').val();
        let pass = $('#sim-input-password').val();
        Console.log(`Connecting to ${host} ${user} ${pass}`);
        /* Stop before startint mqtt*/
        SimStop();
        mqttConnect(host, user, pass);
        Console.log('MQTT connected!');
    });

    let disconnect_btn = $('#sim-btn-disconnect').button();
    disconnect_btn.on('click', () => {
        /* Stop sim before stoping mqtt */
        SimStop();
        mqttDisconnect();
        Console.log('MQTT disconnected!');
    });

    let start_btn = $('#sim-btn-start').button();
    start_btn.on('click', () => {
        let update_rate = $('#sim-spinner-updrate').val();
        SimStart(parseFloat(update_rate));
        Console.log('Simulator started!');
    });

    let stop_btn = $('#sim-btn-stop').button();
    stop_btn.on('click', () => {
        SimStop();
        Console.log('Simulator stopped!');
    });

    let timer_val = $('#sim-spinner-updrate').spinner();
});
