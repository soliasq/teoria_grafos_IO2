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

<title>Índice · Práctica Integradora Teoría de Grafos</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            background: #f6f9fc;
            font-family: 'Segoe UI', Roboto, system-ui, -apple-system, sans-serif;
            padding: 2rem 1.5rem;
            display: flex;
            justify-content: center;
        }
        .container {
            max-width: 1000px;
            width: 100%;
            background: white;
            border-radius: 32px;
            box-shadow: 0 20px 40px -12px rgba(0, 20, 30, 0.25);
            padding: 2.5rem 2.8rem;
            transition: all 0.2s;
        }
        h1 {
            font-size: 2.2rem;
            font-weight: 600;
            letter-spacing: -0.02em;
            color: #0b2b3b;
            border-left: 6px solid #2b7a8a;
            padding-left: 1.2rem;
            margin-bottom: 0.4rem;
        }
        .subhead {
            font-size: 1rem;
            color: #3d5f6b;
            margin-bottom: 2rem;
            font-weight: 400;
            padding-left: 1.8rem;
            border-bottom: 1px solid #e2edf2;
            padding-bottom: 0.8rem;
        }
        .indice-grid {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }
        .item {
            display: flex;
            align-items: baseline;
            padding: 0.4rem 0.6rem;
            border-radius: 12px;
            transition: background 0.15s;
            color: #1a3a47;
            font-size: 0.98rem;
            line-height: 1.5;
        }
        .item:hover {
            background: #ecf5f8;
        }
        .num {
            min-width: 2.8rem;
            font-weight: 600;
            color: #1f5a6b;
            font-feature-settings: "tnum";
        }
        .num.sub {
            min-width: 4.4rem;
            padding-left: 1rem;
            color: #3d6f7e;
        }
        .text {
            flex: 1;
        }
        .text .sub-item {
            display: inline-block;
            padding-left: 1.2rem;
            color: #1f4a57;
        }
        .badge {
            background: #d6e9ef;
            color: #16505f;
            font-size: 0.7rem;
            font-weight: 600;
            padding: 0.15rem 0.9rem;
            border-radius: 30px;
            letter-spacing: 0.3px;
            margin-left: 0.8rem;
            white-space: nowrap;
        }
        .seccion {
            margin-top: 0.6rem;
            border-top: 1px dashed #d0e3ea;
            padding-top: 0.4rem;
        }
        .seccion:first-of-type {
            border-top: none;
            margin-top: 0;
        }
        .parte {
            font-weight: 600;
            color: #0a2e3b;
            background: #e7f1f5;
            padding: 0.2rem 0.8rem;
            border-radius: 30px;
            font-size: 0.8rem;
            letter-spacing: 0.3px;
            margin-right: 0.8rem;
        }
        .sub-item-indent {
            padding-left: 1.8rem;
        }
        .footer-note {
            margin-top: 2.2rem;
            font-size: 0.8rem;
            color: #517a88;
            background: #edf6fa;
            padding: 0.8rem 1.5rem;
            border-radius: 60px;
            display: inline-block;
            border: 1px solid #cde0e7;
        }
        .link-sim {
            color: #1f6f82;
            text-decoration: none;
            border-bottom: 1px dotted #9ebcc9;
        }
        @media (max-width: 600px) {
            .container { padding: 1.5rem; }
            .item { flex-wrap: wrap; }
            .num { min-width: 2.2rem; }
            .num.sub { min-width: 3.2rem; }
        }
    </style>
</head>
<body>
<div class="container">
    <h1>📘 Índice · Práctica Integradora</h1>
    <div class="subhead">Teoría de Grafos — Diseño e implementación de sistema funcional</div>

    <div class="indice-grid">

        <!-- 1–4 -->
        <div class="item"><span class="num">1.</span><span class="text">Título de la práctica <span class="badge">Diseño e implementación</span></span></div>
        <div class="item"><span class="num">2.</span><span class="text">Modalidad de trabajo <span class="badge">individual / equipos ≤10</span></span></div>
        <div class="item"><span class="num">3.</span><span class="text">Situación problemática <span class="badge">grafos en organizaciones</span></span></div>
        <div class="item"><span class="num">4.</span><span class="text">Ejemplos de problemáticas <span class="badge">12 casos orientativos</span></span></div>

        <!-- 5–6 -->
        <div class="item"><span class="num">5.</span><span class="text">Objetivo general <span class="badge">aplicación funcional</span></span></div>
        <div class="item"><span class="num">6.</span><span class="text">Objetivos específicos <span class="badge">9 puntos clave</span></span></div>

        <!-- 7 -->
        <div class="item"><span class="num">7.</span><span class="text">Conocimientos que se deben integrar <span class="badge">11 temas</span></span></div>

        <!-- 8 -->
        <div class="item seccion"><span class="num">8.</span><span class="text"><span class="parte">PARTE I</span> Investigación de la problemática</span></div>
        <div class="item"><span class="num sub">8.1.</span><span class="text">Actividades <span class="badge">7 pasos</span></span></div>
        <div class="item"><span class="num sub">8.2.</span><span class="text">Evidencias obligatorias <span class="badge">entrevista, fotos, tabla</span></span></div>

        <!-- 9 -->
        <div class="item seccion"><span class="num">9.</span><span class="text"><span class="parte">PARTE II</span> Construcción del grafo</span></div>
        <div class="item"><span class="num sub">9.1.</span><span class="text">Definición formal <span class="badge">G=(V,E), w(e)</span></span></div>
        <div class="item"><span class="num sub">9.2.</span><span class="text">Requerimientos del modelo <span class="badge">|V|≥10, |E|≥15</span></span></div>
        <div class="item"><span class="num sub">9.3.</span><span class="text">Representación obligatoria <span class="badge">gráfica, listas, matriz</span></span></div>

        <!-- 10 -->
        <div class="item seccion"><span class="num">10.</span><span class="text"><span class="parte">PARTE III</span> Aplicación de algoritmos</span></div>
        <div class="item"><span class="num sub">10.1.</span><span class="text">Búsqueda en profundidad: DFS <span class="badge">orden, aristas, componentes</span></span></div>
        <div class="item"><span class="num sub">10.2.</span><span class="text">Búsqueda en amplitud: BFS <span class="badge">niveles, camino mínimo</span></span></div>
        <div class="item"><span class="num sub">10.3.</span><span class="text">Algoritmo de Dijkstra <span class="badge">camino de menor costo</span></span></div>
        <div class="item"><span class="num sub">10.4.</span><span class="text">Algoritmo de Kruskal <span class="badge">MST por aristas</span></span></div>
        <div class="item"><span class="num sub">10.5.</span><span class="text">Algoritmo de Prim <span class="badge">MST por nodos</span></span></div>
        <div class="item"><span class="num sub">10.6.</span><span class="text">Comparación entre Kruskal y Prim <span class="badge">tabla, costos iguales</span></span></div>

        <!-- 11 -->
        <div class="item seccion"><span class="num">11.</span><span class="text"><span class="parte">PARTE IV</span> Desarrollo del sistema funcional</span></div>
        <div class="item"><span class="num sub">11.1.</span><span class="text">Nombre sugerido <span class="badge">Sistema Inteligente de Análisis y Optimización de Redes</span></span></div>
        <div class="item"><span class="num sub">11.2.</span><span class="text">Tipo de aplicación <span class="badge">web, escritorio, móvil</span></span></div>
        <div class="item"><span class="num sub">11.3.</span><span class="text">Tecnologías sugeridas <span class="badge">Python, Java, JS, C#, etc.</span></span></div>

        <!-- 12 -->
        <div class="item"><span class="num">12.</span><span class="text">Funcionalidades mínimas <span class="badge">17 ítems</span></span></div>

        <!-- 13 -->
        <div class="item"><span class="num">13.</span><span class="text">Entradas y salidas del sistema</span></div>
        <div class="item"><span class="num sub">13.1.</span><span class="text">Entradas mínimas <span class="badge">nombre, origen, destino, pesos, tipo</span></span></div>
        <div class="item"><span class="num sub">13.2.</span><span class="text">Salidas mínimas <span class="badge">grafo, DFS, BFS, Dijkstra, MST, comparación</span></span></div>

        <!-- 14 -->
        <div class="item"><span class="num">14.</span><span class="text">Casos de prueba obligatorios <span class="badge">10 casos</span></span></div>

        <!-- 15 -->
        <div class="item"><span class="num">15.</span><span class="text">Validación manual <span class="badge">grafo de 5–7 nodos</span></span></div>

        <!-- 16 -->
        <div class="item"><span class="num">16.</span><span class="text">Evidencias del proceso de desarrollo <span class="badge">11 evidencias</span></span></div>

        <!-- 17 -->
        <div class="item"><span class="num">17.</span><span class="text">Uso responsable de inteligencia artificial <span class="badge">declaración</span></span></div>

        <!-- 18 -->
        <div class="item"><span class="num">18.</span><span class="text">Estructura sugerida del proyecto <span class="badge">organización</span></span></div>

        <!-- 19 -->
        <div class="item"><span class="num">19.</span><span class="text">Formato sugerido de los datos</span></div>
        <div class="item"><span class="num sub">19.1.</span><span class="text">Archivo de vértices <span class="badge">CSV/JSON</span></span></div>
        <div class="item"><span class="num sub">19.2.</span><span class="text">Archivo de aristas <span class="badge">CSV/JSON</span></span></div>

        <!-- 20–26 -->
        <div class="item"><span class="num">20.</span><span class="text">Producto final esperado <span class="badge">sistema + informe</span></span></div>
        <div class="item"><span class="num">21.</span><span class="text">Estructura del informe <span class="badge">guía</span></span></div>
        <div class="item"><span class="num">22.</span><span class="text">Defensa y demostración <span class="badge">presentación</span></span></div>
        <div class="item"><span class="num">23.</span><span class="text">Preguntas orientadoras para el análisis <span class="badge">reflexión</span></span></div>
        <div class="item"><span class="num">24.</span><span class="text">Conclusión esperada <span class="badge">cierre</span></span></div>
        <div class="item"><span class="num">25.</span><span class="text">Criterios de aprobación <span class="badge">evaluación</span></span></div>
        <div class="item"><span class="num">26.</span><span class="text">Referencias bibliográficas sugeridas <span class="badge">bibliografía</span></span></div>

        <!-- detalle adicional: parte I, II, III, IV -->
        <div style="margin-top: 1.2rem; border-top: 2px solid #d0e3ea; padding-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.4rem 1.2rem;">
            <span style="background: #dcecf2; padding: 0.1rem 1.2rem; border-radius: 30px; font-size:0.8rem; font-weight:500; color:#144753;">📌 Parte I: Investigación</span>
            <span style="background: #dcecf2; padding: 0.1rem 1.2rem; border-radius: 30px; font-size:0.8rem; font-weight:500; color:#144753;">📌 Parte II: Construcción del grafo</span>
            <span style="background: #dcecf2; padding: 0.1rem 1.2rem; border-radius: 30px; font-size:0.8rem; font-weight:500; color:#144753;">📌 Parte III: Algoritmos (DFS, BFS, Dijkstra, Kruskal, Prim)</span>
            <span style="background: #dcecf2; padding: 0.1rem 1.2rem; border-radius: 30px; font-size:0.8rem; font-weight:500; color:#144753;">📌 Parte IV: Sistema funcional</span>
        </div>
    </div>

    <div style="margin-top: 1.8rem; display: flex; flex-wrap: wrap; gap: 0.8rem 1.5rem; background: #f0f7fa; padding: 0.8rem 1.5rem; border-radius: 60px;">
        <span style="font-size:0.85rem; color:#1d4d5d;">🔍 <strong>Vértices:</strong> |V| ≥ 10</span>
        <span style="font-size:0.85rem; color:#1d4d5d;">🔗 <strong>Aristas:</strong> |E| ≥ 15</span>
        <span style="font-size:0.85rem; color:#1d4d5d;">⚖️ <strong>Pesos:</strong> w(e) ≥ 0</span>
        <span style="font-size:0.85rem; color:#1d4d5d;">📁 <strong>Formatos:</strong> CSV / JSON</span>
    </div>

    <div class="footer-note">
        📄 Índice completo · Práctica Integradora · Teoría de Grafos · 26 secciones + partes I–IV
    </div>
    <div style="margin-top: 0.8rem; font-size:0.75rem; color:#4a737f; border-top: 1px solid #d7e6ed; padding-top: 0.8rem; text-align: right;">
        <span>Diseño para README · GitHub · </span>
        <span style="background: #d0e2e9; padding:0.1rem 1rem; border-radius: 30px;">v1.0</span>
    </div>
</div>


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

