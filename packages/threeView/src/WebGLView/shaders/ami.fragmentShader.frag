
// uniforms
uniform int uTextureSize;
uniform sampler2D uTextureContainer[7];
uniform ivec3 uDataDimensions;
uniform mat4 uWorldToData;
uniform float uWindowCenterWidth[2];
uniform float uLowerUpperThreshold[2];
uniform float uRescaleSlopeIntercept[2];
uniform int uNumberOfChannels; // 1
uniform int uBitsAllocated;
uniform int uInvert;
uniform int uLut;
uniform sampler2D uTextureLUT;
uniform int uLutSegmentation;
uniform sampler2D uTextureLUTSegmentation;
uniform int uPixelType;
uniform int uPackedPerPixel;
uniform int uInterpolation;
uniform float uCanvasWidth;
uniform float uCanvasHeight;
uniform vec3 uBorderColor;
uniform float uBorderWidth;
uniform float uBorderMargin;
uniform float uBorderDashLength;
uniform float uOpacity;
uniform float uSpacing;
uniform float uThickness;
uniform int uThicknessMethod;


// varying (should fetch it from vertex directly)
varying vec3 vPos;
varying vec3 vNormal;

// tailored functions

void texture3d(in ivec3 dataCoordinates, out vec4 dataValue, out int offset){
  float textureSizeF = float(uTextureSize);
  int voxelsPerTexture = uTextureSize*uTextureSize;

  int index = dataCoordinates.x
            + dataCoordinates.y * uDataDimensions.x
            + dataCoordinates.z * uDataDimensions.y * uDataDimensions.x;
  
  // dividing an integer by an integer will give you an integer result, rounded down
  // can not get float numbers to work :(
  int packedIndex = index/uPackedPerPixel;
  offset = index - uPackedPerPixel*packedIndex;

  // Map data index to right sampler2D texture
  int textureIndex = packedIndex/voxelsPerTexture;
  int inTextureIndex = packedIndex - voxelsPerTexture*textureIndex;

  // Get row and column in the texture
  int rowIndex = inTextureIndex/uTextureSize;
  float rowIndexF = float(rowIndex);
  float colIndex = float(inTextureIndex - uTextureSize * rowIndex);

  // Map row and column to uv
  vec2 uv = vec2(0,0);
  uv.x = (0.5 + colIndex) / textureSizeF;
  uv.y = 1. - (0.5 + rowIndexF) / textureSizeF;

  float textureIndexF = float(textureIndex);
  dataValue = vec4(0.) + 
      step( abs( textureIndexF - 0.0 ), 0.0 ) * texture2D(uTextureContainer[0], uv) +
      step( abs( textureIndexF - 1.0 ), 0.0 ) * texture2D(uTextureContainer[1], uv) +
      step( abs( textureIndexF - 2.0 ), 0.0 ) * texture2D(uTextureContainer[2], uv) +
      step( abs( textureIndexF - 3.0 ), 0.0 ) * texture2D(uTextureContainer[3], uv) +
      step( abs( textureIndexF - 4.0 ), 0.0 ) * texture2D(uTextureContainer[4], uv) +
      step( abs( textureIndexF - 5.0 ), 0.0 ) * texture2D(uTextureContainer[5], uv) +
      step( abs( textureIndexF - 6.0 ), 0.0 ) * texture2D(uTextureContainer[6], uv);
}
    

void uInt16(in float r, in float a, out float value){
  value = r * 255. + a * 255. * 256.;
}
    

void unpack(in vec4 packedData, in int offset, out vec4 unpackedData){
    float floatedOffset = float(offset);
    uInt16(packedData.r * (1. - floatedOffset) + packedData.b * floatedOffset, packedData.g * (1. - floatedOffset) + packedData.a * floatedOffset, unpackedData.x);
} 
    

void interpolationIdentity(in vec3 currentVoxel, out vec4 dataValue){
  // lower bound
  vec3 rcurrentVoxel = vec3(floor(currentVoxel.x + 0.5 ), floor(currentVoxel.y + 0.5 ), floor(currentVoxel.z + 0.5 ));
  ivec3 voxel = ivec3(int(rcurrentVoxel.x), int(rcurrentVoxel.y), int(rcurrentVoxel.z));

  vec4 tmp = vec4(0., 0., 0., 0.);
  int offset = 0;

  texture3d(voxel, tmp, offset);
  unpack(tmp, offset, dataValue);
}
    
void trilinearInterpolation(
  in vec3 normalizedPosition,
  out vec4 interpolatedValue,
  in vec4 v000, in vec4 v100,
  in vec4 v001, in vec4 v101,
  in vec4 v010, in vec4 v110,
  in vec4 v011, in vec4 v111) {
  // https://en.wikipedia.org/wiki/Trilinear_interpolation
  vec4 c00 = v000 * ( 1.0 - normalizedPosition.x ) + v100 * normalizedPosition.x;
  vec4 c01 = v001 * ( 1.0 - normalizedPosition.x ) + v101 * normalizedPosition.x;
  vec4 c10 = v010 * ( 1.0 - normalizedPosition.x ) + v110 * normalizedPosition.x;
  vec4 c11 = v011 * ( 1.0 - normalizedPosition.x ) + v111 * normalizedPosition.x;

  // c0 and c1
  vec4 c0 = c00 * ( 1.0 - normalizedPosition.y) + c10 * normalizedPosition.y;
  vec4 c1 = c01 * ( 1.0 - normalizedPosition.y) + c11 * normalizedPosition.y;

  // c
  vec4 c = c0 * ( 1.0 - normalizedPosition.z) + c1 * normalizedPosition.z;
  interpolatedValue = c;
}

void interpolationTrilinear(in vec3 currentVoxel, out vec4 dataValue, out vec3 gradient){

  vec3 lower_bound = floor(currentVoxel);
  lower_bound = max(vec3(0.), lower_bound);
  
  vec3 higher_bound = lower_bound + vec3(1.);

  vec3 normalizedPosition = (currentVoxel - lower_bound);
  normalizedPosition =  max(vec3(0.), normalizedPosition);

  vec4 interpolatedValue = vec4(0.);

  //
  // fetch values required for interpolation
  //
  vec4 v000 = vec4(0.0, 0.0, 0.0, 0.0);
  vec3 c000 = vec3(lower_bound.x, lower_bound.y, lower_bound.z);
  interpolationIdentity(c000, v000);

  //
  vec4 v100 = vec4(0.0, 0.0, 0.0, 0.0);
  vec3 c100 = vec3(higher_bound.x, lower_bound.y, lower_bound.z);
  interpolationIdentity(c100, v100);

  //
  vec4 v001 = vec4(0.0, 0.0, 0.0, 0.0);
  vec3 c001 = vec3(lower_bound.x, lower_bound.y, higher_bound.z);
  interpolationIdentity(c001, v001);

  //
  vec4 v101 = vec4(0.0, 0.0, 0.0, 0.0);
  vec3 c101 = vec3(higher_bound.x, lower_bound.y, higher_bound.z);
  interpolationIdentity(c101, v101);
  
  //
  vec4 v010 = vec4(0.0, 0.0, 0.0, 0.0);
  vec3 c010 = vec3(lower_bound.x, higher_bound.y, lower_bound.z);
  interpolationIdentity(c010, v010);

  vec4 v110 = vec4(0.0, 0.0, 0.0, 0.0);
  vec3 c110 = vec3(higher_bound.x, higher_bound.y, lower_bound.z);
  interpolationIdentity(c110, v110);

  //
  vec4 v011 = vec4(0.0, 0.0, 0.0, 0.0);
  vec3 c011 = vec3(lower_bound.x, higher_bound.y, higher_bound.z);
  interpolationIdentity(c011, v011);

  vec4 v111 = vec4(0.0, 0.0, 0.0, 0.0);
  vec3 c111 = vec3(higher_bound.x, higher_bound.y, higher_bound.z);
  interpolationIdentity(c111, v111);

  // compute interpolation at position
  trilinearInterpolation(normalizedPosition, interpolatedValue ,v000, v100, v001, v101, v010,v110, v011,v111);
  dataValue = interpolatedValue;

  // That breaks shading in volume rendering
  // if (gradient.x == 1.) { // skip gradient calculation for slice helper
  //  return;
  // }

  // compute gradient
  float gradientStep = 0.005;

  // x axis
  vec3 g100 = vec3(1., 0., 0.);
  vec3 ng100 = normalizedPosition + g100 * gradientStep;
  ng100.x = min(1., ng100.x);

  vec4 vg100 = vec4(0.);
  trilinearInterpolation(ng100, vg100 ,v000, v100, v001, v101, v010,v110, v011,v111);

  vec3 go100 = -g100;
  vec3 ngo100 = normalizedPosition + go100 * gradientStep;
  ngo100.x = max(0., ngo100.x);

  vec4 vgo100 = vec4(0.);
  trilinearInterpolation(ngo100, vgo100 ,v000, v100, v001, v101, v010,v110, v011,v111);

  gradient.x = (g100.x * vg100.x + go100.x * vgo100.x);

  // y axis
  vec3 g010 = vec3(0., 1., 0.);
  vec3 ng010 = normalizedPosition + g010 * gradientStep;
  ng010.y = min(1., ng010.y);

  vec4 vg010 = vec4(0.);
  trilinearInterpolation(ng010, vg010 ,v000, v100, v001, v101, v010,v110, v011,v111);

  vec3 go010 = -g010;
  vec3 ngo010 = normalizedPosition + go010 * gradientStep;
  ngo010.y = max(0., ngo010.y);

  vec4 vgo010 = vec4(0.);
  trilinearInterpolation(ngo010, vgo010 ,v000, v100, v001, v101, v010,v110, v011,v111);

  gradient.y = (g010.y * vg010.x + go010.y * vgo010.x);

  // z axis
  vec3 g001 = vec3(0., 0., 1.);
  vec3 ng001 = normalizedPosition + g001 * gradientStep;
  ng001.z = min(1., ng001.z);

  vec4 vg001 = vec4(0.);
  trilinearInterpolation(ng001, vg001 ,v000, v100, v001, v101, v010,v110, v011,v111);

  vec3 go001 = -g001;
  vec3 ngo001 = normalizedPosition + go001 * gradientStep;
  ngo001.z = max(0., ngo001.z);

  vec4 vgo001 = vec4(0.);
  trilinearInterpolation(ngo001, vgo001 ,v000, v100, v001, v101, v010,v110, v011,v111);

  gradient.z = (g001.z * vg001.x + go001.z * vgo001.x);

  // normalize gradient
  // +0.0001  instead of if?
  float gradientMagnitude = length(gradient);
  if (gradientMagnitude > 0.0) {
    gradient = -(1. / gradientMagnitude) * gradient;
  }
}
    
// main loop

void main(void) {

  // draw border if slice is cropped
  // float uBorderDashLength = 10.;

  if( uCanvasWidth > 0. &&
      ((gl_FragCoord.x > uBorderMargin && (gl_FragCoord.x - uBorderMargin) < uBorderWidth) ||
       (gl_FragCoord.x < (uCanvasWidth - uBorderMargin) && (gl_FragCoord.x + uBorderMargin) > (uCanvasWidth - uBorderWidth) ))){
    float valueY = mod(gl_FragCoord.y, 2. * uBorderDashLength);
    if( valueY < uBorderDashLength && gl_FragCoord.y > uBorderMargin && gl_FragCoord.y < (uCanvasHeight - uBorderMargin) ){
      gl_FragColor = vec4(uBorderColor, 1.);
      return;
    }
  }

  if( uCanvasHeight > 0. &&
      ((gl_FragCoord.y > uBorderMargin && (gl_FragCoord.y - uBorderMargin) < uBorderWidth) ||
       (gl_FragCoord.y < (uCanvasHeight - uBorderMargin) && (gl_FragCoord.y + uBorderMargin) > (uCanvasHeight - uBorderWidth) ))){
    float valueX = mod(gl_FragCoord.x, 2. * uBorderDashLength);
    if( valueX < uBorderDashLength && gl_FragCoord.x > uBorderMargin && gl_FragCoord.x < (uCanvasWidth - uBorderMargin) ){
      gl_FragColor = vec4(uBorderColor, 1.);
      return;
    }
  }

  // get texture coordinates of current pixel
  vec4 dataValue = vec4(0.);
  vec3 gradient = vec3(1.); // gradient calculations will be skipped if it is equal to vec3(1.) 
  float steps = floor(uThickness / uSpacing + 0.5); // (0/1 + 0.5) = 0.5

  if (steps > 1.) { // false
    vec3 origin = vPos - uThickness * 0.5 * vNormal;
    vec4 dataValueAcc = vec4(0.);
    for (float step = 0.; step < 128.; step++) {
      if (step >= steps) {
        break;
      }

      vec4 dataCoordinates = uWorldToData * vec4(origin + step * uSpacing * vNormal, 1.);
      vec3 currentVoxel = dataCoordinates.xyz;
      interpolationTrilinear(currentVoxel, dataValueAcc, gradient);;

      if (step == 0.) {
        dataValue.r = dataValueAcc.r;
        continue;
      }

      if (uThicknessMethod == 0) {
        dataValue.r = max(dataValueAcc.r, dataValue.r);
      }
      if (uThicknessMethod == 1) {
        dataValue.r += dataValueAcc.r;
      }
      if (uThicknessMethod == 2) {
        dataValue.r = min(dataValueAcc.r, dataValue.r);
      }
    }

    if (uThicknessMethod == 1) {
      dataValue.r /= steps;
    }
  } else {
    vec4 dataCoordinates = uWorldToData * vec4(vPos, 1.); // uWorldToData 矩阵 * (modelMatrix * vec4(position, 1.0 )).xyz
    vec3 currentVoxel = dataCoordinates.xyz; 
    interpolationTrilinear(currentVoxel, dataValue, gradient);
  }

  if(uNumberOfChannels == 1){ // 为 true
    // rescale/slope
    float realIntensity = dataValue.r * uRescaleSlopeIntercept[0] + uRescaleSlopeIntercept[1];
  
    // threshold
    if (realIntensity < uLowerUpperThreshold[0] || realIntensity > uLowerUpperThreshold[1]) {
      discard;
    }
  
    // normalize
    float windowMin = uWindowCenterWidth[0] - uWindowCenterWidth[1] * 0.5;
    float normalizedIntensity =
      ( realIntensity - windowMin ) / uWindowCenterWidth[1];
    dataValue.r = dataValue.g = dataValue.b = normalizedIntensity;
    dataValue.a = 1.;

    // apply LUT
    if(uLut == 1){ // false 不触发
      // should opacity be grabbed there?
      dataValue = texture2D( uTextureLUT, vec2( normalizedIntensity , 1.0) );
    }
  
    // apply segmentation
    if(uLutSegmentation == 1){ // false 不触发
      // should opacity be grabbed there?
      //
      float textureWidth = 256.;
      float textureHeight = 128.;
      float min = 0.;
      // start at 0!
      int adjustedIntensity = int(floor(realIntensity + 0.5));
  
      // Get row and column in the texture
      int colIndex = int(mod(float(adjustedIntensity), textureWidth));
      int rowIndex = int(floor(float(adjustedIntensity)/textureWidth));
  
      float texWidth = 1./textureWidth;
      float texHeight = 1./textureHeight;
    
      // Map row and column to uv
      vec2 uv = vec2(0,0);
      uv.x = 0.5 * texWidth + (texWidth * float(colIndex));
      uv.y = 1. - (0.5 * texHeight + float(rowIndex) * texHeight);
  
      dataValue = texture2D( uTextureLUTSegmentation, uv );
    }
  }

  if(uInvert == 1){
    dataValue.xyz = vec3(1.) - dataValue.xyz;
  }

  dataValue.a = dataValue.a*uOpacity;

  gl_FragColor = dataValue;
}
   
      