const Hero = () => {
  return (
    <div className='flex flex-col justify-center items-center w-[50ch] mx-auto'>
      <h1 className="m-2 text-center">
        <p className="font-bold text-xl mb-1">
          🌱 Grow Your Garden
        </p>
        <p className="text-base font-semibold">
          Plant a seed to start a goal. A flower represents smaller, daily
          goals; a tree represents larger, long-term goals.
        </p>
      </h1>
      <section className="mb-2">
        <p className="text-sm text-balance p-2">
          <code>Flowers</code> need to be watered <strong>every day</strong>. Each individual
          flower takes three days to grow—but make
          sure to water it every day until does! {' '}
          <strong>Don't worry!</strong> You won't lose your flowers if you miss a day, but
          you'll have to wait all over again for the last one to grow!
        </p>
        <p className="text-sm text-balance p-2">
          <code>Trees</code> are a little different. They grow slowly, with each branch
          representing a smaller part of the goal—and each leaf its
          completion. If the branches never grow, the tree will wither to a
          stump. If the parts are never completed, the tree will remain bare.{' '}
          <strong>Don't forget!</strong> You choose how big your goal is. The more branches a
          tree has, the longer it will take to grow; the fewer, the quicker!
        </p>
      </section>
    </div>
  )
}

export default Hero