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

module.exports={
    GetRut,
    UseRegexRut,
    fechaSplit,
    fechaSplit2,
    horaSplit,
    useRegexTelefono
}
