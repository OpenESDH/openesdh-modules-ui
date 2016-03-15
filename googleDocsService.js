
angular
        .module('openeApp.google.docs')
        .factory('googleDocsService', GoogleDocsService);
function GoogleDocsService($http, ALFRESCO_URI, $window, $mdDialog, $translate, $q, $location, $compile, $rootScope) {

    var service = {
        uploadContent: uploadContent,
        saveContent: saveContent,
        resumeEditing: resumeEditing,
        discardContent: discardContent
    };
    return service;

    function _checkGoogleAuth(_scope, onLogedIn) {
        var imgEl = angular.element('<img id="gauthimg" ng-hide>');
        imgEl.attr('src', "https://accounts.google.com/CheckCookie?" +
                "continue=https%3A%2F%2Fwww.google.com%2Fintl%2Fen%2Fimages%2Flogos%2Faccounts_logo.png&" +
                "followup=https%3A%2F%2Fwww.google.com%2Fintl%2Fen%2Fimages%2Flogos%2Faccounts_logo.png&" +
                "chtml=LoginDoneHtml&checkedDomains=youtube&checkConnection=youtube%3A291%3A1&" +
                "ts=" + new Date().getTime());
        imgEl.on('load', function(event) {
            onLogedIn();
            imgEl.remove();
        });
        imgEl.on('error', function(event) {
            _authurl(onLogedIn);
            imgEl.remove();
        });
        $compile(imgEl)(_scope);
    }

    function _authurl(onLogedIn) {
        $http.get(ALFRESCO_URI.webClientServiceProxy + '/googledocs/authurl', {
            params: {
                state: getStateUrl(),
                override: true,
                nodeRef: null
            }
        }).then(function(response) {
            //do google login
            var authURL = response.data.authURL;
            var OAUTH_WINDOW_WIDTH = 480;
            var OAUTH_WINDOW_HEIGHT = 480;

            /**
             * google login popup callback function
             */
            if (!window.Alfresco) {
                angular.merge(window, {
                    Alfresco: {
                        GoogleDocs: {
                        }
                    }
                });
            }
            window.Alfresco.GoogleDocs.onOAuthReturn = onLogedIn;

            /*
             * borrowed from google docs plugin
             */
            if (typeof window.showModalDialog == "function" && document.documentMode) {
                //ie
                var returnVal = window.showModalDialog(authURL, {onOAuthReturn: onLogedIn}, "dialogwidth:" + OAUTH_WINDOW_WIDTH + ";dialogheight:" + OAUTH_WINDOW_HEIGHT); // only returns on popup close
            } else {
                var popup = window.open(authURL, "GDOAuth", "menubar=no,location=no,resizable=no,scrollbars=yes,status=no,width=" + OAUTH_WINDOW_WIDTH + ",height=" + OAUTH_WINDOW_HEIGHT + ",modal=yes"); // returns straight away
            }
        });
    }

    function getStateUrl() {
        return $location.$$protocol + "://" + $location.$$host + ($location.$$port ? ':' + $location.$$host : '') + ALFRESCO_URI.webClientServiceProxy + "/";
    }

    function uploadContent(_scope, nodeRef) {
        var uplCont = $q.defer();
        _checkGoogleAuth(_scope, function() {
            $http.post(ALFRESCO_URI.webClientServiceProxy + '/googledocs/uploadContent?nodeRef=' + nodeRef, {}).then(
                    function(response) {
                        console.log(response);
                        $window.open(response.data.editorUrl, "_blank");
                        uplCont.resolve(response);
                    }, uplCont.reject);
        });
        return uplCont.promise;
    }

    function saveContent(_scope, nodeRef) {
        var uplCont = $q.defer();
        _checkGoogleAuth(_scope, function() {
            $http.post(ALFRESCO_URI.webClientServiceProxy + '/googledocs/saveContent',
                    {
                        nodeRef: nodeRef,
                        override: false,
                        removeFromDrive: true,
                        majorVersion: false,
                        description: ''
                    }).then(uplCont.resolve, uplCont.reject);
        });
        return uplCont.promise;
    }

    function resumeEditing(_scope, file) {
        return _checkGoogleAuth(_scope, function() {
            $window.open(file.googledocs.editorURL, "_blank");
        });
    }

    function discardContent(_scope, nodeRef) {
        var discard = $q.defer();
        var confirm = $mdDialog.confirm()
                .title($translate.instant('COMMON.CONFIRM'))
                .textContent($translate.instant('GOOGLE.DOCS.ARE_YOU_SURE_YOU_WANT_TO_CANCEL'))
                .ariaLabel('Cancel editing in Google Docs confirmation')
                .targetEvent(null)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));
        $mdDialog.show(confirm).then(function() {
            return _checkGoogleAuth(_scope, function() {
                $http.post(ALFRESCO_URI.webClientServiceProxy + '/googledocs/discardContent',
                        {
                            nodeRef: nodeRef,
                            override: false
                        })
                        .then(discard.resolve, discard.reject);
            });
        }, discard.reject);
        return discard.promise;
    }
}