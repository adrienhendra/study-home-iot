/* Include jQuery module, better to be before any other scripts */
import $ from 'jquery';

/* Import bootstrap */
import 'bootstrap';
import 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';

/* Then jquery */
import 'webpack-jquery-ui';
import 'webpack-jquery-ui/css';

/* Event emitter module */
import * as EE from 'event-emitter';

/* Files to bundle */
import './style.css';
import './home.png';

/* Import firebase */
// import { app } from 'firebase';

/* Import my modules */
import IoTMon from './iotmon';

/* Alias for my console debug */
const Console = console;

const FIXED_HOST = 'ws://192.168.232.130:8081'; // VM
const MQTT_USER = 'iotuser';
const MQTT_PASSWORD = 'iot12345';

/* Load when document is ready */
$(() => {
    /* Get document element */
    const appWinContainer = document.getElementById('app-container');

    /* Set default hostname */
    $('#app-input-hostname').val(FIXED_HOST);
    $('#app-input-username').val(MQTT_USER);
    $('#app-input-password').val(MQTT_PASSWORD);

    let appWin = new IoTMon(appWinContainer);

    /* Need to fix this in the future ... */
    appWin.addStatusMonitor((ok, msg) => {
        if (true == ok) {
            $('#app-connection-status-text').text(msg);
            $('#app-connection-status')
                .removeClass('alert-danger')
                .addClass('alert-success');
        } else {
            $('#app-connection-status-text').text(msg);
            $('#app-connection-status')
                .removeClass('alert-success')
                .addClass('alert-danger');
        }
    });

    /* Create a button */
    let connect_btn = $('#app-btn-connect').button();
    connect_btn.on('click', () => {
        let host = $('#app-input-hostname').val();
        let user = $('#app-input-username').val();
        let pass = $('#app-input-password').val();
        Console.log(`Connecting to ${host} ${user} ${pass}`);
        appWin.mqttConnect(host, user, pass);
        Console.log('Monitoring connected!');
    });

    let disconnect_btn = $('#app-btn-disconnect').button();
    disconnect_btn.on('click', () => {
        appWin.mqttDisconnect();
        Console.log('Monitoring disconnected!');
    });
});
