import { ElementDataEnvelope } from "./types";

const queue: ElementDataEnvelope[] = [];

export function add(data: ElementDataEnvelope) {
  queue.push(data);
}

export function get() {
  return queue;
}

export function pullChunk(size: number) {
  return queue.splice(0, size);
}

export function clear() {
  queue.length = 0;
}

export function size() {
  return queue.length;
}

export function isEmpty() {
  return queue.length === 0;
}
