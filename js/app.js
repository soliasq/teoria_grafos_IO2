// VARIABLES GLOBALES
var redSalud = {};
var adyacencia = {};
var datosCargados = false;
var mapPrincipal;
var miniMaps = {};
var chartInstance = null;
var capaActual = 'calles';
var modoOscuro = false;
var modoPresentacion = false;
var criterioActual = 'tiempo';
var pesosMultiples = {};
var historialAcciones = [];
var editorAbierto = false;
var nodoSeleccionadoEd = null;
var modoAgregarNodoMapa = false;
var flotaCamiones = [];

var capas = {
    'calles': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    'satelite': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    'terreno': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
};

// ============================================================
// EXPORTAR CSV ACTUALIZADO
// ============================================================
function descargarCSVActualizado() {
    if (!datosCargados) {
        mostrarToast('No hay datos para exportar', 'warning');
        return;
    }

    var totalNodos = Object.keys(redSalud).length;
    var totalAristas = Object.values(adyacencia).reduce(function(s, x) { return s + Object.keys(x).length; }, 0) / 2;

    // ====== 1. GENERAR vertices.csv ======
    var vertices = 'id,nombre,tipo,lat,lng\n';
    Object.keys(redSalud).forEach(function(k) {
        var n = redSalud[k];
        var nombre = (n.nombre || '').replace(/,/g, ';');
        var tipo = (n.tipo || '').replace(/,/g, ';');
        vertices += k + ',' + nombre + ',' + tipo + ',' + n.lat + ',' + n.lng + '\n';
    });

    // ====== 2. GENERAR aristas.csv ======
    var aristas = 'origen,destino,peso\n';
    var procesadas = {};
    Object.keys(adyacencia).forEach(function(u) {
        Object.keys(adyacencia[u]).forEach(function(v) {
            var key = [u, v].sort().join('-');
            if (!procesadas[key]) {
                procesadas[key] = true;
                aristas += u + ',' + v + ',' + adyacencia[u][v] + '\n';
            }
        });
    });

    // ====== 3. DESCARGAR vertices.csv ======
    var blobV = new Blob([vertices], {type:'text/csv;charset=utf-8;'});
    var urlV = URL.createObjectURL(blobV);
    var aV = document.createElement('a');
    aV.href = urlV;
    aV.download = 'vertices.csv';
    document.body.appendChild(aV);
    aV.click();
    document.body.removeChild(aV);

    // ====== 4. DESCARGAR aristas.csv ======
    setTimeout(function() {
        var blobA = new Blob([aristas], {type:'text/csv;charset=utf-8;'});
        var urlA = URL.createObjectURL(blobA);
        var aA = document.createElement('a');
        aA.href = urlA;
        aA.download = 'aristas.csv';
        document.body.appendChild(aA);
        aA.click();
        document.body.removeChild(aA);

        setTimeout(function() {
            URL.revokeObjectURL(urlV);
            URL.revokeObjectURL(urlA);
        }, 1000);

        mostrarToast('✓ Descargados: ' + totalNodos + ' nodos, ' + totalAristas + ' aristas', 'success', 6000);
        agregarAlHistorial('CSV actualizado descargado: ' + totalNodos + ' nodos', 'info');
    }, 600);
}

// ============================================================
// LOCALSTORAGE
// ============================================================
function guardarEnLocalStorage() {
    try {
        localStorage.setItem('ceass_redSalud', JSON.stringify(redSalud));
        localStorage.setItem('ceass_adyacencia', JSON.stringify(adyacencia));
        localStorage.setItem('ceass_fecha', new Date().toISOString());
    } catch(e) {
        console.warn('No se pudo guardar en localStorage:', e);
    }
}

function cargarDesdeLocalStorage() {
    try {
        var r = localStorage.getItem('ceass_redSalud');
        var a = localStorage.getItem('ceass_adyacencia');
        if (r && a) {
            var data = JSON.parse(r);
            if (Object.keys(data).length > 0) {
                redSalud = data;
                adyacencia = JSON.parse(a);
                datosCargados = true;
                generarPesosMultiples();
                actualizarTodo();
                actualizarSelectsEditor();
                renderizarListaNodos();
                renderizarListaAristas();
                console.log('✓ Datos cargados desde localStorage: ' + Object.keys(redSalud).length + ' nodos');
                return true;
            }
        }
    } catch(e) {
        console.warn('No se pudo cargar desde localStorage:', e);
    }
    return false;
}

// CANVAS DE FONDO
function initBackgroundAnimation() {
    var canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var width = canvas.width = window.innerWidth;
    var height = canvas.height = window.innerHeight;
    var particles = [];
    for (var i = 0; i < 60; i++) {
        particles.push({x:Math.random()*width, y:Math.random()*height, vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5, radius:Math.random()*2+1});
    }
    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = modoOscuro ? 'rgba(214,158,46,0.6)' : 'rgba(26,54,93,0.4)';
            ctx.fill();
        }
        for (var a = 0; a < particles.length; a++) {
            for (var b = a+1; b < particles.length; b++) {
                var dx = particles[a].x - particles[b].x;
                var dy = particles[a].y - particles[b].y;
                var dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.strokeStyle = modoOscuro ? 'rgba(214,158,46,' + ((1-dist/150)*0.3) + ')' : 'rgba(26,54,93,' + ((1-dist/150)*0.3) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('resize', function() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}

// TOAST
function mostrarToast(mensaje, tipo, duracion) {
    tipo = tipo || 'info';
    duracion = duracion || 4000;
    var c = document.getElementById('toastContainer');
    if (!c) return;
    var t = document.createElement('div');
    t.className = 'toast ' + tipo;
    var iconos = {success:'fa-check-circle', error:'fa-times-circle', warning:'fa-exclamation-triangle', info:'fa-info-circle'};
    t.innerHTML = '<div class="toast-icon"><i class="fas ' + iconos[tipo] + '"></i></div><div class="toast-content">' + mensaje + '</div><button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>';
    c.appendChild(t);
    setTimeout(function() { t.style.opacity = '0'; setTimeout(function() { t.remove(); }, 300); }, duracion);
}

function addLog(msg, icon) {
    icon = icon || 'info-circle';
    var el = document.getElementById('resultados');
    if (!el) return;
    var t = new Date().toLocaleTimeString();
    el.innerHTML += '<div style="padding:2px 0;"><i class="fas fa-' + icon + '" style="color:#d69e2e;width:14px;"></i> <span style="color:#8899aa;">[' + t + ']</span> ' + msg + '</div>';
    el.scrollTop = el.scrollHeight;
}

// HISTORIAL
function agregarAlHistorial(accion, tipo) {
    tipo = tipo || 'info';
    var hora = new Date().toLocaleTimeString('es-BO', {hour:'2-digit', minute:'2-digit', second:'2-digit'});
    historialAcciones.unshift({hora:hora, accion:accion, tipo:tipo});
    if (historialAcciones.length > 50) historialAcciones.pop();
    renderizarHistorial();
    var badge = document.getElementById('activityCount');
    if (badge) badge.textContent = historialAcciones.length;
}

function renderizarHistorial() {
    var container = document.getElementById('historialAcciones');
    if (!container) return;
    if (historialAcciones.length === 0) {
        container.innerHTML = '<div class="activity-empty">Sin acciones recientes</div>';
        return;
    }
    var iconos = {success:'fa-check-circle', error:'fa-times-circle', warning:'fa-exclamation-triangle', info:'fa-info-circle', node:'fa-map-marker-alt', edge:'fa-link', delete:'fa-trash', algorithm:'fa-cogs'};
    var html = '';
    for (var i = 0; i < historialAcciones.length; i++) {
        var item = historialAcciones[i];
        var icono = iconos[item.tipo] || iconos.info;
        html += '<div class="activity-item ' + item.tipo + '"><div class="act-icon"><i class="fas ' + icono + '"></i></div><span class="act-time">' + item.hora + '</span><span class="act-text">' + item.accion + '</span></div>';
    }
    container.innerHTML = html;
}

function limpiarHistorial() {
    if (!confirm('Limpiar historial?')) return;
    historialAcciones = [];
    renderizarHistorial();
    var badge = document.getElementById('activityCount');
    if (badge) badge.textContent = '0';
    mostrarToast('Historial limpiado', 'info');
}

function renderizarNodosEnVivo() {
    var container = document.getElementById('activityNodos');
    var countEl = document.getElementById('activityNodosCount');
    if (!container) return;
    var keys = Object.keys(redSalud);
    if (countEl) countEl.textContent = keys.length;
    if (keys.length === 0) {
        container.innerHTML = '<div class="activity-empty">Sin nodos cargados</div>';
        return;
    }
    var html = '';
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var n = redSalud[k];
        var iconTipo = 'fa-hospital';
        var colorTipo = '#d69e2e';
        var tipo = n.tipo || '';
        if (tipo.indexOf('Hub') !== -1) { iconTipo = 'fa-warehouse'; colorTipo = '#1a365d'; }
        else if (tipo.indexOf('SEDES') !== -1) { iconTipo = 'fa-building'; colorTipo = '#38a169'; }
        else if (tipo.indexOf('Frontera') !== -1) { iconTipo = 'fa-passport'; colorTipo = '#e53e3e'; }
        else if (tipo.indexOf('3er Nivel') !== -1) { iconTipo = 'fa-hospital'; colorTipo = '#805ad5'; }
        else if (tipo.indexOf('2do Nivel') !== -1) { iconTipo = 'fa-clinic-medical'; colorTipo = '#3182ce'; }
        html += '<div class="activity-item" onclick="seleccionarNodoEd(\'' + k + '\')" style="cursor:pointer;"><div class="act-icon" style="background:' + colorTipo + ';"><i class="fas ' + iconTipo + '"></i></div><span class="act-time" style="min-width:50px;color:' + colorTipo + ';">' + k + '</span><span class="act-text">' + n.nombre + '</span></div>';
    }
    container.innerHTML = html;
}

// PONDERACION
function generarPesosMultiples() {
    pesosMultiples = {};
    var procesadas = {};
    Object.keys(adyacencia).forEach(function(u) {
        Object.keys(adyacencia[u]).forEach(function(v) {
            var key = [u, v].sort().join('-');
            if (!procesadas[key]) {
                procesadas[key] = true;
                var t = adyacencia[u][v];
                pesosMultiples[key] = {
                    tiempo: t,
                    distancia: Math.round(t * 60),
                    costo: Math.round(t * 60 * 0.8 + 20),
                    riesgo: Math.min(10, Math.max(1, Math.round(t * 0.8 + 2)))
                };
            }
        });
    });
}

function getPeso(u, v) {
    var key = [u, v].sort().join('-');
    var p = pesosMultiples[key];
    if (!p) return adyacencia[u] && adyacencia[u][v] ? adyacencia[u][v] : 0;
    return p[criterioActual] || 0;
}

function getUnidad() {
    var u = {tiempo:'h', distancia:'km', costo:'Bs', riesgo:'/10'};
    return u[criterioActual] || '';
}

function getPesoNodo(code) {
    var vecinos = Object.keys(adyacencia[code] || {});
    if (vecinos.length === 0) return 0;
    var suma = 0;
    vecinos.forEach(function(v) { suma += getPeso(code, v); });
    return suma / vecinos.length;
}

function initPonderacion() {
    document.querySelectorAll('.pond-option').forEach(function(option) {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            var criterio = this.dataset.criterio;
            document.querySelectorAll('.pond-option').forEach(function(opt) { opt.classList.remove('active'); });
            this.classList.add('active');
            var radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
            criterioActual = criterio;
            var textos = {tiempo:'Tiempo (horas)', distancia:'Distancia (km)', costo:'Costo (Bs)', riesgo:'Riesgo (1-10)'};
            document.getElementById('pondStatusText').textContent = 'Criterio: ' + textos[criterio];
            generarPesosMultiples();
            if (datosCargados) {
                actualizarMatriz();
                actualizarLista();
                actualizarTodo();
            }
            mostrarToast('Criterio: ' + textos[criterio], 'info');
        });
    });
}

// MODALES
function mostrarAcercaDe() { document.getElementById('modalAcercaDe').classList.add('active'); }
function mostrarAtajos() { document.getElementById('modalAtajos').classList.add('active'); }
function cerrarModal(id) { document.getElementById(id).classList.remove('active'); }

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(function(el) { el.classList.remove('active'); });
        if (document.body.classList.contains('mapa-grande')) toggleMapaGrande();
        if (editorAbierto) cerrarEditor();
        if (modoAgregarNodoMapa) cancelarModoMapa();
    }
});

document.querySelectorAll('.modal-overlay').forEach(function(m) {
    m.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('active'); });
});

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'e') { e.preventDefault(); ejecutar(); }
        if (e.key.toLowerCase() === 'r') { e.preventDefault(); reiniciar(); }
        if (e.key.toLowerCase() === 'd') { e.preventDefault(); cargarDatosPrueba(); }
        if (e.key.toLowerCase() === 'm') { e.preventDefault(); toggleMapaGrande(); }
        if (e.key.toLowerCase() === 'k') { e.preventDefault(); toggleEditor(); }
    }
    if (e.key === 'F1') { e.preventDefault(); mostrarAtajos(); }
});

function toggleMapaGrande() {
    document.body.classList.toggle('mapa-grande');
    var btn = document.getElementById('btn-expandir');
    var isGrande = document.body.classList.contains('mapa-grande');
    if (btn) btn.innerHTML = isGrande ? '<i class="fas fa-compress"></i> Reducir' : '<i class="fas fa-expand"></i> Completa';
    if (isGrande) {
        if (!document.querySelector('.btn-cerrar-expandido')) {
            var closeBtn = document.createElement('button');
            closeBtn.className = 'btn-cerrar-expandido';
            closeBtn.innerHTML = '<i class="fas fa-times"></i> Salir';
            closeBtn.onclick = toggleMapaGrande;
            document.body.appendChild(closeBtn);
        }
    } else {
        var cb = document.querySelector('.btn-cerrar-expandido');
        if (cb) cb.remove();
    }
    setTimeout(function() { if (mapPrincipal) mapPrincipal.invalidateSize(); }, 400);
}

// MAPAS
function initMapPrincipal() {
    mapPrincipal = L.map('map', {zoomControl:true}).setView([-16.5, -64.5], 5);
    var layer = L.tileLayer(capas['calles'], {maxZoom:19, attribution:'Esri', crossOrigin:true});
    layer.on('tileerror', function() {
        mapPrincipal.removeLayer(layer);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {maxZoom:19, subdomains:'abcd', crossOrigin:true}).addTo(mapPrincipal);
    });
    layer.addTo(mapPrincipal);
    setTimeout(function() { mapPrincipal.invalidateSize(); }, 500);
}

function initMiniMaps() {
    var algos = ['bfs','dfs','dijkstra','astar','kruskal','prim'];
    algos.forEach(function(algo) {
        var container = document.getElementById('minimap-' + algo);
        if (!container) return;
        var m = L.map(container, {zoomControl:false, attributionControl:false, dragging:true, scrollWheelZoom:false, doubleClickZoom:false, boxZoom:false, keyboard:false}).setView([-16.5, -64.5], 5);
        L.tileLayer(capas['calles'], {maxZoom:19, crossOrigin:true}).addTo(m);
        miniMaps[algo] = m;
    });
    setTimeout(function() { Object.values(miniMaps).forEach(function(m) { m.invalidateSize(); }); }, 800);
}

function cambiarCapa(tipo) {
    if (!mapPrincipal) return;
    capaActual = tipo;
    mapPrincipal.eachLayer(function(l) { if (l instanceof L.TileLayer) mapPrincipal.removeLayer(l); });
    L.tileLayer(capas[tipo], {maxZoom:19, crossOrigin:true}).addTo(mapPrincipal);
    document.querySelectorAll('.map-controls button').forEach(function(b) { b.classList.remove('active'); });
    var btn = document.getElementById('btn-' + tipo);
    if (btn) btn.classList.add('active');
}

function toggleModoOscuro() {
    modoOscuro = !modoOscuro;
    document.body.classList.toggle('dark-mode', modoOscuro);
    mostrarToast(modoOscuro ? 'Modo oscuro' : 'Modo claro', 'info');
}

// ACTUALIZAR
function actualizarTodo() {
    if (!mapPrincipal) return;
    mapPrincipal.eachLayer(function(layer) {
        if (layer instanceof L.Marker || layer instanceof L.CircleMarker || layer instanceof L.Polyline) {
            mapPrincipal.removeLayer(layer);
        }
    });

    var procesadas = {};
    Object.keys(adyacencia).forEach(function(u) {
        Object.keys(adyacencia[u]).forEach(function(v) {
            var key = [u, v].sort().join('-');
            if (!procesadas[key] && redSalud[u] && redSalud[v]) {
                procesadas[key] = true;
                L.polyline([[redSalud[u].lat, redSalud[u].lng], [redSalud[v].lat, redSalud[v].lng]],
                    {color:'#94a3b8', weight:2, opacity:0.4, dashArray:'4,4'}).addTo(mapPrincipal);
            }
        });
    });

    var pesosNodo = {};
    Object.keys(redSalud).forEach(function(k) { pesosNodo[k] = getPesoNodo(k); });
    var maxPN = 0, minPN = Infinity;
    Object.values(pesosNodo).forEach(function(p) {
        if (p > maxPN) maxPN = p;
        if (p < minPN) minPN = p;
    });
    if (minPN === Infinity) minPN = 0;

    var keysR = Object.keys(redSalud);
    for (var m = 0; m < keysR.length; m++) {
        var code = keysR[m];
        var n = redSalud[code];
        var tipo = n.tipo || '';
        var pesoNodo = pesosNodo[code];
        var ratio = maxPN > minPN ? (pesoNodo - minPN) / (maxPN - minPN) : 0.5;
        var bg = ratio < 0.33 ? '#38a169' : ratio < 0.66 ? '#d69e2e' : '#e53e3e';
        var iconFA = 'fa-hospital';
        var size = 26 + ratio * 8;

        if (tipo.indexOf('Hub CEASS') !== -1) iconFA = 'fa-warehouse';
        else if (tipo.indexOf('Frontera') !== -1) iconFA = 'fa-passport';
        else if (tipo.indexOf('SEDES') !== -1) iconFA = 'fa-building';
        else if (tipo.indexOf('3er Nivel') !== -1) iconFA = 'fa-hospital';
        else if (tipo.indexOf('2do Nivel') !== -1) iconFA = 'fa-clinic-medical';

        var htmlIcono = '<div style="background:' + bg + ';color:white;width:' + size + 'px;height:' + size + 'px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:' + Math.floor(size * 0.45) + 'px;border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"><i class="fas ' + iconFA + '"></i></div>';
        var icono = L.divIcon({className:'icono-nodo', html:htmlIcono, iconSize:[size, size], iconAnchor:[size/2, size/2]});
        L.marker([n.lat, n.lng], {icon:icono}).addTo(mapPrincipal)
            .bindTooltip('<b>' + n.nombre + '</b><br><span style="color:#d69e2e;font-size:10px;">' + n.tipo + '</span><br><b>Peso prom: ' + pesoNodo.toFixed(2) + getUnidad() + '</b>', {direction:'top', sticky:true});
    }

    actualizarSelects();
    actualizarKPI();
    actualizarBadges();
    actualizarMatriz();
    actualizarLista();
    renderizarNodosEnVivo();
    setTimeout(function() { mapPrincipal.invalidateSize(); }, 100);
}

function actualizarSelects() {
    var o = document.getElementById('origen');
    var d = document.getElementById('destino');
    var oPrev = o.value, dPrev = d.value;
    o.innerHTML = '';
    d.innerHTML = '';
    var keys = Object.keys(redSalud);
    for (var i = 0; i < keys.length; i++) {
        var c = keys[i];
        o.innerHTML += '<option value="' + c + '">' + c + ' - ' + redSalud[c].nombre + '</option>';
        d.innerHTML += '<option value="' + c + '">' + c + ' - ' + redSalud[c].nombre + '</option>';
    }
    d.insertAdjacentHTML('afterbegin', '<option value="">-- Seleccionar --</option>');
    if (oPrev && redSalud[oPrev]) o.value = oPrev;
    else if (keys.indexOf('LPZ') !== -1) o.value = 'LPZ';
    if (dPrev && redSalud[dPrev]) d.value = dPrev;
    else if (keys.indexOf('SCZ') !== -1) d.value = 'SCZ';
}

function actualizarKPI() {
    var h = 0, r = 0, f = 0;
    Object.values(redSalud).forEach(function(n) {
        var tipo = n.tipo || '';
        if (tipo.indexOf('Hub') !== -1) h++;
        else if (tipo.indexOf('Frontera') !== -1) f++;
        else r++;
    });
    document.getElementById('kpi-hubs').textContent = h;
    document.getElementById('kpi-regionales').textContent = r;
    document.getElementById('kpi-frontera').textContent = f;
}

function actualizarBadges() {
    var n = Object.keys(redSalud).length;
    var a = Object.values(adyacencia).reduce(function(s, x) { return s + Object.keys(x).length; }, 0) / 2;
    document.getElementById('badge-nodos').innerHTML = '<i class="fas fa-circle"></i> ' + n + ' Nodos';
    document.getElementById('badge-aristas').innerHTML = '<i class="fas fa-link"></i> ' + Math.round(a) + ' Aristas';
    document.getElementById('badge-data-status').innerHTML = '<i class="fas fa-check-circle"></i> Cargado';
}

function actualizarMatriz() {
    var c = document.getElementById('matriz-body');
    var keys = Object.keys(redSalud);
    if (!keys.length) { c.innerHTML = 'Cargue datos'; return; }
    document.getElementById('matriz-count').textContent = keys.length + 'x' + keys.length;
    var h = '<table class="matriz"><thead><tr><th>.</th>';
    for (var i = 0; i < keys.length; i++) h += '<th>' + keys[i] + '</th>';
    h += '</tr></thead><tbody>';
    for (var a = 0; a < keys.length; a++) {
        h += '<tr><td class="fila-header">' + keys[a] + '</td>';
        for (var b = 0; b < keys.length; b++) {
            if (a === b) h += '<td class="vacio">0</td>';
            else if (adyacencia[keys[a]] && adyacencia[keys[a]][keys[b]]) h += '<td class="conexion">' + getPeso(keys[a], keys[b]).toFixed(1) + '</td>';
            else h += '<td class="vacio">-</td>';
        }
        h += '</tr>';
    }
    c.innerHTML = h + '</tbody></table>';
}

function actualizarLista() {
    var c = document.getElementById('lista-body');
    var keys = Object.keys(redSalud);
    if (!keys.length) { c.innerHTML = 'Cargue datos'; return; }
    document.getElementById('lista-count').textContent = keys.length + ' nodos';
    var u = getUnidad();
    var h = '<div class="lista-ady">';
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var v = Object.keys(adyacencia[k] || {});
        h += '<div class="lista-ady-item"><div class="nodo-principal">' + k + ' - ' + redSalud[k].nombre + '</div><div class="vecinos">';
        if (!v.length) h += '<em style="color:#cbd5e1;">Sin conexiones</em>';
        else for (var j = 0; j < v.length; j++) h += '<span class="vecino">' + v[j] + ' <span class="peso">(' + getPeso(k, v[j]).toFixed(1) + u + ')</span></span>';
        h += '</div></div>';
    }
    c.innerHTML = h + '</div>';
}

function getBounds() {
    var lats = [], lngs = [];
    Object.values(redSalud).forEach(function(n) { lats.push(n.lat); lngs.push(n.lng); });
    if (!lats.length) return [[-22, -70], [-10, -57]];
    return [[Math.min.apply(null, lats), Math.min.apply(null, lngs)], [Math.max.apply(null, lats), Math.max.apply(null, lngs)]];
}

// DATOS PRUEBA
function cargarDatosPrueba() {
    redSalud = {
        'LPZ': {nombre:'La Paz - CEASS Central', tipo:'Hub CEASS', lat:-16.5000, lng:-68.1500},
        'EAL': {nombre:'El Alto - Almacen Central', tipo:'Hub CEASS', lat:-16.5100, lng:-68.1900},
        'CBB': {nombre:'Cochabamba - Hub CEASS', tipo:'Hub CEASS', lat:-17.3895, lng:-66.1568},
        'SCZ': {nombre:'Santa Cruz - Hub CEASS', tipo:'Hub CEASS', lat:-17.7833, lng:-63.1821},
        'WAR': {nombre:'Warnes - Almacen Este', tipo:'Hub CEASS', lat:-17.5167, lng:-63.1667},
        'ORU': {nombre:'Oruro - SEDES', tipo:'SEDES', lat:-17.9647, lng:-67.1060},
        'PTS': {nombre:'Potosi - SEDES', tipo:'SEDES', lat:-19.5836, lng:-65.7531},
        'SRE': {nombre:'Sucre - SEDES', tipo:'SEDES', lat:-19.0333, lng:-65.2627},
        'TJA': {nombre:'Tarija - SEDES', tipo:'SEDES', lat:-21.5355, lng:-64.7295},
        'TJN': {nombre:'Trinidad - SEDES', tipo:'SEDES', lat:-14.8333, lng:-64.9000},
        'CIJ': {nombre:'Cobija - SEDES', tipo:'SEDES', lat:-11.0267, lng:-68.7692},
        'HCL': {nombre:'Hospital de Clinicas - LPZ', tipo:'Hospital 3er Nivel', lat:-16.5042, lng:-68.1260},
        'HNORTE': {nombre:'Hospital del Norte - El Alto', tipo:'Hospital 3er Nivel', lat:-16.4895, lng:-68.1748},
        'HVIEDMA': {nombre:'Hospital Viedma - CBB', tipo:'Hospital 3er Nivel', lat:-17.3895, lng:-66.1568},
        'HGURQUIDI': {nombre:'Hospital German Urquidi - CBB', tipo:'Hospital 3er Nivel', lat:-17.3836, lng:-66.1624},
        'HSJD-ORU': {nombre:'Hospital San Juan de Dios - Oruro', tipo:'Hospital 3er Nivel', lat:-17.9647, lng:-67.1060},
        'HDB': {nombre:'Hospital Daniel Bracamonte - Potosi', tipo:'Hospital 3er Nivel', lat:-19.5836, lng:-65.7531},
        'HSB': {nombre:'Hospital Santa Barbara - Sucre', tipo:'Hospital 3er Nivel', lat:-19.0333, lng:-65.2627},
        'HMUJ': {nombre:'Hospital Universitario Japones - SCZ', tipo:'Hospital 3er Nivel', lat:-17.7833, lng:-63.1821},
        'HSJD-SCZ': {nombre:'Hospital San Juan de Dios - SCZ', tipo:'Hospital 3er Nivel', lat:-17.7897, lng:-63.1794},
        'HNINOS': {nombre:'Hospital de Ninos - SCZ', tipo:'Hospital 3er Nivel', lat:-17.7889, lng:-63.1734},
        'HSJD-TJA': {nombre:'Hospital San Juan de Dios - TJA', tipo:'Hospital 3er Nivel', lat:-21.5355, lng:-64.7295},
        'HTRINIDAD': {nombre:'Hospital Obrero 8 - Trinidad', tipo:'Hospital 3er Nivel', lat:-14.8333, lng:-64.9000},
        'HACHACACHI': {nombre:'Hospital Achacachi', tipo:'Hospital 2do Nivel', lat:-16.0440, lng:-68.6860},
        'HCARANAVI': {nombre:'Hospital Caranavi', tipo:'Hospital 2do Nivel', lat:-15.8167, lng:-67.5500},
        'HUYUNI': {nombre:'Hospital Uyuni', tipo:'Hospital 2do Nivel', lat:-20.4597, lng:-66.8250},
        'HCAMIRI': {nombre:'Hospital Camiri', tipo:'Hospital 2do Nivel', lat:-20.0385, lng:-63.5174},
        'HVALLEGRANDE': {nombre:'Hospital Vallegrande', tipo:'Hospital 2do Nivel', lat:-18.4892, lng:-64.1061},
        'HRIBERALTA': {nombre:'Hospital Riberalta', tipo:'Hospital 2do Nivel', lat:-11.0065, lng:-66.0631},
        'HGUAYARA': {nombre:'Hospital Guayaramerin', tipo:'Hospital 2do Nivel', lat:-10.8368, lng:-65.3581},
        'HSANBORJA': {nombre:'Hospital San Borja', tipo:'Hospital 2do Nivel', lat:-14.8500, lng:-66.7500},
        'HRURREN': {nombre:'Hospital Rurrenabaque', tipo:'Hospital 2do Nivel', lat:-14.4422, lng:-67.5275},
        'DES': {nombre:'Desaguadero - Frontera', tipo:'Frontera', lat:-16.5651, lng:-69.0425},
        'TAM': {nombre:'Tambo Quemado - Frontera', tipo:'Frontera', lat:-18.2828, lng:-69.0289},
        'PAB': {nombre:'Pisiga - Frontera', tipo:'Frontera', lat:-19.0988, lng:-68.6094},
        'VLL': {nombre:'Villazon - Frontera', tipo:'Frontera', lat:-22.0866, lng:-65.5960},
        'PST': {nombre:'Puerto Suarez - Frontera', tipo:'Frontera', lat:-18.9649, lng:-57.7977},
        'YAC': {nombre:'Yacuiba - Frontera', tipo:'Frontera', lat:-22.0167, lng:-63.6833},
        'BER': {nombre:'Bermejo - Frontera', tipo:'Frontera', lat:-22.7314, lng:-64.3372}
    };
    adyacencia = {
        'LPZ': {'EAL':0.5, 'HCL':0.3, 'HNORTE':0.4},
        'EAL': {'LPZ':0.5, 'HACHACACHI':1.8, 'DES':2.0, 'ORU':3.0, 'HCL':0.3, 'HNORTE':0.4},
        'HACHACACHI': {'EAL':1.8, 'HCARANAVI':2.5, 'HSANBORJA':6.0},
        'HCARANAVI': {'HACHACACHI':2.5, 'HRIBERALTA':12.0, 'HSANBORJA':5.0},
        'DES': {'EAL':2.0},
        'ORU': {'EAL':3.0, 'TAM':4.0, 'PAB':3.5, 'CBB':4.0, 'HSJD-ORU':0.3, 'PTS':4.0},
        'TAM': {'ORU':4.0},
        'PAB': {'ORU':3.5},
        'PTS': {'HUYUNI':3.0, 'VLL':6.0, 'SRE':3.0, 'HDB':0.3, 'ORU':4.0},
        'HUYUNI': {'PTS':3.0, 'VLL':5.0, 'HDB':3.0},
        'VLL': {'HUYUNI':5.0, 'PTS':6.0},
        'CBB': {'ORU':4.0, 'SRE':7.0, 'SCZ':7.0, 'TJN':12.0, 'HVIEDMA':0.3, 'HGURQUIDI':0.4, 'HSB':7.0},
        'HVIEDMA': {'CBB':0.3, 'HGURQUIDI':0.3},
        'HGURQUIDI': {'CBB':0.4, 'HVIEDMA':0.3},
        'SRE': {'CBB':7.0, 'PTS':3.0, 'HSB':0.3, 'TJA':6.0, 'SCZ':9.0},
        'HSB': {'SRE':0.3, 'HSJD-TJA':6.0, 'HDB':3.5, 'CBB':7.0},
        'SCZ': {'CBB':7.0, 'WAR':0.8, 'SRE':9.0, 'TJN':10.0, 'HMUJ':0.4, 'HSJD-SCZ':0.3, 'HNINOS':0.5, 'HCAMIRI':4.0, 'HVALLEGRANDE':4.5, 'PST':8.0},
        'WAR': {'SCZ':0.8},
        'HMUJ': {'SCZ':0.4, 'HSJD-SCZ':0.5, 'HNINOS':0.4},
        'HSJD-SCZ': {'SCZ':0.3, 'HMUJ':0.5, 'HNINOS':0.3},
        'HNINOS': {'SCZ':0.5, 'HMUJ':0.4, 'HSJD-SCZ':0.3},
        'TJA': {'SRE':6.0, 'HSJD-TJA':0.3, 'YAC':3.5, 'BER':3.0},
        'HSJD-TJA': {'TJA':0.3, 'HSB':6.0, 'YAC':3.5, 'BER':3.0},
        'YAC': {'TJA':3.5, 'HSJD-TJA':3.5, 'BER':4.0, 'HCAMIRI':3.5},
        'BER': {'TJA':3.0, 'HSJD-TJA':3.0, 'YAC':4.0},
        'HCAMIRI': {'SCZ':4.0, 'YAC':3.5, 'HVALLEGRANDE':3.0},
        'HVALLEGRANDE': {'HCAMIRI':3.0, 'SCZ':4.5},
        'TJN': {'CBB':12.0, 'SCZ':10.0, 'HRIBERALTA':11.0, 'HTRINIDAD':0.3, 'HSANBORJA':3.0},
        'HTRINIDAD': {'TJN':0.3, 'HRIBERALTA':11.0},
        'HRIBERALTA': {'HTRINIDAD':11.0, 'HGUAYARA':1.5, 'HCARANAVI':12.0, 'HSANBORJA':4.0, 'CIJ':8.0},
        'HGUAYARA': {'HRIBERALTA':1.5},
        'CIJ': {'HRIBERALTA':8.0},
        'HDB': {'PTS':0.3, 'HSB':3.5, 'HUYUNI':3.0},
        'HCL': {'EAL':0.3, 'HNORTE':0.4, 'LPZ':0.3},
        'HNORTE': {'EAL':0.4, 'HCL':0.3, 'LPZ':0.4},
        'HSJD-ORU': {'ORU':0.3},
        'HSANBORJA': {'TJN':3.0, 'HRIBERALTA':4.0, 'HRURREN':2.5, 'HCARANAVI':5.0, 'HACHACACHI':6.0},
        'HRURREN': {'HSANBORJA':2.5},
        'PST': {'SCZ':8.0}
    };
    Object.keys(redSalud).forEach(function(k) {
        if (!adyacencia[k]) adyacencia[k] = {};
    });
    datosCargados = true;
    generarPesosMultiples();
    setTimeout(function() {
        actualizarTodo();
        actualizarSelectsEditor();
        renderizarListaNodos();
        renderizarListaAristas();
        if (mapPrincipal) mapPrincipal.fitBounds(getBounds(), {padding:[30,30]});
    }, 300);
    var nNodos = Object.keys(redSalud).length;
    var nAristas = Object.values(adyacencia).reduce(function(s, x) { return s + Object.keys(x).length; }, 0) / 2;
    mostrarToast('Datos de prueba cargados: ' + nNodos + ' nodos, ' + nAristas + ' aristas', 'success');
    agregarAlHistorial('Datos de prueba: ' + nNodos + ' nodos', 'info');
    document.getElementById('badge-origen-datos').innerHTML = '<i class="fas fa-flask"></i> Datos de prueba';
}

// CSV
function cargarDatosDesdeArchivos() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.multiple = true;
    input.onchange = function(e) {
        var files = e.target.files;
        var vF = null, aF = null;
        for (var i = 0; i < files.length; i++) {
            var n = files[i].name.toLowerCase();
            if (n.indexOf('vertice') !== -1 || n.indexOf('nodo') !== -1) vF = files[i];
            else if (n.indexOf('arista') !== -1 || n.indexOf('edge') !== -1) aF = files[i];
        }
        if (!vF || !aF) { mostrarToast('Selecciona vertices.csv y aristas.csv', 'warning', 5000); return; }
        var rV = new FileReader(), rA = new FileReader();
        var tV = '', tA = '';
        rV.onload = function(ev) { tV = ev.target.result; if (tA) procesarCSV(tV, tA); };
        rA.onload = function(ev) { tA = ev.target.result; if (tV) procesarCSV(tV, tA); };
        rV.readAsText(vF);
        rA.readAsText(aF);
    };
    input.click();
}

function parseCSV(text) {
    if (!text || text.length === 0) return [];
    text = text.replace(/^\uFEFF/, '');
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    var lines = text.split('\n');
    var result = [];
    var headers = null;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line === '') continue;
        var cols = line.split(',').map(function(c) { return c.trim(); });
        if (headers === null) { headers = cols; continue; }
        var row = {};
        for (var j = 0; j < headers.length; j++) {
            row[headers[j]] = cols[j] !== undefined ? cols[j] : '';
        }
        result.push(row);
    }
    return result;
}

function procesarCSV(csvV, csvA) {
    try {
        var v = parseCSV(csvV);
        var a = parseCSV(csvA);
        if (v.length === 0) { mostrarToast('vertices.csv vacio', 'error', 5000); return; }
        var nV = {};
        for (var i = 0; i < v.length; i++) {
            var r = v[i];
            if (r.id && r.nombre && r.id.trim() !== '') {
                nV[r.id.trim()] = {
                    nombre: r.nombre.trim(),
                    tipo: (r.tipo && r.tipo.trim()) || 'Hospital 2do Nivel',
                    lat: parseFloat(r.lat) || 0,
                    lng: parseFloat(r.lng) || 0
                };
            }
        }
        var nA = {};
        var ids = Object.keys(nV);
        for (var k = 0; k < ids.length; k++) nA[ids[k]] = {};
        var ok = 0, omitidas = 0;
        for (var m = 0; m < a.length; m++) {
            var r2 = a[m];
            if (r2.origen && r2.destino && r2.origen.trim() !== '' && r2.destino.trim() !== '') {
                var o = r2.origen.trim();
                var d = r2.destino.trim();
                var p = parseFloat(r2.peso) || 1;
                if (nA[o] !== undefined && nA[d] !== undefined) {
                    nA[o][d] = p;
                    nA[d][o] = p;
                    ok++;
                } else {
                    omitidas++;
                }
            }
        }
        redSalud = nV;
        adyacencia = nA;
        datosCargados = true;
        generarPesosMultiples();
        actualizarTodo();
        actualizarSelectsEditor();
        renderizarListaNodos();
        renderizarListaAristas();
        setTimeout(function() {
            if (mapPrincipal && Object.keys(redSalud).length > 0) {
                mapPrincipal.fitBounds(getBounds(), {padding:[30,30]});
                mapPrincipal.invalidateSize();
            }
        }, 400);
        var totalN = Object.keys(redSalud).length;
        var totalA = Object.values(adyacencia).reduce(function(s, x) { return s + Object.keys(x).length; }, 0) / 2;
        mostrarToast('Datos cargados desde CSV: ' + totalN + ' nodos, ' + totalA + ' aristas', 'success', 5000);
        agregarAlHistorial('CSV cargado: ' + totalN + ' nodos, ' + totalA + ' aristas', 'info');
        document.getElementById('badge-origen-datos').innerHTML = '<i class="fas fa-file-csv"></i> Datos CSV (' + totalN + ' nodos)';
        if (omitidas > 0) setTimeout(function() { mostrarToast(omitidas + ' aristas omitidas', 'warning', 5000); }, 1000);
    } catch (e) {
        mostrarToast('Error: ' + e.message, 'error', 5000);
    }
}

function descargarDatosEjemplo() {
    var vertices = 'id,nombre,tipo,lat,lng\nLPZ,La Paz - CEASS Central,Hub CEASS,-16.5000,-68.1500\nSCZ,Santa Cruz - Hub CEASS,Hub CEASS,-17.7833,-63.1821\nCBB,Cochabamba - Hub CEASS,Hub CEASS,-17.3895,-66.1568\nORU,Oruro - SEDES,SEDES,-17.9647,-67.1060\nTJA,Tarija - SEDES,SEDES,-21.5355,-64.7295\n';
    var aristas = 'origen,destino,peso\nLPZ,SCZ,12.0\nSCZ,CBB,7.0\nCBB,ORU,4.0\nORU,TJA,9.0\n';
    var blobV = new Blob([vertices], {type:'text/csv;charset=utf-8;'});
    var aV = document.createElement('a');
    aV.href = URL.createObjectURL(blobV);
    aV.download = 'vertices.csv';
    document.body.appendChild(aV);
    aV.click();
    document.body.removeChild(aV);
    setTimeout(function() {
        var blobA = new Blob([aristas], {type:'text/csv;charset=utf-8;'});
        var aA = document.createElement('a');
        aA.href = URL.createObjectURL(blobA);
        aA.download = 'aristas.csv';
        document.body.appendChild(aA);
        aA.click();
        document.body.removeChild(aA);
        mostrarToast('2 archivos descargados', 'success', 5000);
        agregarAlHistorial('Plantillas CSV descargadas', 'info');
    }, 500);
}

// EJECUTAR
function ejecutar() {
    if (!datosCargados) { mostrarToast('Cargue datos primero', 'warning'); return; }
    var algo = document.querySelector('input[name="algoritmo"]:checked').value;
    var src = document.getElementById('origen').value;
    var dst = document.getElementById('destino').value;
    if (!src) { mostrarToast('Seleccione ORIGEN', 'warning'); return; }
    if ((algo === 'dijkstra' || algo === 'astar') && !dst) { mostrarToast(algo.toUpperCase() + ' requiere DESTINO', 'warning'); return; }
    mapPrincipal.eachLayer(function(l) { if (l instanceof L.Polyline && l.options.weight >= 3) mapPrincipal.removeLayer(l); });
    mapPrincipal.eachLayer(function(l) {
        if (l instanceof L.Marker && l.options.icon && l.options.icon.options && (l.options.icon.options.className === 'nivel-label' || l.options.icon.options.className === 'orden-label' || l.options.icon.options.className === 'tsp-label')) mapPrincipal.removeLayer(l);
    });
    if (algo === 'bfs') runBFS(src);
    else if (algo === 'dfs') runDFS(src);
    else if (algo === 'dijkstra') runDijkstra(src, dst);
    else if (algo === 'astar') runAStar(src, dst);
    else if (algo === 'kruskal') runKruskal();
    else if (algo === 'prim') runPrim(src);
}// BFS
function runBFS(start) {
    var visitados = [];
    var niveles = {};
    var visited = new Set([start]);
    var queue = [[start]];
    niveles[start] = 0;
    var aristasArbol = [];
    var ordenPorNivel = {0:[start]};
    while (queue.length > 0) {
        var path = queue.shift();
        var node = path[path.length - 1];
        visitados.push(node);
        var nivel = niveles[node];
        Object.keys(adyacencia[node] || {}).forEach(function(v) {
            if (!visited.has(v)) {
                visited.add(v);
                niveles[v] = nivel + 1;
                if (!ordenPorNivel[niveles[v]]) ordenPorNivel[niveles[v]] = [];
                ordenPorNivel[niveles[v]].push(v);
                aristasArbol.push({u:node, v:v});
                queue.push(path.concat([v]));
            }
        });
    }
    aristasArbol.forEach(function(e) {
        L.polyline([[redSalud[e.u].lat, redSalud[e.u].lng], [redSalud[e.v].lat, redSalud[e.v].lng]], {color:'#0066FF', weight:5, opacity:1}).addTo(mapPrincipal);
    });
    Object.keys(redSalud).forEach(function(code) {
        if (niveles[code] !== undefined) {
            var n = redSalud[code];
            var iconoNivel = L.divIcon({
                className: 'nivel-label',
                html: '<div style="background:#0066FF;color:white;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:800;border:2px solid white;">N' + niveles[code] + '</div>',
                iconSize: [30, 20], iconAnchor: [15, -15]
            });
            L.marker([n.lat, n.lng], {icon:iconoNivel}).addTo(mapPrincipal);
        }
    });
    var m = miniMaps['bfs'];
    if (m) {
        m.eachLayer(function(l) { if (!(l instanceof L.TileLayer)) m.removeLayer(l); });
        aristasArbol.forEach(function(e) { L.polyline([[redSalud[e.u].lat, redSalud[e.u].lng], [redSalud[e.v].lat, redSalud[e.v].lng]], {color:'#0066FF', weight:2.5}).addTo(m); });
        Object.keys(redSalud).forEach(function(code) {
            var n = redSalud[code];
            var vis = visitados.indexOf(code) !== -1;
            L.circleMarker([n.lat, n.lng], {radius:vis ? 5 : 3, fillColor:vis ? '#0066FF' : '#cbd5e1', color:'#fff', weight:1, fillOpacity:0.95}).addTo(m);
        });
        m.fitBounds(getBounds(), {padding:[10,10]});
    }
    document.getElementById('costo-bfs').textContent = visitados.length + '/' + Object.keys(redSalud).length;
    document.getElementById('footer-mini-bfs').innerHTML = visitados.length + ' nodos';
    var out = document.getElementById('resultados');
    var html = '<div style="font-weight:800;color:#0066FF;font-size:14px;"><i class="fas fa-layer-group"></i> BFS</div>';
    html += '<div style="font-weight:700;color:#1a365d;margin:8px 0 4px;">Por niveles:</div>';
    Object.keys(ordenPorNivel).sort(function(a,b){return a-b;}).forEach(function(n) {
        html += '<div style="margin-bottom:4px;padding:6px 8px;background:rgba(0,102,255,0.1);border-left:3px solid #0066FF;border-radius:4px;"><b style="color:#0066FF;">N' + n + ':</b> ' + ordenPorNivel[n].join(' - ') + '</div>';
    });
    out.innerHTML = html;
    document.getElementById('decision-box').innerHTML = '<i class="fas fa-lightbulb icono"></i> <strong>BFS:</strong> expande nivel por nivel.';
    actualizarGrafico('BFS', visitados.length);
    generarRecomendaciones('BFS', {nodos: visitados.length});
    agregarAlHistorial('BFS desde ' + start + ' (' + visitados.length + ' nodos)', 'algorithm');
    mostrarToast('BFS: ' + visitados.length + ' nodos', 'success');
}

// DFS
function runDFS(start) {
    var visitados = [];
    var visited = new Set();
    var aristasArbol = [];
    var ordenVisita = [];
    var contador = 0;
    function dfs(node, profundidad) {
        profundidad = profundidad || 0;
        visited.add(node);
        visitados.push(node);
        ordenVisita.push({nodo:node, orden:++contador, profundidad:profundidad});
        Object.keys(adyacencia[node] || {}).forEach(function(v) {
            if (!visited.has(v)) {
                aristasArbol.push({u:node, v:v});
                dfs(v, profundidad + 1);
            }
        });
    }
    dfs(start);
    aristasArbol.forEach(function(e) {
        L.polyline([[redSalud[e.u].lat, redSalud[e.u].lng], [redSalud[e.v].lat, redSalud[e.v].lng]], {color:'#00CC44', weight:5, opacity:1}).addTo(mapPrincipal);
    });
    ordenVisita.forEach(function(o) {
        var n = redSalud[o.nodo];
        var iconoOrden = L.divIcon({
            className: 'orden-label',
            html: '<div style="background:#00CC44;color:white;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:800;border:2px solid white;">#' + o.orden + '</div>',
            iconSize: [30, 20], iconAnchor: [15, -15]
        });
        L.marker([n.lat, n.lng], {icon:iconoOrden}).addTo(mapPrincipal);
    });
    var m = miniMaps['dfs'];
    if (m) {
        m.eachLayer(function(l) { if (!(l instanceof L.TileLayer)) m.removeLayer(l); });
        aristasArbol.forEach(function(e) { L.polyline([[redSalud[e.u].lat, redSalud[e.u].lng], [redSalud[e.v].lat, redSalud[e.v].lng]], {color:'#00CC44', weight:2.5}).addTo(m); });
        Object.keys(redSalud).forEach(function(code) {
            var n = redSalud[code];
            var vis = visitados.indexOf(code) !== -1;
            L.circleMarker([n.lat, n.lng], {radius:vis ? 5 : 3, fillColor:vis ? '#00CC44' : '#cbd5e1', color:'#fff', weight:1, fillOpacity:0.95}).addTo(m);
        });
        m.fitBounds(getBounds(), {padding:[10,10]});
    }
    var profMax = Math.max.apply(null, ordenVisita.map(function(o) { return o.profundidad; }));
    document.getElementById('costo-dfs').textContent = visitados.length + '/' + Object.keys(redSalud).length;
    document.getElementById('footer-mini-dfs').innerHTML = visitados.length + ' nodos prof. ' + profMax;
    var out = document.getElementById('resultados');
    var html = '<div style="font-weight:800;color:#00CC44;font-size:14px;"><i class="fas fa-sitemap"></i> DFS</div>';
    ordenVisita.slice(0, 20).forEach(function(o) {
        html += '<div style="font-size:11px;padding:2px 0;"><span style="color:#00CC44;font-weight:800;display:inline-block;min-width:30px;">#' + o.orden + '</span><span style="color:#1a365d;font-weight:700;">' + o.nodo + '</span><span style="color:#8899aa;"> (prof. ' + o.profundidad + ')</span></div>';
    });
    out.innerHTML = html;
    document.getElementById('decision-box').innerHTML = '<i class="fas fa-lightbulb icono"></i> <strong>DFS:</strong> profundiza y retrocede.';
    actualizarGrafico('DFS', visitados.length);
    generarRecomendaciones('DFS', {nodos: visitados.length, profMax: profMax});
    agregarAlHistorial('DFS desde ' + start + ' (' + visitados.length + ' nodos)', 'algorithm');
    mostrarToast('DFS: ' + visitados.length + ' nodos', 'success');
}

// DIJKSTRA
function runDijkstra(start, target) {
    var dist = {}, prev = {}, unvisited = new Set();
    Object.keys(redSalud).forEach(function(n) { dist[n] = Infinity; prev[n] = null; unvisited.add(n); });
    dist[start] = 0;
    while (unvisited.size > 0) {
        var u = null, minD = Infinity;
        unvisited.forEach(function(n) { if (dist[n] < minD) { minD = dist[n]; u = n; } });
        if (u === null || dist[u] === Infinity) break;
        unvisited.delete(u);
        if (u === target) break;
        for (var v in adyacencia[u]) {
            if (unvisited.has(v)) {
                var alt = dist[u] + getPeso(u, v);
                if (alt < dist[v]) { dist[v] = alt; prev[v] = u; }
            }
        }
    }
    var path = [];
    var curr = target;
    while (curr) { path.unshift(curr); curr = prev[curr]; }
    if (path.length === 0 || path[0] !== start) { mostrarToast('Sin ruta', 'warning'); return; }
    for (var i = 0; i < path.length - 1; i++) {
        L.polyline([[redSalud[path[i]].lat, redSalud[path[i]].lng], [redSalud[path[i+1]].lat, redSalud[path[i+1]].lng]], {color:'#FF6600', weight:6, opacity:1}).addTo(mapPrincipal);
    }
    var m = miniMaps['dijkstra'];
    if (m) {
        m.eachLayer(function(l) { if (!(l instanceof L.TileLayer)) m.removeLayer(l); });
        for (var j = 0; j < path.length - 1; j++) {
            L.polyline([[redSalud[path[j]].lat, redSalud[path[j]].lng], [redSalud[path[j+1]].lat, redSalud[path[j+1]].lng]], {color:'#FF6600', weight:3}).addTo(m);
        }
        Object.keys(redSalud).forEach(function(code) {
            var n = redSalud[code];
            var vis = path.indexOf(code) !== -1;
            L.circleMarker([n.lat, n.lng], {radius:vis ? 5 : 3, fillColor:vis ? '#FF6600' : '#cbd5e1', color:'#fff', weight:1, fillOpacity:0.95}).addTo(m);
        });
        m.fitBounds(getBounds(), {padding:[10,10]});
    }
    var costo = dist[target];
    var u2 = getUnidad();
    document.getElementById('costo-dijkstra').textContent = costo.toFixed(2) + u2;
    document.getElementById('footer-mini-dijkstra').innerHTML = path.length + ' nodos (' + costo.toFixed(2) + u2 + ')';
    var out = document.getElementById('resultados');
    var html = '<div style="font-weight:800;color:#FF6600;font-size:14px;"><i class="fas fa-route"></i> Dijkstra</div>';
    html += '<div style="font-size:13px;font-weight:800;color:#FF6600;margin:8px 0;">' + path.join(' - ') + '</div>';
    for (var k = 0; k < path.length - 1; k++) {
        html += '<div style="font-size:11px;">' + path[k] + ' -> ' + path[k+1] + ' = <b style="color:#FF6600;">' + getPeso(path[k], path[k+1]).toFixed(2) + u2 + '</b></div>';
    }
    html += '<div style="margin-top:8px;padding:8px;background:rgba(255,102,0,0.15);border-radius:6px;"><b>Costo:</b> <span style="color:#FF6600;font-weight:800;font-size:16px;">' + costo.toFixed(2) + u2 + '</span></div>';
    out.innerHTML = html;
    document.getElementById('decision-box').innerHTML = '<i class="fas fa-lightbulb icono"></i> <strong>Ruta:</strong> ' + path.length + ' nodos, ' + costo.toFixed(2) + u2;
    actualizarGrafico('Dijkstra', costo);
    generarRecomendaciones('Dijkstra', {costo: costo, path: path, origen: start, destino: target});
    agregarAlHistorial('Dijkstra: ' + start + ' a ' + target + ' (' + costo.toFixed(2) + u2 + ')', 'algorithm');
    mostrarToast('Ruta: ' + costo.toFixed(2) + u2, 'success');
}

// A*
function runAStar(start, target) {
    if (!redSalud[target]) { mostrarToast('Destino invalido', 'warning'); return; }
    function haversine(a, b) {
        var R = 6371;
        var dLat = (b.lat - a.lat) * Math.PI / 180;
        var dLng = (b.lng - a.lng) * Math.PI / 180;
        var lat1 = a.lat * Math.PI / 180;
        var lat2 = b.lat * Math.PI / 180;
        var x = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2);
        return 2 * R * Math.asin(Math.sqrt(x));
    }
    var g = {}, f = {}, prev = {}, openSet = new Set(), closedSet = new Set();
    Object.keys(redSalud).forEach(function(n) { g[n] = Infinity; f[n] = Infinity; prev[n] = null; });
    g[start] = 0;
    f[start] = haversine(redSalud[start], redSalud[target]);
    openSet.add(start);
    var expandidos = 0;
    while (openSet.size > 0) {
        var current = null, minF = Infinity;
        openSet.forEach(function(n) { if (f[n] < minF) { minF = f[n]; current = n; } });
        if (current === null) break;
        expandidos++;
        if (current === target) break;
        openSet.delete(current);
        closedSet.add(current);
        var vecinos = Object.keys(adyacencia[current] || {});
        for (var i = 0; i < vecinos.length; i++) {
            var v = vecinos[i];
            if (closedSet.has(v)) continue;
            var tentG = g[current] + getPeso(current, v);
            if (tentG < g[v]) {
                prev[v] = current;
                g[v] = tentG;
                f[v] = g[v] + haversine(redSalud[v], redSalud[target]);
                openSet.add(v);
            }
        }
    }
    var path = [];
    var curr = target;
    while (curr) { path.unshift(curr); curr = prev[curr]; }
    if (path.length === 0 || path[0] !== start) { mostrarToast('Sin ruta A*', 'warning'); return; }
    for (var j = 0; j < path.length - 1; j++) {
        L.polyline([[redSalud[path[j]].lat, redSalud[path[j]].lng], [redSalud[path[j+1]].lat, redSalud[path[j+1]].lng]], {color:'#f59e0b', weight:6, opacity:1}).addTo(mapPrincipal);
    }
    var m = miniMaps['astar'];
    if (m) {
        m.eachLayer(function(l) { if (!(l instanceof L.TileLayer)) m.removeLayer(l); });
        for (var k = 0; k < path.length - 1; k++) {
            L.polyline([[redSalud[path[k]].lat, redSalud[path[k]].lng], [redSalud[path[k+1]].lat, redSalud[path[k+1]].lng]], {color:'#f59e0b', weight:3}).addTo(m);
        }
        Object.keys(redSalud).forEach(function(code) {
            var n = redSalud[code];
            var vis = path.indexOf(code) !== -1;
            L.circleMarker([n.lat, n.lng], {radius:vis ? 5 : 3, fillColor:vis ? '#f59e0b' : '#cbd5e1', color:'#fff', weight:1, fillOpacity:0.95}).addTo(m);
        });
        m.fitBounds(getBounds(), {padding:[10,10]});
    }
    var costo = g[target];
    var u2 = getUnidad();
    document.getElementById('costo-astar').textContent = costo.toFixed(2) + u2;
    document.getElementById('footer-mini-astar').innerHTML = path.length + ' nodos (' + costo.toFixed(2) + u2 + ')';
    var out = document.getElementById('resultados');
    var html = '<div style="font-weight:800;color:#f59e0b;font-size:14px;"><i class="fas fa-star"></i> A* (A Estrella)</div>';
    html += '<div style="font-size:11px;color:#8899aa;margin:4px 0;">Nodos expandidos: ' + expandidos + ' de ' + Object.keys(redSalud).length + '</div>';
    html += '<div style="font-size:13px;font-weight:800;color:#f59e0b;margin:8px 0;">' + path.join(' - ') + '</div>';
    for (var p = 0; p < path.length - 1; p++) {
        html += '<div style="font-size:11px;">' + path[p] + ' -> ' + path[p+1] + ' = <b style="color:#f59e0b;">' + getPeso(path[p], path[p+1]).toFixed(2) + u2 + '</b></div>';
    }
    html += '<div style="margin-top:8px;padding:8px;background:rgba(245,158,11,0.15);border-radius:6px;"><b>Costo A*:</b> <span style="color:#f59e0b;font-weight:800;font-size:16px;">' + costo.toFixed(2) + u2 + '</span></div>';
    out.innerHTML = html;
    document.getElementById('decision-box').innerHTML = '<i class="fas fa-lightbulb icono"></i> <strong>A*:</strong> ' + path.length + ' nodos, ' + costo.toFixed(2) + u2 + ' (mas eficiente que Dijkstra)';
    actualizarGrafico('A*', costo);
    generarRecomendaciones('A*', {costo: costo, expandidos: expandidos, path: path});
    agregarAlHistorial('A* desde ' + start + ' a ' + target + ' (' + costo.toFixed(2) + u2 + ')', 'algorithm');
    mostrarToast('A*: ' + costo.toFixed(2) + u2, 'success');
}

// KRUSKAL
function runKruskal() {
    var edges = [], proc = {};
    Object.keys(adyacencia).forEach(function(u) {
        Object.keys(adyacencia[u]).forEach(function(v) {
            var k = [u, v].sort().join('-');
            if (!proc[k]) { proc[k] = true; edges.push({u:u, v:v, w:getPeso(u, v)}); }
        });
    });
    edges.sort(function(a, b) { return a.w - b.w; });
    var parent = {};
    Object.keys(redSalud).forEach(function(n) { parent[n] = n; });
    function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
    function union(a, b) { var ra = find(a), rb = find(b); if (ra === rb) return false; parent[ra] = rb; return true; }
    var mst = [], rechazadas = [], total = 0;
    for (var i = 0; i < edges.length; i++) {
        if (union(edges[i].u, edges[i].v)) { mst.push(edges[i]); total += edges[i].w; }
        else rechazadas.push(edges[i]);
    }
    mst.forEach(function(e) {
        L.polyline([[redSalud[e.u].lat, redSalud[e.u].lng], [redSalud[e.v].lat, redSalud[e.v].lng]], {color:'#8800FF', weight:5, opacity:1}).addTo(mapPrincipal);
    });
    var m = miniMaps['kruskal'];
    if (m) {
        m.eachLayer(function(l) { if (!(l instanceof L.TileLayer)) m.removeLayer(l); });
        mst.forEach(function(e) { L.polyline([[redSalud[e.u].lat, redSalud[e.u].lng], [redSalud[e.v].lat, redSalud[e.v].lng]], {color:'#8800FF', weight:2.5}).addTo(m); });
        Object.keys(redSalud).forEach(function(code) {
            var n = redSalud[code];
            L.circleMarker([n.lat, n.lng], {radius:5, fillColor:'#8800FF', color:'#fff', weight:1, fillOpacity:0.95}).addTo(m);
        });
        m.fitBounds(getBounds(), {padding:[10,10]});
    }
    var u = getUnidad();
    document.getElementById('costo-kruskal').textContent = total.toFixed(2) + u;
    document.getElementById('footer-mini-kruskal').innerHTML = mst.length + ' aristas (' + total.toFixed(2) + u + ')';
    document.getElementById('mst-costo').innerHTML = '<span class="gold">' + total.toFixed(1) + '</span>';
    document.getElementById('kruskal-total').textContent = total.toFixed(2) + ' ' + u;
    actualizarMSTDiff();
    var out = document.getElementById('resultados');
    var html = '<div style="font-weight:800;color:#8800FF;font-size:14px;"><i class="fas fa-tree"></i> Kruskal - MST</div>';
    html += '<div style="font-size:11px;color:#8899aa;margin:4px 0;">Aristas: ' + edges.length + ' - Aceptadas: ' + mst.length + ' - Rechazadas: ' + rechazadas.length + '</div>';
    for (var j = 0; j < Math.min(12, mst.length); j++) {
        html += '<div style="font-size:11px;">' + (j+1) + '. ' + mst[j].u + ' - ' + mst[j].v + ' <b style="color:#8800FF;">(' + mst[j].w.toFixed(2) + u + ')</b></div>';
    }
    html += '<div style="margin-top:8px;padding:8px;background:rgba(136,0,255,0.15);border-radius:6px;"><b>Costo MST:</b> <span style="color:#8800FF;font-weight:800;font-size:16px;">' + total.toFixed(2) + u + '</span></div>';
    out.innerHTML = html;
    document.getElementById('decision-box').innerHTML = '<i class="fas fa-lightbulb icono"></i> <strong>Kruskal:</strong> MST global con ' + mst.length + ' aristas. Costo: ' + total.toFixed(2) + u;
    actualizarGrafico('Kruskal', total);
    generarRecomendaciones('Kruskal', {costo: total, aristas: mst.length});
    agregarAlHistorial('Kruskal MST: ' + total.toFixed(2) + u, 'algorithm');
    mostrarToast('Kruskal: ' + total.toFixed(2) + u, 'success');
}

// PRIM
function runPrim(start) {
    var visited = new Set([start]);
    var mst = [], total = 0;
    while (visited.size < Object.keys(redSalud).length) {
        var minE = null;
        visited.forEach(function(u) {
            for (var v in adyacencia[u]) {
                if (!visited.has(v)) {
                    var w = getPeso(u, v);
                    if (!minE || w < minE.w) minE = {u:u, v:v, w:w};
                }
            }
        });
        if (!minE) break;
        visited.add(minE.v);
        mst.push(minE);
        total += minE.w;
    }
    mst.forEach(function(e) {
        L.polyline([[redSalud[e.u].lat, redSalud[e.u].lng], [redSalud[e.v].lat, redSalud[e.v].lng]], {color:'#FF0033', weight:5, opacity:1}).addTo(mapPrincipal);
    });
    var m = miniMaps['prim'];
    if (m) {
        m.eachLayer(function(l) { if (!(l instanceof L.TileLayer)) m.removeLayer(l); });
        mst.forEach(function(e) { L.polyline([[redSalud[e.u].lat, redSalud[e.u].lng], [redSalud[e.v].lat, redSalud[e.v].lng]], {color:'#FF0033', weight:2.5}).addTo(m); });
        Object.keys(redSalud).forEach(function(code) {
            var n = redSalud[code];
            L.circleMarker([n.lat, n.lng], {radius:5, fillColor:'#FF0033', color:'#fff', weight:1, fillOpacity:0.95}).addTo(m);
        });
        m.fitBounds(getBounds(), {padding:[10,10]});
    }
    var u = getUnidad();
    document.getElementById('costo-prim').textContent = total.toFixed(2) + u;
    document.getElementById('footer-mini-prim').innerHTML = mst.length + ' aristas (' + total.toFixed(2) + u + ')';
    document.getElementById('prim-total').textContent = total.toFixed(2) + ' ' + u;
    actualizarMSTDiff();
    var out = document.getElementById('resultados');
    var html = '<div style="font-weight:800;color:#FF0033;font-size:14px;"><i class="fas fa-seedling"></i> Prim - MST</div>';
    html += '<div style="font-size:11px;color:#8899aa;margin:4px 0;">Inicio: ' + start + '</div>';
    for (var j = 0; j < Math.min(10, mst.length); j++) {
        html += '<div style="font-size:11px;">' + (j+1) + '. ' + mst[j].u + ' - ' + mst[j].v + ' <b style="color:#FF0033;">(' + mst[j].w.toFixed(2) + u + ')</b></div>';
    }
    html += '<div style="margin-top:8px;padding:8px;background:rgba(255,0,51,0.15);border-radius:6px;"><b>Costo MST:</b> <span style="color:#FF0033;font-weight:800;font-size:16px;">' + total.toFixed(2) + u + '</span></div>';
    out.innerHTML = html;
    document.getElementById('decision-box').innerHTML = '<i class="fas fa-lightbulb icono"></i> <strong>Prim:</strong> desde ' + start + ', ' + mst.length + ' aristas. Costo: ' + total.toFixed(2) + u;
    actualizarGrafico('Prim', total);
    generarRecomendaciones('Prim', {costo: total, aristas: mst.length});
    agregarAlHistorial('Prim MST desde ' + start + ': ' + total.toFixed(2) + u, 'algorithm');
    mostrarToast('Prim: ' + total.toFixed(2) + u, 'success');
}

// COMPARA KRUSKAL VS PRIM
function actualizarMSTDiff() {
    var kEl = document.getElementById('kruskal-total');
    var pEl = document.getElementById('prim-total');
    var dEl = document.getElementById('mst-diff');
    if (!kEl || !pEl || !dEl) return;
    var kTxt = kEl.textContent;
    var pTxt = pEl.textContent;
    if (kTxt === '--' || pTxt === '--') {
        dEl.textContent = 'Ejecuta Kruskal y Prim para comparar';
        dEl.className = 'kpi-mst-diff';
        return;
    }
    var kNum = parseFloat(kTxt);
    var pNum = parseFloat(pTxt);
    var diff = Math.abs(kNum - pNum);
    if (diff < 0.01) {
        dEl.textContent = '✓ Idénticos (óptimo global)';
        dEl.className = 'kpi-mst-diff ok';
    } else {
        dEl.textContent = 'Diferencia: ' + diff.toFixed(2);
        dEl.className = 'kpi-mst-diff warn';
    }
}

// ========== ANALISIS ==========
function mostrarAnalisis(tipo, event) {
    document.querySelectorAll('.btn-analysis').forEach(function(b) { b.classList.remove('active'); });
    if (event && event.target) { var btn = event.target.closest('.btn-analysis'); if (btn) btn.classList.add('active'); }
    var c = document.getElementById('analysis-content');
    if (!datosCargados) { c.innerHTML = '<div class="analysis-empty"><p>Cargue datos primero</p></div>'; return; }
    
    if (tipo === 'nodos-criticos') {
        var nodos = Object.keys(redSalud).map(function(k) { return {codigo:k, nombre:redSalud[k].nombre, grado:Object.keys(adyacencia[k] || {}).length}; }).sort(function(a, b) { return b.grado - a.grado; });
        var maxG = nodos[0] ? nodos[0].grado : 1;
        var html = '<div class="analysis-grid">';
        nodos.slice(0, 8).forEach(function(n, i) {
            var nivel = n.grado / maxG > 0.7 ? 'critico' : n.grado / maxG > 0.4 ? 'warning' : 'info';
            html += '<div class="analysis-card ' + nivel + '"><div class="card-title"><i class="fas fa-exclamation-triangle"></i> #' + (i+1) + ' ' + n.codigo + '</div><div class="card-value">' + n.grado + '</div><div class="card-label">conexiones</div><div class="card-detail">' + n.nombre + '</div></div>';
        });
        c.innerHTML = html + '</div>';
    } else if (tipo === 'estadisticas') {
        var V = Object.keys(redSalud).length;
        var E = Object.values(adyacencia).reduce(function(s, x) { return s + Object.keys(x).length; }, 0) / 2;
        var d = (2 * E) / (V * (V - 1));
        var grados = Object.keys(redSalud).map(function(k) { return Object.keys(adyacencia[k] || {}).length; });
        var prom = grados.reduce(function(a, b) { return a + b; }, 0) / V;
        c.innerHTML = '<div class="analysis-grid"><div class="analysis-card info"><div class="card-title"><i class="fas fa-cube"></i> Nodos</div><div class="card-value">' + V + '</div></div><div class="analysis-card ok"><div class="card-title"><i class="fas fa-link"></i> Aristas</div><div class="card-value">' + E + '</div></div><div class="analysis-card warning"><div class="card-title"><i class="fas fa-percentage"></i> Densidad</div><div class="card-value">' + (d*100).toFixed(1) + '%</div></div><div class="analysis-card purple"><div class="card-title"><i class="fas fa-chart-line"></i> Grado Prom</div><div class="card-value">' + prom.toFixed(2) + '</div></div></div>';
    } else if (tipo === 'componentes') {
        var visitados = new Set();
        var comps = [];
        Object.keys(redSalud).forEach(function(n) {
            if (!visitados.has(n)) {
                var comp = [];
                var stack = [n];
                while (stack.length) {
                    var a = stack.pop();
                    if (visitados.has(a)) continue;
                    visitados.add(a);
                    comp.push(a);
                    Object.keys(adyacencia[a] || {}).forEach(function(v) { if (!visitados.has(v)) stack.push(v); });
                }
                comps.push(comp);
            }
        });
        var html = '<div class="analysis-grid">';
        html += '<div class="analysis-card ' + (comps.length === 1 ? 'ok' : 'warning') + '"><div class="card-title"><i class="fas fa-project-diagram"></i> Estado</div><div class="card-value">' + comps.length + '</div><div class="card-label">' + (comps.length === 1 ? 'RED CONECTADA' : 'RED FRAGMENTADA') + '</div></div>';
        comps.forEach(function(comp, i) {
            html += '<div class="analysis-card info"><div class="card-title">Componente ' + (i+1) + '</div><div class="card-value">' + comp.length + '</div><div class="card-detail">' + comp.slice(0, 8).join(', ') + '</div></div>';
        });
        c.innerHTML = html + '</div>';
    } else if (tipo === 'top-rutas') {
        var arr = [], proc = {};
        Object.keys(adyacencia).forEach(function(u) {
            Object.keys(adyacencia[u]).forEach(function(v) {
                var k = [u, v].sort().join('-');
                if (!proc[k]) { proc[k] = true; arr.push({u:u, v:v, w:getPeso(u, v)}); }
            });
        });
        arr.sort(function(a, b) { return a.w - b.w; });
        var html = '<div class="analysis-grid">';
        arr.slice(0, 10).forEach(function(e, i) {
            html += '<div class="analysis-card ' + (i < 3 ? 'ok' : 'info') + '"><div class="card-title"><i class="fas fa-trophy"></i> #' + (i+1) + ' ' + e.u + ' -> ' + e.v + '</div><div class="card-value">' + e.w.toFixed(2) + '</div><div class="card-label">' + getUnidad() + '</div></div>';
        });
        c.innerHTML = html + '</div>';
    } else if (tipo === 'aislados') {
        var a = Object.keys(redSalud).filter(function(k) { return Object.keys(adyacencia[k] || {}).length === 0; });
        var html = '<div class="analysis-grid">';
        if (!a.length) html += '<div class="analysis-card ok"><div class="card-title"><i class="fas fa-check-circle"></i> Sin aislados</div><div class="card-detail">Todos conectados</div></div>';
        else a.forEach(function(k) { html += '<div class="analysis-card critico"><div class="card-title">' + k + '</div><div class="card-detail">' + redSalud[k].nombre + '</div></div>'; });
        c.innerHTML = html + '</div>';
    } else if (tipo === 'mst') {
        var edges = [], proc = {};
        Object.keys(adyacencia).forEach(function(u) {
            Object.keys(adyacencia[u]).forEach(function(v) {
                var k = [u, v].sort().join('-');
                if (!proc[k]) { proc[k] = true; edges.push({u:u, v:v, w:getPeso(u, v)}); }
            });
        });
        edges.sort(function(a, b) { return a.w - b.w; });
        var parent = {};
        Object.keys(redSalud).forEach(function(n) { parent[n] = n; });
        function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
        function union(a, b) { var ra = find(a), rb = find(b); if (ra === rb) return false; parent[ra] = rb; return true; }
        var mstK = [], totalK = 0;
        edges.forEach(function(e) { if (union(e.u, e.v)) { mstK.push(e); totalK += e.w; } });

        var start = Object.keys(redSalud)[0];
        var visited = new Set([start]);
        var mstP = [], totalP = 0;
        while (visited.size < Object.keys(redSalud).length) {
            var minE = null;
            visited.forEach(function(u) {
                for (var v in adyacencia[u]) {
                    if (!visited.has(v)) {
                        var w = getPeso(u, v);
                        if (!minE || w < minE.w) minE = {u:u, v:v, w:w};
                    }
                }
            });
            if (!minE) break;
            visited.add(minE.v); mstP.push(minE); totalP += minE.w;
        }

        var u = getUnidad();
        var html = '<div class="analysis-grid">';
        html += '<div class="analysis-card purple"><div class="card-title"><i class="fas fa-tree"></i> Kruskal</div><div class="card-value">' + totalK.toFixed(2) + '</div><div class="card-label">' + u + ' - ' + mstK.length + ' aristas</div></div>';
        html += '<div class="analysis-card critico"><div class="card-title"><i class="fas fa-seedling"></i> Prim (desde ' + start + ')</div><div class="card-value">' + totalP.toFixed(2) + '</div><div class="card-label">' + u + ' - ' + mstP.length + ' aristas</div></div>';
        var diff = Math.abs(totalK - totalP);
        html += '<div class="analysis-card ' + (diff < 0.01 ? 'ok' : 'warning') + '"><div class="card-title"><i class="fas fa-balance-scale"></i> Diferencia</div><div class="card-value">' + diff.toFixed(2) + '</div><div class="card-label">' + (diff < 0.01 ? 'IDENTICOS (optimo)' : 'DIFERENTES') + '</div></div>';
        html += '</div>';

        html += '<div style="margin-top:12px;background:white;border-radius:8px;padding:12px;border-left:4px solid #8800FF;">';
        html += '<div style="font-size:12px;font-weight:800;color:#1a365d;margin-bottom:8px;">Aristas del MST (Kruskal)</div>';
        html += '<div style="font-size:11px;color:#4a5568;line-height:1.8;">';
        mstK.slice(0, 20).forEach(function(e, i) {
            html += '<div>' + (i+1) + '. <b>' + e.u + '</b> → <b>' + e.v + '</b> : ' + e.w.toFixed(2) + u + '</div>';
        });
        html += '</div></div>';
        c.innerHTML = html;
    } else if (tipo === 'floyd') {
        var keys = Object.keys(redSalud);
        var n = keys.length;
        var D = [];
        for (var i = 0; i < n; i++) {
            D[i] = [];
            for (var j = 0; j < n; j++) {
                if (i === j) D[i][j] = 0;
                else if (adyacencia[keys[i]] && adyacencia[keys[i]][keys[j]]) D[i][j] = getPeso(keys[i], keys[j]);
                else D[i][j] = Infinity;
            }
        }
        for (var k = 0; k < n; k++) {
            for (var a = 0; a < n; a++) {
                for (var b = 0; b < n; b++) {
                    if (D[a][k] + D[k][b] < D[a][b]) D[a][b] = D[a][k] + D[k][b];
                }
            }
        }
        var u = getUnidad();
        var maxDist = 0, diametroDe = '', diametroA = '';
        var maxValor = 0;
        for (var x = 0; x < n; x++) {
            for (var y = 0; y < n; y++) {
                if (x !== y && D[x][y] !== Infinity) {
                    if (D[x][y] > maxValor) maxValor = D[x][y];
                    if (D[x][y] > maxDist) {
                        maxDist = D[x][y];
                        diametroDe = keys[x];
                        diametroA = keys[y];
                    }
                }
            }
        }
        var alcanzables = 0, noAlcanzables = 0;
        for (var x2 = 0; x2 < n; x2++) {
            for (var y2 = 0; y2 < n; y2++) {
                if (x2 !== y2) {
                    if (D[x2][y2] === Infinity) noAlcanzables++;
                    else alcanzables++;
                }
            }
        }
        var visitados = new Set();
        var comps = 0;
        keys.forEach(function(nodo) {
            if (!visitados.has(nodo)) {
                comps++;
                var stack = [nodo];
                while (stack.length) {
                    var z = stack.pop();
                    if (visitados.has(z)) continue;
                    visitados.add(z);
                    Object.keys(adyacencia[z] || {}).forEach(function(v) {
                        if (!visitados.has(v)) stack.push(v);
                    });
                }
            }
        });
        var html = '<div class="analysis-grid">';
        html += '<div class="analysis-card info"><div class="card-title"><i class="fas fa-cube"></i> Nodos</div><div class="card-value">' + n + '</div><div class="card-label">Matriz ' + n + '×' + n + '</div></div>';
        html += '<div class="analysis-card purple"><div class="card-title"><i class="fas fa-network-wired"></i> Componentes</div><div class="card-value">' + comps + '</div><div class="card-label">' + (comps === 1 ? 'Red conectada' : 'Fragmentada') + '</div></div>';
        html += '<div class="analysis-card warning"><div class="card-title"><i class="fas fa-ruler"></i> Diametro</div><div class="card-value">' + maxDist.toFixed(2) + '</div><div class="card-label">' + u + ' (' + diametroDe + ' → ' + diametroA + ')</div></div>';
        html += '<div class="analysis-card ' + (noAlcanzables > 0 ? 'critico' : 'ok') + '"><div class="card-title"><i class="fas fa-route"></i> Pares</div><div class="card-value">' + alcanzables + '</div><div class="card-label">' + (noAlcanzables > 0 ? noAlcanzables + ' sin ruta' : 'Todos conectados') + '</div></div>';
        html += '</div>';
        html += '<div style="margin-top:16px;background:white;border-radius:8px;padding:12px;">';
        html += '<div style="font-size:12px;font-weight:800;color:#1a365d;margin-bottom:8px;"><i class="fas fa-table" style="color:#d69e2e;"></i> Matriz de Distancias Mínimas (' + n + '×' + n + ')</div>';
        html += '<div style="overflow:auto;max-height:500px;max-width:100%;border:1px solid #e2e8f0;border-radius:6px;">';
        html += '<table style="border-collapse:collapse;font-size:10px;white-space:nowrap;">';
        html += '<thead><tr>';
        html += '<th style="position:sticky;top:0;left:0;background:#1a365d;color:white;padding:6px 8px;border:1px solid #cbd5e1;z-index:12;font-weight:800;">.</th>';
        for (var h = 0; h < n; h++) {
            html += '<th style="position:sticky;top:0;background:#1a365d;color:white;padding:6px 8px;border:1px solid #cbd5e1;z-index:10;font-weight:800;font-size:9px;">' + keys[h].substring(0, 8) + '</th>';
        }
        html += '</tr></thead><tbody>';
        for (var r = 0; r < n; r++) {
            html += '<tr>';
            html += '<td style="position:sticky;left:0;background:#1a365d;color:white;padding:6px 8px;border:1px solid #cbd5e1;z-index:9;font-weight:800;font-size:9px;">' + keys[r].substring(0, 10) + '</td>';
            for (var c2 = 0; c2 < n; c2++) {
                var val = D[r][c2];
                var cellStyle = 'padding:5px 7px;border:1px solid #e2e8f0;text-align:center;font-size:10px;';
                if (r === c2) {
                    cellStyle += 'background:#f0f4f8;color:#cbd5e1;font-weight:700;';
                    html += '<td style="' + cellStyle + '">0</td>';
                } else if (val === Infinity) {
                    cellStyle += 'background:#fee2e2;color:#991b1b;font-weight:800;';
                    html += '<td style="' + cellStyle + '">∞</td>';
                } else {
                    var ratio = maxValor > 0 ? val / maxValor : 0;
                    var bg, color;
                    if (ratio > 0.7) { bg = '#fee2e2'; color = '#991b1b'; }
                    else if (ratio > 0.4) { bg = '#fef3c7'; color = '#92400e'; }
                    else { bg = '#f0fdf4'; color = '#166534'; }
                    cellStyle += 'background:' + bg + ';color:' + color + ';font-weight:600;';
                    html += '<td style="' + cellStyle + '">' + val.toFixed(2) + '</td>';
                }
            }
            html += '</tr>';
        }
        html += '</tbody></table></div></div>';
        c.innerHTML = html;
        agregarAlHistorial('Floyd-Warshall: ' + n + ' nodos, matriz ' + n + '×' + n, 'algorithm');
        mostrarToast('Floyd: ' + n + ' nodos procesados', 'success');
    } else if (tipo === 'tarjan') {
        var disc = {}, low = {}, parent = {}, visited = {}, articulaciones = [], puentes = [];
        var time = 0;
        function dfsTarjan(u) {
            visited[u] = true;
            disc[u] = low[u] = ++time;
            var children = 0;
            var vecinos = Object.keys(adyacencia[u] || {});
            for (var i = 0; i < vecinos.length; i++) {
                var v = vecinos[i];
                if (!visited[v]) {
                    children++;
                    parent[v] = u;
                    dfsTarjan(v);
                    low[u] = Math.min(low[u], low[v]);
                    if (low[v] > disc[u]) puentes.push({u:u, v:v});
                    if (parent[u] !== undefined && low[v] >= disc[u]) {
                        if (articulaciones.indexOf(u) === -1) articulaciones.push(u);
                    }
                } else if (v !== parent[u]) {
                    low[u] = Math.min(low[u], disc[v]);
                }
            }
            if (parent[u] === undefined && children > 1) {
                if (articulaciones.indexOf(u) === -1) articulaciones.push(u);
            }
        }
        Object.keys(redSalud).forEach(function(n) {
            if (!visited[n]) { parent[n] = undefined; dfsTarjan(n); }
        });
        articulaciones.forEach(function(code) {
            var n = redSalud[code];
            if (!n) return;
            L.circleMarker([n.lat, n.lng], {radius:18, fillColor:'transparent', color:'#e53e3e', weight:3, dashArray:'5,5'}).addTo(mapPrincipal);
        });
        puentes.forEach(function(p) {
            L.polyline([[redSalud[p.u].lat, redSalud[p.u].lng], [redSalud[p.v].lat, redSalud[p.v].lng]], {color:'#ed8936', weight:4, dashArray:'8,6'}).addTo(mapPrincipal);
        });
        var html = '<div class="analysis-grid">';
        html += '<div class="analysis-card ' + (articulaciones.length > 0 ? 'critico' : 'ok') + '"><div class="card-title"><i class="fas fa-cut"></i> Puntos de Articulacion</div><div class="card-value">' + articulaciones.length + '</div><div class="card-label">nodos criticos</div></div>';
        html += '<div class="analysis-card ' + (puentes.length > 0 ? 'warning' : 'ok') + '"><div class="card-title"><i class="fas fa-bridge"></i> Puentes</div><div class="card-value">' + puentes.length + '</div><div class="card-label">aristas criticas</div></div>';
        html += '</div>';
        html += '<div style="margin-top:12px;background:white;border-radius:8px;padding:12px;border-left:4px solid #e53e3e;">';
        html += '<div style="font-size:12px;font-weight:800;color:#1a365d;margin-bottom:8px;">Nodos de Articulacion (si fallan, la red se divide)</div>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
        if (articulaciones.length === 0) html += '<em style="color:#8899aa;">Ninguno</em>';
        else articulaciones.forEach(function(a) {
            html += '<span style="background:#fee2e2;color:#991b1b;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;">' + a + ' - ' + redSalud[a].nombre + '</span>';
        });
        html += '</div></div>';
        html += '<div style="margin-top:10px;background:white;border-radius:8px;padding:12px;border-left:4px solid #ed8936;">';
        html += '<div style="font-size:12px;font-weight:800;color:#1a365d;margin-bottom:8px;">Puentes (aristas criticas)</div>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
        if (puentes.length === 0) html += '<em style="color:#8899aa;">Ninguno</em>';
        else puentes.forEach(function(p) {
            html += '<span style="background:#ffedd5;color:#9a3412;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;">' + p.u + ' ↔ ' + p.v + '</span>';
        });
        html += '</div></div>';
        c.innerHTML = html;
        agregarAlHistorial('Tarjan: ' + articulaciones.length + ' articulaciones, ' + puentes.length + ' puentes', 'algorithm');
        mostrarToast('Tarjan: ' + articulaciones.length + ' articulaciones', 'success');
    }
}

// ========== RECOMENDACIONES INTELIGENTES ==========
function generarRecomendaciones(algoritmo, datos) {
    var contenedor = document.getElementById('decision-list');
    if (!contenedor) return;
    var recos = [];
    var V = Object.keys(redSalud).length;
    var E = Object.values(adyacencia).reduce(function(s, x) { return s + Object.keys(x).length; }, 0) / 2;
    recos.push({icono: 'chart-line', texto: 'Red con <b>' + V + ' nodos</b> y <b>' + E + ' aristas</b> cargados.'});
    if (algoritmo === 'BFS') {
        recos.push({icono: 'layer-group', texto: 'BFS exploro <b>' + datos.nodos + '</b> nodos nivel por nivel.'});
        recos.push({icono: 'lightbulb', texto: 'Util para ver como se propaga el abastecimiento desde un hub.'});
    } else if (algoritmo === 'DFS') {
        recos.push({icono: 'sitemap', texto: 'DFS visito <b>' + datos.nodos + '</b> nodos con profundidad max <b>' + datos.profMax + '</b>.'});
        recos.push({icono: 'lightbulb', texto: 'Util para detectar ciclos o caminos alternativos.'});
    } else if (algoritmo === 'Dijkstra') {
        recos.push({icono: 'route', texto: 'Ruta optima de <b>' + datos.origen + '</b> a <b>' + datos.destino + '</b>:'});
        recos.push({icono: 'dollar-sign', texto: 'Costo total: <b>' + datos.costo.toFixed(2) + getUnidad() + '</b> en <b>' + datos.path.length + ' nodos</b>.'});
        if (datos.path.length > 3) recos.push({icono: 'info-circle', texto: 'Recorrido largo detectado. Considerar ruta alternativa directa.'});
        else recos.push({icono: 'check-circle', texto: 'Ruta optima y eficiente.'});
    } else if (algoritmo === 'A*') {
        recos.push({icono: 'star', texto: 'A* expandio solo <b>' + datos.expandidos + '</b> de <b>' + V + '</b> nodos.'});
        recos.push({icono: 'bolt', texto: 'Eficiencia: <b>' + ((1 - datos.expandidos/V) * 100).toFixed(1) + '%</b> mas rapido que Dijkstra.'});
        recos.push({icono: 'route', texto: 'Ruta: <b>' + datos.path.join(' → ') + '</b>'});
    } else if (algoritmo === 'Kruskal') {
        recos.push({icono: 'tree', texto: 'MST global: <b>' + datos.costo.toFixed(2) + getUnidad() + '</b> con <b>' + datos.aristas + ' aristas</b>.'});
        recos.push({icono: 'info-circle', texto: 'Representa la infraestructura minima para conectar toda la red.'});
        recos.push({icono: 'lightbulb', texto: 'Comparar con Prim para verificar optimalidad.'});
    } else if (algoritmo === 'Prim') {
        recos.push({icono: 'seedling', texto: 'MST desde origen: <b>' + datos.costo.toFixed(2) + getUnidad() + '</b>.'});
        recos.push({icono: 'info-circle', texto: 'Arbol de expansion creciendo desde un nodo especifico.'});
        recos.push({icono: 'lightbulb', texto: 'Util para planificar expansion desde un hub.'});
    }
    var grados = Object.keys(redSalud).map(function(k) {
        return {codigo: k, grado: Object.keys(adyacencia[k] || {}).length};
    }).sort(function(a, b) { return b.grado - a.grado; });
    if (grados[0] && grados[0].grado > 3) {
        recos.push({icono: 'exclamation-triangle', texto: 'Nodo critico detectado: <b>' + grados[0].codigo + '</b> con <b>' + grados[0].grado + ' conexiones</b>.'});
    }
    var aislados = Object.keys(redSalud).filter(function(k) { return Object.keys(adyacencia[k] || {}).length === 0; });
    if (aislados.length > 0) {
        recos.push({icono: 'unlink', texto: '<b>' + aislados.length + ' nodo(s) aislado(s)</b>: ' + aislados.join(', ') + '. Requieren conexion.'});
    }
    var visitados = new Set();
    var comps = 0;
    Object.keys(redSalud).forEach(function(n) {
        if (!visitados.has(n)) {
            comps++;
            var stack = [n];
            while (stack.length) {
                var a = stack.pop();
                if (visitados.has(a)) continue;
                visitados.add(a);
                Object.keys(adyacencia[a] || {}).forEach(function(v) { if (!visitados.has(v)) stack.push(v); });
            }
        }
    });
    if (comps === 1) recos.push({icono: 'check-circle', texto: 'Red <b>100% conectada</b>. Todos los nodos son alcanzables.'});
    else recos.push({icono: 'exclamation-triangle', texto: 'Red fragmentada en <b>' + comps + ' componentes</b>. Revisar conectividad.'});
    var densidad = V > 1 ? (2 * E) / (V * (V - 1)) : 0;
    if (densidad < 0.1) recos.push({icono: 'info-circle', texto: 'Densidad baja (<b>' + (densidad * 100).toFixed(1) + '%</b>). La red es dispersa.'});
    else if (densidad < 0.3) recos.push({icono: 'info-circle', texto: 'Densidad moderada (<b>' + (densidad * 100).toFixed(1) + '%</b>).'});
    else recos.push({icono: 'check-circle', texto: 'Densidad alta (<b>' + (densidad * 100).toFixed(1) + '%</b>). Excelente interconectividad.'});
    var html = '';
    recos.forEach(function(r) {
        html += '<div class="item"><span class="icon"><i class="fas fa-' + r.icono + '"></i></span><span>' + r.texto + '</span></div>';
    });
    contenedor.innerHTML = html;
}