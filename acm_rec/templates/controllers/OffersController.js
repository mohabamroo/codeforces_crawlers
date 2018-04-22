angular.module('community').controller('OffersController', ['$scope', '$location', 'AuthService', 'AuthToken', '$rootScope', '$timeout', '$window', '$routeParams', '$http', '$filter', 'Upload', 'multipartForm',
    function($scope, $location, AuthService, AuthToken, $rootScope, $timeout, $window, $routeParams, $http, $filter, Upload, multipartForm) {

        // $rootScope.loadingDiv = true;
        $scope.newTags = "";
        var currentId = $routeParams.id;

        $scope.getMinimalBranches = function() {
            var companyId = $routeParams.id;
            $rootScope.loadingDiv = true;
            $http({
                    url: backendUrl + '/api/company/getMinimalBranches/' + companyId,
                    method: "get",
                })
                .then(function(response) {
                    $rootScope.loadingDiv = false;
                    $rootScope.msg = response.data.msg;
                    $scope.branches = response.data.data;

                }, function(response) {
                    $rootScope.handleErrors(response);
                });
        }

        $scope.addOffer = function() {
            branchIDS = $scope.newOffer.branches;
            var uploadUrl = '/api/offers/addOffer';
            var fd = new FormData();
            var data = $scope.newOffer;
            for (var key in data) {
                fd.append(key, data[key]);
            }
            $rootScope.loadingDiv = true;
            $rootScope.disabled = true;
            $http.post(uploadUrl, fd, {
                    transformRequest: angular.indentity,
                    headers: { 'Content-Type': undefined }
                }).success(function(response) {
                    $rootScope.loadingDiv = false;
                    $rootScope.msg = response.msg;
                    $window.scrollTo(0, 0);
                    setTimeout(function() {
                        $window.location.href = '/#/' + $rootScope.currentUser.usertype + '/viewprofile/' + $rootScope.currentUser._id;
                    }, 2000);
                })
                .error(function(response) {
                    $rootScope.handleErrors(response);
                });
        }

        $scope.getOffers = function(type) {
            var page = $scope.pageNumber;
            $rootScope.loadingDiv = true;
            url = backendUrl + '/api/offers/' + type + '/' + page + '/10/';
            $http({
                    url: url,
                    method: "get",
                })
                .then(function(response) {
                    $rootScope.loadingDiv = false;
                    $rootScope.msg = response.data.msg;
                    newOffers = response.data.data;
                    if (response.data.data != null) {
                        if (response.data.data.length < 10) {
                            // no more offers
                            $scope.noMoreOffers = true;
                        }
                        newOffers.forEach(function(offer) {
                            $scope.offers.push(offer);
                        });
                        $scope.pageNumber++;
                    }

                }, function(response) {
                    $rootScope.handleErrors(response);
                });
        }

        $scope.changeType = function(type) {
            $scope.type = type;
            $scope.offers = [];
            $scope.pageNumber = 1;
            $scope.noMoreOffers = false;
            if (AuthService.isLoggedIn()) {
                $scope.getOffers(type);
            }
        }

        $scope.scanCode = function() {
            $rootScope.cameraRequested = true;
            $rootScope.backgroundDiv = true;
            $scope.openCam();
        }

        $scope.processURLfromQR = function(code) {
            console.log(code);
            $rootScope.cameraRequested = false;
            $rootScope.loadingDiv = true;
            apiUrl = backendUrl + '/api/offers/scanCode/';
            $http({
                    url: apiUrl,
                    method: "post",
                    data: { 'qrCode': code }
                })
                .then(function(response) {
                    $rootScope.loadingDiv = false;
                    if (response.data.success) {
                        $rootScope.msg = response.data.msg;
                        console.log(response.data.data);
                        console.log(response.data.data.offer);
                        $scope.offer = response.data.data[0].offer;
                        console.log($scope.offer);
                    }
                }, function(response) {
                    $rootScope.handleErrors(response);
                });
        }

        $scope.handelCode = function(code) {
            $rootScope.loadingDiv = true;
            apiUrl = backendUrl + '/api/offers/scanCode/';
            $http({
                    url: apiUrl,
                    method: "post",
                    data: { 'qrCode': code }
                })
                .then(function(response) {
                    $rootScope.loadingDiv = false;
                    if (response.data.success) {
                        $rootScope.msg = response.data.msg;
                        if (response.data.data == null || response.data.data.length < 1) {
                            $scope.qrSuccess = false;
                            console.log("no offer for this code");
                        } else {
                            $scope.qrSuccess = true;
                            $scope.offer = response.data.data[0].offer;
                        }
                        $scope.returnDefaults();
                    }
                }, function(response) {
                    $rootScope.handleErrors(response);
                    $scope.returnDefaults();
                });
        }

        function decodeImageFromBase64(data, callback) {
            qrcode.callback = callback;
            qrcode.decode(data)
        }

        $scope.openCam = function() {
            $scope.qrError = "Scan a QR code";
            var options = {
                DecodeQRCodeRate: 5, // null to disable OR int > 0 !
                DecodeBarCodeRate: 5, // null to disable OR int > 0 !
                successTimeout: 500, // delay time when decoding is succeed
                codeRepetition: true, // accept code repetition true or false
                tryVertical: true, // try decoding vertically positioned barcode true or false
                frameRate: 15, // 1 - 25
                width: 800, // canvas width
                height: 800, // canvas height
                constraints: { // default constraints
                    video: {
                        mandatory: {
                            maxWidth: 1280,
                            maxHeight: 720
                        },
                        optional: [{
                            sourceId: true
                        }]
                    },
                    audio: false
                },
                flipVertical: false, // boolean
                flipHorizontal: false, // boolean
                zoom: -1, // if zoom = -1, auto zoom for optimal resolution else int
                // beep: 'audio/beep.mp3',                 // string, audio file location
                decoderWorker: 'js/DecoderWorker.js', // string, DecoderWorker file location
                brightness: 0, // int
                autoBrightnessValue: false, // functional when value autoBrightnessValue is int
                grayScale: false, // boolean
                contrast: 0, // int
                threshold: 0, // int 
                sharpness: [], // to On declare matrix, example for sharpness ->  [0, -1, 0, -1, 5, -1, 0, -1, 0]
                resultFunction: function(result) {
                    /*
                        result.format: code format,
                        result.code: decoded string,
                        result.imgData: decoded image data
                    */
                    alert(result.code);
                },
                cameraSuccess: function(stream) { //callback funtion to camera success
                    console.log('cameraSuccess');
                },
                canPlayFunction: function() { //callback funtion to can play
                    console.log('canPlayFunction');
                },
                getDevicesError: function(error) { //callback funtion to get Devices error
                    console.log(error);
                },
                getUserMediaError: function(error) { //callback funtion to get usermedia error
                    console.log(error);
                },
                cameraError: function(error) { //callback funtion to camera error  
                    console.log(error);
                }
            };
            $scope.qrSuccess = false;

            var canvas = document.querySelector('#webcodecam-canvas');
            new WebCodeCamJS(canvas).init();

            var decoder = new WebCodeCamJS('#webcodecam-canvas');
            decoder.buildSelectMenu(document.createElement('select'), 'environment|back').init().play();
            decoder.options = options;
            decoder.options.zoom = 1.25;
            // decoder.play();
            decoder.getLastImageSrc();

            document.getElementById("action").addEventListener('click', function() {
                if ($scope.decodeType == "file")
                    return;
                var src = decoder.getLastImageSrc();
                decodeImageFromBase64(src, function(decodedInformation) {
                    if (decodedInformation != "error decoding QR Code") {
                        decoder.stop();
                        $scope.qrSuccess = true;
                        $scope.handelCode(decodedInformation);
                    } else {
                        console.log("err");
                        $scope.qrError = "Error scanning, please try again."
                    }
                });
            }, false);

            document.getElementById("cancel").addEventListener('click', function() {
                decoder.stop();
            }, false);

            jQuery('#codeImg').on('change', function() {
                if (!$scope.currentFile)
                    return;
                decoder.stop();
                jQuery('#webcodecam-canvas').hide();
                jQuery('#codePre').show();
                $scope.decodeType = "file";
            });
        }

        jQuery("#camIcon").click(function() {
            jQuery("#codeImg").trigger('click');
        });

        jQuery('#codeImg').on('change', function() {
            var val = $(this).val();
            jQuery('#spanCode').text(val);
        });

        $scope.setFile = function(element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function(event) {
                var src = event.target.result;
                jQuery('#codePre').attr('src', src);
                $scope.$apply();
                decodeImageFromBase64(src, function(decodedInformation) {
                    console.log(decodedInformation);
                    console.log("rg3t");
                    if (decodedInformation != "error decoding QR Code") {
                        // $scope.qrSuccess = true;
                        $scope.handelCode(decodedInformation);
                    } else {
                        console.log("errer");
                        $scope.qrError = "Error scanning, please try again."
                    }
                });
            }
            if ($scope.currentFile)
                reader.readAsDataURL(element.files[0]);
        }

        $scope.typeOfferCode = function(offer) {
            $scope.codeSuccess = false;
            $scope.code = "";
            $scope.offer = offer;
            $rootScope.backgroundDiv = true;
            $scope.typeCode = true;
            $scope.offerId = offer._id;
        }

        $scope.submitOfferCode = function() {
            $rootScope.loadingDiv = true;
            apiUrl = backendUrl + '/api/offers/matchCode/';
            $http({
                    url: apiUrl,
                    method: "post",
                    data: {
                        'code': $scope.code,
                        offer_id: $scope.offerId
                    }
                })
                .then(function(response) {
                    $rootScope.loadingDiv = false;
                    $scope.codeSuccess = true;
                    $scope.offer = response.data.data.offer;
                }, function(response) {
                    $rootScope.handleErrors(response);
                });

        }

        $scope.returnDefaults = function() {
            console.log("defaults");
            // $scope.qrSuccess = false;
            jQuery('#spanCode').text("No file selected");
            jQuery('#webcodecam-canvas').show();
            jQuery('#codePre').hide();
            jQuery('#codePre').attr('src', "");

        }

    }
]);