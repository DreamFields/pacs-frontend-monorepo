// 精度限定符
precision highp float;
precision highp int;
precision highp sampler2DArray;

uniform sampler2DArray diffuse;
in vec2 vUv;
uniform float depth;

// out vec4 outColor;

void main() {
    mat4 rotateMat4 = mat4(1.0, 0.0, 0.0, 0.0, 
                       0.0, 0.0, -1.0, 0.0,  
                       0.0, 1.0, 0.0, 0.0,  
                       0.0, 0.0, 0.0, 1.0); 

    vec4 pos = vec4( vUv, depth , 1.0 );

    // vec4 pos = vec4( vUv.x,  depth / 256.0, vUv.y * 109.0, 1.0 );

    vec4 color = texture( diffuse, pos.xyz );

    // lighten a bit
    // outColor = vec4( color.rrr * 1.5, 1.0 );

    gl_FragColor = vec4( color.rrr * 1.5, 1.0 );
}
