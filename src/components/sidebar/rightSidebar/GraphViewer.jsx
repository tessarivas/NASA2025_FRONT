import React, { useEffect, useRef, memo } from "react";
import * as d3 from "d3";

// Datos de fallback si no se proporcionan datos
const defaultGraphData = {
  nodes: [
    { id: "A1", name: "Microgravity Effects", group: "Microgravity" },
    { id: "A2", name: "Plant Growth", group: "Microgravity" },
    { id: "A3", name: "Bone Density Loss", group: "Microgravity" },
    { id: "B1", name: "Radiation Damage", group: "Radiation" },
    { id: "B2", name: "DNA Repair", group: "Radiation" },
    { id: "B3", name: "Cosmic Ray Shield", group: "Radiation" },
    { id: "C1", name: "Photosynthesis", group: "Agriculture" },
    { id: "C2", name: "LED Systems", group: "Agriculture" },
    { id: "C3", name: "Oxygen Production", group: "Agriculture" },
    { id: "D1", name: "Water Recycling", group: "LifeSupport" },
    { id: "D2", name: "Air Purification", group: "LifeSupport" },
  ],
  links: [
    { source: "A1", target: "A2", value: 2 },
    { source: "A2", target: "A3", value: 2 },
    { source: "B1", target: "B2", value: 2 },
    { source: "B2", target: "B3", value: 2 },
    { source: "C1", target: "C2", value: 2 },
    { source: "C2", target: "C3", value: 2 },
    { source: "D1", target: "D2", value: 2 },
    { source: "A1", target: "C1", value: 1 },
    { source: "B1", target: "D1", value: 1 },
    { source: "C3", target: "D2", value: 1 },
  ],
};

const GraphViewer = memo(function GraphViewer({ graphData = null }) {
  const containerRef = useRef(null);

  // Función para validar y limpiar datos del grafo
  const validateGraphData = (data) => {
    if (!data || !data.nodes || !data.links) {
      console.warn('GraphViewer - Datos de grafo inválidos:', data);
      return null;
    }

    // Si los arrays están vacíos, retornar null para usar datos por defecto
    if (data.nodes.length === 0 || data.links.length === 0) {
      console.warn('GraphViewer - Datos de grafo vacíos');
      return null;
    }

    // Crear un Set de IDs de nodos para búsqueda rápida
    const nodeIds = new Set(data.nodes.map(node => node.id));
    
    // Filtrar links que referencien nodos inexistentes
    const validLinks = data.links.filter(link => {
      const sourceExists = nodeIds.has(link.source);
      const targetExists = nodeIds.has(link.target);
      
      if (!sourceExists) {
        console.warn(`GraphViewer - Nodo source no encontrado: ${link.source}`);
      }
      if (!targetExists) {
        console.warn(`GraphViewer - Nodo target no encontrado: ${link.target}`);
      }
      
      return sourceExists && targetExists;
    });

    // Validar que los nodos tengan las propiedades requeridas
    const validNodes = data.nodes.filter(node => {
      if (!node.id || !node.name || !node.group) {
        console.warn('GraphViewer - Nodo inválido:', node);
        return false;
      }
      return true;
    });

    // Verificar conectividad y arreglar nodos aislados
    const connectedNodeIds = new Set();
    validLinks.forEach(link => {
      connectedNodeIds.add(link.source);
      connectedNodeIds.add(link.target);
    });
    
    const isolatedNodes = validNodes.filter(node => !connectedNodeIds.has(node.id));
    
    if (isolatedNodes.length > 0) {
      console.warn('GraphViewer - Nodos aislados encontrados:', isolatedNodes.map(n => n.id));
      
      // Conectar nodos aislados al nodo más relacionado (por grupo)
      isolatedNodes.forEach(isolatedNode => {
        const sameGroupNodes = validNodes.filter(n => 
          n.group === isolatedNode.group && n.id !== isolatedNode.id && connectedNodeIds.has(n.id)
        );
        
        if (sameGroupNodes.length > 0) {
          // Conectar al primer nodo del mismo grupo
          validLinks.push({
            source: isolatedNode.id,
            target: sameGroupNodes[0].id,
            value: 1
          });
          console.log(`GraphViewer - Conectado nodo aislado ${isolatedNode.id} a ${sameGroupNodes[0].id}`);
        } else if (validNodes.length > 1) {
          // Si no hay nodos del mismo grupo, conectar al primer nodo disponible
          const firstConnectedNode = Array.from(connectedNodeIds)[0];
          if (firstConnectedNode) {
            validLinks.push({
              source: isolatedNode.id,
              target: firstConnectedNode,
              value: 1
            });
            console.log(`GraphViewer - Conectado nodo aislado ${isolatedNode.id} a ${firstConnectedNode}`);
          }
        }
      });
    }

    // Si después de validar no quedan nodos o links, retornar null
    if (validNodes.length === 0 || validLinks.length === 0) {
      console.warn('GraphViewer - No hay datos válidos después de la validación');
      return null;
    }

    return {
      nodes: validNodes,
      links: validLinks
    };
  };

  useEffect(() => {
    // Usar datos proporcionados o datos por defecto, con validación
    const validatedData = graphData ? validateGraphData(graphData) : null;
    const currentGraphData = validatedData || defaultGraphData;

    if (!containerRef.current) {
      return;
    }
    
    // Limpiar contenedor
    d3.select(containerRef.current).selectAll("*").remove();

    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    // Obtener grupos únicos dinámicamente
    const uniqueGroups = [...new Set(currentGraphData.nodes.map(node => node.group))];

    // Colores personalizados por categoría (expandible dinámicamente)
    const colorPalette = ["#00B8EB", "#FF6B35", "#00D4AA", "#F63564", "#9B59B6", "#E67E22"];
    const colorScale = d3.scaleOrdinal()
      .domain(uniqueGroups)
      .range(colorPalette.slice(0, uniqueGroups.length));

    // Copiar datos para no mutar los originales
    const links = currentGraphData.links.map((d) => ({ ...d }));
    const nodes = currentGraphData.nodes.map((d) => ({ ...d }));

    try {
      // Crear simulación de fuerzas - ajustada para espacio pequeño con menos interconexión
      const simulation = d3
        .forceSimulation(nodes)
        .force("link", d3.forceLink(links).id((d) => d.id).distance(60)) // Aumentado de 40 a 60
        .force("charge", d3.forceManyBody().strength(-100)) // Reducido de -150 a -100
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(15))
        .force("bounds", () => {
          // Fuerza para mantener nodos dentro de los límites
          for (let node of nodes) {
            node.x = Math.max(15, Math.min(width - 15, node.x));
            node.y = Math.max(15, Math.min(height - 15, node.y));
          }
        });

    // Crear SVG
    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background", "transparent")
      .on("click", function(event) {
        // Cerrar tooltip al hacer click en el fondo
        if (event.target === this) {
          d3.select(containerRef.current).select(".graph-tooltip").style("visibility", "hidden");
        }
      });

    // Crear gradientes para los nodos dinámicamente
    const defs = svg.append("defs");

    uniqueGroups.forEach((group) => {
      const gradient = defs
        .append("radialGradient")
        .attr("id", `mini-gradient-${group.replace(/\s+/g, '-')}`)
        .attr("cx", "30%")
        .attr("cy", "30%");

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d3.color(colorScale(group)).brighter(0.3));

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorScale(group));
    });

    // Crear enlaces
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(255, 255, 255, 0.3)")
      .attr("stroke-width", (d) => Math.sqrt(d.value || 1))
      .attr("stroke-opacity", 0.6);

    // Crear nodos con tamaño variable (centro más grande)
    const centerX = width / 2;
    const centerY = height / 2;
    
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => {
        // Calcular distancia del centro para hacer el nodo central más grande
        const distance = Math.sqrt(Math.pow(d.x - centerX, 2) + Math.pow(d.y - centerY, 2));
        return distance < 50 ? 8 : 6; // Nodo central más grande
      })
      .attr("fill", (d) => `url(#mini-gradient-${d.group.replace(/\s+/g, '-')})`)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .style("cursor", "pointer");

    // Crear etiquetas de nodos (ocultas por defecto)
    const labels = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.name)
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("dy", "-12px")
      .attr("font-family", "var(--font-space-mono)")
      .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.8)")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Crear etiquetas de grupos (más pequeñas)
    const groupLabels = svg
      .append("g")
      .selectAll("text")
      .data(d3.groups(nodes, (d) => d.group))
      .join("text")
      .text((d) => d[0])
      .attr("font-size", "11px")
      .attr("font-weight", "bold")
      .attr("fill", (d) => colorScale(d[0]))
      .attr("text-anchor", "middle")
      .attr("font-family", "var(--font-zen-dots)")
      .style("text-shadow", "1px 1px 3px rgba(0,0,0,0.8)")
      .style("pointer-events", "none")
      .style("opacity", 0.8);

    // Interacciones (código igual que antes)
    node
      .on("mouseenter", function (event, d) {
        d3.select(this).transition().duration(150).attr("r", 9).attr("stroke-width", 2);
        labels.filter((label) => label.id === d.id).transition().duration(150).style("opacity", 1);
        
        link.transition().duration(150)
          .attr("stroke-opacity", (l) => l.source.id === d.id || l.target.id === d.id ? 0.8 : 0.2)
          .attr("stroke-width", (l) => l.source.id === d.id || l.target.id === d.id ? Math.sqrt(l.value || 1) * 2 : Math.sqrt(l.value || 1));

        node.transition().duration(150).style("opacity", (n) => {
          if (n.id === d.id) return 1;
          const connected = links.some((l) => (l.source.id === d.id && l.target.id === n.id) || (l.target.id === d.id && l.source.id === n.id));
          return connected ? 1 : 0.3;
        });
      })
      .on("mouseleave", function (event, d) {
        d3.select(this).transition().duration(150).attr("r", 6).attr("stroke-width", 1);
        labels.filter((label) => label.id === d.id).transition().duration(150).style("opacity", 0);
        link.transition().duration(150).attr("stroke-opacity", 0.6).attr("stroke-width", (d) => Math.sqrt(d.value || 1));
        node.transition().duration(150).style("opacity", 1);
      })
      .on("click", function (event) {
        event.stopPropagation();
        // Click functionality removed - details only available in full graph view
      });

    // Drag behavior
    const drag = d3.drag()
      .on("start", function (event, d) {
        if (!event.active) simulation.alphaTarget(0.1).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", function (event, d) {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", function (event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag);

    // Función tick
    simulation.on("tick", () => {
      nodes.forEach((d) => {
        d.x = Math.max(15, Math.min(width - 15, d.x));
        d.y = Math.max(15, Math.min(height - 15, d.y));
      });

      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      labels.attr("x", (d) => d.x).attr("y", (d) => d.y - 12);

      groupLabels
        .attr("x", (d) => d3.mean(d[1], (node) => node.x))
        .attr("y", (d) => d3.mean(d[1], (node) => node.y) - 25);
    });

    setTimeout(() => {
      simulation.alphaTarget(0).restart();
    }, 3000);

    return () => {
      simulation.stop();
    };
    
    } catch (error) {
      console.error('GraphViewer - Error al crear el grafo:', error);
      console.error('GraphViewer - Datos que causaron el error:', currentGraphData);
      
      // Mostrar mensaje de error en el contenedor
      d3.select(containerRef.current)
        .append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("justify-content", "center")
        .style("height", "100%")
        .style("color", "#ff6b6b")
        .style("font-family", "monospace")
        .style("font-size", "12px")
        .style("text-align", "center")
        .html("Error loading graph<br/>Check console for details");
    }
  }, [graphData]); // Changed to depend on graphData directly

  return (
    <div className="w-full h-[300px] bg-black/60 rounded-xl p-2 relative border border-white/20 overflow-hidden">
      <div ref={containerRef} className="w-full h-full relative" />
    </div>
  );
});

export default GraphViewer;
