/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
/**
 * @description: 是否是自定义元素， document.registerElement() 可以创建一个自定义元素
 * @param {string} tagName 标签名
 * @param {object} props 标签属性
 * @return {boolean} 是否是自定义元素
 */
function isCustomComponent(tagName: string, props: Object) {
  if (tagName.indexOf('-') === -1) {
    return typeof props.is === 'string';
  }
  switch (tagName) {
    // 这里是判断svg的
    // These are reserved SVG and MathML elements.
    // We don't mind this list too much because we expect it to never grow.
    // The alternative is to track the namespace in a few places which is convoluted.
    // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
    case 'annotation-xml':
    case 'color-profile':
    case 'font-face':
    case 'font-face-src':
    case 'font-face-uri':
    case 'font-face-format':
    case 'font-face-name':
    case 'missing-glyph':
      return false;
    default:
      return true;
  }
}

export default isCustomComponent;