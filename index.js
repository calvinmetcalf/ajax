'use strict';

var promise = require('lie');
var qs = require('querystringparser');

function ajax(url, method, body) {
  if (typeof method !== 'string' && typeof body === 'undefined') {
    body = method;
    method = 'get';
  } 
  body = body || {};
  
  return promise(function(resolve,reject) {
    var data = qs.stringify(body);
    
    if (method === 'get') {
      url = url + '?' + data;
    }
    
    var ajax = new XMLHttpRequest();
    
    ajax.open(method, url, true);
    
    function onLoad() {
      if (ajax.status>399) {
        reject(new Error(ajax.status));
      } else {
        try {
          resolve(JSON.parse(ajax.response));
        } catch(e) {
          resolve(ajax.response);
        }
      }
      
      ajax.removeEventListener('load', onLoad, false);
      ajax.removeEventListener('error', onError, false);
    }
    function onError(e) {
      ajax.removeEventListener('load', onLoad, false);
      ajax.removeEventListener('error', onError, false);
      reject(e);
    }
    ajax.addEventListener('error', reject, false);
    ajax.addEventListener('load', onLoad, false);
    
    if (method === 'get') {
      ajax.send();
    } else {
      ajax.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
      ajax.send(data);
    }
  });
}

module.exports = ajax;

ajax.get = ajax;

ajax.post = function (url, data) {
  return ajax(url, 'post', data);
};
