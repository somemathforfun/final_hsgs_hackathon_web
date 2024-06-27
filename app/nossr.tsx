import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('../components/List'), {
  ssr: false
})

export default () => <DynamicComponentWithNoSSR />