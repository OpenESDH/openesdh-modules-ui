    angular
        .module('openeApp.projectRooms')
        .directive('uniquesite', uniqueSiteDirective);
    
    function uniqueSiteDirective($q, projectRoomsService){
        return {
            require: 'ngModel',
            link : function(scope, elm, attrs, ctrl){
                ctrl.$asyncValidators.uniquesite = function(modelValue, viewValue){
                    if(ctrl.$isEmpty(modelValue)){
                        return $q.when();
                    }
                    
                    var def = $q.defer();
                    
                    projectRoomsService.siteExists(modelValue.trim()).then(function(response){
                       if(true === response.siteExists){
                           def.reject();
                       } else {
                           def.resolve();
                       }
                    });
                    
                    return def.promise;
                } 
            }
        }
    }