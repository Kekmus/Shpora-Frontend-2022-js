/**
 * Напиши здесь логику, которая будет решать, куда пойти пакману!
 *
 * @typedef {Object} Point - координаты на карте
 * @property {number} x
 * @property {number} y
 *
 * @typedef {Object} Pickup - Объект "еды", которую можно подбирать или "есть"
 * @property {'pacdot' | 'powerPellet'} type - тип еды
 * @property {Point} position - положение объекта на карте
 * @property {boolean} taken - флаг, был ли объект поднят или "съеден"
 *
 * @typedef {Object} Pacman - Объект пакмана
 * @property {'pacman'} type - тип пакман
 * @property {Point} position - положение пакмана на карте
 *
 * @typedef {Object} Ghost - Объект призрака
 * @property {'ghost'} type - тип призрака
 * @property {Point} position - положение призрака на карте
 *
 * @typedef {Pickup | Pacman | Ghost} Entity - одна из игровых сущностей
 *
 * @param {Entity[]} entities - Массив сущностей на игровой карте
 * @param {string[][]} maze - Начальное состояние игрового лабиринта, где каждое значение это:
 * - 'X' — стена лабиринта
 * - 'o' — еда или "точки", за подбор которых начисляются очки
 * - ' ' — свободное пространство в лабиринте
 * @return {'up' | 'down' | 'left' | 'right'} направление, в которое надо пойти пакману
 */

function GetNeighbors(maze, x, y, ans) {
  if (y > 0 && maze[y - 1][x] != "X") {
    ans.push(PointToId({ x: x, y: y - 1 }));
  }
  if (y == 0 && maze[maze.length - 1][x] != "X") {
    ans.push(PointToId({ x: x, y: maze.length - 1 }));
  }
  if (x > 0 && maze[y][x - 1] != "X") {
    ans.push(PointToId({ x: x - 1, y: y }));
  }
  if (x == 0 && maze[y][maze[y].length - 1] != "X") {
    ans.push(PointToId({ x: maze[y].length - 1, y: y }));
  }
  if (y < maze.length - 1 && maze[y + 1][x] != "X") {
    ans.push(PointToId({ x: x, y: y + 1 }));
  }
  if (y == maze.length - 1 && maze[0][x] != "X") {
    ans.push(PointToId({ x: x, y: 0 }));
  }
  if (x < maze[y].length - 1 && maze[y][x + 1] != "X") {
    ans.push(PointToId({ x: x + 1, y: y }));
  }
  if (x == maze[y].length - 1 && maze[y][0] != "X") {
    ans.push(PointToId({ x: 0, y: y }));
  }
}

function CreatelRelatedMap(maze, path) {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      let elem = maze[y][x];
      if (elem != "X") {
        let ans = [];
        GetNeighbors(maze, x, y, ans);
        path.set(PointToId({ x: x, y: y }), ans);
      }
    }
  }
}

function PickDirection(startpoint, endpoint, mazeWidth, mazeheight) {
  if (typeof startpoint == "number") {
    startpoint = IdToPoint(startpoint);
  }
  if (typeof endpoint == "number") {
    endpoint = IdToPoint(endpoint);
  }
  let xDifference = endpoint.x - startpoint.x;
  let yDifference = endpoint.y - startpoint.y;
  // console.log(xDifference, yDifference, mazeWidth, mazeheight);
  switch (xDifference) {
    case 1:
      return "right";
    case -1:
      return "left";
    case mazeWidth:
      return "left";
    case -1 * mazeWidth:
      return "right";
  }
  switch (yDifference) {
    case 1:
      return "down";
    case -1:
      return "up";
    case mazeheight:
      return "up";
    case -1 * mazeheight:
      return "down";
  }
  throw new Error("Точки не соседи");
}

function GetReverseDirection(direction) {
  switch (direction) {
    case "up":
      return "down";
    case "down":
      return "up";
    case "left":
      return "right";
    case "right":
      return "left";
    default:
      throw Error("Unknown direction");
  }
}

function IdToPoint(id) {
  let x = 0;
  if (id >= 1000) {
    x = Math.floor(id / 1000);
  }
  let y = id % 1000;
  return { x: x, y: y };
}

function PointToId(point) {
  let x = point.x;
  let y = point.y;
  let number = x * 1000 + y;
  return number;
}

function dfs(NeighborsMap, v, visited, path, mazeWidth, mazeheight) {
  if (visited.has(v)) return false;
  visited.add(v);
  for (let neighbor of NeighborsMap.get(v)) {
    if (!visited.has(neighbor)) {
      path.push(PickDirection(v, neighbor, mazeWidth, mazeheight));
      let reached = dfs(
        NeighborsMap,
        neighbor,
        visited,
        path,
        mazeWidth,
        mazeheight
      );
      path.push(PickDirection(neighbor, v, mazeWidth, mazeheight));
      if (reached) return true;
    }
  }
}

function AddGhostwall(entities, maze) {
  for (const entitie of entities) {
    if (entitie.type === "ghost") {
      let x = entitie.position.x;
      let y = entitie.position.y;
      maze[y][x] = "X";
    }
    if (entitie.type === "pacdot") {
      break;
    }
  }
}

// function NextPosToWall(entities, nextPosDirection, maze) {
//     let nexPos = GetNextPos(entities, nextPosDirection);
//     nexPos = IdToPoint(nexPos);
//     let x = nexPos.x;
//     let y = nexPos.y;
//     maze[y][x] = "X";
//     kek.push(nexPos);
// }

// function PosToNoWall(position, maze) {
//     let x = position.x;
//     let y = position.y;
//     maze[y][x] = " ";
//     kek.shift()
// }

function CreatePath(entities, maze, path, NeighborsMap) {
  let visited = new Set();
  CreatelRelatedMap(maze, NeighborsMap);
  let start = PointToId(entities[0].position);
  dfs(NeighborsMap, start, visited, path, maze[0].length - 1, maze.length - 1);
}

function IsNeighbor(point1, point2, NeighborsMap) {
  if (typeof point1 != "number") {
    point1 = PointToId(point1);
  }
  if (typeof point2 != "number") {
    point2 = PointToId(point2);
  }
  return NeighborsMap.get(point2).includes(point1);
}

function GetSetOfDangerousPositions(entities) {
  let dangerPositions = new Set();
  for (const entitie of entities) {
    if (entitie.type === "pacdot" || entitie.type === "powerPellet") {
      break;
    }
    if (entitie.type == "ghost") {
        // console.log(entitie);
        // console.log(PointToId(entitie.position));
        // console.log(NeighborsMap.get(PointToId(entitie.position)));
      let dangerPosPerOneGhost = NeighborsMap.get(PointToId(entitie.position));
      if (dangerPosPerOneGhost) {
        dangerPositions = new Set([...dangerPositions, ...dangerPosPerOneGhost]);
      }
    }
  }
  return dangerPositions;
}

function GetNextPos(entities, direction) {
  let pacmanPosition = entities[0].position;
  switch (direction) {
    case "left":
      return PointToId({ x: pacmanPosition.x - 1, y: pacmanPosition.y });
    case "right":
      return PointToId({ x: pacmanPosition.x + 1, y: pacmanPosition.y });
    case "up":
      return PointToId({ x: pacmanPosition.x, y: pacmanPosition.y - 1 });
    case "down":
      return PointToId({ x: pacmanPosition.x, y: pacmanPosition.y + 1 });
    default:
      throw Error("unknown pos");
  }
}

function IsNextPosDangerous(entities, nextPosDirection) {
  let dangerPositions = GetSetOfDangerousPositions(entities);
  let nexPos = GetNextPos(entities, nextPosDirection);
  if (dangerPositions.has(nexPos)) {
    return true;
  }
  return false;
}

let NeighborsMap = new Map();
let path = [];
let i = 0;
function pacmanDirectionHandler(entities, maze) {
  // console.log(maze);
  console.log(entities);
  if (path.length == 0) {
    AddGhostwall(entities, maze);
    CreatePath(entities, maze, path, NeighborsMap);
  }
//   if (IsNextPosDangerous(entities, path[i])) {
//     console.log("DANGER!!!!!!!!")
//     i--;
//     return GetReverseDirection(path[i]);
//   }
  return path[i++];
}

export default pacmanDirectionHandler;
