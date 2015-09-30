require('angular/angular');

var piratesApp = angular.module('piratesApp', []);
require('./pirates/pirates')(piratesApp);
