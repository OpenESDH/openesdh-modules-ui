    angular
        .module('openeApp.projectRooms')
        .factory('projectRoomsService', projectRoomsService);
    
    function projectRoomsService($http){
        
        return {
            participantRoles:  ["SiteConsumer", "SiteContributor", "SiteCollaborator", "SiteManager"],
            siteExists: siteExists,
            createSite: createSite,
            getSites: getSites,
            getCaseSites: getCaseSites,
            getSite: getSite,
            getSiteDocuments: getSiteDocuments,
            getSiteDocumentsWithAttachments: getSiteDocumentsWithAttachments,
            updateCaseSite: updateCaseSite,
            closeSite: closeSite,
            getSiteMembers: getSiteMembers,
            inviteParticipants: inviteParticipants,
            getPendingInvites: getPendingInvites,
            cancelInvite: cancelInvite,
            removeMember: removeMember,
            changeMemberRole: changeMemberRole,
            getInvitationByTicket: getInvitationByTicket,
            acceptInvite: acceptInvite,
            rejectInvite: rejectInvite
        };
        
        function siteExists(shortName){
            return $http.get('/api/openesdh/site/' + shortName + '/exists').then(function(response){
                return response.data;
            });            
        }
        
        function getSites(){
            return $http.get('/api/openesdh/case/sites').then(function(response){
                return response.data;
            });
        }
        
        function createSite(caseSite){
            return $http.post('/api/openesdh/case/sites', caseSite).then(function(response){
                return response;
            });
        }
        
        function getCaseSites(caseId){
            return $http.get('/api/openesdh/case/' + caseId + '/sites').then(function(response){
                return response.data;
            });
        }
        
        function getSite(shortName){
            return $http.get('/api/openesdh/sites/' + shortName).then(function(response){
                return response.data;
            });
        }
        
        function getSiteDocuments(shortName){
            return $http.get('/api/openesdh/sites/' + shortName + '/documents').then(function(response){
                return response.data;
            });
        }
        
        function updateCaseSite(site){
            return $http.put('/api/openesdh/case/sites', site).then(function(response){
                return response;
            });
        }
        
        function getSiteDocumentsWithAttachments(shortName){
            return $http.get('/api/openesdh/case/sites/' + shortName + '/documents').then(function(response){
                return response.data;
            });
        }
        
        function closeSite(site){
            return $http.post('/api/openesdh/case/sites/close', site).then(function(response){
                return response.data;
            });
        }
        
        function getSiteMembers(shortName){
            return $http.get('/api/sites/' + shortName + '/memberships', {authorityType: 'USER'}).then(function(response){
                return response.data;
            });
        }
        
        function inviteParticipants(site){
            return $http.post('/api/openesdh/case/sites/members/invite', site).then(function(response){
                return response.data;
            });
        }
        
        function getPendingInvites(shortName){
            return $http.get('/api/sites/' + shortName + '/invitations').then(function(response){
                return response.data.data;
            });
        }
        
        function cancelInvite(siteShortName, inviteId){
            return $http.delete('/api/sites/' + siteShortName + '/invitations/' + inviteId).then(function(response){
                return response.data;
            });
        }
        
        function acceptInvite(inviteId, inviteTicket){
            return inviteResponse(inviteId, inviteTicket, 'accept');
        }
        
        function rejectInvite(inviteId, inviteTicket){
            return inviteResponse(inviteId, inviteTicket, 'reject');
        }
        
        function inviteResponse(inviteId, inviteTicket, action){
            return $http.put('/api/invite/' + inviteId + '/' + inviteTicket + '/' + action).then(function(response){
                return response.data;
            });
        }
        
        function removeMember(shortName, authority){
            return $http.delete('/api/sites/' + shortName + '/memberships/' + authority).then(function(response){
                return response.data;
            });
        }
        
        function changeMemberRole(shortName, authorityFullName, role){
            var data = {
                    role: role,
                    authority: {
                        fullName: authorityFullName
                    }
            };
            return $http.put('/alfresco/s/api/sites/' + shortName + '/memberships', data).then(function(response){
                return response.data;
            });
        }
        
        function getInvitationByTicket(inviteId, inviteTicket){
            return $http.get('/alfresco/s/api/invite/' + inviteId + '/' + inviteTicket).then(function(response){
                return response.data.invite;
            });
        }
    }