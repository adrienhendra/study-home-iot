/* Include jQuery module, better to be before any other scripts */
import $ from 'jquery';

/* Import bootstrap */
import 'bootstrap';
import 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';

/* Then jquery */
import 'webpack-jquery-ui';
import 'webpack-jquery-ui/css';

/* Files to bundle */
import './style.css';
import './home.png';

/* Import firebase */
// import { app } from 'firebase';

/* Import my modules */
import IoTMon from './iotmon';

/* Alias for my console debug */
const Console = console;

var test = () => {
    Console.log('Hello World');
    //   alert("Heeeei!");
};

Console.log('Test 2');
test();

Console.log('Test 3');

$(() => {
    /* Get document element */
    const appWinContainer = document.getElementById('app-container');

    let appWin = new IoTMon(appWinContainer);

    /* Create a button */
    let connect_btn = $('#app-btn-connect').button();
    connect_btn.on('click', () => {
        appWin.mqttConnect(null);
        Console.log('Monitoring connected!');
        $('#app-connection-status-text').text('MQTT Connected!');
        $('#app-connection-status').removeClass('alert-danger').addClass('alert-success');
    });

    let disconnect_btn = $('#app-btn-disconnect').button();
    disconnect_btn.on('click', () => {
        appWin.mqttDisconnect();
        Console.log('Monitoring disconnected!');
        $('#app-connection-status-text').text('MQTT Disconnected!');        
        $('#app-connection-status').removeClass('alert-success').addClass('alert-danger');        
    });
});
