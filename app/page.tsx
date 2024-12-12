import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main
      data-lk-theme='default'
      className='h-full grid content-center bg-[var(--lk-bg)]'
    >
      <div className='flex flex-col gap-2 items-center pb-10'>
        <span className='text-white text-6xl font-bold leading-tight'>
          Emergent
        </span>
      </div>
      <div className='flex flex-row gap-8 items-center justify-center'>
        <Link href='/agent?simulation=heart-attack'>
          <div className='flex flex-col gap-2 items-center rounded-md p-4 hover:scale-110 transition-all duration-300 bg-neutral-900 cursor-pointer'>
            <Image
              className='rounded-md object-cover w-[300px] h-[300px]'
              src='/heartattack.jpg'
              alt='Heart Attack'
              width={300}
              height={300}
            />
            <span className='font-semibold text-xl'>Heart Attack</span>
          </div>
        </Link>
        <Link href='/agent?simulation=low-blood-pressure'>
          <div className='flex flex-col gap-2 items-center rounded-md p-4 hover:scale-110 transition-all duration-300 bg-neutral-900 cursor-pointer'>
            <Image
              className='rounded-md object-cover w-[300px] h-[300px]'
              src='/dizzy.png'
              alt='Low Blood Pressure'
              width={300}
              height={300}
            />
            <span className='font-semibold text-xl'>Low Blood Pressure</span>
          </div>
        </Link>
        <Link href='/agent?simulation=low-blood-oxygen'>
          <div className='flex flex-col gap-2 items-center rounded-md p-4 hover:scale-110 transition-all duration-300 bg-neutral-900 cursor-pointer'>
            <Image
              className='rounded-md object-cover w-[300px] h-[300px]'
              src='/cannotbreath.png'
              alt='Low Blood Oxygen'
              width={300}
              height={300}
            />
            <span className='font-semibold text-xl'>Low Blood Oxygen</span>
          </div>
        </Link>
      </div>
    </main>
  );
}
