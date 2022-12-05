import Dungeon from "@mikewesthad/dungeon";
import React, { useState } from "react";

export default function (w, h) {
  return getMappedTiles(make(w, h));
}

export const make = (width = 30, height = 30) =>
  new Dungeon({
    width,
    height,
    doorPadding: 1, // Experimental, minimum number of tiles between a door and a room corner (>= 1)
    randomSeed: (Math.random() * 100) | 0, // Leave undefined if you don't want to control the seed
    rooms: {
      width: {
        min: 3,
        max: 9,
        onlyOdd: true, // Or onlyEven: true
      },
      height: {
        min: 3,
        max: 9,
        onlyOdd: true, // Or onlyEven: true
      },
      maxArea: 150,
      maxRooms: 50,
    },
  });

// Get a 2D array of tiles where each tile type is remapped to a custom value. Useful if you are
// using this in a tilemap, or if you want to map the tiles to something else, e.g. this is used
// internally to convert a dungeon to an HTML string.
export const getMappedTiles = (dungeon) =>
  dungeon.getMappedTiles({
    floor: 0,
    door: 0,
    wall: 1,
    empty: 1,
  });

// Helper method for debugging by dumping the map into an HTML fragment (<pre><table>)
export const drawToHtml = (dungeon) => {
  const html = dungeon.drawToHtml({
    empty: " ",
    emptyAttributes: { class: "dungeon__empty", style: "color: rgb(0, 0, 0)" },
    wall: "#",
    wallAttributes: { class: "dungeon__wall", style: "color: rgb(255, 0, 0)" },
    floor: "0",
    floorAttributes: {
      class: "dungeon__floor",
      style: "color: rgb(210, 210, 210)",
    },
    door: "x",
    doorAttributes: { class: "dungeon__door", style: "color: rgb(0, 0, 255)" },
    containerAttributes: { class: "dungeon", style: "font-size: 15px" },
  });

  let rootElement = document.createElement("div");
  rootElement.appendChild(html);
  return <div dangerouslySetInnerHTML={{ __html: rootElement.innerHTML }} />;
};

//dungeon.rooms; // Array of Room instances
//dungeon.tiles; // 2D array of tile IDs - see Tile.js for types
