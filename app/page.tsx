import Image from "next/image";
import Link from "next/link";
import { getPokemon, getPokemonList } from "@/lib/pokeapi";
import { TYPE_COLORS } from "@/lib/type-colors";

export default async function Home() {
  const list = await getPokemonList(20);
  const pokemon = await Promise.all(
    list.results.map((item) => getPokemon(item.name))
  );

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2 text-gray-800">
          Pokédex
        </h1>
        <p className="text-center text-gray-500 mb-10 text-sm">
          First {list.results.length} Pokémon
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {pokemon.map((poke) => (
            <Link
              key={poke.id}
              href={`/pokemon/${poke.name}`}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 flex flex-col items-center gap-2 group border border-gray-100 hover:border-gray-200"
            >
              <Image
                src={
                  poke.sprites.other["official-artwork"].front_default ||
                  poke.sprites.front_default
                }
                alt={poke.name}
                width={96}
                height={96}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span className="text-xs text-gray-400 font-mono">
                #{String(poke.id).padStart(3, "0")}
              </span>
              <span className="font-semibold capitalize text-gray-800 text-sm">
                {poke.name}
              </span>
              <div className="flex gap-1 flex-wrap justify-center">
                {poke.types.map(({ type }) => (
                  <span
                    key={type.name}
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[type.name] ?? "bg-gray-300 text-gray-700"}`}
                  >
                    {type.name}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
