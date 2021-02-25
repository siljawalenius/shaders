//GENERAL

// Normalized mouse - use mnouseMovements without screen resolution messing it all up
vec2 mouse = u_mouse / u_resolution; 


//Fake random number for shaders

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
} 

//CANVAS/MOTION STUFF

//Aspect - set the texture to be the right size for the canvas

vec2 aspect(vec2 uv, float texture_ratio, float canvas_ratio){
   
    //if canvas is too tall for texture, stretch across
    //if it's too wide for texture, stretch vertical 
    
    if(texture_ratio > canvas_ratio){
         float diff = canvas_ratio/texture_ratio;
         uv.x *= diff; 
         //keep image anchored in center
         uv.x += (1.0 - diff) / 2.0;
    }else{
         float diff = texture_ratio/canvas_ratio;
         uv.y *= diff; 
         //keep the image anchored in center
         uv.y += (1.0-diff) / 2.0; 
    }
    
    return uv; 
} 



//Noise 

float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    
    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
} 

//Brownian Motion

float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
} 

//COLORS 

//hsv to rgb color 

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
} 