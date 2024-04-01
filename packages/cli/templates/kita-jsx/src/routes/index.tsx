import { Layout } from '../components/layout';

export function get() {
  return (
    <Layout>
      <div class="text-center bg-[#1B1B1F] h-screen flex items-center justify-center">
        <div>
          <img src="https://kita.js.org/logo.svg" alt="Kita" class="w-128 mx-auto" />
          <h1 class="text-8xl font-bold text-gray-500 text-[#99483d] mb-2">Kita</h1>
          <p class="text-lg text-white">Performant and type safe Fastify router</p>
          <p class="text-lg text-white">
            Visit{' '}
            <a href="https://kita.js.org" class="text-blue-500">
              kita.js.org
            </a>{' '}
            for more information
          </p>
        </div>
      </div>
    </Layout>
  );
}
