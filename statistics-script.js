let members = data.results[0].members;

let listaDemocrats = [];
let listaRepublicans = [];
let listaIndependents = [];

function rellenarListasPorPartido(miembros){

    miembros.forEach(miembro => {
        
        miembro.party=="D" ? listaDemocrats.push(miembro) :
        miembro.party=="R" ? listaRepublicans.push(miembro) :
        miembro.party=="ID" ? listaIndependents.push(miembro) : "";

    });

}

function promedioPercentPartyVotes(lista){

    let suma = 0;

    if(lista.length > 0) {
        lista.forEach(miembro => suma += miembro.votes_with_party_pct);
        return (suma/lista.length).toFixed(2);
    }
    else return null;
}


function obtenerLeast(datosOrdenados){

    let qty = datosOrdenados.length * 0.1;

    let least = [];
    
    for(let i=0; i<qty; i++){least.push(datosOrdenados[i]);}

    return least;
    
}

function obtenerMost(datosOrdenados){

    let qty = datosOrdenados.length * 0.1;

    let most = [];

    for(let i=datosOrdenados.length-1; i>datosOrdenados.length-1-qty; i--){most.push(datosOrdenados[i]);}

    return most;
}


function crearTablaAtAGlance(idTabla){

    let tabla = document.getElementById(idTabla);

    let tbody = document.createElement("tbody");
    
    let fila = (partyName,datos) => {
        let row = document.createElement("tr");
        
        let cell = document.createElement("td");
        cell.innerHTML = partyName;
        row.appendChild(cell);

        for( let x in datos){
            cell = document.createElement("td");
            cell.innerHTML = datos[x];
            row.appendChild(cell);    
        }
        
        return row;
    }

    tbody.appendChild(fila("Democrats",statistics.democrats));
    tbody.appendChild(fila("Republicans",statistics.republicans));
    tbody.appendChild(fila("Independents",statistics.independents));

    tabla.appendChild(tbody);
}

function crearTablaMostAndLeast(idTabla,datos,parametros){

    if(!document.getElementById(idTabla)) return;

    let tabla = document.getElementById(idTabla);

    let tbody = document.createElement("tbody");

    for(let x in datos){

        let row = document.createElement("tr");

        for(let y in parametros){   

            let cell = document.createElement("td");  

            //Si le paso parametros para link
            if(typeof parametros[y] === 'object' && parametros[y][1]["link"]=="true"){ 
                                
                let linkParam = parametros[y][1];
                
                let link = document.createElement("a");
                
                link.setAttribute("href",datos[x]["url"]);
                link.setAttribute("target","blank");

                let multiCampo = parametros[y][0].split('+');
                let valor = "";
                                
                Array.from(multiCampo).forEach(el => valor += datos[x][el]+" ");
                valor = valor.trim();

                link.innerHTML = valor;
                            
                cell.appendChild(link);                
            }

            else {
                cell.innerHTML = datos[x][parametros[y]];
            }

            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }
    
    tabla.appendChild(tbody);
    
}


rellenarListasPorPartido(members);

statistics.democrats.qty = listaDemocrats.length;
statistics.republicans.qty = listaRepublicans.length;
statistics.independents.qty = listaIndependents.length;
statistics.qtyTotal = listaDemocrats.length + listaRepublicans.length + listaIndependents.length;

statistics.democrats.averagePercentPartyVotes = promedioPercentPartyVotes(listaDemocrats);
statistics.republicans.averagePercentPartyVotes = promedioPercentPartyVotes(listaRepublicans);
statistics.independents.averagePercentPartyVotes = promedioPercentPartyVotes(listaIndependents);


//Miembros ordenados por votes with party pct
members.sort((a,b) => (a.votes_with_party_pct) - (b.votes_with_party_pct) )
statistics.leastLoyal = obtenerLeast(members);
statistics.mostLoyal = obtenerMost(members);
//---------------------------------------------


//Miembros ordenados por missed votes pct
members.sort((a,b) => (b.missed_votes_pct) - (a.missed_votes_pct) );
statistics.leastEngaged = obtenerLeast(members);
statistics.mostEngaged = obtenerMost(members);
//---------------------------------------------

crearTablaAtAGlance("tableAtAGlance");

crearTablaMostAndLeast("leastLoyal",statistics.leastLoyal,[["first_name+last_name",{"link":"true"}],"total_votes","votes_with_party_pct"]);
crearTablaMostAndLeast("mostLoyal",statistics.mostLoyal,[["first_name+last_name",{"link":"true"}],"total_votes","votes_with_party_pct"]);

crearTablaMostAndLeast("leastEngaged",statistics.leastEngaged,[["first_name+last_name",{"link":"true"}],"missed_votes","missed_votes_pct"]);
crearTablaMostAndLeast("mostEngaged",statistics.mostEngaged,[["first_name+last_name",{"link":"true"}],"missed_votes","missed_votes_pct"]);

