/* Include jQuery module, better to be before any other scripts */
import $ from 'jquery';

/* Import bootstrap */
import 'bootstrap';
import 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';

/* Then jquery */
import 'webpack-jquery-ui';
import 'webpack-jquery-ui/css';

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

var test = () => {
    Console.log('SIM: Hello World');
    //   alert("Heeeei!");
};

Console.log('SIM: Test 2');
test();

Console.log('SIM: Test 3');

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

$(() => {
    /* Initialize MQTT client */
});
