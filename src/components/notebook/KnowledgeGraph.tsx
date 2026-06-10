'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { getSourcesByNotebook, getChunksByNotebook } from '@/lib/db/indexeddb';
import type { GraphNode, GraphEdge } from '@/types';

// ============================================================
// KnowledgeGraph Component — D3 force-directed graph
// ============================================================

interface KnowledgeGraphProps {
  notebookId: string;
}

export function KnowledgeGraph({ notebookId }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const buildGraph = useCallback(async () => {
    if (!svgRef.current || !containerRef.current) return;

    const sources = await getSourcesByNotebook(notebookId);
    const chunks = await getChunksByNotebook(notebookId);

    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Add source nodes
    sources.forEach((source) => {
      nodes.push({
        id: source.id,
        label: source.title,
        type: 'source',
        notebookId,
      });
    });

    // Add chunk nodes (limit to 50 for performance)
    const limitedChunks = chunks.slice(0, 50);
    limitedChunks.forEach((chunk) => {
      nodes.push({
        id: chunk.id,
        label: chunk.content.slice(0, 30) + '...',
        type: 'chunk',
        notebookId,
      });
      edges.push({
        source: chunk.sourceId,
        target: chunk.id,
        label: 'contains',
        weight: 1,
      });
    });

    if (nodes.length === 0) return;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 400;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Color scale
    const colorScale = d3.scaleOrdinal<string, string>()
      .domain(['source', 'note', 'chunk'])
      .range(['#3b82f6', '#10b981', '#8b5cf6']);

    // Size scale
    const sizeScale = d3.scaleOrdinal<string, number>()
      .domain(['source', 'note', 'chunk'])
      .range([12, 10, 6]);

    // Create simulation
    const simulation = d3
      .forceSimulation(nodes as any)
      .force('link', d3.forceLink(edges).id((d: any) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(20));

    // Zoom
    const g = svg.append('g');
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    // Edges
    const link = g
      .append('g')
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke', '#94a3b8')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1);

    // Nodes
    const node = g
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => sizeScale(d.type) ?? 8)
      .attr('fill', (d) => colorScale(d.type) ?? '#94a3b8')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .call(
        d3.drag<SVGCircleElement, GraphNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }) as any
      );

    // Labels
    const label = g
      .append('g')
      .selectAll('text')
      .data(nodes.filter((d) => d.type === 'source'))
      .join('text')
      .text((d) => d.label)
      .attr('font-size', '11px')
      .attr('fill', '#64748b')
      .attr('dx', 16)
      .attr('dy', 4);

    // Tooltip
    node.on('mouseover', function (event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', (sizeScale(d.type) ?? 8) + 3);

      const tooltip = g
        .append('foreignObject')
        .attr('x', event.x + 10)
        .attr('y', event.y - 10)
        .attr('width', 200)
        .attr('height', 60);

      tooltip
        .append('xhtml:div')
        .style('background', 'rgba(0,0,0,0.8)')
        .style('color', 'white')
        .style('padding', '6px 10px')
        .style('border-radius', '6px')
        .style('font-size', '12px')
        .style('max-width', '200px')
        .style('overflow', 'hidden')
        .style('text-overflow', 'ellipsis')
        .html(
          d.type === 'source'
            ? `<strong>${d.label}</strong><br/>来源文档`
            : `<strong>分块</strong><br/>${d.label}`
        );
    }).on('mouseout', function (event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', sizeScale(d.type) ?? 8);
      g.selectAll('foreignObject').remove();
    });

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
      label.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [notebookId]);

  useEffect(() => {
    buildGraph();

    const handleResize = () => buildGraph();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [buildGraph]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px]">
      {svgRef.current === null && (
        <p className="text-sm text-surface-400 text-center py-8">正在加载知识图谱...</p>
      )}
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
