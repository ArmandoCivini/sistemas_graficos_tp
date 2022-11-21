export function indexBufferBuilder(gl, rows, cols) {
  const index = [];

  for (let i = 0; i < rows - 1; i++) {
    index.push(i * cols);
    for (let j = 0; j < cols - 1; j++) {
      index.push(i * cols + j);
      index.push((i + 1) * cols + j);
      index.push(i * cols + j + 1);
      index.push((i + 1) * cols + j + 1);
    }
    index.push((i + 1) * cols + cols - 1);
  }

  const trianglesIndexBuffer = gl.createBuffer();
  trianglesIndexBuffer.number_vertex_point = index.length;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
  return trianglesIndexBuffer;
}
