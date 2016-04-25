
angular
        .module('openeApp.google.docs')
        .provider('googleDocsService', GoogleDocsServiceProvider);
function GoogleDocsServiceProvider() {

    this.$get = GoogleDocsService;
    /*
     * list from org.alfresco.integrations.google.docs.service.GoogleDocsServiceImpl.importFormats
     */
    var supportedMimetypes = [
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint',
        'text/tab-separated-values',
        'application/vnd.sun.xml.writer',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/rtf',
        'application/msword',
        'application/vnd.oasis.opendocument.text',
        'text/plain',
        'text/csv',
        'application/x-vnd.oasis.opendocument.spreadsheet',
        'application/vnd.oasis.opendocument.spreadsheet',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    function GoogleDocsService($http, ALFRESCO_URI, $window, $mdDialog, $translate, $q, $location, $compile,
            notificationUtilsService) {
        
        var gAuthErrors = ['authError', 'dailyLimitExceededUnreg'];
        
        var service = {
            uploadContent: uploadContent,
            saveContent: saveContent,
            resumeEditing: resumeEditing,
            discardContent: discardContent,
            isSupportedFormat: isSupportedFormat
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
                var OAUTH_WINDOW_WIDTH = 500;
                var OAUTH_WINDOW_HEIGHT = 630;

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

                var popup = window.open(authURL, "GDOAuth", "menubar=no,location=no,resizable=no,scrollbars=yes,status=no,width=" + OAUTH_WINDOW_WIDTH + ",height=" + OAUTH_WINDOW_HEIGHT + ",modal=yes"); // returns straight away
            });
        }

        function getStateUrl() {
            return $location.$$protocol + "://" + $location.$$host + ($location.$$port ? ':' + $location.$$port : '') + ALFRESCO_URI.webClientServiceProxy + "/";
        }

        /*
         * executes action with double google auth checking
         * 
         * @param {type} _scope
         * @param {type} action - webscript call function to execute
         * @param {type} nodeRef - nodeRef of document
         * @param {type} onSuccess
         * @param {type} onFailure
         */
        function _executeWithGLogin(_scope, action, nodeRef, onSuccess, onFailure){
            //check google auth cookie or do login
            _checkGoogleAuth(_scope, function() {
                //try action
                action(nodeRef).then(onSuccess, function(response) {
                    //if google authorization error
                    parseGoogleDocsError(response).then(function() {
                        //do login
                        _authurl(function() {
                            //retry action
                            action(nodeRef).then(onSuccess, onFailure);
                        });
                    }, onFailure); //else reject
                });
            });
        }


        /*
         * uploads document to google docs for editing.
         */
        function uploadContent(_scope, nodeRef) {
            var uplCont = $q.defer();
            var success = function(response) {
                console.log(response);
                $window.open(response.data.editorUrl, "_blank");
                uplCont.resolve(response);
            };
            _executeWithGLogin(_scope, _uploadContent, nodeRef, success, uplCont.reject);
            return uplCont.promise;
        }
        
        function _uploadContent(nodeRef) {
            return $http.post(ALFRESCO_URI.webClientServiceProxy + '/googledocs/uploadContent?nodeRef=' + nodeRef, {}, {errorHandler: 'skip'});
        }

        function saveContent(_scope, nodeRef) {
            var uplCont = $q.defer();
            _executeWithGLogin(_scope, _saveContent, nodeRef, uplCont.resolve, uplCont.reject);
            return uplCont.promise;
        }

        function _saveContent(nodeRef) {
            return $http.post(ALFRESCO_URI.webClientServiceProxy + '/googledocs/saveContent',
                    {
                        nodeRef: nodeRef,
                        override: false,
                        removeFromDrive: true,
                        majorVersion: false,
                        description: ''
                    },
                    {
                        errorHandler: 'skip'
                    });
        }

        function resumeEditing(_scope, editorURL) {
            return _checkGoogleAuth(_scope, function() {
                $window.open(editorURL, "_blank");
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
                _executeWithGLogin(_scope, _discardContent, nodeRef, discard.resolve, discard.reject);
            }, function() {
                discard.resolve(false);
            });
            return discard.promise;
        }

        function _discardContent(nodeRef) {
            return $http.post(ALFRESCO_URI.webClientServiceProxy + '/googledocs/discardContent',
                    {
                        nodeRef: nodeRef,
                        override: false
                    },
                    {
                        errorHandler: 'skip'
                    });
        }

        function isSupportedFormat(mimetype) {
            return mimetype && supportedMimetypes.indexOf(mimetype) > -1;
        }

        function parseGoogleDocsError(response) {
            try {
                var gError = angular.fromJson(response.data.error.message.substr(response.data.error.message.indexOf('\n')));
                if (gAuthErrors.indexOf(gError.errors[0].reason) > -1) {
                    return $q.when(gError.errors[0]);
                }
                notificationUtilsService.alert($translate.instant('GOOGLE.DOCS.SERVICE_ERROR', gError));
            } catch (err) {
                notificationUtilsService.notifyError($translate.instant('ERROR.UNEXPECTED_ERROR'));
            }
            $q.reject(response);
        }
    }
}