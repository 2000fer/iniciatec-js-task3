//console.log(data);

let notNull = (str) => str || "...";

function crearTabla(datos,idTabla){

    //Si no existe el id de la tabla
    if(!document.getElementById(idTabla)) return;

    let tabla = document.getElementById(idTabla);

    tabla.innerHTML = "";

    //Registros de miembros
    datos.forEach(info => {

        let x=`                    
                <td>
                    <a href="${notNull(info.url)}" target="_blank">
                        ${notNull(info.first_name)} ${notNull(info.last_name)}
                    </a>
                </td>

                <td>${notNull(info.first_name)} ${notNull(info.middle_name)}</td>

                <td>${notNull(info.party)}</td>

                <td>${notNull(info.state)}</td>

                <td>${notNull(info.seniority)}</td>

                <td>${notNull(info.votes_with_party_pct)}%</td>
            `;
     
        let row = document.createElement('tr');
        row.innerHTML = x;

        tabla.appendChild(row);
    });
}


function inicializarFiltroState(datos,idSelect){

    if(!document.getElementById(idSelect)) return;

    let select = document.getElementById(idSelect);

    let estados = [];

    datos.forEach(info=>{
        if(estados.findIndex(x=>x==info.state) ==-1) {
            estados.push(info.state);
        }
    })

    estados.sort().forEach(estado=>{
        let option = document.createElement('option')
        option.setAttribute("value",estado);
        option.innerHTML = estado;
        select.appendChild(option)
    })
}


function addEventHandlerOnChange(formId, funcion){

    if(!document.getElementById(formId)) return;

    let inputs = document.getElementById(formId);

    Array.from(inputs).forEach(input =>{
        input.addEventListener("change", funcion);
    })
}

let getFiltrosParty = (idFiltro) => {

    //let checkBoxFiltros = document.forms[0];
    let checkBoxFiltros = document.getElementById(idFiltro);

    return Array.from(checkBoxFiltros).filter(x=> {
        return(x.checked==true ? true : false);
    });
}

let getFiltroSelect = (idSelect) => {

    let state = document.getElementById(idSelect).value;
    
    return state;
}



function actualizarLista(idTabla){

    let filtrosParty = getFiltrosParty("filtrosParty").map(element => element.value);
    let filtroState = getFiltroSelect("selectFilterState");

    let datos = data.results[0].members;
    let datosFiltrados = datos;

    if(filtrosParty.length > 0 || filtroState!="ALL"){

        datosFiltrados = datos.filter(element=>{
        
            let boolParty = true;
            let boolState = true;

            if(filtrosParty.length > 0){
                filtrosParty.findIndex(x=> x==element.party) >= 0 ? boolParty=true:boolParty=false;
            }

            if(filtroState!="ALL"){
                element.state == filtroState ? boolState=true:boolState=false;
            }
            
            return (boolParty && boolState);
        })   
    }

    crearTabla(datosFiltrados,"house-data");
    crearTabla(datosFiltrados,"senate-data");
}


inicializarFiltroState(data.results[0].members,"selectFilterState");

crearTabla(data.results[0].members,"senate-data");
crearTabla(data.results[0].members,"house-data");


addEventHandlerOnChange("filtrosParty",actualizarLista);
addEventHandlerOnChange("filtrosState",actualizarLista);
