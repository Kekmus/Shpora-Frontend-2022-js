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
  path.clear();
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

function PickDirection(startpoint, endpoint) {
  if (typeof startpoint == "number") {
    startpoint = IdToPoint(startpoint);
  }
  if (typeof endpoint == "number") {
    endpoint = IdToPoint(endpoint);
  }
  let xDifference = endpoint.x - startpoint.x;
  let yDifference = endpoint.y - startpoint.y;
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
  if(typeof id === 'object') return id;
  let x = 0;
  if (id >= 1000) {
    x = Math.floor(id / 1000);
  }
  let y = id % 1000;
  return { x: x, y: y };
}

function PointToId(point) {
  if (typeof point === 'number') return point;
  let x = point.x;
  let y = point.y;
  x = (x === -1 ? mazeWidth : x);
  y = (y === -1 ? mazeheight : y);
  x = (x === mazeWidth+1 ? 0 : x);
  y = (y === mazeheight+1 ? 0 : y);
  let number = x * 1000 + y;
  return number;
}



function dfs(NeighborsMap, v, visited, path) {
  if (visited.has(v)) return false;
  visited.add(v);
  for (let neighbor of NeighborsMap.get(v)) {
    let IsFoodEaten = isFoodEaten.get(neighbor);
    if (!visited.has(neighbor) && !isFoodEaten.get(neighbor)) {
      path.push(PickDirection(v, neighbor));
      let reached = dfs(
        NeighborsMap,
        neighbor,
        visited,
        path,
        mazeWidth,
        mazeheight
      );
      path.push(PickDirection(neighbor, v));
      if (reached) return true;
    }
  }
}

function bfs(NeighborsMap, s, path) {
  let visited = new Set();
  let  previous = new Map();
	let queue = [];
	queue.push(s);
  visited.add(s);
  previous.set(s, -1);
	while(queue.length > 0) {
		let v = queue.shift()
		for(let neighbor of NeighborsMap.get(v)) {
			if(!visited.has(neighbor)) {
				queue.push(neighbor);
        previous.set(neighbor, v);
				visited.add(neighbor);
				if(IsFoodEaten(neighbor)) {
          path.push(...FindBackWay(neighbor, previous));
          return neighbor;
        }
			}
		} 
	}
	return false
}

function FindBackWay(point, previous) {
  let ans = [];
  while (previous.get(point) != -1) {
    ans.push(PickDirection(point, previous.get(point), mazeWidth, mazeheight));
    point = previous.get(point);
  }
  ans = ans.map(x => GetReverseDirection(x)).reverse();
  return ans;
}

function IsFoodEaten(point) {
  if (isFoodEaten.get(point)) return false;
  return true;
}

function CreatePath(entities, maze, path, NeighborsMap) {
  let visited = new Set();
  let start = PointToId(entities[0].position);
  start = bfs(NeighborsMap, start, path);
  dfs(NeighborsMap, start, visited, path);
}



function IsNextPosDangerous(entities, nextPosDirection) {
  let dangerPositions = GetSetOfDangerousPositions(entities);
  let nexPos = GetNextPos(entities, nextPosDirection);
  if (dangerPositions.has(nexPos)) {
    return true;
  }
  return false;
}

function GetSetOfDangerousPositions(entities) {
  let dangerPositions = new Set();
  for (const entitie of entities) {
    if (entitie.type === "pacdot" || entitie.type === "powerPellet") {
      break;
    }
    if (entitie.type == "ghost") {
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



function CreateFoodMap(entities, isFoodEaten) {
  for (const entitie of entities) {
    if (entitie.type === 'pacdot' || entitie.type === 'powerPellet') {
      isFoodEaten.set(PointToId(entitie.position), false)
    }
  }
}

function MarkFoodIsEaten(entities, position = entities[0].position) {
  const pacmanId = PointToId(position);
  if (isFoodEaten.has(pacmanId)){
    isFoodEaten.set(pacmanId, true);
  }
}



function GetRetreatDirection (entities, maze) {
  let nextPosDirection;
  if (i === 0) {
    CreatePath(entities, maze, path, NeighborsMap);
    nextPosDirection= path[i];
  } else {
    i--;
    nextPosDirection = GetReverseDirection(path[i]);
  }
  if (!IsNextPosDangerous(entities, nextPosDirection)) return nextPosDirection;
  path.length = 0;
  i = 0;
  isDangerBeforeThisStep = false;
  const temp = new Map(NeighborsMap);
  WallDangerZone(entities, maze, nextPosDirection)
  CreatelRelatedMap(maze, NeighborsMap);
  CreatePath(entities, maze, path, NeighborsMap);
  NeighborsMap = temp;
  UnwallDangerZone(entities, maze, nextPosDirection)
  return path[i++];
}



function WallDangerZone(entities, maze, nextPosDirection) {
  NextPosToWall(entities, nextPosDirection, maze);
  AddGhostWall(entities, maze)
  DangerousPositionsToWall(entities, maze)
}

function NextPosToWall(entities, nextPosDirection, maze) {
  const nexPos = GetNextPos(entities, nextPosDirection);
  PosToWall(nexPos, maze, entities);
}

function AddGhostWall(entities, maze) {
  for (const entitie of entities) {
    if (entitie.type === "ghost") {
      PosToWall(entitie.position, maze, entities)
    }
    if (entitie.type === "pacdot") {
      break;
    }
  }
}

function DangerousPositionsToWall(entities, maze) {
  const dangerPositions = GetSetOfDangerousPositions(entities);
  for(const position of dangerPositions) {
    PosToWall(position, maze, entities);
  }
}

function PosToWall (pos, maze, entities) {
  pos = IdToPoint(pos);
  const x = pos.x;
  const y = pos.y;
  if(x != entities[0].position.x || y != entities[0].position.y) maze[y][x] = "X";
}




function UnwallDangerZone(entities, maze, nextPosDirection) {
  DangerousPositionsToUnwall(entities, maze)
  AddGhostUnwall(entities, maze)
  NextPosToUnwall(entities, nextPosDirection, maze);
}

function NextPosToUnwall(entities, nextPosDirection, maze) {
  const nexPos = GetNextPos(entities, nextPosDirection);
  PosToUnwall(nexPos, maze);
}

function AddGhostUnwall(entities, maze) {
  for (const entitie of entities) {
    if (entitie.type === "ghost") {
      PosToUnwall(entitie.position, maze)
    }
    if (entitie.type === "pacdot") {
      break;
    }
  }
}

function DangerousPositionsToUnwall(entities, maze) {
  const dangerPositions = GetSetOfDangerousPositions(entities);
  for(const position of dangerPositions) {
    PosToUnwall(position, maze);
  }
}

function PosToUnwall (pos, maze) {
  pos = IdToPoint(pos);
  const x = pos.x;
  const y = pos.y;
  maze[y][x] = " ";
}


let NeighborsMap = new Map();
let isFoodEaten = new Map();
let path = [];
let i = 0;
let isDangerBeforeThisStep = false;
let countStepsAfterStart = 0;
let mazeWidth = -1;
let mazeheight = -1;

function pacmanDirectionHandler(entities, maze) {
  countStepsAfterStart++;
  MarkFoodIsEaten(entities)

  if (countStepsAfterStart === 1) {
    mazeWidth = maze[0].length - 1;
    mazeheight = maze.length - 1;
    CreateFoodMap(entities, isFoodEaten);
    CreatelRelatedMap(maze, NeighborsMap);
    CreatePath(entities, maze, path, NeighborsMap);
  }

  if(path.length == i) {
    path.length = 0;
    i = 0;
    CreatePath(entities, maze, path, NeighborsMap);
  }

  if (IsNextPosDangerous(entities, path[i])) {
    isDangerBeforeThisStep = true;
    return GetRetreatDirection(entities, maze);
  }

  if (isDangerBeforeThisStep) {
    path.length = 0;
    i = 0;
    isDangerBeforeThisStep = false;
    CreatePath(entities, maze, path, NeighborsMap);
  }

  return path[i++];
}

export default pacmanDirectionHandler;
