import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1">
      <h1 className="text-2xl font-bold mb-4">高速PCB设计笔记</h1>
      <p>
        打开{' '}
        <Link href="/docs" className="font-medium underline">
          /docs
        </Link>{' '}
        即可阅读全部笔记。
      </p>
    </div>
  );
}
