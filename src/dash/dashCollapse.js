export default function collapse (node, params) {

  const defaultParams = {
    open: true,
    duration: 0.35,
    easing: 'cubic-bezier(.71,.7,.41,1.14)'
  }

  params = Object.assign(defaultParams, params)

  const noop = () => {}
  let transitionEndResolve = noop
  let transitionEndReject = noop

  const listener = node.addEventListener('transitionend', () => {
    transitionEndResolve()
    transitionEndResolve = noop
    transitionEndReject = noop
  })

  // convenience functions
  async function asyncTransitionEnd () {
    return new Promise((resolve, reject) => {
      transitionEndResolve = resolve
      transitionEndReject = reject
    })
  }

  async function nextFrame () {
    return new Promise(requestAnimationFrame)
  }

  function transition () {
    return `height ${params.duration}s ${params.easing}`
  }

  // set initial styles
  node.style.transition = transition()
  node.style.height = params.open ? 'auto' : '0px'
  node.style.overflow = params.open ? 'visible' : 'hidden';

  async function enter () {
    node.style.height = node.scrollHeight + 'px'
    try {
      await asyncTransitionEnd()
      node.style.height = 'auto'
      node.style.overflow = 'visible'
    } catch(err) {}
  }

  async function leave () {
    if (node.style.height === 'auto') {
      node.style.transition = 'none';
      await nextFrame();
      node.style.height = node.scrollHeight + 'px';
      node.style.transition = transition();
      await nextFrame();
      node.style.overflow = 'hidden';
      node.style.height = '0px';
    } else {
      transitionEndReject();
      node.style.overflow = 'hidden';
      node.style.height = '0px';
    }
  }

  function update (newParams) {
    params = Object.assign(params, newParams)
    params.open ? enter() : leave()
  }

  function destroy () {
    node.removeEventListener('transitionend', listener)
  }

  return { update, destroy }
}