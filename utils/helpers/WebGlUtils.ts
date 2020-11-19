
function error(err: string): never {
  throw new Error(err)
}

/**
 * Loads a shader.
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {string} shaderSource The shader source.
 * @param {number} shaderType The type of shader.
 * @return {WebGLShader} The created shader.
 */
export function loadShader(gl: WebGLRenderingContext, shaderSource: string, shaderType: number) {
  // Create the shader object
  const shader = gl.createShader(shaderType)!;

  // Load the shader source
  gl.shaderSource(shader, shaderSource);

  // Compile the shader
  gl.compileShader(shader);

  // Check the compile status
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    // Something went wrong during compilation; get the error
    const lastError = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    error('*** Error compiling shader \'' + shader + '\':' + lastError);
  }

  return shader;
}


/**
 * Creates a program, attaches shaders, binds attrib locations, links the
 * program and calls useProgram.
 * @param {WebGLShader[]} shaders The shaders to attach
 * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
 * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
 * @memberOf module:webgl-utils
 */
export function createProgram(
  gl: WebGLRenderingContext, shaders: WebGLShader[], opt_attribs?: string[], opt_locations?: number[]) {
  const program = gl.createProgram()!;
  shaders.forEach(function (shader) {
    gl.attachShader(program, shader);
  });
  if (opt_attribs) {
    opt_attribs.forEach(function (attrib, ndx) {
      gl.bindAttribLocation(
        program,
        opt_locations ? opt_locations[ndx] : ndx,
        attrib);
    });
  }
  gl.linkProgram(program);

  // Check the link status
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    // something went wrong with the link
    const lastError = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    error('Error in program linking:' + lastError);
  }
  return program;
}


/**
 * Returns the corresponding bind point for a given sampler type
 */
function getBindPointForSamplerType(gl: WebGLRenderingContext, type: number) {
  if (type === gl.SAMPLER_2D) return gl.TEXTURE_2D;        // eslint-disable-line
  if (type === gl.SAMPLER_CUBE) return gl.TEXTURE_CUBE_MAP;  // eslint-disable-line
  return undefined;
}


let textureUnit = 0;

/**
 * Creates a setter for a uniform of the given program with it's
 * location embedded in the setter.
 * @param {WebGLProgram} program
 * @param {WebGLUniformInfo} uniformInfo
 * @returns {function} the created setter.
 */
function createUniformSetter(gl: WebGLRenderingContext, program: WebGLProgram, uniformInfo: WebGLActiveInfo): (v: any) => void {
  const location = gl.getUniformLocation(program, uniformInfo.name);
  const type = uniformInfo.type;
  // Check if this uniform is an array
  const isArray = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]');
  if (type === gl.FLOAT && isArray) {
    return function (v) {
      gl.uniform1fv(location, v);
    };
  }
  if (type === gl.FLOAT) {
    return function (v) {
      gl.uniform1f(location, v);
    };
  }
  if (type === gl.FLOAT_VEC2) {
    return function (v) {
      gl.uniform2fv(location, v);
    };
  }
  if (type === gl.FLOAT_VEC3) {
    return function (v) {
      gl.uniform3fv(location, v);
    };
  }
  if (type === gl.FLOAT_VEC4) {
    return function (v) {
      gl.uniform4fv(location, v);
    };
  }
  if (type === gl.INT && isArray) {
    return function (v) {
      gl.uniform1iv(location, v);
    };
  }
  if (type === gl.INT) {
    return function (v) {
      gl.uniform1i(location, v);
    };
  }
  if (type === gl.INT_VEC2) {
    return function (v) {
      gl.uniform2iv(location, v);
    };
  }
  if (type === gl.INT_VEC3) {
    return function (v) {
      gl.uniform3iv(location, v);
    };
  }
  if (type === gl.INT_VEC4) {
    return function (v) {
      gl.uniform4iv(location, v);
    };
  }
  if (type === gl.BOOL) {
    return function (v) {
      gl.uniform1iv(location, v);
    };
  }
  if (type === gl.BOOL_VEC2) {
    return function (v) {
      gl.uniform2iv(location, v);
    };
  }
  if (type === gl.BOOL_VEC3) {
    return function (v) {
      gl.uniform3iv(location, v);
    };
  }
  if (type === gl.BOOL_VEC4) {
    return function (v) {
      gl.uniform4iv(location, v);
    };
  }
  if (type === gl.FLOAT_MAT2) {
    return function (v) {
      gl.uniformMatrix2fv(location, false, v);
    };
  }
  if (type === gl.FLOAT_MAT3) {
    return function (v) {
      gl.uniformMatrix3fv(location, false, v);
    };
  }
  if (type === gl.FLOAT_MAT4) {
    return function (v) {
      gl.uniformMatrix4fv(location, false, v);
    };
  }
  if ((type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) && isArray) {
    const units = [];
    for (let ii = 0; ii < uniformInfo.size; ++ii) {
      units.push(textureUnit++);
    }
    return function (bindPoint, units) {
      return function (textures: WebGLTexture[]) {
        gl.uniform1iv(location, units);
        textures.forEach(function (texture, index) {
          gl.activeTexture(gl.TEXTURE0 + units[index]);
          gl.bindTexture(bindPoint, texture);
        });
      };
    }(getBindPointForSamplerType(gl, type)!, units);
  }
  if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) {
    return function (bindPoint, unit) {
      return function (texture: WebGLTexture) {
        gl.uniform1i(location, unit);
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(bindPoint, texture);
      };
    }(getBindPointForSamplerType(gl, type)!, textureUnit++);
  }
  throw ('unknown type: 0x' + type.toString(16)); // we should never get here.
}


/**
 * Creates setter functions for all uniforms of a shader
 * program.
 *
 * @see {@link module:webgl-utils.setUniforms}
 *
 * @param {WebGLProgram} program the program to create setters for.
 * @returns {Object.<string, function>} an object with a setter by name for each uniform
 * @memberOf module:webgl-utils
 */
export function createUniformSetters(gl: WebGLRenderingContext, program: WebGLProgram) {
  textureUnit = 0;

  const uniformSetters = {} as Record<string, (v: any) => void>;
  const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

  for (let ii = 0; ii < numUniforms; ++ii) {
    const uniformInfo = gl.getActiveUniform(program, ii);
    if (!uniformInfo) {
      break;
    }
    let name = uniformInfo.name;
    // remove the array suffix.
    if (name.substr(-3) === '[0]') {
      name = name.substr(0, name.length - 3);
    }
    const setter = createUniformSetter(gl, program, uniformInfo);
    uniformSetters[name] = setter;
  }
  return uniformSetters;
}

export interface AttributeInfo {
  /** count */
  size: number
  buffer: WebGLBuffer
  type?: number
  normalize?: boolean
  /** in bytes */
  stride?: number
  /** in bytes */
  offset?: number
}

/**
 * Creates setter functions for all attributes of a shader
 * program. You can pass this to {@link module:webgl-utils.setBuffersAndAttributes} to set all your buffers and attributes.
 *
 * @see {@link module:webgl-utils.setAttributes} for example
 * @param {WebGLProgram} program the program to create setters for.
 * @return {Object.<string, function>} an object with a setter for each attribute by name.
 * @memberOf module:webgl-utils
 */
export function createAttributeSetters(gl: WebGLRenderingContext, program: WebGLProgram) {
  const attribSetters = {} as Record<string, (b: AttributeInfo) => void>;

  function createAttribSetter(location: number) {
    return function (b: AttributeInfo) {
      gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(
        location, b.size, b.type === undefined ? gl.FLOAT : b.type, b.normalize || false, b.stride || 0, b.offset || 0);
    };
  }

  const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (let ii = 0; ii < numAttribs; ++ii) {
    const attribInfo = gl.getActiveAttrib(program, ii);
    if (!attribInfo) {
      break;
    }
    const location = gl.getAttribLocation(program, attribInfo.name);
    attribSetters[attribInfo.name] = createAttribSetter(location);
  }

  return attribSetters;
}

/**
 * Resize a canvas to match the size its displayed.
 * @param {HTMLCanvasElement} canvas The canvas to resize.
 * @param {number} [multiplier] amount to multiply by.
 *    Pass in window.devicePixelRatio for native pixels.
 * @return {boolean} true if the canvas was resized.
 * @memberOf module:webgl-utils
 */
export function resizeCanvas(gl: WebGLRenderingContext, target?: HTMLElement, multiplier = 1) {
  const { canvas } = gl
  if (!("clientWidth" in canvas)) return
  if (!target) target = canvas
  const width = target.clientWidth * multiplier | 0;
  const height = target.clientHeight * multiplier | 0;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, canvas.width, canvas.height)
    return true;
  }
  return false;
}
