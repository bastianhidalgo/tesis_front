function GetRut(req) {
    let s = req.split('=');
    let numero = s[3].split('&');
    s = s[1].split('&');
    let rut = s[0];
    //let serie = numero[0];
    let serial=[rut]
    return serial;
}
function UseRegexRut(input) {
    let regex = /^[0-9]{1,2}(\.|)[0-9]{3}(\.|)[0-9]{3}(-|)[0-9kK]{1}$/;
    return regex.test(input);
}



function fechaSplit(req) {
    if (req && typeof req === 'string') {
    let s = req.split('T');
    s = s[0];

    return s;
}
}
function fechaSplit2(req){
    if (req && typeof req === 'string') {
    let s = req.split('T');
    s = s[0];
    let year= s.split('-');
    year = year[0];
    let month = s.split('-');
    month = month[1]
    let day = s.split('-');
    day = day[2]
    let fecha= day+'-'+month+'-'+year;
    return fecha;
}
}

function horaSplit(req){
    if (req && typeof req === 'string') {
    let s = req.split('T');
    s = s[1];
    if (s && typeof s === 'string') {
    let hora= s.split(':');
    hora = hora[0]+':'+hora[1];

    return hora;
}
}}
//2023-11-09T18:31:27.616Z

function useRegexTelefono(input) {
    let regex = /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/;
    return regex.test(input);
}

  

  
  var Fn = {
    // Valida el rut con su cadena completa "XXXXXXXX-X"
    validaRut: function(rutCompleto) {
      if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
        return false;
      var tmp = rutCompleto.split('-');
      var digv = tmp[1];
      var rut = tmp[0];
      if (digv == 'K') digv = 'k';
      return (Fn.dv(rut) == digv);
    },
    dv: function(T) {
      var M = 0,
        S = 1;
      for (; T; T = Math.floor(T / 10))
        S = (S + T % 10 * (9 - M++ % 6)) % 11;
      return S ? S - 1 : 'k';
    }
  };
  

  
/*const rut = '9149193-1';
  
if (Fn.validaRut(rut)) {
  console.log('El RUT es válido.');
} else {
  console.log('El RUT no es válido.');
}*/
module.exports={
    GetRut,
    UseRegexRut,
    fechaSplit,
    fechaSplit2,
    horaSplit,
    useRegexTelefono,
    Fn
}
