import { AsBind } from 'as-bind';

const asyncTask = async () => {
  const asBindInstance = await AsBind.instantiate(fetch('./assembly/index.wasm'));
  const response = asBindInstance.exports.addWorld('Hello');
  const helloWorldNode = document.createTextNode(response);
  document.body.appendChild(helloWorldNode);
};
asyncTask();
