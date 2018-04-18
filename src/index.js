import 'phaser';

/* Import firebase */
import * as firebase from 'firebase';

// Initialize Firebase
var fb_config = {
  apiKey: 'AIzaSyDbNOykje9_Se35J7aPtqoGVKHtJx3Zavo',
  authDomain: 'study-home-iot.firebaseapp.com',
  databaseURL: 'https://study-home-iot.firebaseio.com',
  projectId: 'study-home-iot',
  storageBucket: 'study-home-iot.appspot.com',
  messagingSenderId: '210399166672'
};
var db = firebase.initializeApp(fb_config).database();
console.log(fb_config);

var phaser_config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  }
};
console.log(phaser_config);

var game = new Phaser.Game(phaser_config);

function preload() {
  this.load.image('logo', 'assets/logo.png');
}

function create() {
  var logo = this.add.image(400, 150, 'logo');

  this.tweens.add({
    targets: logo,
    y: 450,
    duration: 2000,
    ease: 'Power2',
    yoyo: true,
    loop: -1
  });
}
