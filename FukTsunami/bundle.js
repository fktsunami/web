(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
    /*
     * Copyright 2015-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
     *
     * Licensed under the Apache License, Version 2.0 (the "License").
     * You may not use this file except in compliance with the License.
     * A copy of the License is located at
     *
     *  http://aws.amazon.com/apache2.0
     *
     * or in the "license" file accompanying this file. This file is distributed
     * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
     * express or implied. See the License for the specific language governing
     * permissions and limitations under the License.
     */

    /*
     * NOTE: You must set the following string constants prior to running this
     * example application.
     */
    var awsConfiguration = {
        poolId: 'us-west-2:6edcd2e6-3900-4caa-adf4-2b082359d4fa', // 'YourCognitoIdentityPoolId'
        host: 'a3n0rmdkx656cj-ats.iot.us-west-2.amazonaws.com', // 'YourAWSIoTEndpoint', e.g. 'prefix.iot.us-east-1.amazonaws.com'
        region: 'us-west-2' // 'YourAwsRegion', e.g. 'us-east-1'
    };
    module.exports = awsConfiguration;


},{}],2:[function(require,module,exports){
    /*
     * Copyright 2015-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
     *
     * Licensed under the Apache License, Version 2.0 (the "License").
     * You may not use this file except in compliance with the License.
     * A copy of the License is located at
     *
     *  http://aws.amazon.com/apache2.0
     *
     * or in the "license" file accompanying this file. This file is distributed
     * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
     * express or implied. See the License for the specific language governing
     * permissions and limitations under the License.
     */

//
// Instantiate the AWS SDK and configuration objects.  The AWS SDK for
// JavaScript (aws-sdk) is used for Cognito Identity/Authentication, and
// the AWS IoT SDK for JavaScript (aws-iot-device-sdk) is used for the
// WebSocket connection to AWS IoT and device shadow APIs.
//
    var AWS = require('aws-sdk');
    var AWSIoTData = require('aws-iot-device-sdk');
    var AWSConfiguration = require('./aws-configuration.js');

    console.log('Loaded AWS SDK for JavaScript and AWS IoT SDK for Node.js');

//
// Remember our current subscription topic here.
//
    var currentlySubscribedTopic = 'subscribe-topic';

//
// Remember our message history here.
//
    var messageHistory = '';

//
// Create a client id to use when connecting to AWS IoT.
//
    var clientId = 'mqtt-explorer-' + (Math.floor((Math.random() * 100000) + 1));

//
// Initialize our configuration.
//
    AWS.config.region = AWSConfiguration.region;

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: AWSConfiguration.poolId
    });

//
// Create the AWS IoT device object.  Note that the credentials must be
// initialized with empty strings; when we successfully authenticate to
// the Cognito Identity Pool, the credentials will be dynamically updated.
//
    const mqttClient = AWSIoTData.device({
        //
        // Set the AWS region we will operate in.
        //
        region: AWS.config.region,
        //
        ////Set the AWS IoT Host Endpoint
        host: AWSConfiguration.host,
        //
        // Use the clientId created earlier.
        //
        clientId: clientId,
        //
        // Connect via secure WebSocket
        //
        protocol: 'wss',
        //
        // Set the maximum reconnect time to 8 seconds; this is a browser application
        // so we don't want to leave the user waiting too long for reconnection after
        // re-connecting to the network/re-opening their laptop/etc...
        //
        maximumReconnectTimeMs: 8000,
        //
        // Enable console debugging information (optional)
        //
        debug: true,
        //
        // IMPORTANT: the AWS access key ID, secret key, and sesion token must be
        // initialized with empty strings.
        //
        accessKeyId: 's',
        secretKey: 's',
        sessionToken: 's'
    });

//
// Attempt to authenticate to the Cognito Identity Pool.  Note that this
// example only supports use of a pool which allows unauthenticated
// identities.
//
    var cognitoIdentity = new AWS.CognitoIdentity();
    AWS.config.credentials.get(function(err, data) {
        if (!err) {
            console.log('retrieved identity: ' + AWS.config.credentials.identityId);
            var params = {
                IdentityId: AWS.config.credentials.identityId
            };
            cognitoIdentity.getCredentialsForIdentity(params, function(err, data) {
                if (!err) {
                    //
                    // Update our latest AWS credentials; the MQTT client will use these
                    // during its next reconnect attempt.
                    //
                    mqttClient.updateWebSocketCredentials(data.Credentials.AccessKeyId,
                        data.Credentials.SecretKey,
                        data.Credentials.SessionToken);
                } else {
                    console.log('error retrieving credentials: ' + err);
                    alert('error retrieving credentials: ' + err);
                }
            });
        } else {
            console.log('error retrieving identity:' + err);
            alert('error retrieving identity: ' + err);
        }
    });

//
// Connect handler; update div visibility and fetch latest shadow documents.
// Subscribe to lifecycle events on the first connect event.
//
    window.mqttClientConnectHandler = function() {
        console.log('connect');
        // document.getElementById("connecting-div").style.visibility = 'hidden';
        // document.getElementById("explorer-div").style.visibility = 'visible';
        // document.getElementById('subscribediv').innerHTML = '<p><br></p>';
        // messageHistory = '';
        toastr.success('Connected to server!').css("margin-top","87vh");

        //
        // Subscribe to our current topic.
        //
        mqttClient.subscribe('+/tsunamiSensor');
        mqttClient.subscribe('+/user');

        // Init tsunamiSensorRoom
        window.tsunamiSensorRoom = new TsunamiSensorRoom();
        window.userRoom = new UserRoom();
    };

//
// Reconnect handler; update div visibility.
//
    window.mqttClientReconnectHandler = function() {
        console.log('reconnect');
    };

//
// Utility function to determine if a value has been defined.
//
    window.isUndefined = function(value) {
        return typeof value === 'undefined' || typeof value === null;
    };

//
// Message handler for lifecycle events; create/destroy divs as clients
// connect/disconnect.
//
    window.mqttClientMessageHandler = function(topic, payload) {
        console.log('message: ' + topic + ':' + payload.toString());
        var id = topic.split("/")[0];
        var topicName = topic.split("/")[1];
        if (id && topicName == "tsunamiSensor") {
            payloadJSON = JSON.parse(payload)
            payloadJSON.id = id

            window.tsunamiSensorRoom.receiveData(payloadJSON)
        } else if (id && topicName == "user"){
            payloadJSON = JSON.parse(payload)
            payloadJSON.id = id

            window.userRoom.receiveData(payloadJSON)
        }
    };

//
// Handle the UI for the current topic subscription
//
    window.updateSubscriptionTopic = function() {
        var subscribeTopic = document.getElementById('subscribe-topic').value;
        document.getElementById('subscribediv').innerHTML = '';
        mqttClient.unsubscribe(currentlySubscribedTopic);
        currentlySubscribedTopic = subscribeTopic;
        mqttClient.subscribe(currentlySubscribedTopic);
    };

//
// Handle the UI to clear the history window
//
    window.clearHistory = function() {
        if (confirm('Delete message history?') === true) {
            document.getElementById('subscribediv').innerHTML = '<p><br></p>';
            messageHistory = '';
        }
    };

//
// Handle the UI to update the topic we're publishing on
//
    window.updatePublishTopic = function() {};

//
// Handle the UI to update the data we're publishing
//
    window.updatePublishData = function() {
        var publishText = document.getElementById('publish-data').value;
        var publishTopic = document.getElementById('publish-topic').value;

        mqttClient.publish(publishTopic, publishText);
        document.getElementById('publish-data').value = '';
    };

    subscribeDroneTopicTerraDrone = function() {
        var droneTopic = document.getElementById('manufacture').value + '/' + document.getElementById('serial').value + '/drone';
        var appTopic = document.getElementById('manufacture').value + '/' + document.getElementById('serial').value + '/app';
        var serverTopic = document.getElementById('manufacture').value + '/' + document.getElementById('serial').value + '/server';

        mqttClient.subscribe(droneTopic);
        mqttClient.subscribe(appTopic);
        mqttClient.subscribe(serverTopic);

        Log(droneTopic + ': Subscribed</br>' + appTopic + ': Subscribed</br>' + serverTopic + ': Subscribed', subscribediv);

        missionId = document.getElementById("missionId").value;
        token = document.getElementById("token").value;
        homePosition.lat = parseFloat(document.getElementById("homePositionLat").value);
        homePosition.lng = parseFloat(document.getElementById("homePositionLng").value);
        PDID = document.getElementById("serial").value;
    }

    subscribeDroneTopicKTEC = function() {
        var droneTopic = document.getElementById('manufacture').value + '/' + document.getElementById('serial').value + '/drone';
        var appTopic = document.getElementById('manufacture').value + '/' + document.getElementById('serial').value + '/app';

        mqttClient.subscribe(droneTopic);
        mqttClient.subscribe(appTopic);

        Log(droneTopic + ': Subscribed</br>' + appTopic + ': Subscribed', subscribediv);
    }

    publishMission = function() {
        var publishTopic = document.getElementById('manufacture').value + '/' + document.getElementById('serial').value + '/drone';
        var publishText = {
            "type": "ctrl_drone",
            "cmd": "add_mission",
            "kml_url": KMLPath
        }

        mqttClient.publish(publishTopic, JSON.stringify(publishText));
    }

    startMission = function() {
        var publishTopic = document.getElementById('manufacture').value + '/' + document.getElementById('serial').value + '/drone';
        var publishText = {
            "type": "ctrl_drone",
            "cmd": "takeoff_drone",
            "timing": 300
        }

        mqttClient.publish(publishTopic, JSON.stringify(publishText));
    }

    broadcastSyncLogByMQTT = function(data, cnt) {
        if (data.PDID !== undefined && data.PDID == document.getElementById('serial').value) {
        var publishTopic = document.getElementById('manufacture').value + '/' + document.getElementById('serial').value + '/app';
        var publishText = {
            "type": "telemetry",
            "terra_platform": 1.0,
            "flight_id": document.getElementById("missionId").value,
            "datetime": data.flight_time,
            "elapsed": cnt++,
            "aircraft":{
                "manufacturer": document.getElementById('manufacture').value,
                "serial": document.getElementById('serial').value,
                "firmware": 3.9,
                "sdk": 2.0
            },
            "position":{
                "lat": parseFloat(data.lat),
                "lng": parseFloat(data.lng),
                "alt": data.height,
                "waypoint": data.waypoint
            },
            "attitude":{
                "head": data.direction,
                "speed": data.speed
            },
            "status":{
                "battery": data.battery,
                "flightstat": data.flightstat
            },
            "network":{
                "lte":{
                    "phone": data.phone_no,
                    "strength": data.antenna
                }
            }

        }

        mqttClient.publish(publishTopic, JSON.stringify(publishText));
	     }
    }

    local_host = 'http://api.drone.test'
    nedo_host = 'https://api-dev.terra-utm.com'

    host = nedo_host

    schedule = function () {
        var serial = $('#serial').val()
        getDroneBySerial(serial, function (serial) {
            $.ajax({
                url: host + '/v1/missions/reserve',
                headers: {
                    "Authorization": "Bearer " + $('#token').val(),
                    "Content-Type": "application/json"
                },
                type: 'POST',
                dataType: 'JSON',
                data: JSON.stringify({
                    "mission_id": $('#missionId').val(),
                    "drone_id": serial,
                    "flight_start_time": $('#flightSchedule').val()
                })
            })
            .done(function (data) {
                if (data.status === true) {
                    Log('Make Flight Schedule: ' + document.getElementById('manufacture').value + '/' + document.getElementById('serial').value + '/drone' + ':' + JSON.stringify(data.data), subscribediv);
                }
            })
            .fail(function (xhr) {
                if (xhr.responseJSON.status === false) {
                    Log('Make Flight Schedule: ' + document.getElementById('manufacture').value + '/' + document.getElementById('serial').value + '/drone' + ':' + xhr.responseJSON.error.message[0], subscribediv);
                }
            })
        })
    }

    function getDroneBySerial (serial, callback) {
        $.ajax({
            url: host + '/v1/drones?filters[serial]=' + serial,
            headers: {
              "Authorization": "Bearer " + $('#token').val()
            },
            type: 'GET',
        })
        .done(function (data) {
                if (data.status === true) {
                let drones = data.data.data
                if (drones.length > 0) {
                    callback(drones[0].id)
                } else {
                    Log('Get Drone ID: ' + document.getElementById('manufacture').value + '/' + document.getElementById('serial').value + '/drone' + ': Drone not found', subscribediv);
                }
            }
        })
        .fail(function (xhr) {
            if (xhr.responseJSON.status === false) {
                console.log(xhr.responseJSON);
                Log('Get Drone ID: ' + document.getElementById('manufacture').value + '/' + document.getElementById('serial').value + '/drone' + ':' + xhr.responseJSON.error.message[0], subscribediv);
            }
        })
    }

    prepareMissionByMqtt = function () {
        $.ajax({
            url: host + '/v1/missions/' + $('#missionId').val() + '/flights',
            headers: {
                "Authorization": "Bearer " + $('#token').val(),
                "Content-Type": "application/json"
            },
            type: 'POST',
            data: JSON.stringify({
                lat: $('#homePositionLat').val(),
                lng: $('#homePositionLng').val(),
                serial: $('#serial').val()
            })
        })
        .done(function (data) {
            if (data.status === true) {
                Log('Prepare Flight Succeed for Mission: ' +
                    $('#missionId').val() + ' Flight: ' + data.data.id, subscribediv)
                var publishTopic = document.getElementById('manufacture').value + '/' + document.getElementById('serial').value + '/app';
                var publishText = {
                    "type": "utm_cmd",
                    "cmd": "flight_plan_res",
                    "result": "success",
                    "flight_id": data.data.id
                }

                mqttClient.publish(publishTopic, JSON.stringify(publishText));
                socket.emit('APP_CREATED_FLIGHT', {
                    flight_id: data.data.id,
                    serial: $('#serial').val(),
                    token: $('#token').val()
                });
            }
        })
        .fail(function (xhr) {
            if (xhr.responseJSON.status === false) {
                Log('Create Datelist failed for Mission: ' + $('#missionId').val(), subscribediv)
                console.log(xhr.responseJSON.error.message[0])
            }
        })
    }
//
// Install connect/reconnect event handlers.
//
    mqttClient.on('connect', window.mqttClientConnectHandler);
    mqttClient.on('reconnect', window.mqttClientReconnectHandler);
    mqttClient.on('message', window.mqttClientMessageHandler);

//
// Initialize divs.
//
    // document.getElementById('connecting-div').style.visibility = 'visible';
    // document.getElementById('explorer-div').style.visibility = 'hidden';
    // document.getElementById('connecting-div').innerHTML = '<p>Attempting to connect to AWS iot...</p>';

},{"./aws-configuration.js":1,"aws-iot-device-sdk":"aws-iot-device-sdk","aws-sdk":"aws-sdk"}]},{},[2]);
