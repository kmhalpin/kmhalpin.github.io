import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { vertex, fragment } from './shader'

class Environtment {
    constructor() {
        this.objects = []

        const canvas = document.querySelector('canvas.webgl')
        const scene = this.scene = new THREE.Scene()

        const sizes = this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        window.addEventListener('resize', this.onwindowresize())

        const camera = this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        camera.position.set(0, 0, 2)
        scene.add(camera)

        const controls = this.controls = new OrbitControls(camera, canvas)
        controls.enableDamping = true
        controls.enablePan = false
        controls.maxDistance = 10
        controls.minDistance = 1
        controls.zoomSpeed = 5

        const renderer = this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
        })
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        this.init()
        this.animate()
    }

    async init() {
        const textureLoader = new THREE.TextureLoader()

        this.scene.background = new THREE.CubeTextureLoader().load([
            'skybox/nx.png',
            'skybox/px.png',
            'skybox/py.png',
            'skybox/ny.png',
            'skybox/nz.png',
            'skybox/pz.png',
        ])

        const earth = new THREE.Mesh(
            new THREE.SphereGeometry(.7, 32, 32),
            new THREE.ShaderMaterial({
                uniforms: {
                    sunDirection: { value: new THREE.Vector3(2, 0, 20) },
                    dayTexture: { value: textureLoader.load('earth_daymap.jpg') },
                    nightTexture: { value: textureLoader.load('earth_nightmap.jpg') },
                    cloudTexture: { value: textureLoader.load('earth_clouds.jpg') }
                },
                vertexShader: vertex,
                fragmentShader: fragment,
            })
        )
        this.addMove(earth, time => {
            earth.rotation.y = .2 * time
        })

        const moon = new THREE.Mesh(
            new THREE.SphereGeometry(.3, 32, 32),
            new THREE.MeshStandardMaterial({
                color: new THREE.Color(0x777777),
                normalMap: textureLoader.load('moon_nm.png'),
                map: textureLoader.load('moon.jpg'),
            })
        )
        this.addMove(moon, time => {
            moon.position.set(
                Math.cos(time / 15) * 5,
                0,
                Math.sin(time / 15) * 5
            )
            moon.rotation.y = time / 15
        })

        const rocket = (await new GLTFLoader().loadAsync('rocket.glb')).scene
        rocket.traverse(o => {
            if (o.isMesh && o.material.isMeshStandardMaterial)
                o.material.metalness = 0.4
        })
        rocket.scale.set(0.1, 0.1, 0.1)
        rocket.rotation.set(-0.5, 4, 0)
        this.addMove(rocket, time => {
            rocket.position.set(
                Math.cos(time / 6) * 2,
                Math.sin(time / 6) * 2,
                Math.cos(time / 6) * 2
            )
        })

        const sun = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color(0xffff00)
            })
        )
        sun.position.set(2, 0, 20)

        const light = new THREE.PointLight(0xffffff, 1)
        light.position.set(2, 0, 20)

        this.scene.add(earth, moon, rocket, sun, light)
    }

    addMove(object, move) {
        object.move = move
        this.objects.push(object)
    }

    onwindowresize() {
        return () => {
            this.sizes.width = window.innerWidth
            this.sizes.height = window.innerHeight

            this.camera.aspect = this.sizes.width / this.sizes.height
            this.camera.updateProjectionMatrix()

            this.renderer.setSize(this.sizes.width, this.sizes.height)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }
    }

    animate() {
        const clock = new THREE.Clock()

        const tick = () => {
            window.requestAnimationFrame(tick)

            const elapsedTime = clock.getElapsedTime()

            this.objects.forEach(o => {
                o.move(elapsedTime)
            })

            this.controls.update()

            this.renderer.render(this.scene, this.camera)
        }

        tick()
    }
}

new Environtment()
