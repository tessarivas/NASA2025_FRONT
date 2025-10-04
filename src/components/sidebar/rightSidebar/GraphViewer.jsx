import React, { useEffect, useRef } from "react";
import Graph from "graphology";
import Sigma from "sigma";

const GraphViewer = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new Graph();

    // Expandir los datos gradualmente
    const nodes = [
      { id: "A1", label: "Microgravity Effects", cluster: "Microgravity" },
      { id: "A2", label: "Plant Growth", cluster: "Microgravity" },
      { id: "A3", label: "Bone Density Loss", cluster: "Microgravity" },
      { id: "B1", label: "Radiation Damage", cluster: "Radiation" },
      { id: "B2", label: "DNA Repair", cluster: "Radiation" },
      { id: "B3", label: "Cosmic Ray Shield", cluster: "Radiation" },
      { id: "C1", label: "Photosynthesis", cluster: "Photosynthesis" },
      { id: "C2", label: "LED Systems", cluster: "Photosynthesis" },
      { id: "C3", label: "Oxygen Production", cluster: "Photosynthesis" },
      { id: "D1", label: "Water Recycling", cluster: "LifeSupport" },
      { id: "D2", label: "Air Purification", cluster: "LifeSupport" },
    ];

    const edges = [
      ["A1", "A2"],
      ["A2", "A3"],
      ["B1", "B2"],
      ["B2", "B3"],
      ["C1", "C2"],
      ["C2", "C3"],
      ["D1", "D2"],
      ["A1", "C1"],
      ["B1", "D1"],
      ["C3", "D2"],
    ];

    const clusterColors = {
      Microgravity: "#00B8EB",
      Radiation: "#FF6B35",
      Photosynthesis: "#00D4AA",
      LifeSupport: "#F63564",
    };

    // Inicializar clusters
    const clusters = {};
    for (const clusterName in clusterColors) {
      clusters[clusterName] = {
        label: clusterName,
        color: clusterColors[clusterName],
        positions: [],
        x: 0,
        y: 0,
      };
    }

    // Agregar nodos con posiciones más controladas para que estén dentro del área visible
    nodes.forEach((n) => {
      // Generar posiciones dentro de un rango más pequeño para evitar que se salgan
      const x = Math.random() * 0.8 + 0.1; // Entre 0.1 y 0.9
      const y = Math.random() * 0.8 + 0.1; // Entre 0.1 y 0.9

      graph.addNode(n.id, {
        label: n.label,
        x: x,
        y: y,
        size: 10,
        color: clusterColors[n.cluster],
        originalColor: clusterColors[n.cluster],
        hovered: false,
      });

      // Guardar posición para calcular centro del cluster
      clusters[n.cluster].positions.push({ x, y });
    });

    // Calcular el baricentro de cada cluster
    for (const clusterName in clusters) {
      const cluster = clusters[clusterName];
      cluster.x = cluster.positions.reduce((acc, p) => acc + p.x, 0) / cluster.positions.length;
      cluster.y = cluster.positions.reduce((acc, p) => acc + p.y, 0) / cluster.positions.length;
    }

    // Agregar aristas
    edges.forEach(([src, tgt]) => {
      graph.addEdge(src, tgt, {
        color: "rgba(255, 255, 255, 0.3)",
        size: 1,
      });
    });

    // Configuración de Sigma
    try {
      const renderer = new Sigma(graph, containerRef.current, {
        renderLabels: false,
        renderEdgeLabels: false,
        defaultNodeColor: "#ffffff",
        defaultEdgeColor: "rgba(255, 255, 255, 0.3)",
      });

      let hoveredNode = null;

      // Crear layer de títulos de clusters DENTRO del contenedor
      const clustersLayer = document.createElement("div");
      clustersLayer.id = "clustersLayer";
      clustersLayer.style.position = "absolute";
      clustersLayer.style.top = "0";
      clustersLayer.style.left = "0";
      clustersLayer.style.width = "100%";
      clustersLayer.style.height = "100%";
      clustersLayer.style.pointerEvents = "none";
      clustersLayer.style.zIndex = "1";
      clustersLayer.style.overflow = "hidden"; // Importante: evita que se salgan

      // Función para actualizar posiciones de títulos
      const updateClusterLabels = () => {
        let clusterLabelsDoms = "";
        for (const clusterName in clusters) {
          const cluster = clusters[clusterName];
          const viewportPos = renderer.graphToViewport({ x: cluster.x, y: cluster.y });

          // Asegurar que las etiquetas estén dentro del contenedor
          const containerRect = containerRef.current.getBoundingClientRect();
          const maxX = containerRect.width - 100; // Espacio para el texto
          const maxY = containerRect.height - 20; // Espacio para el texto

          const clampedX = Math.max(50, Math.min(maxX, viewportPos.x));
          const clampedY = Math.max(20, Math.min(maxY, viewportPos.y));

          clusterLabelsDoms += `
            <div id='cluster-${clusterName}' class="clusterLabel" style="
              position: absolute;
              top: ${clampedY}px;
              left: ${clampedX}px;
              color: ${cluster.color};
              font-weight: bold;
              font-size: 12px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
              pointer-events: none;
              transform: translate(-50%, -50%);
              font-family: var(--font-zen-dots);
              white-space: nowrap;
            ">${cluster.label}</div>
          `;
        }
        clustersLayer.innerHTML = clusterLabelsDoms;
      };

      // Insertar el layer dentro del contenedor
      containerRef.current.style.position = "relative"; // Asegurar posicionamiento relativo
      containerRef.current.appendChild(clustersLayer);

      // Actualizar inicialmente
      updateClusterLabels();

      // Actualizar posiciones en cada render
      renderer.on("afterRender", () => {
        for (const clusterName in clusters) {
          const cluster = clusters[clusterName];
          const clusterLabel = document.getElementById(`cluster-${clusterName}`);
          if (clusterLabel) {
            const viewportPos = renderer.graphToViewport({ x: cluster.x, y: cluster.y });

            // Mantener dentro del contenedor
            const containerRect = containerRef.current.getBoundingClientRect();
            const maxX = containerRef.current.offsetWidth - 100;
            const maxY = containerRef.current.offsetHeight - 20;

            const clampedX = Math.max(50, Math.min(maxX, viewportPos.x));
            const clampedY = Math.max(20, Math.min(maxY, viewportPos.y));

            clusterLabel.style.top = `${clampedY}px`;
            clusterLabel.style.left = `${clampedX}px`;
          }
        }
      });

      // RENDERIZADO MANUAL DE ETIQUETAS DE NODOS
      renderer.setSetting("labelRenderer", (context, data, settings) => {
        const { x, y, size } = data;
        const label = data.label;

        const fontSize = 9; // Reducido para mejor ajuste
        const fontFamily = "Arial";
        const padding = 3;

        context.font = `bold ${fontSize}px ${fontFamily}`;
        const textWidth = context.measureText(label).width;

        if (data.hovered) {
          // HOVER: Fondo negro + texto blanco
          context.fillStyle = "rgba(0, 0, 0, 0.8)";
          context.fillRect(
            x + size + 5,
            y - fontSize / 2 - padding,
            textWidth + padding * 2,
            fontSize + padding * 2
          );
          context.fillStyle = "#ffffff";
        } else {
          // NORMAL: Texto blanco
          context.fillStyle = "#ffffff";
        }

        context.fillText(label, x + size + 5 + padding, y + fontSize / 4);
      });

      // Eventos hover
      renderer.on("enterNode", (event) => {
        const nodeId = event.node;
        hoveredNode = nodeId;

        graph.setNodeAttribute(nodeId, "size", 15);
        graph.setNodeAttribute(nodeId, "hovered", true);

        renderer.refresh();
      });

      renderer.on("leaveNode", (event) => {
        const nodeId = event.node;
        hoveredNode = null;

        graph.setNodeAttribute(nodeId, "size", 10);
        graph.setNodeAttribute(nodeId, "hovered", false);

        renderer.refresh();
      });

      return () => {
        try {
          if (clustersLayer && clustersLayer.parentNode) {
            clustersLayer.parentNode.removeChild(clustersLayer);
          }
          renderer.kill();
        } catch (e) {
          console.log("Error al limpiar renderer:", e);
        }
      };
    } catch (error) {
      console.error("Error creando Sigma:", error);
    }
  }, []);

  return (
    <div className="w-full h-[300px] bg-black/60 rounded-xl p-2 relative border border-white/20 overflow-hidden">
      <div ref={containerRef} className="w-full h-full relative" />
    </div>
  );
};

export default GraphViewer;
