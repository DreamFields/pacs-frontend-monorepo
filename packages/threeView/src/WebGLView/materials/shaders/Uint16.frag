// 精度限定符
precision highp float;
precision highp int;
precision mediump sampler3D;

uniform sampler3D diffuse;
in vec2 vUv;
uniform float depth;

uniform float ww;
uniform float wl;
uniform float rescaleSlope;
uniform float rescaleIntercept;
uniform float numOfSlice;

uniform int orientation;

// out vec4 outColor;

void main() {
    vec4 pos;
    
    if(orientation == 1){
        // x 轴为正向
        pos = vec4( depth/numOfSlice, vUv.x, vUv.y, 1.0 );
    }else if(orientation == 2){
        pos = vec4( vUv.x, depth/numOfSlice, vUv.y, 1.0 );
    }else{
        pos = vec4( vUv, depth/numOfSlice , 1.0 );
    }

    

    vec4 color = texture( diffuse, pos.xyz );

    // Calculate luminance from packed texture
    float intensity = color.r * 256.0 + color.a * 65536.0;

    // Rescale based on slope and window settings
    intensity = intensity * rescaleSlope + rescaleIntercept;
    float center = wl - 0.5;
    float width = ww;
    intensity = (intensity - center) / width + 0.5;

    // Clamp intensity
    intensity = clamp(intensity, 0.0, 1.0);

    gl_FragColor = vec4( intensity, intensity, intensity , 1.0 );
}
