const AsBind = require('as-bind');
const fs = require('fs');

const wasm = fs.readFileSync('./assembly/index.wasm');

const asyncTask = async () => {
  const asBindInstance = await AsBind.instantiate(wasm);
  const response = asBindInstance.exports.addWorld('Hello');
  console.log(response);
};
asyncTask();
