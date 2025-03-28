import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * 加载 .glb 模型文件
 * @param {Object} options - 加载参数
 * @param {THREE.Scene} options.scene - three.js 场景对象
 * @param {string} options.path - 模型路径（.glb 格式）
 * @param {Function} [options.onLoad] - 模型加载完成回调，返回模型对象
 * @param {Function} [options.onProgress] - 加载进度回调，返回 0-1 的数字
 * @param {Function} [options.onError] - 加载错误回调
 */
export function loadGlbModel({
  path,
  position = { x: 0, y: 0, z: 0 },
  scale = { x: 1, y: 1, z: 1 },
  rotate = { x: 0, y: 0, z: 0 },
  onLoad = () => {},
  onProgress = () => {},
  onError = (err) => { console.error('GLB 加载失败:', err); }
}) {
  const loader = new GLTFLoader();

  loader.load(
    path,
    (gltf) => {
      const model = gltf.scene;
      model.position.set(position.x, position.y, position.z)
      model.scale.set(scale.x, scale.y, scale.z)
      model.rotation.set(rotate.x, rotate.y, rotate.z)
      onLoad(model);
    },
    (xhr) => {
      // xhr.loaded / xhr.total 可能为 NaN，因此先做判断
      if (xhr.total && xhr.lengthComputable) {
        const progress = xhr.loaded / xhr.total;
        onProgress(progress);
      }
    },
    onError
  );
}
