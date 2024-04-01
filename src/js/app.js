import * as curlconverter from "curlconverter";

// jq
const jsonDoc = document.getElementById("json-doc");
const jqQuery = document.getElementById("jq-query");
const jqResult = document.getElementById("jq-result");

function runQuery() {
  try {
    const parsedJson = JSON.parse(jsonDoc.value);
    jqResult.innerHTML =
      "<pre><code>" +
      JSON.stringify(jq.json(parsedJson, jqQuery.value), null, 2) +
      "</code></pre>";
  } catch (error) {
    jqResult.innerHTML = "<pre><code>" + error.message + "</code></pre>";
  }
}

jsonDoc.addEventListener("input", runQuery);
jqQuery.addEventListener("input", runQuery);
jq.onInitialized.addListener(runQuery);

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
