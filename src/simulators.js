/* Files to bundle */
import './style.css';
import './home.png';

/* Import bootstrap */
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
Console.log('SIM: Test 4');
Console.log('SIM: Test 5i');

{
    /* Get document element */
    const appSimWinContainer = document.getElementById('app-sim-container');

    // let appWin = new IoTMon(appWinContainer);
}
