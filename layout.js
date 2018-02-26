/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Initialize Firebase


 var config = {
    apiKey: "AIzaSyD_zvW9MPuAwldnNfci8XyQ2EqNHuPEuMo",
    authDomain: "demosfifco.firebaseapp.com",
    databaseURL: "https://demosfifco.firebaseio.com",
    projectId: "demosfifco",
    storageBucket: "demosfifco.appspot.com",
    messagingSenderId: "124097320488"
  };
  firebase.initializeApp(config); 
(function() {
  "use strict";

  var ENTER_KEY_CODE = 13;
  var queryInput, resultDiv, accessTokenInput;

  window.onload = init;

  function init() {
    queryInput = document.getElementById("q");
    resultDiv = document.getElementById("result");
    // accessTokenInput = document.getElementById("access_token");
    // var setAccessTokenButton = document.getElementById("set_access_token");

    queryInput.addEventListener("keydown", queryInputKeyDown);
    // setAccessTokenButton.addEventListener("click", setAccessToken);
    setAccessToken("767b2da83d4f49dab33e70b845ef3f05");
  }

  function setAccessToken(key) {
    // document.getElementById("placeholder").style.display = "none";
    document.getElementById("main-wrapper").style.display = "block";
    window.init(key);
  }

  function queryInputKeyDown(event) {
    if (event.which !== ENTER_KEY_CODE) {
      return;
    }

    var value = queryInput.value;
    queryInput.value = "";

    createQueryNode(value);
    var responseNode = createResponseNode();

    sendText(value)
      .then(function(response) {
        var result;
        try {
          result = response.result.fulfillment.speech
        } catch(error) {
          result = "";
        }
        console.log(response.result.resolvedQuery);
        let action = response.result.resolvedQuery;

        var str = action;
        
        if (str.search("Pedir") != -1 || str.search("pedir") != -1 || str.search("PEDIR") != -1){
          console.log(str.search("Pedir"));

          var fechaEnMiliseg = Date.now();
          firebase.database()
          .ref("Pedidos/"+fechaEnMiliseg)
          .set({
            pedido: action,
            ID: "343029",
            red: "Pavas",
            estado: "Pendiente",
            date: firebase.database.ServerValue.TIMESTAMP
          })
          .then(()=>console.log("Realizado con exito!"))
          .catch((error)=>console.log("Error: "+error));
        }
        // setResponseJSON(response);
        setResponseOnNode(result, responseNode);
      })
      .catch(function(err) {
        // setResponseJSON(err);
        setResponseOnNode("Something goes wrong", responseNode);
      });
  }

  function createQueryNode(query) {
    var node = document.createElement('div');
    node.className = "clearfix left-align left card-panel green accent-1";
    node.innerHTML = query;
    resultDiv.appendChild(node);
  }

  function createResponseNode() {
    var node = document.createElement('div');
    node.className = "clearfix right-align right card-panel blue-text text-darken-2 hoverable";
    node.innerHTML = "...";
    resultDiv.appendChild(node);
    return node;
  }

  function setResponseOnNode(response, node) {
    node.innerHTML = response ? response : "[empty response]";
    node.setAttribute('data-actual-response', response);
  }

  // function setResponseJSON(response) {
  //   var node = document.getElementById("jsonResponse");
  //   node.innerHTML = JSON.stringify(response, null, 2);
  // }

  function sendRequest() {

  }

})();

var accessToken = "767b2da83d4f49dab33e70b845ef3f05",
    baseUrl = "https://api.api.ai/v1/",
    $speechInput,
    $recBtn,
    recognition,
    messageRecording = "Recording...",
    messageCouldntHear = "I couldn't hear you, could you say that again?",
    messageInternalError = "Oh no, there has been an internal server error",
    messageSorry = "I'm sorry, I don't have the answer to that yet.";

function startRecognition() {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
          recognition.interimResults = false;

      recognition.onstart = function(event) {
        respond(messageRecording);
        updateRec();
      };
      recognition.onresult = function(event) {
        recognition.onend = null;

        console.log(event.results)
        
        var text = "";
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
          }
          setInput(text);
        stopRecognition();
      };
      recognition.onend = function() {
        respond(messageCouldntHear);
        stopRecognition();
      };
      recognition.lang = "en-US";
      recognition.start();
    }
  
    function stopRecognition() {
      if (recognition) {
        recognition.stop();
        recognition = null;
      }
      updateRec();
    }

