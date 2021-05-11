const vertex = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vSunDir;

uniform vec3 sunDirection;

void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    vNormal = normalMatrix * normal;
    vSunDir = mat3(viewMatrix) * sunDirection;

    gl_Position = projectionMatrix * mvPosition;
}

`;

const fragment = `
uniform sampler2D dayTexture;
uniform sampler2D nightTexture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vSunDir;

void main(void) {
    vec3 dayColor = texture2D(dayTexture, vUv).rgb;
    vec3 nightColor = texture2D(nightTexture, vUv).rgb;

    float cosineAngleSunToNormal = dot(normalize(vNormal), normalize(vSunDir));

    cosineAngleSunToNormal = clamp(cosineAngleSunToNormal * 5.0, -1.0, 1.0);

    float mixAmount = cosineAngleSunToNormal * 0.5 + 0.5;

    vec3 color = mix(nightColor, dayColor, mixAmount);

    gl_FragColor = vec4(color, 1.0);
}

`;

export { vertex, fragment };