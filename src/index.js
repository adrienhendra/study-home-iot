/* Files to bundle */
import './style.css';
// import './index.html';

/* Import bootstrap */
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

/* Import firebase */
// import { app } from 'firebase';

/* Import my modules */
import IoTMon from './iotmon';

var test = () => {
    console.log('Hello World');
    //   alert("Heeeei!");
};

console.log('Test 2');
test();

console.log('Test 3');

{
    /* Get document element */
    const appWinContainer = document.getElementById('app-container');

    let appWin = new IoTMon(appWinContainer);
}
