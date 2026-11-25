/* Escena 3D del computador, creada con geometrías de Three.js. */
(() => {
  const viewport = document.querySelector('#computer-viewport');
  if (!viewport) return;
  const status = document.querySelector('#model-status');
  const descriptions = {
    ram: ['Memoria RAM', 'Almacena temporalmente los datos y programas en uso. Su contenido se pierde al apagar el equipo.'],
    cpu: ['CPU o procesador', 'Ejecuta instrucciones y coordina las tareas del sistema. En el modelo se ve el disipador y el ventilador sobre el procesador.'],
    gpu: ['GPU o tarjeta gráfica', 'Procesa gráficos y video. La tarjeta dedicada incorpora un procesador gráfico, memoria y ventiladores.'],
    fuente: ['Fuente de alimentación', 'Convierte la corriente de entrada y suministra energía a la placa base y a los demás componentes.'],
    almacenamiento: ['Almacenamiento', 'Las unidades SSD o HDD conservan el sistema, los programas y los archivos cuando el equipo está apagado.']
  };
  const buttons = document.querySelectorAll('.component-list [data-component]');
  const title = document.querySelector('#component-title');
  const description = document.querySelector('#component-description');
  let selectComponent = key => {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.component === key)));
    title.textContent = descriptions[key][0];
    description.textContent = descriptions[key][1];
  };
  buttons.forEach(button => button.addEventListener('click', () => selectComponent(button.dataset.component)));
  if (!window.THREE) { status.textContent = 'No fue posible cargar la biblioteca 3D. Puedes consultar los componentes con los botones.'; return; }
  const THREE = window.THREE;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (error) {
    status.textContent = 'El navegador no pudo iniciar WebGL. Puedes consultar los componentes con los botones.';
    return;
  }
  status.textContent = '';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  viewport.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xddeeff, 0x30382e, 2.0));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(4, 8, 7);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -5; keyLight.shadow.camera.right = 5;
  keyLight.shadow.camera.top = 5; keyLight.shadow.camera.bottom = -5;
  scene.add(keyLight);
  const fill = new THREE.PointLight(0x75d69a, 20, 12);
  fill.position.set(-3, 2, 4); scene.add(fill);
  const material = (color, metalness = 0, roughness = 0.65) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const caseMat = material(0x252b30, 0.65, 0.5);
  const edgeMat = material(0x444e53, 0.7, 0.38);
  const boardMat = material(0x183d32, 0.15, 0.8);
  const black = material(0x161d20, 0.2, 0.75);
  const silver = material(0xa7b0b3, 0.85, 0.3);
  const copper = material(0xb67a3e, 0.8, 0.35);
  const gold = material(0xd2ae58, 0.75, 0.35);
  const gpuMat = material(0x343d48, 0.6, 0.42);
  const ramMat = material(0x32614b, 0.35, 0.55);
  const caseGroup = new THREE.Group(); scene.add(caseGroup);
  function box(parent, size, position, mat, key) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
    mesh.position.set(...position); mesh.castShadow = true; mesh.receiveShadow = true;
    if (key) mesh.userData.component = key;
    parent.add(mesh); return mesh;
  }
  function cylinder(parent, radius, depth, position, mat, key) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, 32), mat);
    mesh.rotation.x = Math.PI / 2; mesh.position.set(...position); mesh.castShadow = true;
    if (key) mesh.userData.component = key;
    parent.add(mesh); return mesh;
  }
  function fan(parent, x, y, z, radius, key) {
    cylinder(parent, radius, 0.08, [x,y,z], black, key);
    cylinder(parent, radius * .82, 0.09, [x,y,z+.05], edgeMat, key);
    cylinder(parent, radius * .7, 0.10, [x,y,z+.10], black, key);
    for (let i = 0; i < 9; i++) {
      const blade = box(parent, [radius*.23, radius*.78, .055], [x,y,z+.17], gpuMat, key);
      blade.rotation.z = i * Math.PI * 2 / 9;
    }
    cylinder(parent, radius*.18, .14, [x,y,z+.21], silver, key);
  }
  // Gabinete abierto en el lateral para observar la placa y sus componentes.
  box(caseGroup,[3.5,4.2,.09],[0,0,-.72],caseMat);
  box(caseGroup,[3.5,.10,1.55],[0,-2.05,0],caseMat);
  box(caseGroup,[3.5,.10,1.55],[0,2.05,0],caseMat);
  box(caseGroup,[.10,4.2,1.55],[-1.7,0,0],caseMat);
  box(caseGroup,[.18,4.2,1.55],[1.7,0,0],edgeMat);
  for (const x of [-1.6,1.6]) for (const y of [-1.95,1.95]) box(caseGroup,[.10,.10,1.5],[x,y,0],edgeMat);
  for (let i=0;i<9;i++) box(caseGroup,[.025,2.2,.035],[1.81, .45, -.58+i*.14],black);
  box(caseGroup,[2.35,2.6,.09],[-.28,.42,-.62],boardMat);
  // Conectores, condensadores y disipadores de la placa base.
  for (let i=0;i<9;i++) box(caseGroup,[.12,.25,.10],[-1.37,1.45-i*.25,-.52],silver);
  for (let i=0;i<10;i++) cylinder(caseGroup,.035,.08,[-1.12+i*.15,-.68,-.51],silver);
  for (let i=0;i<8;i++) box(caseGroup,[.025,.48,.13],[-1.10+i*.08,1.19,-.49],silver);
  box(caseGroup,[.64,.64,.10],[-.48,.78,-.50],black);
  box(caseGroup,[.52,.52,.11],[-.48,.78,-.42],silver,'cpu');
  for(let i=0;i<9;i++) box(caseGroup,[.52,.022,.20],[-.48,.55+i*.055,-.30],silver,'cpu');
  fan(caseGroup,-.48,.78,-.12,.30,'cpu');
  // Dos módulos DIMM con chips y contactos visibles.
  for (let n=0;n<2;n++) {
    const x=.32+n*.19;
    box(caseGroup,[.13,1.12,.14],[x,.70,-.42],ramMat,'ram');
    for(let i=0;i<6;i++) box(caseGroup,[.09,.12,.02],[x,.28+i*.16,-.33],black,'ram');
    box(caseGroup,[.12,.07,.16],[x,.11,-.42],gold,'ram');
  }
  // Tarjeta gráfica instalada horizontalmente y dos ventiladores.
  box(caseGroup,[2.05,.50,.24],[-.12,-.55,-.28],gpuMat,'gpu');
  box(caseGroup,[2.12,.07,.30],[-.12,-.83,-.28],silver,'gpu');
  fan(caseGroup,-.60,-.55,-.10,.20,'gpu'); fan(caseGroup,.28,-.55,-.10,.20,'gpu');
  // Fuente con rejilla y ventilador, y unidades de almacenamiento.
  box(caseGroup,[1.05,.72,.95],[-.93,-1.56,-.05],black,'fuente');
  fan(caseGroup,-.93,-1.56,.46,.26,'fuente');
  box(caseGroup,[.73,.48,.28],[1.00,-1.28,-.18],silver,'almacenamiento');
  box(caseGroup,[.68,.42,.12],[1.00,-1.70,-.18],black,'almacenamiento');
  box(caseGroup,[.52,.20,.025],[1.00,-1.27,-.025],edgeMat,'almacenamiento');
  // Cables y detalles de chasis.
  for (let i=0;i<3;i++) {
    const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.45,-1.5,.2),new THREE.Vector3(.25,-1.38,.25+i*.04),new THREE.Vector3(.70,-1.03,-.15)]);
    const cable=new THREE.Mesh(new THREE.TubeGeometry(curve,24,.025,6,false), i===1 ? copper : black); caseGroup.add(cable);
  }
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(20,20), material(0x101a14,0,.95));
  ground.rotation.x=-Math.PI/2; ground.position.y=-2.18; ground.receiveShadow=true; scene.add(ground);
  const target = new THREE.Vector3(0,0,0);
  let desiredTarget = target.clone();
  let radius=8.7, desiredRadius=8.7, azimuth=.48, elevation=.25;
  const defaultView = () => { desiredTarget.set(0,0,0); desiredRadius=8.7; azimuth=.48; elevation=.25; };
  const focus = { cpu:[-.48,.78,-.1], ram:[.42,.7,-.3], gpu:[-.12,-.55,-.1], fuente:[-.93,-1.56,.1], almacenamiento:[1,-1.5,-.1] };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  selectComponent = key => {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.component === key)));
    title.textContent=descriptions[key][0]; description.textContent=descriptions[key][1];
    caseGroup.traverse(item => {
      if (!item.isMesh || !item.userData.component) return;
      if (!item.userData.originalMaterial) item.userData.originalMaterial=item.material;
      if (item.userData.highlightMaterial) item.userData.highlightMaterial.dispose();
      item.material=item.userData.originalMaterial;
      if (item.userData.component === key) {
        item.material=item.material.clone(); item.material.emissive.setHex(0x387b31); item.material.emissiveIntensity=.75;
        item.userData.highlightMaterial=item.material;
      } else item.userData.highlightMaterial=null;
    });
    desiredTarget.set(...focus[key]); desiredRadius=4.8; azimuth=.3; elevation=.16;
  };
  const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2();
  const pointers = new Map(); let lastDistance=0; let moved=false; let downPosition=null;
  viewport.addEventListener('pointerdown', event => {
    viewport.setPointerCapture(event.pointerId); pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if (pointers.size===1) {moved=false; downPosition={x:event.clientX,y:event.clientY};}
    if (pointers.size===2) {const p=[...pointers.values()];lastDistance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);moved=true;}
  });
  viewport.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId)) return;
    const previous=pointers.get(event.pointerId); pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if (pointers.size===1) {const dx=event.clientX-previous.x, dy=event.clientY-previous.y; azimuth-=dx*.008; elevation=Math.max(-1.35,Math.min(1.35,elevation+dy*.008)); if(downPosition && Math.hypot(event.clientX-downPosition.x,event.clientY-downPosition.y)>5) moved=true;}
    if (pointers.size===2) {const p=[...pointers.values()];const distance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);desiredRadius=Math.max(3,Math.min(13,desiredRadius*lastDistance/distance));lastDistance=distance;}
  });
  viewport.addEventListener('pointerup', event => {
    if (!moved && pointers.size===1) {
      const rect=renderer.domElement.getBoundingClientRect(); pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
      raycaster.setFromCamera(pointer,camera);
      const hit=raycaster.intersectObjects(caseGroup.children,true)[0];
      if (hit && hit.object.userData.component) selectComponent(hit.object.userData.component);
    }
    pointers.delete(event.pointerId); if(pointers.size) moved=true;
  });
  viewport.addEventListener('pointercancel', event => pointers.delete(event.pointerId));
  viewport.addEventListener('wheel', event => {event.preventDefault();desiredRadius=Math.max(3,Math.min(13,desiredRadius*Math.exp(event.deltaY*.001)));},{passive:false});
  document.querySelector('#zoom-in').addEventListener('click',()=>{desiredRadius=Math.max(3,desiredRadius*.8);});
  document.querySelector('#zoom-out').addEventListener('click',()=>{desiredRadius=Math.min(13,desiredRadius*1.25);});
  document.querySelector('#reset-camera').addEventListener('click',defaultView);
  function resize() {const width=viewport.clientWidth, height=viewport.clientHeight; if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(viewport); else window.addEventListener('resize',resize);
  resize();
  function animate() {
    requestAnimationFrame(animate);
    const factor=reducedMotion.matches?1:.09;
    target.lerp(desiredTarget,factor); radius+=(desiredRadius-radius)*factor;
    camera.position.set(target.x+radius*Math.sin(azimuth)*Math.cos(elevation),target.y+radius*Math.sin(elevation),target.z+radius*Math.cos(azimuth)*Math.cos(elevation));
    camera.lookAt(target); renderer.render(scene,camera);
  }
  animate();
})();
