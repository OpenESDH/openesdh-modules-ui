angular
        .module('openeApp.doctemplates')
        .factory('docTemplatesService', docTemplatesService);

function docTemplatesService() {
    var service = {
        log: log
    };
    return service;

    function log() {
        console.log('doc templates is alive!');
    }
}