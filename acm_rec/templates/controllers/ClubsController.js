var app = angular.module('community');

app.controller('ClubsController', ['$scope', '$rootScope', '$http', '$location', '$window', '$routeParams', '$timeout',
    function($scope, $rootScope, $http, $location, $window, $routeParams, $timeout) {
        $scope.addMemberDiv = false;
        $scope.getClubs = function() {
            $http.get('/api/clubs/getClubs').success(function(response) {
                $scope.clubs = response;
            });
        }

        $scope.getClub = function() {
            var currentId = $routeParams.id;
            $rootScope.loadingDiv = true;
            $http.get(backendUrl + '/api/clubs/viewClub/' + currentId)
                .success(function(response) {
                    $scope.club = response.data;
                    $rootScope.loadingDiv = false;
                }).error(function(data) {
                    $rootScope.loadingDiv = false;
                });
        }

        $scope.getPer = function(next) {
            $http.get(backendUrl + '/api/clubs/per/' + $scope.depId)
                .then(function(response) {
                        $scope.permission = true;
                        jQuery('.ratingLabel').hover(function() {
                            jQuery(this).css('cursor', 'pointer');
                        });
                    },
                    function(response) {
                        $scope.permission = false;
                    });
        }

        $scope.viewMemebers = function(id, backDiv, next = null) {
            $rootScope.loadingDiv = true;
            $http.get(backendUrl + '/api/clubs/membersOfSingleDepartment/' + id)
                .success(function(response) {
                    $rootScope.loadingDiv = false;
                    $rootScope.backgroundDiv = backDiv;
                    $scope.tableTopDiv = true;
                    $scope.depId = id;
                    $scope.dep = response;
                    $scope.nest = false;
                    $scope.members = response.members;
                    $scope.depHeadFlag = response.head.profileId != null && response.head.profileId != 'none';
                    $scope.getPer(next);
                })
                .error(function(response) {
                    $rootScope.handleErrors(response);
                });
        }

        $scope.viewMemebersNest = function(depId, subDepId, backDiv, next = null) {
            $rootScope.loadingDiv = true;
            $http.get(backendUrl + '/api/clubs/membersOfNestedDepartment/' + depId + '/' + subDepId).success(function(response) {
                    $rootScope.loadingDiv = false;
                    $rootScope.backgroundDiv = backDiv;
                    $scope.tableTopDiv = true;
                    $scope.depId = depId;
                    $scope.subDepId = subDepId;
                    $scope.dep = response.subDepartment;
                    $scope.nest = true;
                    $scope.depHeadFlag = response.subDepartment.head.profileId != null && response.subDepartment.head.profileId != 'none';
                    $scope.members = response.subDepartment.members;
                    $scope.getPer(next);
                })
                .error(function(response) {
                    $rootScope.handleErrors(response);
                });
        }

        $scope.showAddMember = function(depID) {
            $scope.tableTopDiv = false;
            $scope.addMemberDiv = true;
        }

        $scope.viewAllMembers = function() {
            var clubId = $routeParams.id;
            $rootScope.loadingDiv = true;
            $http.get(backendUrl + '/api/clubs/viewAllMembers/' + clubId).success(function(response) {
                $rootScope.loadingDiv = false;
                $scope.club = response.club;
                $scope.members = response.members;
            });
        }

        $scope.viewReview = function(name, review) {
            $rootScope.backgroundDiv = true;
            $scope.name = name;
            $scope.review = review;
            jQuery('#reviewDiv').show();
        }

        $scope.addNewDepartment = function() {
            $scope.newDep.headPhoto = $scope.headPhoto;
            $rootScope.loadingDiv = true;
            var fd = new FormData();

            var data = $scope.newDep;
            for (var key in data) {
                // console.log(key + " => " + data[key]);
                fd.append(key, data[key]);
            }
            $http.post(backendUrl + '/api/clubs/addDepartment', fd, {
                    transformRequest: angular.indentity,
                    headers: { 'Content-Type': undefined }
                }).success(function(response) {
                    $rootScope.printMsg(response);
                    $timeout(function() {
                        $window.location.reload();
                    }, 1000);
                })
                .error(function(response) {
                    $rootScope.loadingDiv = true;
                    $rootScope.handleErrors(response)
                });
        }

        $scope.deleteDep = function(id) {
            $rootScope.loadingDiv = true;
            $http({
                    url: backendUrl + '/api/clubs/deleteDepartment/' + id,
                    method: "POST",
                })
                .then(function(response) {
                        $rootScope.loadingDiv = false;
                        $scope.club.departments.forEach(function(department, index) {
                            if (id == department._id) {
                                $scope.club.departments.splice(index, 1);
                            }
                        });
                    },
                    function(response) {
                        $rootScope.handleErrors(response);
                    });
        }

        $scope.addPhoto = function() {
            $rootScope.loadingDiv = true;
            var fd = new FormData();
            fd.append('picture', $scope.picture);
            fd.append('caption', $scope.newPic.caption)
            $http.post(backendUrl + '/api/clubs/addPhoto', fd, {
                    transformRequest: angular.indentity,
                    headers: { 'Content-Type': undefined }
                }).success(function(response) {
                    $rootScope.msg = response.msg;
                    $rootScope.loadingDiv = false;
                    $scope.club.photos.push(response.picture);
                    $scope.newPic = {};
                })
                .error(function(response) {
                    $rootScope.loadingDiv = true;
                    $rootScope.error = "";
                    response.errors.forEach(function(errror) {
                        $rootScope.error += error.msg;
                    });
                });
        }

        $scope.updateLogo = function() {
            $rootScope.loadingDiv = true;
            var fd = new FormData();
            fd.append('logoPhoto', $scope.logoPhoto);
            $http.post(backendUrl + '/api/clubs/updateLogo', fd, {
                    transformRequest: angular.indentity,
                    headers: { 'Content-Type': undefined }
                }).success(function(response) {
                    $rootScope.msg = response.msg;
                    $rootScope.loadingDiv = false;
                    $scope.company.logo = response.url;
                })
                .error(function(response) {
                    $rootScope.loadingDiv = true;
                    $rootScope.handleErrors(response);
                });
        }

        $scope.updatePresident = function() {
            $scope.newPres.presidentPhoto = $scope.presidentPhoto;
            $rootScope.loadingDiv = true;
            var fd = new FormData();
            var data = $scope.newPres;
            for (var key in data) {
                fd.append(key, data[key]);
            }
            $http.post(backendUrl + '/api/clubs/updatePresident', fd, {
                    transformRequest: angular.indentity,
                    headers: { 'Content-Type': undefined }
                }).success(function(response) {
                    $rootScope.msg = response.msg;
                    $window.scrollTo(0, 0);
                    $rootScope.loadingDiv = false;
                    $scope.club.president = response.president;
                    $scope.newPres = {};
                })
                .error(function(response) {
                    $rootScope.loadingDiv = true;
                    $rootScope.error = "";
                    response.errors.forEach(function(error) {
                        $rootScope.error += error.msg;
                    });
                });
        }

        $scope.addMember = function() {
            $scope.newMember.departmentID = $scope.depId;
            var url = backendUrl + '/api/clubs/addMember';
            if ($scope.nest) {
                $scope.newMember.subDepartmentID = $scope.dep._id;
                url += '/sub';
            }
            $scope.addMemberDiv = false;
            $rootScope.loadingDiv = true;
            $http({
                    url: url,
                    method: "POST",
                    data: $scope.newMember
                })
                .then(function(response) {
                        $rootScope.loadingDiv = false;
                        $rootScope.backgroundDiv = false;
                        $scope.newMember = {};
                        $scope.newMember.role = 'member';
                        $scope.msg = response.data.msg;
                        $scope.printMsg(response);
                    },
                    function(response) {
                        $rootScope.loadingDiv = false;
                        $scope.addMemberDiv = true;
                        $rootScope.handleErrors(response);
                    });
        }

        $scope.getAllClubs = function() {
            $rootScope.loadingDiv = true;
            $http.get(backendUrl + '/api/clubs/all/').success(function(response) {
                $rootScope.loadingDiv = false;
                $scope.clubs = response.clubs;
            });
        }

        $scope.updateMembers = function() {
            $rootScope.loadingDiv = true;
            $http.get(backendUrl + '/api/clubs/updateMembers/')
                .success(function(response) {
                    $rootScope.printMsg(response);
                })
                .error(function(data) {
                    $rootScope.loadingDiv = false;
                    $rootScope.handleErrors(data);
                });
        }

        $scope.updateRating = function() {
            jQuery("fieldset").each(function(i) {
                var rating = jQuery(this).parent().attr('rating');
                if (!rating)
                    rating = "0";
                var inputElement = jQuery(this).find("[value='" + rating + "']");
                jQuery(this).find("input").nextAll().css({ "color": "#ddd" });
                inputElement.css({ "color": "#FFD700" });
                inputElement.nextAll().css({ "color": "#FFD700" });
                // console.log($(this).find("[value="+rating+"]").val());
            });
        }

        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            $scope.updateRating();
        });

        $scope.getMembersOfDep = function() {
            var depId = $routeParams.id;
            var subId = $routeParams.subId;
            if (subId) {
                $scope.viewMemebersNest(depId, subId, false, $scope.ratingClick);
            } else {
                $scope.viewMemebers(depId, false, $scope.ratingClick);
            }
        }

        jQuery('#depImg').click(function() {
            jQuery('#depFile').click();
        });

        jQuery('#subDepImg').click(function() {
            jQuery('#subDepFile').click();
        });

        jQuery('#logoEdit').click(function() {
            jQuery('#fileUpload').click();
        });

        jQuery('#presEdit').click(function() {
            jQuery('#presFile').click();
        });

        $scope.ratingClick = function() {
            jQuery(".ratingLabel").click(function() {
                jQuery(this).parent().find("input").nextAll().css({ "color": "#ddd" });
                jQuery(this).css({ "color": "#FFD700" });
                jQuery(this).nextAll().css({ "color": "#FFD700" });
                var myelement = jQuery(this).prev();
                var rating = myelement.val();
                var fieldset = myelement.parent();
                var memberID = fieldset.closest('tr').attr('id');
                $http({
                        url: backendUrl + '/api/clubs/rateMember/' + memberID,
                        method: "POST",
                        data: { rating: rating }
                    })
                    .then(function(response) {
                            $rootScope.loadingDiv = false;
                        },
                        function(response) { // optional
                            $rootScope.handleErrors(response);
                        });
            });
        }

        $scope.editReview = function(member) {
            $scope.member = member;
            $rootScope.backgroundDiv = true;
            $scope.reviewDiv = true;
        }

        $scope.submitReview = function() {
            var memberID = $scope.member._id;
            var review = $scope.newReview;
            var row = jQuery('tr[id="' + memberID + '"').find(".reviewClass");
            $rootScope.loadingDiv = true;
            if (review) {
                $http({
                        url: backendUrl + '/api/clubs/editReview/' + memberID,
                        method: "POST",
                        data: { review: review }
                    })
                    .then(function(response) {
                            $rootScope.loadingDiv = false;
                            $scope.reviewDiv = false;
                            $rootScope.backgroundDiv = false;
                            row.text(review);
                            $scope.newReview = "";
                        },
                        function(response) { // optional
                            $rootScope.handleErrors(response);
                        });
            }
        }

        $scope.addEvent = function() {
            $scope.newEvent.photo = $scope.newEventPhoto;
            $rootScope.loadingDiv = true;
            var fd = new FormData();
            var data = $scope.newEvent;
            for (var key in data) {
                fd.append(key, data[key]);
            }
            $http.post(backendUrl + '/api/events/addEvent', fd, {
                    transformRequest: angular.indentity,
                    headers: { 'Content-Type': undefined }
                })
                .success(function(response) {
                    $rootScope.msg = response.msg;
                    $rootScope.loadingDiv = false;
                    $window.scrollTo(0, 0);
                    $scope.newEvent = {};
                })
                .error(function(response) {
                    $rootScope.loadingDiv = false;
                    $rootScope.handleErrors(response)
                });
        }

        $scope.createForm = function() {

        }
        $scope.initializeForm = function() {
            $rootScope.loadingDiv = true;
            $scope.form = {};
            $scope.choiceSet = {
                choices: []
            };
            $scope.quest = {};
            $scope.choiceSet.choices = [];
            $scope.addNewChoice = function() {
                $scope.choiceSet.choices.push('');
            };
            $scope.removeChoice = function(z) {
                $scope.choiceSet.choices.splice(z, 1);
            };
            $http.get(backendUrl + '/api/clubs/getForm/')
                .success(function(response) {
                    $scope.questions = response.form.questions;
                    $scope.deps = response.departments;
                    $scope.addNewChoice();
                    $rootScope.loadingDiv = false;
                }).error(function(data) {
                    $rootScope.loadingDiv = false;
                });
        }
        $scope.submitApplicationForm = function() {
            var questions = [];
            var currentId = $routeParams.id;

            $scope.choiceSet.choices.forEach(function(question) {
                if (question != "") {
                    questions.push({ text: question });
                }
            });
            if (questions.length > 0) {
                $scope.form.questions = questions;
                $rootScope.loadingDiv = true;
                $http({
                        url: backendUrl + '/api/clubs/addForm/',
                        method: "POST",
                        data: $scope.form

                    })
                    .then(function(response) {
                            $rootScope.loadingDiv = false;
                            $window.location = '/#/club/applicants/all';
                        },
                        function(response) {
                            $rootScope.handleErrors(response);
                        });
            } else {
                $window.scrollTo(0, 0);
                $rootScope.error = "Add a question at least."
            }
        }

        $scope.getForm = function() {
            var currentId = $routeParams.id;
            $rootScope.loadingDiv = true;
            $scope.application = {};
            $scope.application.club = currentId;
            $scope.application.answers = [];
            $http.get(backendUrl + '/api/clubs/view/form/' + currentId)
                .success(function(response) {
                    $scope.form = response.form;
                    response.form.questions.forEach(function(q, index) {
                        $scope.application.answers[index] = {};
                        $scope.application.answers[index].question = q;
                    });
                    $scope.questions = response.form.questions;
                    $scope.deps = $scope.form.departments;
                    $rootScope.loadingDiv = false;
                }).error(function(data) {
                    $rootScope.loadingDiv = false;
                    $rootScope.handleErrors(data);
                });
        }

        $scope.submitApplication = function() {
            $rootScope.loadingDiv = true;
            $http({
                    url: backendUrl + '/api/clubs/submit/application',
                    method: "POST",
                    data: { application: $scope.application }
                })
                .then(function(response) {
                        $rootScope.printMsg(response);
                        $timeout(function() {
                            $rootScope.loadingDiv = false;
                            $window.location = '/#/';
                        }, 3000);
                    },
                    function(response) {
                        $rootScope.handleErrors(response);
                    });
        }

        $scope.getClubApplicants = function() {
            $rootScope.loadingDiv = true;
            var filter = $routeParams.filter;
            $http.get(backendUrl + '/api/clubs/list/applicants/' + filter)
                .success(function(response) {
                    $scope.applicants = response.applicants;
                    $rootScope.loadingDiv = false;
                }).error(function(data) {
                    $rootScope.loadingDiv = false;
                });
        }

        $scope.showApplication = function(index) {
            $scope.application = $scope.applicants[index];
            $rootScope.backgroundDiv = true;
            $scope.detailedApplication = true;
            $scope.index = index;
        }

        $scope.closeApplication = function(applicationID, status) {
            $rootScope.loadingDiv = true;
            $http({
                    url: backendUrl + '/api/clubs/application/close/' + applicationID,
                    method: "POST",
                    data: { status: status }
                })
                .then(function(response) {
                        $rootScope.loadingDiv = false;
                        $scope.applicants.splice($scope.index, 1);
                        $rootScope.exit();
                    },
                    function(response) {
                        $rootScope.handleErrors(response);
                    });
        }

        $scope.switchForm = function(status) {
            $rootScope.loadingDiv = true;
            $http.get(backendUrl + '/api/clubs/form/status/' + status)
                .success(function(response) {
                    $rootScope.loadingDiv = false;
                    if (status == "open")
                        $scope.club.form.open = true;
                    else
                        $scope.club.form.open = false;

                }).error(function(data) {
                    $rootScope.loadingDiv = false;
                    $rootScope.handleErrors(data);
                });
        }
        $scope.addSubSection = function(id) {
            jQuery('#subBtn' + id).next().slideDown();
            jQuery('#subBtn' + id).fadeOut();
        }

        $scope.addSubdepartment = function(depID, x) {
            var keyz = 'headPhoto' + depID;
            $rootScope.loadingDiv = true;
            var data = $scope.subs[x];
            var fd = new FormData();
            fd.append('headPhoto', $scope[keyz]);
            for (var key in data) {
                fd.append(key, data[key]);
            }

            $http.post(backendUrl + '/api/clubs/addSubDepartment/' + depID, fd, {
                    transformRequest: angular.indentity,
                    headers: { 'Content-Type': undefined }
                }).success(function(response) {
                    $rootScope.printMsg(response);
                    $timeout(function() {
                        $window.location.reload();
                    }, 1000);
                    $scope.subs[x] = {};
                })
                .error(function(response) {
                    $rootScope.handleErrors(response);
                });
        }

        $scope.toggleSubs = function(event, depID) {
            var button = event.target;
            jQuery('#' + depID + 'Subs').toggle();
        }

        $scope.saveClubChanges = function() {
            if ($scope.club.summary && $scope.club.summary != "") {
                $rootScope.loadingDiv = true;
                $http({
                        url: '/api/clubs/updateDetails/',
                        method: "POST",
                        data: { summary: $scope.club.summary, email: $scope.club.email }
                    })
                    .then(function(response) {
                            $rootScope.printMsg(response);
                        },
                        function(response) {
                            $rootScope.handleErrors(response);
                        });
            }
        }

        $scope.changeImg = function(depID) {
            $rootScope.subDepIdImg = depID;
            jQuery("#subDepFile" + depID).click();
        }

        $scope.deleteMember = function(memberID, depID, subDepID = null) {
            swal({
                title: 'Are you sure?',
                text: "Member will be deleted permenantly from the database!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#aaa',
                confirmButtonText: 'Yes, delete member!'
            }).then(function(result) {
                if (result.value) {
                    var url;
                    if (subDepID) {
                        url = backendUrl + '/api/clubs/deleteMember/' + depID + '/' + subDepID + '/' + memberID;
                    } else {
                        url = backendUrl + '/api/clubs/deleteMember/' + depID + '/' + memberID;
                    }
                    $rootScope.loadingDiv = true;
                    $http({
                            url: url,
                            method: "POST",
                        })
                        .then(function(response) {
                                jQuery('#' + memberID).hide();
                                $rootScope.printMsg(response);
                            },
                            function(response) {
                                $rootScope.loadingDiv = false;
                                $rootScope.handleErrors(response);
                            });
                }
            });
        }

        $scope.dismissMember = function(memberID, depID, subDepID = null) {
            swal({
                title: 'Are you sure?',
                text: "Member will be removed from club (but appears in his/her C.V.).",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#aaa',
                confirmButtonText: 'Dismiss member.'
            }).then(function(result) {
                if (result.value) {
                    var url;
                    if (subDepID) {
                        url = backendUrl + '/api/clubs/dismissMember/' + depID + '/' + subDepID + '/' + memberID;
                    } else {
                        url = backendUrl + '/api/clubs/dismissMember/' + depID + '/' + memberID;
                    }
                    $rootScope.loadingDiv = true;
                    $http({
                            url: url,
                            method: "POST",
                        })
                        .then(function(response) {
                                jQuery('#' + memberID).hide();
                                $rootScope.printMsg(response);
                            },
                            function(response) {
                                $rootScope.loadingDiv = false;
                                $rootScope.handleErrors(response);
                            });
                }
            });
        }

    }

]);