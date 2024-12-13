import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const DynamicAuthentication = dynamic(() => import('@/components/custom/Authencation'), {
  loading: () => <p>Loading...</p>,
})

const Page = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DynamicAuthentication />
    </Suspense>
  )
}

export default Page
