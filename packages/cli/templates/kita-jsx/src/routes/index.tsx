import { Layout } from '../components/layout';

export function get() {
  return (
    <Layout>
      <section class="container max-w-7xl p-6 m-auto h-screen">
        <div class="flex flex-col w-full h-full items-center gap-16 lg:gap-40 justify-center">
          <div class="flex justify-center items-center flex-col lg:flex-row">
            <div class="flex gap-8 flex-col  lg:w-1/2">
              <h1 class="leading[3rem] text-6xl w-fit font-bold bg-gradient-to-br from-red-200 to-red-900 bg-clip-text text-transparent">
                Kita
              </h1>
              <p class="leading[3rem] text-6xl font-bold">Performant and type safe Fastify router</p>

              <p class="leading-9 text-2xl text-zinc-500 font-medium">
                Build fast end-to-end APIs with ZERO abstraction cost!
              </p>
            </div>

            <div class="relative lg:w-1/2 flex items-center justify-center">
              <img class="size-[250px] z" src="/kita.svg" alt="Kita brown and white lotus logo" />
              <div class=" bg-gradient-to-br from-red-200 to-red-900 absolute size-[250px] -z-10 top-1/2 rounded-full left-1/2 -translate-y-1/2 -translate-x-1/2 blur-3xl " />
            </div>
          </div>

          <div class="flex flex-col md:flex-row justify-between items-center w-full gap-6 lg:gap-12">
            <a
              href="https://kita.js.org"
              target="_blank"
              class="border flex flex-col h-full border-red-200 rounded-xl p-6 gap-6"
            >
              <h2 class="leading[3rem] text-2xl font-bold">Kita.js 🡲</h2>
              <p class="leading-2 text-base lg:text-xl text-zinc-500 font-medium">
                Minimum setup, maximum efficiency. Kita.js simplifies your workflow with a no-nonsense, practical
                approach.
              </p>
            </a>
            <a
              href="https://kita.js.org/routing/html"
              target="_blank"
              class="border flex flex-col h-full border-red-200 rounded-xl p-6 gap-6"
            >
              <h2 class="leading[3rem] text-2xl font-bold">Kita HTML 🡲</h2>
              <p class="leading-2 text-base lg:text-xl text-zinc-500 font-medium">
                Ready to use. Kita HTML stands out for its simplicity, allowing you to focus on what really matters:
                building powerful APIs.
              </p>
            </a>
            <a
              href="https://github.com/kitajs"
              target="_blank"
              class="border flex flex-col h-full border-red-200 rounded-xl p-6 gap-6"
            >
              <h2 class="leading[3rem] text-2xl font-bold">Github 🡲</h2>
              <p class="leading-2 text-base lg:text-xl text-zinc-500 font-medium">
                Explore. Collaborate. Innovate. Access the Kita repository on GitHub and join the construction of
                smarter, more efficient routing.
              </p>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
