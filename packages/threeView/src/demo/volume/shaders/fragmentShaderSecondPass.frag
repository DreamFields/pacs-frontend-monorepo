// 设置精度
precision highp float;
precision highp int;
precision highp sampler3D;

// 将坐标从 vert shader 中传入
varying vec3 worldSpaceCoords;
varying vec4 projectedCoords;

uniform sampler2D tex;
uniform sampler2D transferTex;
uniform sampler3D cubeTex;

uniform float steps;
uniform float alphaCorrection;

// This prevents the back of the image from getting cut off when steps=512 & viewing diagonally.
const int MAX_STEPS = 887;

vec4 getTexture( vec3 texCoord )
{
    vec4 colorSample = texture(cubeTex ,texCoord );
    vec3 color = texture( transferTex, vec2( colorSample.r, 1.0) ).rgb;
    return vec4(color , colorSample.a);
}

void main( void ) {
    // step1 获取dir
    //转换屏幕空间坐标从 [-1;1] 到 [0;1]
    vec2 texc = vec2(((projectedCoords.x / projectedCoords.w) + 1.0 ) / 2.0, ((projectedCoords.y / projectedCoords.w) + 1.0 ) / 2.0 );

    //后面的位置 是 存储在材质中的世界空间坐标
    vec3 backPos = texture(tex, texc).xyz;

    //前面的位置 是 世界空间坐标
    vec3 frontPos = worldSpaceCoords;

    // 在rtexture中使用 NearestFilter 可以消除立方体边缘的不好的 backPos 值
    // 但是当前片段可能仍然没有有效的backPos值。
    if ((backPos.x == 0.0) && (backPos.y == 0.0))
    {
        gl_FragColor = vec4(0.0);
        return;
    }

   //从前面的位置 到 后面的位置 的向量
    vec3 dir = backPos - frontPos;

    // 射线长度
    float rayLength = length(dir);

    // step2 设置射线
    // 计算步长
	float delta = 1.0 / steps;

    // 计算长度
    vec3 deltaDirection = normalize(dir) * delta;
    float deltaDirectionLength = length(deltaDirection);

    // 射线从 立方体前面位置 射入
    vec3 currentPosition = frontPos;

    // 设置一个颜色的累积器
    vec4 accumulatedColor = vec4(0.0);

    // 设置一个 Alpha 的累积器
    float accumulatedAlpha = 0.0;

    // 射线传播了多长的距离
    float accumulatedLength = 0.0;

    // 如果样本数是原来的两倍，每个样本只需要1/2。
    // 缩放256/10正好给alphaCorrection滑块一个很好的值。
    float alphaScaleFactor = 25.6 * delta;

    vec4 colorSample;
    float alphaSample = 0.0;

    // step3
    // 执行射线前进的迭代

    for(int i = 0; i < MAX_STEPS; i++)
    {
        // 从3D纹理中获得体素强度值。
        // colorSample = sampleAs3DTexture( currentPosition );
        // vec3 pos = vec3( currentPosition.xy, currentPosition.z * 100.0 );
        colorSample = getTexture(currentPosition);

        // colorSample = texture(cubeTex , currentPosition);

        // alpha校正
        alphaSample = colorSample.a * alphaCorrection;

        // 将这种效果应用于颜色和alpha积累，可以获得更真实的透明度。
        alphaSample *= (1.0 - accumulatedAlpha);

        // 按步长缩放alpha使最终的颜色不变。
        alphaSample *= alphaScaleFactor;

        // 执行合成
        accumulatedColor += colorSample * alphaSample;

        // 存储到目前为止积累的alpha。
        accumulatedAlpha += alphaSample;

        // 推进射线
        currentPosition += deltaDirection;
        accumulatedLength += deltaDirectionLength;

        // 如果遍历的长度大于射线长度，或者累计的alpha达到1.0，那么退出。
        if(accumulatedLength >= rayLength || accumulatedAlpha >= 1.0 )
            break;
    }

    // 输出 1 
    // gl_FragColor = vec4(frontPos , 1.0);

    // 输出 2
    gl_FragColor = accumulatedColor;

}