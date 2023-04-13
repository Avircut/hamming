import './style.css'
import $ from 'jquery';
import hammingCode from './hamming';


$('#encode').on('click',() => {
  $('#result').val(hammingCode.encode($('#source').val()));  
})
$('#decode').on('click',() => {
  $('#result').val(hammingCode.pureDecode($('#source').val()));
})
$('#check').on('click',() => {
  let checkResult = hammingCode.check($('#source').val());
  checkResult = checkResult ? 'В коде есть ошибка.' : 'Ошибок нет';
  $('#result').val(checkResult);
})