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



Índice
1. Títulodelapráctica 3
2.Modalidaddetrabajo 3
3. Situaciónproblemática 3
4. Ejemplosdeproblemáticas 3
5. Objetivogeneral 4
6. Objetivosespecíficos 4
7. Conocimientosquesedebenintegrar 5
8. ParteI: investigacióndelaproblemática 5
8.1. Actividades . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
8.2. Evidenciasobligatorias . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
9. ParteII:construccióndelgrafo 6
9.1. Definiciónformal . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
9.2. Requerimientosdelmodelo . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
9.3. Representaciónobligatoria . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
10.ParteIII:aplicacióndealgoritmos 8
10.1.Búsquedaenprofundidad:DFS . . . . . . . . . . . . . . . . . . . . . . . . 8
10.2.Búsquedaenamplitud:BFS . . . . . . . . . . . . . . . . . . . . . . . . . . 8
10.3.AlgoritmodeDijkstra. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
10.4.AlgoritmodeKruskal . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
10.5.AlgoritmodePrim . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
10.6.ComparaciónentreKruskalyPrim . . . . . . . . . . . . . . . . . . . . . . 10
11.ParteIV:desarrollodelsistemafuncional 10
11.1.Nombresugerido . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
11.2.Tipodeaplicación . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
1
PrácticaIntegradora TeoríadeGrafos
11.3.Tecnologíassugeridas . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
12.Funcionalidadesmínimas 11
13.Entradasysalidasdelsistema 12
13.1.Entradasmínimas . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
13.2.Salidasmínimas . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
14.Casosdepruebaobligatorios 13
15.Validaciónmanual 14
16.Evidenciasdelprocesodedesarrollo 14
17.Usoresponsabledeinteligenciaartificial 15
18.Estructurasugeridadelproyecto 16
19.Formatosugeridodelosdatos 16
19.1.Archivodevértices . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17
19.2.Archivodearistas . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17
20.Productofinalesperado 17
21.Estructuradel informe 18
22.Defensaydemostración 19
23.Preguntasorientadorasparaelanálisis 19
24.Conclusiónesperada 20
25.Criteriosdeaprobación 20
26.Referenciasbibliográficassugeridas 21
2
Práctica Integradora
Teoría de Grafos
1. Título de la práctica
Diseño e implementación de un sistema funcional para resolver una problemática
real mediante teoría de grafos.
2. Modalidad de trabajo
La práctica podrá desarrollarse individualmente o en equipos de un máximo de diez
estudiantes, de acuerdo con las indicaciones del docente.
Cada equipo deberá identificar una problemática real, recopilar información verificable,
modelarla mediante un grafo e implementar un sistema funcional que utilice los algoritmos
estudiados.
No se aceptarán proyectos que únicamente reproduzcan ejemplos genéricos obtenidos de
Internet o generados completamente mediante herramientas de inteligencia artificial, sin
investigación, datos y evidencias propias.
3. Situación problemática
En diferentes organizaciones y comunidades existen problemas relacionados con rutas,
conexiones, distribución de recursos, comunicación, transporte, accesibilidad, infraestructura
y planificación de redes.
Estos problemas pueden representarse mediante grafos, donde:
Los vértices o nodos representan lugares, personas, equipos, instituciones, estaciones,
aulas, almacenes u otros elementos.
Las aristas representan carreteras, calles, conexiones, relaciones, enlaces o posibilida
des de desplazamiento.
Los pesos pueden representar distancia, tiempo, costo, consumo de combustible,
riesgo u otra medida cuantificable.
El equipo deberá encontrar una problemática concreta de su entorno y desarrollar un
sistema que contribuya a analizarla o resolverla mediante teoría de grafos.
4. Ejemplos de problemáticas
Los siguientes ejemplos son únicamente orientativos. Cada equipo debe contextualizar y
justificar su propio problema.
3
Práctica Integradora
Teoría de Grafos
1. Determinación de rutas óptimas para la distribución de productos.
2. Diseño de una red de conexión entre laboratorios o salas de computación.
3. Optimización de recorridos de transporte universitario.
4. Identificación de rutas de evacuación dentro de una institución.
5. Conexión de centros de salud de una determinada zona.
6. Diseño de una red de fibra óptica con costo mínimo.
7. Organización de rutas para la recolección de residuos.
8. Análisis de accesibilidad entre comunidades rurales.
9. Distribución de medicamentos o insumos médicos.
10. Diseño de recorridos para visitas técnicas o mantenimiento.
11. Análisis de conexiones entre dependencias de una empresa.
12. Localización de caminos alternativos ante el cierre de una ruta.
La propuesta elegida deberá contar con una fuente real de información y con una persona,
institución, comunidad o grupo que pueda beneficiarse de la solución.
5. Objetivo general
Diseñar e implementar una aplicación funcional que modele una problemática real mediante
grafos y aplique los algoritmos DFS, BFS, Dijkstra, Kruskal y Prim para generar resultados
útiles en la toma de decisiones.
6. Objetivos específicos
1. Identificar y documentar una problemática real susceptible de ser representada me
diante un grafo.
2. Construir el grafo correspondiente, definiendo correctamente vértices, aristas, pesos y
tipo de grafo.
3. Implementar la búsqueda en profundidad y la búsqueda en amplitud.
4. Determinar rutas de costo mínimo mediante el algoritmo de Dijkstra.
5. Obtener árboles de expansión mínima mediante los algoritmos de Kruskal y Prim.
4
Práctica Integradora
Teoría de Grafos
6. Comparar los resultados obtenidos mediante los diferentes algoritmos.
7. Desarrollar una aplicación web, de escritorio o móvil que permita interactuar con el
grafo.
8. Validar el funcionamiento del sistema mediante datos reales y casos de prueba.
9. Formular recomendaciones relacionadas con la problemática estudiada.
7. Conocimientos que se deben integrar
El proyecto deberá demostrar la aplicación articulada de los siguientes contenidos:
1. Conceptos fundamentales de teoría de grafos.
2. Grafos dirigidos y no dirigidos.
3. Grafos ponderados y no ponderados.
4. Representación mediante listas o matrices de adyacencia.
5. Grado de un vértice.
6. Caminos, ciclos y conectividad.
7. Búsqueda en profundidad (DFS).
8. Búsqueda en amplitud (BFS).
9. Algoritmo de Dijkstra.
10. Algoritmo de Kruskal.
11. Algoritmo de Prim.
8. Parte I: investigación de la problemática
Antes de programar, el equipo deberá realizar una investigación breve del problema.
8.1. Actividades
1. Identificar una problemática del entorno.
2. Describir el lugar, institución o población involucrada.
3. Identificar a los posibles usuarios o beneficiarios.
5
Práctica Integradora
Teoría de Grafos
4. Explicar cómo se resuelve actualmente el problema.
5. Determinar las dificultades o limitaciones existentes.
6. Recopilar datos necesarios para construir el grafo.
7. Definir qué decisiones podría mejorar el sistema propuesto.
8.2. Evidencias obligatorias
El equipo deberá presentar, como mínimo:
Una entrevista breve, encuesta, observación directa o conversación documentada con
un usuario relacionado con el problema.
Fotografías propias, capturas, croquis, registros, formularios o documentos del contexto
investigado.
Una tabla con los datos originales recopilados.
Fecha, lugar y responsable de la recopilación.
Explicación del procedimiento seguido para obtener los datos.
Cuando no sea posible tomar fotografías por razones de privacidad, seguridad o autorización,
se podrá presentar un acta de observación o una fuente institucional verificable.
9. Parte II: construcción del grafo
El equipo deberá transformar la problemática en un modelo de grafo.
9.1. Definición formal
El grafo deberá expresarse como:
donde:
representa el conjunto de vértices y
G=(V,E),
V ={v1,v2,...,vn}
6
Práctica Integradora
Teoría de Grafos
E ={e1,e2,...,em}
representa el conjunto de aristas.
Cuando el grafo sea ponderado, deberá definirse una función:
w : E −→R≥0,
donde w(e) representa el peso de cada arista.
9.2. Requerimientos del modelo
El informe deberá especificar:
1. Qué representa cada vértice.
2. Qué representa cada arista.
3. Qué representa el peso de las aristas.
4. Si el grafo es dirigido o no dirigido.
5. Si el grafo es ponderado o no ponderado.
6. Las unidades utilizadas: metros, kilómetros, minutos, bolivianos u otras.
7. Las restricciones y supuestos adoptados.
8. La cantidad total de vértices y aristas.
El grafo utilizado deberá tener, salvo justificación técnica, al menos:
|V | ≥ 10
9.3. Representación obligatoria
El equipo deberá presentar:
Representación gráfica del grafo.
Lista de vértices.
Lista de aristas.
y
Matriz de adyacencia o matriz de pesos.
|E| ≥ 15.
Lista de adyacencia generada por el sistema.
7
Práctica Integradora
Teoría de Grafos
10. Parte III: aplicación de algoritmos
10.1. Búsqueda en profundidad: DFS
El sistema deberá implementar el algoritmo de búsqueda en profundidad.
Deberá permitir seleccionar un nodo inicial y mostrar:
Orden en que se visitan los nodos.
Aristas utilizadas durante el recorrido.
Nodos alcanzables desde el origen.
Identificación de componentes conexos, cuando corresponda.
Detección de ciclos o caminos alternativos, si resulta pertinente.
El equipo deberá explicar qué utilidad tiene DFS dentro de la problemática seleccionada.
10.2. Búsqueda en amplitud: BFS
El sistema deberá implementar el algoritmo de búsqueda en amplitud.
Deberá permitir:
Seleccionar un nodo inicial.
Mostrar el recorrido por niveles.
Determinar el número mínimo de aristas entre dos nodos.
Reconstruir el camino encontrado.
Mostrar los nodos visitados y la estructura de la cola.
El equipo deberá explicar por qué BFS es adecuado para encontrar caminos mínimos cuando
todas las conexiones tienen el mismo costo.
10.3. Algoritmo de Dijkstra
El sistema deberá implementar el algoritmo de Dijkstra para obtener el camino de menor
costo entre un nodo origen y los demás nodos.
Deberá mostrar:
8
Práctica Integradora
Teoría de Grafos
Nodo origen y nodo destino.
Distancia o costo mínimo.
Secuencia completa del camino.
Tabla de distancias calculadas.
Nodo predecesor de cada vértice.
Visualización del camino óptimo dentro del grafo.
Los pesos utilizados deberán ser mayores o iguales a cero:
w(u,v) ≥ 0.
Si existen pesos negativos, el sistema deberá mostrar una advertencia indicando que Dijkstra
no es aplicable.
10.4. Algoritmo de Kruskal
El sistema deberá generar un árbol de expansión mínima mediante Kruskal.
Deberá mostrar:
Aristas ordenadas de menor a mayor peso.
Aristas aceptadas.
Aristas rechazadas por generar ciclos.
Árbol de expansión mínima resultante.
Costo total de la solución.
El sistema deberá verificar que el grafo sea no dirigido, ponderado y conexo antes de ejecutar
el algoritmo.
10.5. Algoritmo de Prim
El sistema deberá implementar Prim permitiendo seleccionar un nodo inicial.
Deberá mostrar:
Nodo inicial.
Arista seleccionada en cada iteración.
9
Práctica Integradora
Teoría de Grafos
Conjunto de nodos incorporados.
Árbol de expansión mínima.
Costo total obtenido.
10.6. Comparación entre Kruskal y Prim
El equipo deberá comparar los resultados mediante una tabla como la siguiente:
Criterio
Kruskal
Prim
Costo total
Número de aristas
Orden de selección
Tiempo de ejecución
Ventajas observadas
Limitaciones observa
das
Si existen varias soluciones óptimas, los árboles obtenidos pueden ser diferentes, pero
deberán cumplir:
Costo de Kruskal = Costo de Prim.
Si los costos son diferentes, el equipo deberá revisar la implementación o justificar técnica
mente el resultado.
11. Parte IV: desarrollo del sistema funcional
11.1. Nombre sugerido
Sistema Inteligente de Análisis y Optimización de Redes
El equipo podrá utilizar otro nombre relacionado con la problemática seleccionada.
11.2. Tipo de aplicación
El sistema podrá implementarse como:
Aplicación web.
10
Práctica Integradora
Teoría de Grafos
Aplicación de escritorio.
Aplicación móvil.
Sistema multiplataforma.
No se considerará sistema funcional a un programa que únicamente muestre resultados fijos
en la consola. Debe existir interacción con el usuario y posibilidad de modificar los datos.
11.3. Tecnologías sugeridas
El estudiante podrá utilizar el lenguaje y las herramientas de su preferencia. Algunas
alternativas son:
Python con Streamlit, Flask, Django o Tkinter.
Java con JavaFX, Swing o Spring Boot.
JavaScript o TypeScript con React, Vue, Angular o Node.js.
C# con .NET.
PHP con Laravel.
Kotlin o Flutter para aplicaciones móviles.
Para la representación gráfica pueden utilizarse bibliotecas como NetworkX, Graphviz,
Cytoscape.js, vis.js, D3.js u otras equivalentes.
12. Funcionalidades mínimas
El sistema deberá cumplir obligatoriamente con las siguientes funcionalidades:
1. Registrar, modificar y eliminar vértices.
2. Registrar, modificar y eliminar aristas.
3. Asignar pesos a las aristas.
4. Cargar datos desde un archivo CSV o JSON.
5. Validar datos incompletos, duplicados o incorrectos.
6. Mostrar gráficamente la red.
7. Generar la matriz o lista de adyacencia.
11
Práctica Integradora
Teoría de Grafos
8. Ejecutar DFS desde un nodo seleccionado.
9. Ejecutar BFS desde un nodo seleccionado.
10. Ejecutar Dijkstra entre un origen y un destino.
11. Ejecutar Kruskal.
12. Ejecutar Prim desde un nodo seleccionado.
13. Resaltar visualmente los caminos y árboles obtenidos.
14. Mostrar los costos y resultados numéricos.
15. Comparar los resultados de Kruskal y Prim.
16. Generar un reporte con resultados y recomendaciones.
17. Permitir reiniciar el análisis o cargar un nuevo grafo.
13. Entradas y salidas del sistema
13.1. Entradas mínimas
Nombre o código de cada vértice.
Descripción de cada vértice.
Nodo de origen.
Nodo de destino.
Aristas existentes.
Peso de cada arista.
Tipo de grafo.
Algoritmo que se desea ejecutar.
13.2. Salidas mínimas
Grafo completo.
Matriz o lista de adyacencia.
Recorrido DFS.
Recorrido BFS.
12
Práctica Integradora
Teoría de Grafos
Camino mínimo calculado por Dijkstra.
Distancia o costo mínimo.
Árbol de expansión mínima de Kruskal.
Árbol de expansión mínima de Prim.
Costo total de cada árbol.
Comparación de resultados.
Recomendaciones relacionadas con el problema real.
14. Casos de prueba obligatorios
El equipo deberá probar el sistema, como mínimo, con los siguientes casos:
1. Grafo real investigado por el equipo.
2. Grafo conexo con diferentes pesos.
3. Grafo con un nodo aislado.
4. Grafo no conexo.
5. Grafo con más de un camino entre origen y destino.
6. Grafo con pesos repetidos.
7. Intento de ingresar una arista duplicada.
8. Intento de ejecutar Dijkstra con un peso negativo.
9. Comparación de Kruskal y Prim sobre el mismo grafo.
10. Modificación de una arista para comprobar cómo cambia la solución.
Para cada caso deberá registrarse:
Datos de entrada.
Resultado esperado.
Resultado obtenido.
Estado de la prueba: aprobada o no aprobada.
Captura de pantalla.
13
Práctica Integradora
Teoría de Grafos
15. Validación manual
No será suficiente mostrar únicamente los resultados producidos por el sistema.
El equipo deberá seleccionar un grafo reducido de entre cinco y siete nodos y resolver
manualmente:
1. Un recorrido DFS.
2. Un recorrido BFS.
3. Un camino mínimo mediante Dijkstra.
4. Un árbol de expansión mínima mediante Kruskal.
5. Un árbol de expansión mínima mediante Prim.
Posteriormente, deberá comparar los resultados manuales con los resultados generados por
el sistema.
16. Evidencias del proceso de desarrollo
Para demostrar que el proyecto fue desarrollado y comprendido por los estudiantes, se
deberán presentar las siguientes evidencias:
1. Planteamiento inicial del problema.
2. Evidencia de recopilación de datos.
3. Primer boceto del grafo.
4. Diagrama o prototipo inicial de la interfaz.
5. Historial de avances del código fuente.
6. Repositorio Git con contribuciones identificables.
7. Registro de errores encontrados y correcciones realizadas.
8. Casos de prueba.
9. Capturas del sistema en distintas etapas.
10. Video breve de demostración.
11. Declaración de herramientas utilizadas.
1



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

