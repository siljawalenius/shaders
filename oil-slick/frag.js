const frag = `
#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float seed;
uniform float segments;

varying vec3 v_normal;
varying vec2 v_texcoord;

${includes}

void main(void)
{

    vec2 uv = v_texcoord;

		//find distance between mouse and points
		vec2 mouse = u_mouse/u_resolution ;
		float dist = distance(uv, mouse);
		float strength = smoothstep(0.5, 0.0, dist);
		

    //hue values for bg
    float hue = u_time * 0.03 + seed;
    
    //2 colors 
    vec3 hsv1 = vec3(hue, 0.9, 0.85);
    vec3 hsv2 = vec3(hue + 0.2, 0.75, 1.0); 
    
   //convert to rgb 
    vec3 rgb = hsv2rgb(hsv1);
    vec3 rgb2 = hsv2rgb(hsv2);
    
     //changing hsv colors to rgb colors + the A val 
    vec4 color1 = vec4(rgb, 1.0);
    vec4 color2 = vec4(rgb2, 1.0);
    
    float grain = rand(10.0 * uv) * mix(0.2, 0.01, strength);
    
    //movement time
    vec2 movement = vec2(u_time * 0.01, u_time*-0.01);
    movement *= rotation2d(u_time * 0.005);

    float f = fbm(uv + movement + seed);
    f*= 10.0;
    f+= grain; 
		
    f+= u_time * 0.2; 
    f = fract(f);
    
		float gap = mix(0.5, 0.01, strength);
    float mixer = smoothstep(0.0, gap, f) - smoothstep(1.0-gap, 1.0, f);
    
    vec4 color = mix(color1, color2, mixer);
    
    gl_FragColor = color;
}

    //float f = smoothstep(0.0, 2.0, uv.x + noise(uv + time));
    
    //float f = noise(uv * 10.0 + vec2(time, time * 0.5));
//    f += noise(uv * 5.0 + vec2(time * -0.3, time * -0.5));
//    f += noise(uv);
//    f = smoothstep(0.0, 3.0, f);
`