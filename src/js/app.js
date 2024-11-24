import * as curlconverter from "curlconverter";

// jq
const jsonDoc = document.getElementById("json-doc");
const jqQuery = document.getElementById("jq-query");
const jqResult = document.getElementById("jq-result");

function logError(message) {
  jqResult.innerHTML = "<pre><code>" + message + "</code></pre>";
}

function runQuery() {
  let parsedJson;

  try {
    parsedJson = JSON.parse(jsonDoc.value);
  } catch (error) {
    logError(error.message);
  }

  jq.then(function (jq) {
    jqResult.innerHTML =
      "<pre><code>" +
      JSON.stringify(jq.json(parsedJson, jqQuery.value), null, 2) +
      "</code></pre>";
  }).catch(function (error) {
    logError(error.message);
  });
}

jsonDoc.addEventListener("input", runQuery);
jqQuery.addEventListener("input", runQuery);
jq.then(runQuery);

// curl
const curlExecute = document.getElementById("curl-execute");
const curlCommand = document.getElementById("curl-command");
const curlErrors = document.getElementById("curl-errors");

function runCurl() {
  curlErrors.innerHTML = "";
  jsonDoc.value = "";
  runQuery();

  let jsCode;
  try {
    jsCode = curlconverter.toJavaScript(curlCommand.value);
  } catch (error) {
    curlErrors.innerHTML =
      "<h2>Errors</h2><pre><code>" + error.message + "</code></pre>";
    return;
  }
  const promise = eval(jsCode);
  promise
    .then(async function (result) {
      jsonDoc.value = await result.text();
      runQuery();
    })
    .catch(function (error) {
      curlErrors.innerHTML =
        "<h2>Errors</h2><pre><code>" + error.message + "</code></pre>";
    });
}

if (curlExecute) {
  curlExecute.addEventListener("click", runCurl);
}
