import{c as w,$ as s}from"./jquery-02352960.js";var g={},D={get exports(){return g},set exports(a){g=a}};(function(a){function h(e){if(typeof e!="string"||e.match(/[^10]/))return console.error('hamming-code error: input should be binary string, for example "101010"');for(var r=e,n=[],c=e.length,t=1,o,i,l,p,b;c/t>=1;)n.push(t),t*=2;for(i=0;i<n.length;i++)o=n[i],l=r.slice(o-1).split(""),p=y(l,o),b=p.reduce(function(u,f,C){return C%2||(u=u.concat(f)),u},[]).reduce(function(u,f){return+u+ +f},0)%2?1:0,r=r.slice(0,o-1)+b+r.slice(o-1),i+1===n.length&&r.length/(o*2)>=1&&n.push(o*2);return r}function m(e){if(typeof e!="string"||e.match(/[^10]/))return console.error('hamming-code error: input should be binary string, for example "101010"');var r=[],n=e.length,c=e,t;for(t=1;n/t>=1;)r.push(t),t*=2;return r.forEach(function(o,i){c=c.substring(0,o-1-i)+c.substring(o-i)}),c}function x(e){if(typeof e!="string"||e.match(/[^10]/))return console.error('hamming-code error: input should be binary string, for example "101010"');for(var r=[],n=0,c=e.length,t=1,o=m(e),i=h(o);c/t>=1;)r.push(t),t*=2;return r.forEach(function(l){e[l]!==i[l]&&(n+=l)}),n&&(o[n-1]==="1"?o=v(o,n-1,"0"):o=v(o,n-1,"1")),o}function k(e){if(typeof e!="string"||e.match(/[^10]/))return console.error('hamming-code error: input should be binary string, for example "101010"');var r=h(m(e));return r!==e}function v(e,r,n){return e.substr(0,r)+n+e.substr(r+n.length)}function y(e,r){for(var n=[],c=0,t=e.length;c<t;)n.push(e.slice(c,c+=r));return n}(function(e,r){a.exports?a.exports=r():e.hammingCode=r()})(w,function(){return{encode:h,pureDecode:m,decode:x,check:k}})})(D);const d=g;s("#encode").on("click",()=>{s("#result").val(d.encode(s("#source").val()))});s("#decode").on("click",()=>{s("#result").val(d.pureDecode(s("#source").val()))});s("#check").on("click",()=>{let a=d.check(s("#source").val());a=a?"В коде есть ошибка.":"Ошибок нет",s("#result").val(a)});