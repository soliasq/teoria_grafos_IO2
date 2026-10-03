<div align="center">  # teoria_grafos_IO2
<h1 align="center">Práctica Integradora</h1>
<strong Sistema de Solución de Problemas Reales<br>
mediante Teoría de Grafos</strong></div>
<p align="center">Aplicación de:
Construcción de grafos, búsqueda en profundidad,<br>
búsqueda en amplitud, algoritmo de Dijkstra,<br>
algoritmo de Kruskal y algoritmo de Prim<br>
Asignatura: Investigación Operativa II / Estructuras Discretas<br>
Docente: M.Sc. Ing. Juan Carlos Catunta Choquecalle<br>
Gestión 202</p>


# 🌐 Red Sanitaria Bolivia - CEASS

**Sistema web para optimización logística sanitaria con Teoría de Grafos**

[![GitHub Pages](https://img.shields.io/badge/Demo-Live-success)](https://soliasq.github.io/teoria_grafos_IO2/)
[![License](https://img.shields.io/badge/License-Académica-blue)]()
[![UPEA](https://img.shields.io/badge/UPEA-Ingeniería%20de%20Sistemas-orange)]()

---

## 📖 Descripción

Sistema web interactivo que modela la **Red Sanitaria de Bolivia** mediante un **grafo ponderado** de 25 nodos y 68 aristas. Implementa los algoritmos clásicos de teoría de grafos (BFS, DFS, Dijkstra, Kruskal, Prim) para optimizar la distribución de medicamentos e insumos médicos de la **Central de Abastecimiento y Suministros en Salud (CEASS)**.

**🔗 Demo en vivo:** [https://soliasq.github.io/teoria_grafos_IO2/](https://soliasq.github.io/teoria_grafos_IO2/)

---

## 🎯 Problemática

La CEASS enfrenta desafíos en la distribución de medicamentos a nivel nacional:

- **3,262 hospitales** y **3,543 centros de salud** en todo Bolivia
- **2,300 toneladas/año** de medicamentos distribuidas
- **127 camiones** en flota
- **Presupuesto:** Bs 1,847 millones
- **Población atendida:** 12.08 millones de habitantes
- Rutas no optimizadas que generan sobrecostos

**Solución:** Modelar la red como grafo y aplicar algoritmos de optimización.

---

## 🧮 Algoritmos Implementados

### 1️⃣ BFS - Búsqueda en Amplitud (Breadth-First Search)

**¿Qué hace?**
Explora el grafo por **niveles**, visitando primero todos los vecinos directos del origen, luego los vecinos de los vecinos, y así sucesivamente.

**Características:**
- 📊 Usa una **cola (FIFO)** para gestionar el orden de visita
- 🎯 Encuentra el **camino con menos aristas** entre origen y destino
- ⏱️ Complejidad: **O(V + E)** — V=nodos, E=aristas
- ✅ Garantiza el camino más corto cuando todas las aristas tienen el mismo peso
- 🔍 Ideal para grafos no ponderados o con pesos uniformes

**Paso a paso del algoritmo:**
```
1. Iniciar desde el nodo origen
2. Marcar el origen como visitado y agregarlo a la cola
3. Mientras la cola tenga elementos:
   a. Extraer el primer nodo de la cola
   b. Si es el destino → terminar
   c. Para cada vecino NO visitado:
      - Marcarlo como visitado
      - Agregarlo a la cola con su camino
4. Devolver el camino encontrado
```

**Aplicación en CEASS:**
- Encontrar la ruta con **menos paradas** entre dos ciudades
- Verificar que todos los centros de salud sean **alcanzables**
- Identificar el **nivel de aislamiento** de cada nodo

**Ejemplo con datos reales:**
```
Origen: LPZ (La Paz)
Destino: SCZ (Santa Cruz)

Nivel 0: LPZ
Nivel 1: EAL
Nivel 2: ORU, CBY, DES, ACH
Nivel 3: CBB, CHA, RIB, AAN, TAM, PAB, TJN
Nivel 4: SCZ ← ¡Encontrado!

Ruta: LPZ → EAL → ORU → CBB → SCZ
Aristas: 4 (mínimo)
Costo: 14.5 horas
```

---

### 2️⃣ DFS - Búsqueda en Profundidad (Depth-First Search)

**¿Qué hace?**
Explora el grafo **en profundidad**, recorriendo un camino hasta el final antes de retroceder (backtracking).

**Características:**
- 📚 Usa una **pila (LIFO)** o recursión
- 🎯 Explora **todos los caminos posibles**
- ⏱️ Complejidad: **O(V + E)**
- ❌ **NO garantiza** el camino más corto
- 🔄 Útil para detectar ciclos y componentes conexos

**Paso a paso del algoritmo:**
```
1. Iniciar desde el nodo origen
2. Marcar el nodo actual como visitado
3. Si es el destino → terminar
4. Para cada vecino NO visitado:
   a. Llamar recursivamente a DFS
   b. Si encuentra el destino → propagar éxito
5. Retroceder (backtracking)
```

**Aplicación en CEASS:**
- Explorar **rutas alternativas** cuando la principal está bloqueada
- Detectar **ciclos** en la red
- Identificar **nodos aislados**
- Verificar **conectividad** de toda la red

**Ejemplo con datos reales:**
```
Origen: LPZ

Recorrido en profundidad:
LPZ → EAL → ACH → AAN (fin, retrocede)
LPZ → EAL → DES (fin, retrocede)
LPZ → EAL → CBY → RIB → GUA (fin, retrocede)
LPZ → EAL → CBY → RIB → CIJ (fin, retrocede)
LPZ → EAL → ORU → TAM (fin, retrocede)
LPZ → EAL → ORU → PAB (fin, retrocede)
LPZ → EAL → ORU → CHA → PTS → UYU → ATO (fin)
LPZ → EAL → ORU → CHA → PTS → UYU → VLL (fin)
LPZ → EAL → ORU → CBB → SCZ ✅

Profundidad máxima: 11 niveles
Nodos visitados: 25/25
```

---

### 3️⃣ Dijkstra - Ruta de Costo Mínimo

**¿Qué hace?**
Encuentra el **camino más barato** (menor tiempo/distancia/costo) entre un nodo origen y todos los demás.

**Características:**
- 🎯 Usa **cola de prioridad** para seleccionar el nodo más cercano
- ✅ Garantiza la **ruta óptima**
- ⏱️ Complejidad: **O(V²)** o **O(E log V)** con heap
- ⚠️ **Requiere pesos NO negativos**
- 🔍 Es el algoritmo estrella para rutas óptimas

**Paso a paso del algoritmo:**
```
1. Inicializar distancias: origen=0, resto=∞
2. Crear conjunto de nodos no visitados
3. Mientras haya nodos no visitados:
   a. Seleccionar el nodo u con MENOR distancia
   b. Marcarlo como visitado
   c. Si u = destino → terminar
   d. Para cada vecino v de u:
      - Calcular: alt = dist[u] + peso(u,v)
      - Si alt < dist[v]:
        * Actualizar dist[v] = alt
        * Actualizar prev[v] = u
4. Reconstruir camino desde destino usando prev[]
```

**Aplicación en CEASS:**
- Calcular la **ruta más rápida** para envíos urgentes de medicamentos
- Optimizar el **consumo de combustible** de los 127 camiones
- Estimar **tiempos de entrega** precisos
- Planificar rutas de **emergencia médica**

**Ejemplo con datos reales:**
```
Origen: LPZ (La Paz)
Destino: SCZ (Santa Cruz)

Tabla de distancias (parcial):
Nodo    Distancia   Predecesor
LPZ     0.0h        -
EAL     0.5h        LPZ
ORU     3.5h        EAL
CBB     7.5h        ORU
SCZ     14.5h       CBB

Ruta óptima: LPZ → EAL → ORU → CBB → SCZ
Costo: 0.5 + 3.0 + 4.0 + 7.0 = 14.5 horas

Comparación con alternativas:
├─ Ruta óptima:        14.5h ✅
├─ Alternativa 1:      16.0h (vía VTU)
├─ Alternativa 2:      20.0h (vía SRE)
└─ Alternativa 3:      20.5h (vía PTS)

AHORRO: 6.0h = 29% más rápido
```

---

### 4️⃣ Kruskal - Árbol de Expansión Mínima (Global)

**¿Qué hace?**
Construye el **MST** (Minimum Spanning Tree) seleccionando las aristas de **menor a mayor peso** sin formar ciclos.

**Características:**
- 🌳 Usa **Union-Find** (conjuntos disjuntos)
- 🌐 Estrategia **global**: ordena todas las aristas primero
- ✅ Encuentra el árbol de **mínimo costo**
- ⏱️ Complejidad: **O(E log E)**
- 🔍 Mejor para grafos **dispersos** (pocas aristas)

**Paso a paso del algoritmo:**
```
1. Ordenar TODAS las aristas de menor a mayor peso
2. Crear un conjunto para cada nodo (Union-Find)
3. Para cada arista (u, v, w) en orden:
   a. Si u y v están en DIFERENTES conjuntos:
      - Agregar arista al MST
      - Unir los conjuntos de u y v
   b. Si u y v están en el MISMO conjunto:
      - RECHAZAR arista (formaría ciclo)
4. Detener cuando el MST tenga (n-1) aristas
```

**Aplicación en CEASS:**
- Diseñar la **red de infraestructura** de mínimo costo
- Planificar la **construcción de carreteras** entre centros de salud
- Identificar las **rutas críticas** de distribución
- Optimizar el **presupuesto** de Bs 1,847 millones

**Ejemplo con datos reales:**
```
Aristas ordenadas (las 10 más baratas):
1. PST-PQU (0.3h) ✅
2. LPZ-EAL (0.5h) ✅
3. WAR-MTR (0.7h) ✅
4. SCZ-WAR (0.8h) ✅
5. ORU-CHA (1.5h) ✅
6. RIB-GUA (1.5h) ✅
7. EAL-ACH (1.8h) ✅
8. EAL-DES (2.0h) ✅
9. TJA-EPZ (2.0h) ✅
10. UYU-ATO (2.0h) ✅
...

Aristas aceptadas: 34
Aristas rechazadas: 34 (formaban ciclos)
Costo total MST: 92.5 horas
```

---

### 5️⃣ Prim - Árbol de Expansión Mínima (Local)

**¿Qué hace?**
Construye el **MST** creciendo **desde un nodo inicial**, agregando siempre la arista más barata que conecte un nodo visitado con uno no visitado.

**Características:**
- 🌱 Estrategia **local**: crece desde un nodo semilla
- ✅ Encuentra el árbol de **mínimo costo**
- ⏱️ Complejidad: **O(V²)** o **O(E log V)** con heap
- 🎯 Eficiente para grafos **densos** (muchas aristas)
- 🔍 Depende del nodo inicial seleccionado

**Paso a paso del algoritmo:**
```
1. Elegir un nodo inicial (ej: LPZ)
2. Crear conjunto de nodos visitados = {inicio}
3. Mientras haya nodos NO visitados:
   a. Buscar la arista de MENOR peso que:
      - Tenga un extremo en visitados
      - El otro extremo en NO visitados
   b. Agregar esa arista al MST
   c. Agregar el nuevo nodo a visitados
4. Detener cuando todos los nodos estén visitados
```

**Aplicación en CEASS:**
- Expandir la red **desde un hub principal** (ej: La Paz)
- Planificar **nuevas sucursales** desde el centro de distribución
- Identificar el **orden de prioridad** de conexiones
- Diseñar rutas de **expansión gradual**

**Ejemplo con datos reales:**
```
Nodo inicial: LPZ

Iteración 1: Visitar LPZ → Agregar EAL (0.5h)
Iteración 2: Visitar EAL → Agregar ACH (1.8h)
Iteración 3: Visitar ACH → Agregar DES (2.0h)
Iteración 4: Visitar DES → Agregar ORU (3.0h)
Iteración 5: Visitar ORU → Agregar CHA (1.5h)
Iteración 6: Visitar CHA → Agregar PTS (3.5h)
Iteración 7: Visitar PTS → Agregar UYU (3.0h)
... continuar hasta conectar los 25 nodos

Aristas seleccionadas: 34
Costo total MST: 92.5 horas
```

---

### 📊 Comparación Kruskal vs Prim

| Criterio | Kruskal | Prim |
|----------|---------|------|
| **Estrategia** | Global (aristas) | Local (nodos) |
| **Estructura de datos** | Union-Find | Cola de prioridad |
| **Complejidad** | O(E log E) | O(V²) |
| **Nodo inicial** | No requiere | Sí requiere |
| **Mejor para** | Grafos dispersos | Grafos densos |
| **Costo total** | **Mismo** ✅ | **Mismo** ✅ |
| **Árbol resultante** | Puede variar | Puede variar |
| **Uso en CEASS** | Planificar red completa | Expandir desde hub |

**✅ IMPORTANTE:** Ambos algoritmos dan el **MISMO COSTO TOTAL** (92.5h). El árbol puede ser diferente cuando hay empates de peso, pero el costo mínimo siempre es igual.

---

### 📊 Tabla Comparativa de Algoritmos

| Algoritmo | Propósito | Complejidad | Resultado CEASS |
|-----------|-----------|-------------|-----------------|
| **BFS** | Camino con menos aristas | O(V+E) | LPZ→EAL→ORU→CBB→SCZ (4 aristas) |
| **DFS** | Exploración completa | O(V+E) | 25 nodos visitados, prof. 11 |
| **Dijkstra** | Ruta de costo mínimo | O(V²) | 14.5 horas (óptima) |
| **Kruskal** | MST por aristas | O(E log E) | 92.5 horas (global) |
| **Prim** | MST por nodos | O(V²) | 92.5 horas (local) |

---

## 🗺️ Modelado del Grafo

### Vértices (Nodos) — 25 ciudades estratégicas

| Tipo | Cantidad | Nodos | Peso |
|------|----------|-------|------|
| **Hub CEASS** | 3 | LPZ, CBB, SCZ | 10 |
| **Hub Logístico** | 1 | EAL | 10 |
| **Hub Minero** | 1 | ORU | 10 |
| **SEDES Departamental** | 7 | PTS, SRE, TJA, TJN, RIB, UYU, CIJ | 7 |
| **Nodo Frontera** | 9 | DES, TAM, PAB, VLL, YAC, GUY, CIJ, PST, PQU | 8 |
| **Nodo Logístico** | 2 | UYU, PST | 6 |
| **Nodo Intermedio** | 5 | CBY, RUR, CHL, EPZ, SJG | 5 |

### Aristas (Conexiones) — 68 rutas

Cada arista representa una **carretera** entre dos nodos con su **tiempo de viaje** (peso en horas).

### Grafo resultante:

- **|V|** = 25 nodos
- **|E|** = 68 aristas
- **Tipo:** No dirigido, ponderado, conexo
- **Densidad:** 22.7% (grafo disperso)
- **Grado promedio:** 5.44 conexiones por nodo
- **Diámetro:** 8 niveles (BFS)

---

## 📂 Estructura del Proyecto

```
proyecto_grafos/
│
├── app/                              # Aplicación web
│   ├── index.html                    # Página principal
│   ├── css/
│   │   └── styles.css                # Estilos
│   └── js/
│       ├── main.js                   # Inicialización y UI
│       ├── grafo.js                  # Construcción del grafo
│       ├── algoritmos.js             # BFS, DFS, Dijkstra, Kruskal, Prim
│       ├── validaciones.js           # Validaciones y nodos críticos
│       └── reportes.js               # Reportes y PDF
│
├── datos/                            # Datos del grafo
│   ├── vertices.csv                  # 25 nodos con coordenadas
│   └── aristas.csv                   # 68 aristas con pesos
│
├── pruebas/                          # Tests automáticos
│   └── test_algoritmos.js            # Pruebas de los 5 algoritmos
│
├── evidencias/                       # Evidencias del proyecto
│   ├── entrevistas/                  # Entrevistas a usuarios
│   ├── fotografias/                  # Fotos del contexto
│   └── capturas/                     # Capturas del sistema
│
├── documentacion/                    # Documentación
│   ├── informe.pdf                   # Informe académico
│   └── manual_usuario.pdf            # Manual de usuario
│
├── requirements.txt                  # Dependencias
└── README.md                         # Este archivo
```

---

## 🚀 Cómo Usar

### 1. Abrir el sistema

**Opción A — Online:**
Visita: [https://soliasq.github.io/teoria_grafos_IO2/](https://soliasq.github.io/teoria_grafos_IO2/)

**Opción B — Local:**
```bash
git clone https://github.com/soliasq/teoria_grafos_IO2.git
cd teoria_grafos_IO2
# Abrir app/index.html en el navegador
```

### 2. Cargar datos

- **📊 Datos Prueba:** Carga los 25 nodos de ejemplo
- **📁 Cargar CSV:** Selecciona `vertices.csv` y `aristas.csv`
- **⬇️ Descargar:** Obtén las plantillas CSV

### 3. Ejecutar algoritmo

1. Selecciona **Origen** y **Destino**
2. Elige el **algoritmo** (BFS, DFS, Dijkstra, Kruskal, Prim)
3. Presiona **Ejecutar**
4. Observa los resultados en el mapa y panel

---

## 🎯 Funcionalidades

- ✅ **5 Algoritmos:** BFS, DFS, Dijkstra, Kruskal, Prim
- ✅ **Mapa interactivo** con Leaflet + 3 capas (Calles, Satélite, Terreno)
- ✅ **Ponderación múltiple:** Tiempo, Distancia, Costo, Riesgo
- ✅ **5 Mini-mapas:** Uno por algoritmo
- ✅ **Matriz de adyacencia** visual
- ✅ **Lista de adyacencia** con grados
- ✅ **Análisis avanzado:**
  - Nodos críticos (puntos de articulación)
  - Detección de ciclos
  - Componentes conexos
  - Estadísticas generales
  - Top 10 rutas más cortas
  - Histograma de pesos
  - Nodos aislados
  - Bellman-Ford
  - Floyd-Warshall
- ✅ **Editor de grafos** (agregar/eliminar nodos y aristas)
- ✅ **Gestión de flota** (camiones)
- ✅ **Comparación Kruskal vs Prim** lado a lado
- ✅ **Exportar PNG** del mapa
- ✅ **Modo presentación** (pantalla completa)
- ✅ **Modo oscuro/claro**
- ✅ **Reporte PDF** con recomendaciones
- ✅ **Notificaciones toast**
- ✅ **Atajos de teclado**

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso | Versión |
|------------|-----|---------|
| **HTML5** | Estructura | - |
| **CSS3** | Estilos y animaciones | - |
| **JavaScript** | Lógica y algoritmos | ES6+ |
| **Leaflet.js** | Mapas interactivos | 1.9.4 |
| **Chart.js** | Gráficos comparativos | Latest |
| **Font Awesome** | Iconografía | 6.5.1 |
| **html2canvas** | Exportar PNG | 1.4.1 |
| **jsPDF** | Generar PDF | 2.5.1 |
| **Google Fonts** | Tipografía Inter | - |

---

## 📊 Resultados Obtenidos

Con los datos de prueba (25 nodos, 68 aristas):

| Algoritmo | Resultado | Tiempo |
|-----------|-----------|--------|
| **BFS** | Camino LPZ→SCZ con 4 aristas | 14.5h |
| **DFS** | Recorrido completo de 25 nodos | - |
| **Dijkstra** | Ruta óptima LPZ→SCZ | 14.5h |
| **Kruskal** | MST con 24 aristas | 92.5h |
| **Prim** | MST con 24 aristas | 92.5h |

**Conclusión:** Kruskal y Prim generan el MISMO costo total, validando la implementación.

---

## 🧪 Casos de Prueba

| # | Caso | Estado |
|---|------|--------|
| 1 | Grafo real (25 nodos) | ✅ Aprobado |
| 2 | Grafo conexo con diferentes pesos | ✅ Aprobado |
| 3 | Grafo con nodo aislado | ✅ Detectado |
| 4 | Grafo no conexo | ✅ Detectado |
| 5 | Múltiples caminos entre origen y destino | ✅ Aprobado |
| 6 | Pesos repetidos | ✅ Aprobado |
| 7 | Intento de arista duplicada | ✅ Validado |
| 8 | Dijkstra con peso negativo | ⚠️ Advertencia |
| 9 | Comparación Kruskal vs Prim | ✅ Aprobado |
| 10 | Modificación de arista | ✅ Aprobado |

---

## 📈 Estadísticas del Grafo

- **Nodos:** 25
- **Aristas:** 68
- **Densidad:** 22.7%
- **Grado promedio:** 5.44
- **Grado máximo:** 9 (SCZ)
- **Grado mínimo:** 1 (DES, CIJ, GUY, PST)
- **Diámetro:** 8
- **Componentes conexos:** 1
- **Tiene ciclos:** Sí
- **Completo:** No
- **Dirigido:** No
- **Ponderado:** Sí

---

## 👥 Autores

** Porfirio Elias Quispe Quispe**
-AÑAMURO CUSI LIDER JHOJAN
 - HUANCA CLARES LESLY MELODY
 - HUARACHI VILLCA VIDAL JUAN
 - LIMACHI MAYDANA YHONNY
 - MAMANI QUISPE CRISTIAN

 - TITO HUANCA MARIANA HELEN
 - YUJRA QUISPE SEYMI NOEMI

- 🎓 Universidad Pública de El Alto (UPEA)
- 💻 Ingeniería de Sistemas
- 📚 6to Semestre
- 🔬 Investigación Operativa II

**Docente:** M.Sc. Ing. Juan Carlos Catunta Choquecalle

---

## 📄 Licencia

Proyecto académico — Todos los derechos reservados © 2026

---

## 🔗 Referencias Bibliográficas

- **Cormen, T. H.**, Leiserson, C. E., Rivest, R. L. y Stein, C. *Introduction to Algorithms*. MIT Press.
- **Rosen, K. H.** *Discrete Mathematics and Its Applications*. McGraw-Hill.
- **Sedgewick, R. & Wayne, K.** *Algorithms*. Addison-Wesley.
- **West, D. B.** *Introduction to Graph Theory*. Prentice Hall.

---

## 📞 Contacto

- **GitHub:** [@soliasq](https://github.com/soliasq)
- **Demo:** [https://soliasq.github.io/teoria_grafos_IO2/](https://soliasq.github.io/teoria_grafos_IO2/)

---

⭐ **Si te gustó este proyecto, dale una estrella en GitHub** ⭐


<p align="center">
  <img align="center" width="auto" src="https://github.com/soliasq/soliasq/assets/5314272/9f87757f-836e-4b79-bfa5-b12b3d1fb72c"/>
  <!--![me](https://github.com/soliasq/soliasq/assets/5314272/9f87757f-836e-4b79-bfa5-b12b3d1fb72c)-->
  <h3 align="center">¡Hey 👋!  I'm soliasq 👨🏻‍💻</h3>
  
```js
const soliasq = {
  pronoums: "he" |"him",
  code: [Javascript,Typescript, HTML, CSS, Java, Haskell, Rust, C#, PHP],
  tools: [Laravel, Flutter, Node, Storybook, Style-Components, Jest, Dock],
  desing: [Photoshop, Illustrator, Figma, Xd, Corel-Draw, Premier, After-Effects, Indesign],
  other: [Skechup, R, Python, Vba, Tableu ]
}    
```

 <p align="center"> <strong> You can find me :</strong>  👇!</p>
 
<p align="center">
  <a href="http://www.soliasq.260mb.net/?i=1" alt="WEB" target="_blank">
     <img align="center" src="https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/googlechrome.svg" alt="Web" height="28px" width="28px"/>
  </a>&nbsp;&nbsp;&nbsp;
   <a href="https://www.youtube.com/channel/UCOBSI6n-Uktm6iN4lqG-fSg" target="_blank" style="margin-right:4px">
    <img align="center" src="https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/youtube.svg" alt="solaisq" height="28px" width="28px" />
  </a>&nbsp;&nbsp;&nbsp;
  <a href="https://t.me/soliasq" target="_blank">
    <img align="center" src="https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/telegram.svg" alt="soliasq" height="28px" width="28px" />
  </a>&nbsp;&nbsp;&nbsp;
    <a href="https://www.facebook.com/profile.php?id=100065418402533" target="_blank">
    <img align="center" src="https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/facebook.svg" alt="soliasq" height="28px" width="28px" />
  </a>&nbsp;&nbsp;&nbsp;
  
  <a href="https://www.instagram.com/t43cr0w" target="blank">
    <img align="center" src="https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/instagram.svg" alt="soliasq" height="28px" width="28px" />
  </a>
</p> 
<hr> 

¡Gracias por visitar! Siéntete libre de contactarme o tienes alguna pregunta.<br>
Thank you for visiting my profile! Feel free to contact me or if you have any questions.
<!--
**soliasq/soliasq** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
-->

