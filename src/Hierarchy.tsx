import { useEffect, useRef } from "react";
import { HierarchyNode } from "./ResultTypes";
import * as d3 from "d3"

// Copyright 2021-2023 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/tree
function Tree(data: HierarchyNode[], { // data is either tabular (array of objects) or hierarchy (nested objects)
    id = (d: any) => d.reg_num, // if tabular data, given a d in data, returns a unique identifier (string)
    parentId = (d: any) => d.parent_num, // if tabular data, given a node d, returns its parent’s identifier
    tree = d3.tree, // layout algorithm (typically d3.tree or d3.cluster)
    //sort, // how to sort nodes prior to layout (e.g., (a, b) => d3.descending(a.height, b.height))
    label = (d: any) => d.data.names ? d.data.names.join(' & ') : d.data.business_name, // given a node d, returns the display name
    title = (d: HierarchyNode) => d.business_name, // given a node d, returns its hover text
    //link, // given a node d, its link (if any)
    //linkTarget = "_blank", // the target attribute for links (if any)
    width = 1200, // outer width, in pixels
    height = 1000, // outer height, in pixels
    r = 3, // radius of nodes
    padding = 1, // horizontal padding for first and last column
    fill = "#000", // fill for nodes
    //fillOpacity, // fill opacity for nodes
    stroke = "#885", // stroke for links
    strokeWidth = 4, // stroke width for links
    strokeOpacity = 0.4, // stroke opacity for links
    strokeLinejoin = null, // stroke line join for links
    strokeLinecap = null, // stroke line cap for links
    halo = "#fff", // color of label halo 
    haloWidth = 0, // padding around the labels
    curve = d3.curveBumpX, // curve for the link
    margin = 0,
  } = {}) {
  
    // If id and parentId options are specified, or the path option, use d3.stratify
    // to convert tabular data to a hierarchy; otherwise we assume that the data is
    // specified as an object {children} with nested objects (a.k.a. the “flare.json”
    // format), and use d3.hierarchy.
    const root = d3.stratify().id(id as any).parentId(parentId as any)(data)
  
    // Sort the nodes.
    //if (sort != null) root.sort(sort);
  
    // Compute labels and titles.
    const descendants = root.descendants();
    const L = descendants.map(d => label(d as any));
  
    // Compute the layout.
    const dx = 13;
    const dy = height / (root.height + padding);
    tree().nodeSize([dx * .85, dy])(root);
  
    // Center the tree.
    let y0 = Infinity;
    let y1 = -y0;
    root.each((d: any) => {
      if (d.y > y1) y1 = d.y;
      if (d.y < y0) y0 = d.y;
    });
  
    // Compute the default height.
    if (height === undefined) height = y1 - y0 + dx * 2;
  
    // Use the required curve
    if (typeof curve !== "function") throw new Error(`Unsupported curve`);
  
    const svg = d3.create("svg")
        .attr("viewBox", [-dy - 300, y0 - dx, width, height])
        .attr("width", '100%')
        .attr("height", '100%')
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
  
    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", stroke)
        .attr("stroke-opacity", strokeOpacity)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-width", strokeWidth)
        .attr('transform', `translate(${margin} ${margin})`)
      .selectAll("path")
        .data(root.links())
        .join("path")
          .attr("d", d3.linkVertical()
              .x((d: any) => {
                console.log(d)
                return d.x * 3
              })
              .y((d: any) => d.y + d.x * 2.0) as any);
  
    const node = svg.append("g")
      .selectAll("a")
      .data(root.descendants())
      .join("a")
        // .attr("xlink:href", link == null ? null : d => link(d.data, d))
        // .attr("target", link == null ? null : linkTarget)
        .attr("transform", (d: any) => `translate(${d.x * 3},${d.y + d.x * 2.0})`);
  
    node.append("circle")
        .attr("fill", d => d.children ? stroke : fill)
        .attr("r", r);
  
    if (title != null) node.append("title")
        .text(d => title(d as any));
  
    if (L) node.append("rect")
        .attr("dy", "0.32em")
        .attr("x", d => !d.parent ? -150 : -50)
        .attr("y", d => !d.parent ? -15 : -10)
        .attr("width", d => !d.parent ? 400 : (d.data as any).business_name.length * 8)
        .attr("height", d => !d.parent ? 30 : 20)
        .attr("fill", d => !d.parent ? "#ECD803" : ((d.data as any).current ? "#FFF" : "#a5c149"))

    if (L) node.append("text")
        .attr("dy", "0.32em")
        .attr("x", d => !d.parent ? -150 : -45)
        .attr("text-anchor", "start")
        .attr("paint-order", "stroke")
        .attr("stroke", halo)
        .attr("stroke-width", haloWidth)
        .attr("class", d => !d.parent ? "top-business-node" : "business-node")
        .text((d, i) => L[i]);



    return svg.node();
  }

export function Hierarchy({hierarchyNodes}: {hierarchyNodes: Array<HierarchyNode>}) {
    const svg = useRef(null as any);
    let generated = false
    useEffect(()=>{
        if (generated) return
        generated = true
        if(svg.current){
            svg.current.appendChild(Tree(hierarchyNodes))
        } 
    }, []);
    console.log(hierarchyNodes)
    return (
        <div ref={svg} className="hierarchy"/>
    );
}
