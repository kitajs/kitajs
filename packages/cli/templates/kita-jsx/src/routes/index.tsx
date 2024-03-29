import { Layout } from '../components/layout';

export function get() {
  return (
    <Layout>
      <section class="w-full pt-12 md:pt-24 lg:pt-32">
        <div class="container space-y-10 xl:space-y-16">
          <div class="grid gap-4 px-10 md:grid-cols-2 md:gap-16">
            <div>
              <h1 class="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                Welcome to Kita
              </h1>
              <p class="text-gray-500 dark:text-gray-400">The Ultimate Framework for Web Development</p>
            </div>
            <div class="flex flex-col items-start space-y-4">
              <a
                class="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href="#"
              >
                Get Started
              </a>
            </div>
          </div>
          <img
            src="https://kita.js.org/logo.svg"
            width="1270"
            height="300"
            alt="Hero"
            class="mx-auto aspect-[3/1] overflow-hidden rounded-t-xl object-cover"
          />
        </div>
      </section>
    </Layout>
  );
}
